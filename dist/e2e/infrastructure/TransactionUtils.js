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
const Address_1 = require("../../src/model/account/Address");
const PublicAccount_1 = require("../../src/model/account/PublicAccount");
const NetworkType_1 = require("../../src/model/blockchain/NetworkType");
const NetworkCurrencyMosaic_1 = require("../../src/model/mosaic/NetworkCurrencyMosaic");
const AggregateTransaction_1 = require("../../src/model/transaction/AggregateTransaction");
const CosignatureTransaction_1 = require("../../src/model/transaction/CosignatureTransaction");
const Deadline_1 = require("../../src/model/transaction/Deadline");
const ModifyMultisigAccountTransaction_1 = require("../../src/model/transaction/ModifyMultisigAccountTransaction");
const MultisigCosignatoryModification_1 = require("../../src/model/transaction/MultisigCosignatoryModification");
const MultisigCosignatoryModificationType_1 = require("../../src/model/transaction/MultisigCosignatoryModificationType");
const PlainMessage_1 = require("../../src/model/transaction/PlainMessage");
const TransferTransaction_1 = require("../../src/model/transaction/TransferTransaction");
const conf_spec_1 = require("../../test/conf/conf.spec");
class TransactionUtils {
    static createAndAnnounce(recipient = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.NIS2_URL)) {
        const account = conf_spec_1.TestingAccount;
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), recipient, [], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = account.sign(transferTransaction);
        transactionHttp.announce(signedTransaction);
    }
    static createAndAnnounceWithInsufficientBalance(transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.NIS2_URL)) {
        const account = conf_spec_1.TestingAccount;
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(100000000000)], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = account.sign(transferTransaction);
        transactionHttp.announce(signedTransaction);
    }
    static createAggregateBoundedTransactionAndAnnounce(transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.NIS2_URL)) {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(100000000000)], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(2, js_joda_1.ChronoUnit.MINUTES), [transferTransaction.toAggregate(conf_spec_1.MultisigAccount.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const signedTransaction = conf_spec_1.CosignatoryAccount.sign(aggregateTransaction);
        transactionHttp.announceAggregateBonded(signedTransaction);
    }
    static cosignTransaction(transaction, account, transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.NIS2_URL)) {
        const cosignatureTransaction = CosignatureTransaction_1.CosignatureTransaction.create(transaction);
        const cosignatureSignedTransaction = account.signCosignatureTransaction(cosignatureTransaction);
        transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction);
    }
    static createModifyMultisigAccountTransaction(account, transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.NIS2_URL)) {
        const modifyMultisig = ModifyMultisigAccountTransaction_1.ModifyMultisigAccountTransaction.create(Deadline_1.Deadline.create(), 2, 1, [new MultisigCosignatoryModification_1.MultisigCosignatoryModification(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Add, PublicAccount_1.PublicAccount.createFromPublicKey(account.publicKey, NetworkType_1.NetworkType.MIJIN_TEST))], NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = account.sign(modifyMultisig);
        transactionHttp.announce(signedTransaction);
    }
}
exports.TransactionUtils = TransactionUtils;
//# sourceMappingURL=TransactionUtils.js.map