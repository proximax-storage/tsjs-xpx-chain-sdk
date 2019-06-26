/*
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
import {ChronoUnit} from 'js-joda';
import {TransactionHttp} from '../../src/infrastructure/TransactionHttp';
import {Account} from '../../src/model/account/Account';
import {Address} from '../../src/model/account/Address';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import {NetworkCurrencyMosaic} from '../../src/model/mosaic/NetworkCurrencyMosaic';
import {AggregateTransaction} from '../../src/model/transaction/AggregateTransaction';
import {CosignatureTransaction} from '../../src/model/transaction/CosignatureTransaction';
import {Deadline} from '../../src/model/transaction/Deadline';
import { LockFundsTransaction } from '../../src/model/transaction/LockFundsTransaction';
import { ModifyMultisigAccountTransaction } from '../../src/model/transaction/ModifyMultisigAccountTransaction';
import { MultisigCosignatoryModification } from '../../src/model/transaction/MultisigCosignatoryModification';
import { MultisigCosignatoryModificationType } from '../../src/model/transaction/MultisigCosignatoryModificationType';
import {PlainMessage} from '../../src/model/transaction/PlainMessage';
import { SignedTransaction } from '../../src/model/transaction/SignedTransaction';
import {TransferTransaction} from '../../src/model/transaction/TransferTransaction';
import {UInt64} from '../../src/model/UInt64';
import {CosignatoryAccount, MultisigAccount, APIUrl, TestingAccount, TestingRecipient, ConfNetworkMosaic, Cosignatory3Account } from '../../e2e/conf/conf.spec';
import { HashLockTransaction, TransactionInfo, TransactionType, AggregateTransactionCosignature } from '../../src/model/model';
import { Listener } from '../../src/infrastructure/Listener';
import { filter, mergeMap } from 'rxjs/operators';

export class TransactionUtils {

    public static createAndAnnounce(recipient: Address = TestingRecipient.address,
                                    transactionHttp: TransactionHttp = new TransactionHttp(APIUrl)) {
        const account = TestingAccount;
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            recipient,
            [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(0))],
            PlainMessage.create('test-message'),
            account.address.networkType,
        );
        const signedTransaction = account.sign(transferTransaction);

        transactionHttp.announce(signedTransaction);
    }

    public static createAndAnnounceWithInsufficientBalance(transactionHttp: TransactionHttp = new TransactionHttp(APIUrl)) {
        const account = TestingAccount;
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            TestingRecipient.address,
            [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(100000000000))],
            PlainMessage.create('test-message'),
            account.address.networkType,
        );
        const signedTransaction = account.sign(transferTransaction);
        transactionHttp.announce(signedTransaction);
    }

    public static createAggregateBondedTransactionAndAnnounce(transactionHttp: TransactionHttp = new TransactionHttp(APIUrl)) {

        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            TestingRecipient.address,
            [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(1000000))],
            PlainMessage.create('test-message'),
            TestingRecipient.address.networkType,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(10, ChronoUnit.MINUTES),
            [transferTransaction.toAggregate(MultisigAccount.publicAccount)],
            MultisigAccount.address.networkType
        );
        return signer.sign(aggregateTransaction, generationHash);
    }

        const signedAggregateTransaction = CosignatoryAccount.sign(aggregateTransaction);

        const lockFundTransaction = HashLockTransaction.create(
            Deadline.create(),
            new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10000000)),
            UInt64.fromUint(120),
            signedAggregateTransaction,
            CosignatoryAccount.address.networkType);

        const signedLockFundTransaction = CosignatoryAccount.sign(lockFundTransaction);

        const listener = new Listener(APIUrl);

        listener.open().then(() => {

            listener.confirmed(CosignatoryAccount.address).pipe(
                filter((transaction) => {
                    return transaction.type === TransactionType.LOCK
                    && (transaction as LockFundsTransaction).hash === lockFundTransaction.hash;
                }),
                mergeMap(unused => {
                    return transactionHttp.announceAggregateBonded(signedAggregateTransaction)
                })
            ).subscribe(result => {
                // console.log(result);
                listener.close();
            }, error => {
                console.log(error);
                listener.close();
            });

            transactionHttp.announce(signedLockFundTransaction).subscribe(result => {
                // console.log(result);
            }, error => {
                console.log(error);
            })
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
        const modifyMultisig = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            0,
            0,
            [new MultisigCosignatoryModification(
                type,
                account,
            )],
            account.address.networkType,
        );

        const aggregate = modifyMultisig.toAggregate(MultisigAccount.publicAccount);

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [aggregate],
            account.address.networkType,
            []
        )

        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(CosignatoryAccount, [Cosignatory3Account]);

        return transactionHttp.announce(signedTransaction);
    }
}