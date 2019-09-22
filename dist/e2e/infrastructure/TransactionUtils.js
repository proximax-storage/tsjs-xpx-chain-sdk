"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const js_joda_1 = require("js-joda");
const TransactionHttp_1 = require("../../src/infrastructure/TransactionHttp");
const Mosaic_1 = require("../../src/model/mosaic/Mosaic");
const CosignatureTransaction_1 = require("../../src/model/transaction/CosignatureTransaction");
const Deadline_1 = require("../../src/model/transaction/Deadline");
const MultisigCosignatoryModification_1 = require("../../src/model/transaction/MultisigCosignatoryModification");
const PlainMessage_1 = require("../../src/model/transaction/PlainMessage");
const UInt64_1 = require("../../src/model/UInt64");
const conf_spec_1 = require("../../e2e/conf/conf.spec");
const model_1 = require("../../src/model/model");
const Listener_1 = require("../../src/infrastructure/Listener");
const operators_1 = require("rxjs/operators");
class TransactionUtils {
    static createAndAnnounce(recipient = conf_spec_1.TestingRecipient.address, transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.APIUrl)) {
        return conf_spec_1.Configuration.getTransactionBuilderFactory().then(factory => {
            const account = conf_spec_1.TestingAccount;
            const transferTransaction = factory.transfer()
                .recipient(recipient)
                .mosaics([new Mosaic_1.Mosaic(conf_spec_1.ConfNetworkMosaic, UInt64_1.UInt64.fromUint(0))])
                .message(PlainMessage_1.PlainMessage.create('test-message'))
                .build();
            const signedTransaction = account.sign(transferTransaction, factory.generationHash);
            return transactionHttp.announce(signedTransaction).toPromise();
        });
    }
    static createAndAnnounceWithInsufficientBalance(transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.APIUrl)) {
        return conf_spec_1.Configuration.getTransactionBuilderFactory().then(factory => {
            const account = conf_spec_1.TestingAccount;
            const transferTransaction = factory.transfer()
                .recipient(conf_spec_1.TestingRecipient.address)
                .mosaics([new Mosaic_1.Mosaic(conf_spec_1.ConfNetworkMosaic, UInt64_1.UInt64.fromUint(100000000000))])
                .message(PlainMessage_1.PlainMessage.create('test-message'))
                .build();
            const signedTransaction = account.sign(transferTransaction, factory.generationHash);
            return transactionHttp.announce(signedTransaction);
        });
    }
    static createAggregateBondedTransactionAndAnnounce(transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.APIUrl)) {
        return conf_spec_1.Configuration.getTransactionBuilderFactory().then(factory => {
            const transferTransaction = factory.transfer()
                .recipient(conf_spec_1.TestingRecipient.address)
                .mosaics([new Mosaic_1.Mosaic(conf_spec_1.ConfNetworkMosaic, UInt64_1.UInt64.fromUint(1000000))])
                .message(PlainMessage_1.PlainMessage.create('test-message'))
                .build();
            const aggregateTransaction = factory.aggregateBonded()
                .deadline(Deadline_1.Deadline.create(10, js_joda_1.ChronoUnit.MINUTES))
                .innerTransactions([transferTransaction.toAggregate(conf_spec_1.MultisigAccount.publicAccount)])
                .build();
            const signedAggregateTransaction = conf_spec_1.CosignatoryAccount.sign(aggregateTransaction, factory.generationHash);
            const lockFundTransaction = factory.lockFunds()
                .mosaic(new Mosaic_1.Mosaic(conf_spec_1.ConfNetworkMosaic, UInt64_1.UInt64.fromUint(10000000)))
                .duration(UInt64_1.UInt64.fromUint(120))
                .signedTransaction(signedAggregateTransaction)
                .build();
            const signedLockFundTransaction = conf_spec_1.CosignatoryAccount.sign(lockFundTransaction, factory.generationHash);
            const listener = new Listener_1.Listener(conf_spec_1.APIUrl);
            return new Promise((resolve, reject) => {
                listener.open().then(() => {
                    listener.confirmed(conf_spec_1.CosignatoryAccount.address).pipe(operators_1.filter((transaction) => {
                        return transaction.type === model_1.TransactionType.LOCK
                            && transaction.hash === lockFundTransaction.hash;
                    }), operators_1.mergeMap(unused => {
                        return transactionHttp.announceAggregateBonded(signedAggregateTransaction);
                    })).subscribe(result => {
                        // console.log(result);
                        listener.close();
                        resolve(result);
                    }, error => {
                        console.log(error);
                        listener.close();
                        reject(error);
                    });
                    transactionHttp.announce(signedLockFundTransaction).subscribe(result => {
                        // console.log(result);
                    }, error => {
                        console.log(error);
                        reject(error);
                    });
                });
            });
        });
    }
    static cosignTransaction(transaction, account, transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.APIUrl)) {
        const cosignatureTransaction = CosignatureTransaction_1.CosignatureTransaction.create(transaction);
        const cosignatureSignedTransaction = account.signCosignatureTransaction(cosignatureTransaction);
        transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction);
    }
    static createModifyMultisigAccountTransaction(account, type, transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.APIUrl)) {
        return conf_spec_1.Configuration.getTransactionBuilderFactory().then(factory => {
            const modifyMultisig = factory.modifyMultisig()
                .minApprovalDelta(0)
                .minRemovalDelta(0)
                .modifications([new MultisigCosignatoryModification_1.MultisigCosignatoryModification(type, account)])
                .build();
            const aggregate = modifyMultisig.toAggregate(conf_spec_1.MultisigAccount.publicAccount);
            const aggregateTransaction = factory.aggregateComplete()
                .innerTransactions([aggregate])
                .build();
            const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(conf_spec_1.CosignatoryAccount, [conf_spec_1.Cosignatory3Account], factory.generationHash);
            return transactionHttp.announce(signedTransaction);
        });
    }
}
exports.TransactionUtils = TransactionUtils;
//# sourceMappingURL=TransactionUtils.js.map