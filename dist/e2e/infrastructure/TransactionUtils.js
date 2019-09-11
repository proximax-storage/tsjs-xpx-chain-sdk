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
const AggregateTransaction_1 = require("../../src/model/transaction/AggregateTransaction");
const CosignatureTransaction_1 = require("../../src/model/transaction/CosignatureTransaction");
const Deadline_1 = require("../../src/model/transaction/Deadline");
const ModifyMultisigAccountTransaction_1 = require("../../src/model/transaction/ModifyMultisigAccountTransaction");
const MultisigCosignatoryModification_1 = require("../../src/model/transaction/MultisigCosignatoryModification");
const PlainMessage_1 = require("../../src/model/transaction/PlainMessage");
const TransferTransaction_1 = require("../../src/model/transaction/TransferTransaction");
const UInt64_1 = require("../../src/model/UInt64");
const conf_spec_1 = require("../../e2e/conf/conf.spec");
const model_1 = require("../../src/model/model");
const Listener_1 = require("../../src/infrastructure/Listener");
const operators_1 = require("rxjs/operators");
class TransactionUtils {
    static createAndAnnounce(recipient = conf_spec_1.TestingRecipient.address, transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.APIUrl)) {
        return conf_spec_1.NemesisBlockInfo.getInstance().then(nemesisBlockInfo => {
            const account = conf_spec_1.TestingAccount;
            const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), recipient, [new Mosaic_1.Mosaic(conf_spec_1.ConfNetworkMosaic, UInt64_1.UInt64.fromUint(0))], PlainMessage_1.PlainMessage.create('test-message'), account.address.networkType);
            const signedTransaction = account.sign(transferTransaction, nemesisBlockInfo.generationHash);
            return transactionHttp.announce(signedTransaction).toPromise();
        });
    }
    static createAndAnnounceWithInsufficientBalance(transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.APIUrl)) {
        return conf_spec_1.NemesisBlockInfo.getInstance().then(nemesisBlockInfo => {
            const account = conf_spec_1.TestingAccount;
            const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), conf_spec_1.TestingRecipient.address, [new Mosaic_1.Mosaic(conf_spec_1.ConfNetworkMosaic, UInt64_1.UInt64.fromUint(100000000000))], PlainMessage_1.PlainMessage.create('test-message'), account.address.networkType);
            const signedTransaction = account.sign(transferTransaction, nemesisBlockInfo.generationHash);
            return transactionHttp.announce(signedTransaction);
        });
    }
    static createAggregateBondedTransactionAndAnnounce(transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.APIUrl)) {
        return conf_spec_1.NemesisBlockInfo.getInstance().then(nemesisBlockInfo => {
            const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), conf_spec_1.TestingRecipient.address, [new Mosaic_1.Mosaic(conf_spec_1.ConfNetworkMosaic, UInt64_1.UInt64.fromUint(1000000))], PlainMessage_1.PlainMessage.create('test-message'), conf_spec_1.TestingRecipient.address.networkType);
            const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(10, js_joda_1.ChronoUnit.MINUTES), [transferTransaction.toAggregate(conf_spec_1.MultisigAccount.publicAccount)], conf_spec_1.MultisigAccount.address.networkType);
            const signedAggregateTransaction = conf_spec_1.CosignatoryAccount.sign(aggregateTransaction, nemesisBlockInfo.generationHash);
            const lockFundTransaction = model_1.HashLockTransaction.create(Deadline_1.Deadline.create(), new Mosaic_1.Mosaic(conf_spec_1.ConfNetworkMosaic, UInt64_1.UInt64.fromUint(10000000)), UInt64_1.UInt64.fromUint(120), signedAggregateTransaction, conf_spec_1.CosignatoryAccount.address.networkType);
            const signedLockFundTransaction = conf_spec_1.CosignatoryAccount.sign(lockFundTransaction, nemesisBlockInfo.generationHash);
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
        return conf_spec_1.NemesisBlockInfo.getInstance().then(nemesisBlockInfo => {
            const modifyMultisig = ModifyMultisigAccountTransaction_1.ModifyMultisigAccountTransaction.create(Deadline_1.Deadline.create(), 0, 0, [new MultisigCosignatoryModification_1.MultisigCosignatoryModification(type, account)], account.address.networkType);
            const aggregate = modifyMultisig.toAggregate(conf_spec_1.MultisigAccount.publicAccount);
            const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [aggregate], account.address.networkType, []);
            const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(conf_spec_1.CosignatoryAccount, [conf_spec_1.Cosignatory3Account], nemesisBlockInfo.generationHash);
            return transactionHttp.announce(signedTransaction);
        });
    }
}
exports.TransactionUtils = TransactionUtils;
//# sourceMappingURL=TransactionUtils.js.map