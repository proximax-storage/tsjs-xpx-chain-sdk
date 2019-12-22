import { SeedAccount, APIUrl, ConfNetworkMosaic, AllTestingAccounts, TestAccount, TestingAccount, ConfTestingNamespaceId, ConfTestingMosaicNonce, ConfTestingMosaicProperties, TestingRecipient, ConfAccountHttp, ConfTransactionHttp, ConfNamespaceHttp, ConfMosaicHttp, Configuration, ConfTestingMosaicId } from "./conf.spec";
import { Account, PlainMessage, UInt64, MultisigCosignatoryModification, MultisigCosignatoryModificationType, Address, Mosaic, MosaicId, AccountInfo, NamespaceId, RegisterNamespaceTransaction, CosignatureTransaction, AccountRestrictionModification, RestrictionModificationType, RestrictionType, MosaicSupplyType } from "../../src/model/model";
import { forkJoin } from "rxjs";
import { TransactionHttp, Listener, AccountHttp } from "../../src/infrastructure/infrastructure";
import { Test } from "mocha";

export class ConfUtils {

    public static waitForConfirmation(listener: Listener, onAddress: Address, callback, hash?: string) {
        const status = listener.status(onAddress).subscribe(error => {
            console.log(error);
            if (error && error.hash &&  error.hash === hash) {
                throw new Error(error.status);
            }
        });
        const sub = listener.confirmed(onAddress).subscribe(tx => {
            if (hash) {
                if (tx && tx.transactionInfo && tx.transactionInfo.hash === hash) {
                    sub.unsubscribe();
                    status.unsubscribe();
                    callback();
                }
            } else {
                sub.unsubscribe();
                status.unsubscribe();
                callback();
            }
        }, error => {
            console.log(error);
        });
    }

    public static prepareE2eTestData() {
        return Promise.all(Array.from(AllTestingAccounts.values()).filter(ta => ta.conf.seed).map(ta =>
            ConfUtils.seed(ta).then(accInfo =>
                ConfUtils.checkIfNeedPubKey(ta, accInfo)
        ))).then(accInfos => {
            // get all the msig roots; will traverse them with bfs, so all other in the middle nodes will be processed automatically
            const msigAccounts: TestAccount[] = Array.from(AllTestingAccounts.values()).filter(ta => ta.hasCosignatories() && !ta.isCosignatory());
            let idx = 0;
            while (idx < msigAccounts.length) {
                Array.prototype.push.apply(msigAccounts, msigAccounts[idx].cosignatories.filter(ta => ta.hasCosignatories()));
                idx += 1;
            }
            return msigAccounts.reduce((prev, curr) => {
                return prev.then(() => {
                    return ConfUtils.convertToMultisigIfNotConvertedYet(curr);
                });
            }, Promise.resolve());
        }).then(() => {
            return ConfUtils.checkOrCreateRootNamespace(ConfTestingNamespaceId);
        }).then(() => {
            return ConfUtils.checkOrCreateMosaic(ConfTestingMosaicId)
        }).then(() => {
            return ConfUtils.simpleAccountRestrictionBLockAddress(TestingAccount, TestingRecipient.address);
        });
    }

    public static convertToMultisigIfNotConvertedYet(ta: TestAccount) {
        const accountHttp = ConfAccountHttp;
        return accountHttp.getMultisigAccountInfo(ta.acc.address).toPromise().then(msigInfo => {
            if (msigInfo.cosignatories && msigInfo.cosignatories.length > 0) {
                console.log(ta.conf.alias + " already is msig");
                return Promise.resolve();
            } else {// it is not msig just yet, we need to convert it now
                return ConfUtils.convertToMultisig(ta);
            }
        }, error => { // it is not msig just yet, we need to convert it now
            return ConfUtils.convertToMultisig(ta);
        });
    }

