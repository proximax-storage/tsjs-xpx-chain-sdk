import { SeedAccount, APIUrl, ConfNetworkMosaic, AllTestingAccounts, TestAccount, ConfNetworkType, TestingAccount, ConfTestingNamespace, ConfTestingMosaic, ConfTestingMosaicNonce, ConfTestingMosaicProperties } from "./conf.spec";
import { Account, TransferTransaction, PublicAccount, Deadline, PlainMessage, UInt64, MultisigCosignatoryModification, ModifyAccountPropertyAddressTransaction, PropertyModificationType, AccountPropertyModification, MultisigCosignatoryModificationType, ModifyMultisigAccountTransaction, Address, PropertyType, Mosaic, MosaicId, TransactionType, AccountInfo, SignedTransaction, MosaicDefinitionTransaction, MosaicNonce, MosaicProperties, NamespaceId, RegisterNamespaceTransaction } from "../../src/model/model";
import { TransactionHttp, Listener, AccountHttp, NamespaceHttp, MosaicHttp } from "../../src/infrastructure/infrastructure";
import { forkJoin } from "rxjs";
import { NamespaceCreationTransaction, namespaceId } from "js-xpx-catapult-library";

const accountHttp = new AccountHttp(APIUrl);
const transactionHttp = new TransactionHttp(APIUrl);
const namespaceHttp = new NamespaceHttp(APIUrl);
const mosaicHttp = new MosaicHttp(APIUrl);

export class ConfUtils {

    public static waitForConfirmation(listener: Listener, onAddress: Address, callback, hash?: string) {
        const sub = listener.confirmed(onAddress).subscribe(tx => {
            if (hash) {
                if (tx && tx.transactionInfo && tx.transactionInfo.hash === hash) {
                    sub.unsubscribe();
                    callback();
                }    
            } else {
                sub.unsubscribe();
                callback();
            }
        }, error => {
            console.log(error);
        });
    }

    public static prepareE2eTestData() {
        return Array.from(AllTestingAccounts.values()).reduce((prev, curr) => {
            return prev.then(() => {
                return ConfUtils.seed(curr).then((accInfo) => {
                    return ConfUtils.checkIfNeedPubKey(curr, accInfo);
                });
            });
        }, Promise.resolve()).then(() => {
            return Array.from(AllTestingAccounts.values()).reduce((prev, curr) => {
                return prev.then(() => {
                    return ConfUtils.checkIfNeedMsig(curr);
                });
            }, Promise.resolve());
        }).then(() => {
            return ConfUtils.checkOrCreateRootNamespace(ConfTestingNamespace);
        }).then(() => {
            return ConfUtils.checkOrCreateMosaic(ConfTestingMosaic)
        });
    }

    public static checkIfNeedMsig(ta: TestAccount) {
        if (ta.hasCosignatories()) {
            return accountHttp.getMultisigAccountInfo(ta.acc.address).toPromise().then(msigInfo => {
                console.log(ta.conf.alias + " already is msig");
                return Promise.resolve();
            }, error => { // it is not msig just yet, we need to convert it now
                console.log(ta.conf.alias + " need msig");
                if (ta.isCosignatory()) {
                    // TODO: implement msig graphs
                    console.log(ta.conf.alias + " in the middle of the graph, ignoring for now");
                    return Promise.resolve();
                } else {
                    return ConfUtils.convertToMultisig(ta);
                }
            });
        } else {
            return Promise.resolve();
        }
    }

    public static checkIfNeedPubKey(ta: TestAccount, accountInfo: AccountInfo) {
        if (ta.isCosignatory() && accountInfo.publicKey.match('0'.repeat(64))) {
            console.log(ta.conf.alias + " need pubkey");
            return ConfUtils.simpleCreateAndAnnounceWaitForConfirmation(ta.acc.address, 0, ta.acc, '')
                .then(() => {
                    return accountHttp.getAccountInfo(ta.acc.address).toPromise();
                });
        } else {
            return Promise.resolve().then(() => {
                return accountInfo;
            });
        }
    }

    public static seed(ta: TestAccount) {
        return ConfUtils.getOrCreate(ta).then(info => {
            const m = info.mosaics.find(mos => mos.id.equals(ConfNetworkMosaic));
            if (!m || m.amount.compact() < (ta.conf.seed * 1000000)) {
                console.log(ta.conf.alias + " not enough funds, gonna add " + (ta.conf.seed * 1000000 - (m ? m.amount.compact() : 0)));
                return ConfUtils.simpleCreateAndAnnounceWaitForConfirmation(ta.acc.address, ta.conf.seed * 1000000 - (m ? m.amount.compact() : 0))
                    .then(() => {
                        return accountHttp.getAccountInfo(ta.acc.address).toPromise();
                    });
            } else {
                console.log(ta.conf.alias + " good to go.");
                return info;
            }
        });
    }

