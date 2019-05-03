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
const chai_1 = require("chai");
const TransactionHttp_1 = require("../../src/infrastructure/TransactionHttp");
const Address_1 = require("../../src/model/account/Address");
const NetworkType_1 = require("../../src/model/blockchain/NetworkType");
const AggregateTransaction_1 = require("../../src/model/transaction/AggregateTransaction");
const Deadline_1 = require("../../src/model/transaction/Deadline");
const PlainMessage_1 = require("../../src/model/transaction/PlainMessage");
const TransferTransaction_1 = require("../../src/model/transaction/TransferTransaction");
const conf_spec_1 = require("../conf/conf.spec");
describe('TransactionHttp', () => {
    const account = conf_spec_1.TestingAccount;
    it('should return an error when a non aggregate transaction bonded is announced via announceAggregateBonded method', () => {
        const tx = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SAGY2PTFX4T2XYKYXTJXYCTQRP3FESQH5MEQI2RQ'), [], PlainMessage_1.PlainMessage.create('Hi'), NetworkType_1.NetworkType.MIJIN_TEST);
        const aggTx = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [
            tx.toAggregate(account.publicAccount),
        ], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const signedTx = account.sign(aggTx);
        const trnsHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.NIS2_URL);
        return trnsHttp.announceAggregateBonded(signedTx)
            .toPromise()
            .then(() => {
            throw new Error('Should be called');
        })
            .catch((reason) => {
            chai_1.expect(reason.toString()).to.be.equal('Only Transaction Type 0x4241 is allowed for announce aggregate bonded');
        });
    });
});
//# sourceMappingURL=TransactionHttp.spec.js.map