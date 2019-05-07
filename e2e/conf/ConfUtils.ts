import { SeedAccount, CosignatoryAccount, Cosignatory2Account, APIUrl, Cosignatory3Account, ConfNetworkMosaic, TestingAccount, TestingRecipient, AllTestingAccounts, TestAccount } from "./conf.spec";
import { Account, TransferTransaction, PublicAccount, Deadline, PlainMessage, UInt64, MultisigCosignatoryModification, ModifyAccountPropertyAddressTransaction, PropertyModificationType, AccountPropertyModification, MultisigCosignatoryModificationType, ModifyMultisigAccountTransaction, Address, PropertyType, Mosaic, MosaicId, TransactionType, AccountInfo, SignedTransaction } from "../../src/model/model";
import { TransactionHttp, Listener, AccountHttp } from "../../src/infrastructure/infrastructure";
import { rejects } from "assert";

const accountHttp = new AccountHttp(APIUrl);

export class ConfUtils {
    
    public static prepareE2eTestAccounts() {
        return Array.from(AllTestingAccounts.values()).reduce((prev, curr) => {
            return prev.then(() => {
                return ConfUtils.seed(curr).then((accInfo) => {
                    return ConfUtils.checkIfNeedPubKey(curr, accInfo);
                });
            });
        }, Promise.resolve()).then(() => {
            Array.from(AllTestingAccounts.values()).reduce((prev, curr) => {
                return prev.then(() => {
                    return ConfUtils.checkIfNeedMsig(curr);
                });
            }, Promise.resolve());
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
                            resolve(accInfo);
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
            let tx: SignedTransaction;
            const sendTx = (amount) => {
                return ConfUtils.simpleCreateAndAnnounce(from, address, amount, message);
            };
            const listener = new Listener(APIUrl);
            listener.open().then(() => {
                const sub = listener.confirmed(address).subscribe(t => {
                    if (tx && t.transactionInfo && t.transactionInfo.hash === tx.hash) {
                        console.log("confirmed: " + tx.hash);
                        listener.close();
                        resolve();
                    }
                }, error => {
                    console.error(error);
                });

                const status = listener.status(address).subscribe(error => {
                    if (tx && error.hash === tx.hash) {
                        console.error(error);
                        listener.close();
                        reject();    
                    }
                });

                tx = sendTx(absoluteAmount);
            });
        });
    }

     public static convertToMultisig(a: TestAccount) {
        return new Promise<void>((resolve, reject) => {
            const listener = new Listener(APIUrl);
            listener.open().then(() => {
                const sub = listener.multisigAccountAdded(a.acc.address).subscribe(t => {
                    console.log(t);
                    listener.close();
                    resolve();
                }, error => {
                    console.error(error);
                });
                ConfUtils.simpleConvertToNminus1Multisig(
                    a.acc, a.cosignatories.map(c => c.acc.publicAccount)
                ).subscribe(result => {
                    console.log("Convert to multisig: " + result);
                }, error => {
                    console.error(error);
                });                    
            });
        });
    }

    public static simpleCreateAndAnnounce(signer: Account, recipient: Address, absoluteAmount: number, message: string,
        transactionHttp: TransactionHttp = new TransactionHttp(APIUrl)) {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            recipient,
            [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(absoluteAmount))],
            PlainMessage.create(message),
            recipient.networkType,
        );
        const signedTransaction = signer.sign(transferTransaction);
        transactionHttp.announce(signedTransaction).subscribe(result => {
            console.log(result);
        }, error => {
            console.error(error);
        });
        return signedTransaction;
    }

    public static simpleConvertToNminus1Multisig(account: Account, coss: PublicAccount[], transactionHttp: TransactionHttp = new TransactionHttp(APIUrl)) {
        const convertIntoMultisigTransaction = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            coss.length<=1 ? 1 : coss.length - 1,
            1,
            coss.map(cos => new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, cos)),
            account.address.networkType);

        const signedTransaction = account.sign(convertIntoMultisigTransaction);

        return transactionHttp.announce(signedTransaction);
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

}