    public static checkIfNeedPubKey(ta: TestAccount, accountInfo: AccountInfo) {
        const accountHttp = ConfAccountHttp;
        if (ta.isCosignatory() && accountInfo.publicKey.match('0'.repeat(64))) {
            console.log(ta.conf.alias + " need pubkey");
            return ConfUtils.simpleCreateAndAnnounceWaitForConfirmation(ta.acc.address, 1, ta.acc, '')
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
        const accountHttp = ConfAccountHttp;
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
        const accountHttp = ConfAccountHttp;
        return new Promise<AccountInfo>((resolve, reject) => {
            accountHttp.getAccountInfo(ta.acc.address).subscribe(accInfo => {
                console.log(ta.conf.alias + " exists.");
                resolve(accInfo);
            }, error => {
                // assume it doesn't exist - seed it
                console.log(ta.conf.alias + " initial seed.");
                const seed = ta.conf.seed ? ta.conf.seed * 1000000 : 1;
                ConfUtils.simpleCreateAndAnnounceWaitForConfirmation(ta.acc.address, seed, SeedAccount, 'Good luck!')
                    .then(() => {
                        accountHttp.getAccountInfo(ta.acc.address).subscribe(accInfo => {
                            if (ta.conf.alias === 'testing') {
                                //initiate 20 more txs.
                                forkJoin(
                                    new Array(20).fill(0).map(n => ConfUtils.simpleCreateAndAnnounceWaitForConfirmation(ta.acc.address, 1, ta.acc))
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
        const transactionHttp = ConfTransactionHttp;
        return Configuration.getTransactionBuilderFactory().then(factory => {
            return new Promise<void>((resolve, reject) => {
                const listener = new Listener(APIUrl);
                listener.open().then(() => {

                    const transferTransaction = factory.transfer()
                        .recipient(address)
                        .mosaics([new Mosaic(ConfNetworkMosaic, UInt64.fromUint(absoluteAmount))])
                        .message(PlainMessage.create(message))
                        .build();

                    const signedTransaction = from.sign(transferTransaction, factory.generationHash);

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
        });
    }

    public static convertToMultisig(ta: TestAccount) {
        const transactionHttp = ConfTransactionHttp;
        return Configuration.getTransactionBuilderFactory().then(factory => {
            return new Promise<void>((resolve, reject) => {
                const listener = new Listener(APIUrl);
                listener.open().then(() => {

                    const convertIntoMultisigTransaction = factory.modifyMultisig()
                        .minApprovalDelta(ta.cosignatories.length<=1 ? 1 : ta.cosignatories.length - 1)
                        .minRemovalDelta(ta.cosignatories.length)
                        .modifications(ta.cosignatories.map(cos => new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, cos.acc.publicAccount)))
                        .build();

                    const aggregateBonded = factory.aggregateBonded()
                        .innerTransactions([convertIntoMultisigTransaction.toAggregate(ta.acc.publicAccount)])
                        .build();

                    const signedAggregateBonded = aggregateBonded.signWith(ta.acc, factory.generationHash);

                    const lockFunds = factory.lockFunds()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(50))
                        .signedTransaction(signedAggregateBonded)
                        .build();

                    const signedLockFunds = lockFunds.signWith(ta.acc, factory.generationHash);
                    listener.cosignatureAdded(ta.acc.address).subscribe(tx => {
                        console.log(tx);
                    });

                    listener.aggregateBondedAdded(ta.acc.address).subscribe(aggtx => {
                        console.log(aggtx);
                        //for (const a of ta.cosignatories) {
                        //    if (! aggtx.signedByAccount(a.acc.publicAccount)) {
                        //        const cosTx = CosignatureTransaction.create(aggtx);
                        //        const signedCosTx = a.acc.signCosignatureTransaction(cosTx);
                        //        transactionHttp.announceAggregateBondedCosignature(signedCosTx);
                        //    }
                        //}
                        const accountHttp = new AccountHttp(APIUrl);
                        accountHttp.aggregateBondedTransactions(ta.acc.publicAccount).subscribe(aggTxs => {
                            aggTxs.forEach(aggTx => {
                                const cosTx = CosignatureTransaction.create(aggTx);
                                ta.cosignatories.forEach(c => {
                                    if (! aggTx.signedByAccount(c.acc.publicAccount)) {
                                        const signedCosTx = c.acc.signCosignatureTransaction(cosTx);
                                        transactionHttp.announceAggregateBondedCosignature(signedCosTx);
                                    }
                                });
                            });
                        });
                    })

                    this.waitForConfirmation(listener, ta.acc.address, () => {
                        this.waitForConfirmation(listener, ta.acc.address, () => {
                            console.log(ta.conf.alias + " converted to msig.");
                            resolve();
                        }, signedAggregateBonded.hash);
                        transactionHttp.announceAggregateBonded(signedAggregateBonded);
                    }, signedLockFunds.hash);
                    transactionHttp.announce(signedLockFunds);
                });
            });
        });
    }

    public static simpleAccountRestrictionBLockAddress(account: Account, blockAddress: Address, transactionHttp: TransactionHttp = new TransactionHttp(APIUrl)) {
        return Configuration.getTransactionBuilderFactory().then(factory => {
            return new Promise((resolve, reject) => {
                const listener = new Listener(APIUrl);
                listener.open().then(() => {
                    const modifyAccountRestrictionAddressTransaction = factory.accountRestrictionAddress()
                        .restrictionType(RestrictionType.BlockAddress)
                        .modifications([new AccountRestrictionModification(RestrictionModificationType.Add, blockAddress.plain())])
                        .build();

                    const signedTransaction = account.sign(modifyAccountRestrictionAddressTransaction, factory.generationHash);

                    this.waitForConfirmation(listener, account.address, () => {
                        listener.close();
                        resolve();
                    }, signedTransaction.hash);

                    return transactionHttp.announce(signedTransaction);
                });
            });
        });
    }

    public static checkOrCreateRootNamespace(namespaceId: NamespaceId) {
        const namespaceHttp = ConfNamespaceHttp;
        const transactionHttp = ConfTransactionHttp;
        return Configuration.getTransactionBuilderFactory().then(factory => {
            return new Promise((resolve, reject) => {
                namespaceHttp.getNamespace(namespaceId).subscribe(namespaceInfo => {
                    resolve();
                }, error => {
                    const listener = new Listener(APIUrl);
                    listener.open().then(() => {
                        RegisterNamespaceTransaction
                        const registerNamespaceTransaction = factory.registerRootNamespace()
                            .namespaceName('testing')
                            .duration(UInt64.fromUint(1000))
                            .build();

                        const signedRegisterNamespaceTransaction = registerNamespaceTransaction.signWith(TestingAccount, factory.generationHash);
                        this.waitForConfirmation(listener, TestingAccount.address, () => {
                            listener.close();
                            resolve();
                        }, signedRegisterNamespaceTransaction.hash);
                        transactionHttp.announce(signedRegisterNamespaceTransaction);
                    });
                });
            });
        });
    }

    public static checkOrCreateMosaic(mosaicId: MosaicId) {
        const mosaicHttp = ConfMosaicHttp;
        const transactionHttp = ConfTransactionHttp;
        return Configuration.getTransactionBuilderFactory().then(factory => {
            return new Promise((resolve, reject) => {
                mosaicHttp.getMosaic(mosaicId).subscribe(mosaicInfo => {
                    resolve();
                }, error => {
                    const listener = new Listener(APIUrl);
                    listener.open().then(() => {
                        const mosaicDefinitionTransaction = factory.mosaicDefinition()
                            .mosaicNonce(ConfTestingMosaicNonce)
                            .mosaicId(ConfTestingMosaicId)
                            .mosaicProperties(ConfTestingMosaicProperties)
                            .build();

                        const signedMosaicDefinitionTransaction = mosaicDefinitionTransaction.signWith(TestingAccount, factory.generationHash);
                        this.waitForConfirmation(listener, TestingAccount.address, () => {
                            const mosaicSupplyChangeTransaction = factory.mosaicSupplyChange()
                                .mosaicId(ConfTestingMosaicId)
                                .direction(MosaicSupplyType.Increase)
                                .delta(UInt64.fromUint(1000000000 * 10^ConfTestingMosaicProperties.divisibility))
                                .build();
                                const signedMosaicSupplyChangeTransaction = mosaicSupplyChangeTransaction.signWith(TestingAccount, factory.generationHash);
                                this.waitForConfirmation(listener, TestingAccount.address, () => {
                                    listener.close();
                                    resolve();
                                }, signedMosaicSupplyChangeTransaction.hash);
                                transactionHttp.announce(signedMosaicSupplyChangeTransaction);
                        }, signedMosaicDefinitionTransaction.hash);
                        transactionHttp.announce(signedMosaicDefinitionTransaction);
                    });
                });
            });
        });
    };
}