    public static getOrCreate(ta: TestAccount) {
        return new Promise<AccountInfo>((resolve, reject) => {
            accountHttp.getAccountInfo(ta.acc.address).subscribe(accInfo => {
                console.log(ta.conf.alias + " exists.");
                resolve(accInfo);
            }, error => {
                // assume it doesn't exist - seed it
                console.log(ta.conf.alias + " initial seed.");
                ConfUtils.simpleCreateAndAnnounceWaitForConfirmation(ta.acc.address, ta.conf.seed * 1000000, SeedAccount, 'Good luck!')
                    .then(() => {
                        accountHttp.getAccountInfo(ta.acc.address).subscribe(accInfo => {
                            if (ta.conf.alias === 'testing') {
                                //initiate 20 more txs.
                                forkJoin(
                                    new Array(20).fill(0).map(n => ConfUtils.simpleCreateAndAnnounceWaitForConfirmation(ta.acc.address, 0, ta.acc))
                                ).toPromise().then(() => {
                                    resolve(accInfo);
                                }).catch(() => {
                                    resolve(accInfo); //continue anyway
                                });
                            } else {
                                resolve(accInfo);
                            }
                        }, error => {
                            reject(error);
                        });
                    }, reason => {
                        reject(reason);
                    });
            });    
        });
    }

    public static simpleCreateAndAnnounceWaitForConfirmation(address: Address, absoluteAmount: number, from: Account = SeedAccount, message = '') {
        return new Promise((resolve, reject) => {
            const listener = new Listener(APIUrl);
            listener.open().then(() => {
                
                const transferTransaction = TransferTransaction.create(
                    Deadline.create(),
                    address,
                    [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(absoluteAmount))],
                    PlainMessage.create(message),
                    address.networkType,
                );
                
                const signedTransaction = from.sign(transferTransaction);
                
                this.waitForConfirmation(listener, address, () => {
                    listener.close();
                    resolve();    
                }, signedTransaction.hash);
                
                transactionHttp.announce(signedTransaction).subscribe(result => {
                    console.log(result);
                }, error => {
                    console.error(error);
                });
            });    
        });
    }

     public static convertToMultisig(ta: TestAccount) {
        return new Promise<void>((resolve, reject) => {
            const listener = new Listener(APIUrl);
            listener.open().then(() => {

                const convertIntoMultisigTransaction = ModifyMultisigAccountTransaction.create(
                    Deadline.create(),
                    ta.cosignatories.length<=1 ? 1 : ta.cosignatories.length - 1,
                    1,
                    ta.cosignatories.map(cos => new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, cos.acc.publicAccount)),
                    ta.acc.address.networkType);
        
                const signedTransaction = ta.acc.sign(convertIntoMultisigTransaction);
        
                this.waitForConfirmation(listener, ta.acc.address, () => {
                    resolve();
                }, signedTransaction.hash);

                return transactionHttp.announce(signedTransaction);     
            });
        });
    }

    public static simplePropertyModificationBLockAddress(account: Account, blockAddress: Address, transactionHttp: TransactionHttp = new TransactionHttp(APIUrl)) {
        const modifyAccountPropertyAddressTransaction = ModifyAccountPropertyAddressTransaction.create(
            Deadline.create(),
            PropertyType.BlockAddress,
            [new AccountPropertyModification(PropertyModificationType.Add, blockAddress.plain())],
            account.address.networkType,
        )

        const signedTransaction = account.sign(modifyAccountPropertyAddressTransaction);

        return transactionHttp.announce(signedTransaction);
    }

    public static checkOrCreateRootNamespace(namespaceId: NamespaceId) {
        return new Promise((resolve, reject) => {
            namespaceHttp.getNamespace(namespaceId).subscribe(namespaceInfo => {
                resolve();
            }, error => {
                const listener = new Listener(APIUrl);
                listener.open().then(() => {
                    RegisterNamespaceTransaction
                    const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
                        Deadline.create(),
                        'testing',
                        UInt64.fromUint(1000),
                        ConfNetworkType
                    )
                    const signedRegisterNamespaceTransaction = registerNamespaceTransaction.signWith(TestingAccount);
                    this.waitForConfirmation(listener, TestingAccount.address, () => {
                        listener.close();
                        resolve();
                    }, signedRegisterNamespaceTransaction.hash);
                    transactionHttp.announce(signedRegisterNamespaceTransaction);    
                });
            });
        });
    }

    public static checkOrCreateMosaic(mosaicId: MosaicId) {
        return new Promise((resolve, reject) => {
            mosaicHttp.getMosaic(mosaicId).subscribe(mosaicInfo => {
                resolve();
            }, error => {
                const listener = new Listener(APIUrl);
                listener.open().then(() => {
                    const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                        Deadline.create(),
                        ConfTestingMosaicNonce,
                        ConfTestingMosaic,
                        ConfTestingMosaicProperties,
                        ConfNetworkType
                    );
                    const signedRegisterNamespaceTransaction = mosaicDefinitionTransaction.signWith(TestingAccount);
                    this.waitForConfirmation(listener, TestingAccount.address, () => {
                        listener.close();
                        resolve();
                    }, signedRegisterNamespaceTransaction.hash);
                    transactionHttp.announce(signedRegisterNamespaceTransaction);    
                });
            });
        });
    }
    
}