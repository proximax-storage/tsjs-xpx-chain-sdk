/*
 * Copyright 2023 ProximaX
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {ChronoUnit} from '@js-joda/core';
import {TransactionHttp} from '../../src/infrastructure/TransactionHttp';
import {Account} from '../../src/model/account/Account';
import {Address} from '../../src/model/account/Address';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import {AggregateTransaction} from '../../src/model/transaction/AggregateTransaction';
import {CosignatureTransaction} from '../../src/model/transaction/CosignatureTransaction';
import {Deadline} from '../../src/model/transaction/Deadline';
import { LockFundsTransaction } from '../../src/model/transaction/LockFundsTransaction';
import { ModifyMultisigAccountTransaction } from '../../src/model/transaction/ModifyMultisigAccountTransaction';
import { MultisigCosignatoryModification } from '../../src/model/transaction/MultisigCosignatoryModification';
import { MultisigCosignatoryModificationType } from '../../src/model/transaction/MultisigCosignatoryModificationType';
import {PlainMessage} from '../../src/model/transaction/PlainMessage';
import {TransferTransaction} from '../../src/model/transaction/TransferTransaction';
import {UInt64} from '../../src/model/UInt64';
import {CosignatoryAccount, MultisigAccount, APIUrl, TestingAccount, TestingRecipient, ConfNetworkMosaic, Cosignatory3Account, Configuration } from '../../e2e/conf/conf.spec';
import { HashLockTransaction, TransactionInfo, TransactionType, AggregateTransactionCosignature, Transaction } from '../../src/model/model';
import { Listener } from '../../src/infrastructure/Listener';
import { filter, mergeMap } from 'rxjs/operators';

export class TransactionUtils {

    public static createAndAnnounce(recipient: Address = TestingRecipient.address,
                                    transactionHttp: TransactionHttp = new TransactionHttp(APIUrl)) {
        return Configuration.getTransactionBuilderFactory().then(factory => {
            const account = TestingAccount;
            const transferTransaction = factory.transfer()
                .recipient(recipient)
                .mosaics([new Mosaic(ConfNetworkMosaic, UInt64.fromUint(1))])
                .message(PlainMessage.create('test-message'))
                .build();

            const signedTransaction = account.sign(transferTransaction, factory.generationHash);

            return transactionHttp.announce(signedTransaction).toPromise();
        });
    }

    public static createAndAnnounceWithInsufficientBalance(transactionHttp: TransactionHttp = new TransactionHttp(APIUrl)) {
        return Configuration.getTransactionBuilderFactory().then(factory => {
            const account = TestingAccount;
            const transferTransaction = factory.transfer()
                .recipient(TestingRecipient.address)
                .mosaics([new Mosaic(ConfNetworkMosaic, UInt64.fromUint(1000000000000000))])
                .message(PlainMessage.create('test-message'))
                .build();

            const signedTransaction = account.sign(transferTransaction, factory.generationHash);
            return transactionHttp.announce(signedTransaction);
        });
    }

    public static createAggregateBondedTransactionAndAnnounce(transactionHttp: TransactionHttp = new TransactionHttp(APIUrl)) {
        return Configuration.getTransactionBuilderFactory().then(factory => {
            const transferTransaction = factory.transfer()
                .recipient(TestingRecipient.address)
                .mosaics([new Mosaic(ConfNetworkMosaic, UInt64.fromUint(1000000))])
                .message(PlainMessage.create('test-message'))
                .build();

            const aggregateTransaction = factory.aggregateBonded()
                .deadline(Deadline.create(10, ChronoUnit.MINUTES))
                .innerTransactions([transferTransaction.toAggregate(MultisigAccount.publicAccount)])
                .build();

            const signedAggregateTransaction = CosignatoryAccount.sign(aggregateTransaction, factory.generationHash);

            const lockFundTransaction = factory.lockFunds()
                .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10000000)))
                .duration(UInt64.fromUint(120))
                .transactionHash(signedAggregateTransaction)
                .build();

            const signedLockFundTransaction = CosignatoryAccount.sign(lockFundTransaction, factory.generationHash);

            const listener = new Listener(APIUrl);

            return new Promise((resolve, reject) => {
                listener.open().then(() => {
                    listener.confirmed(CosignatoryAccount.address).pipe(
                        filter((transaction: Transaction) => {
                            return transaction.type === TransactionType.LOCK
                            && (transaction as LockFundsTransaction).hash === lockFundTransaction.hash;
                        }),
                        mergeMap((unused: Transaction) => {
                            return transactionHttp.announceAggregateBonded(signedAggregateTransaction)
                        })
                    ).subscribe(
                        { 
                            next: (result) => {
                                // console.log(result);
                                listener.close();
                                resolve(result);
                                }, 
                            error: (error) => {
                                console.log(error);
                                listener.close();
                                reject(error);
                            }
                        }
                    );

                    transactionHttp.announce(signedLockFundTransaction).subscribe(result => {
                        // console.log(result);
                    }, error => {
                        console.log(error);
                        reject(error);
                    })
                });
            });
        });
    }

    public static cosignTransaction(transaction: AggregateTransaction,
                                    account: Account,
                                    transactionHttp: TransactionHttp = new TransactionHttp(APIUrl)) {
        const cosignatureTransaction = CosignatureTransaction.create(transaction);
        const cosignatureSignedTransaction = account.signCosignatureTransaction(cosignatureTransaction);
        transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction);
    }

    public static createModifyMultisigAccountTransaction( account: PublicAccount, type: MultisigCosignatoryModificationType,
                                                          transactionHttp: TransactionHttp = new TransactionHttp(APIUrl)) {

        return Configuration.getTransactionBuilderFactory().then(factory => {
            const modifyMultisig = factory.modifyMultisig()
                .minApprovalDelta(0)
                .minRemovalDelta(0)
                .modifications([new MultisigCosignatoryModification(
                    type,
                    account,
                )])
                .build();

            const aggregate = modifyMultisig.toAggregate(MultisigAccount.publicAccount);

            const aggregateTransaction = factory.aggregateComplete()
                .innerTransactions([aggregate])
                .build();

            const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(CosignatoryAccount, [Cosignatory3Account], factory.generationHash);

            return transactionHttp.announce(signedTransaction);
        });
    }
}