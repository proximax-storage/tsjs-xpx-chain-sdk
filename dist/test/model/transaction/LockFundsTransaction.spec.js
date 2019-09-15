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
const assert_1 = require("assert");
const chai_1 = require("chai");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const NetworkCurrencyMosaic_1 = require("../../../src/model/mosaic/NetworkCurrencyMosaic");
const AggregateTransaction_1 = require("../../../src/model/transaction/AggregateTransaction");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const LockFundsTransaction_1 = require("../../../src/model/transaction/LockFundsTransaction");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
describe('LockFundsTransaction', () => {
    const account = conf_spec_1.TestingAccount;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    it('should default maxFee field be set to 0', () => {
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(), [], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockFundsTransaction = LockFundsTransaction_1.LockFundsTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10), UInt64_1.UInt64.fromUint(10), signedTransaction, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(lockFundsTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(lockFundsTransaction.maxFee.lower).to.be.equal(0);
    });
    it('should filled maxFee override transaction maxFee', () => {
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(), [], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockFundsTransaction = LockFundsTransaction_1.LockFundsTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10), UInt64_1.UInt64.fromUint(10), signedTransaction, NetworkType_1.NetworkType.MIJIN_TEST, new UInt64_1.UInt64([1, 0]));
        chai_1.expect(lockFundsTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(lockFundsTransaction.maxFee.lower).to.be.equal(1);
    });
    it('creation with an aggregate bonded tx', () => {
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(), [], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const transaction = LockFundsTransaction_1.LockFundsTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10), UInt64_1.UInt64.fromUint(10), signedTransaction, NetworkType_1.NetworkType.MIJIN_TEST);
        assert_1.deepEqual(transaction.mosaic.id.id, NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.NAMESPACE_ID.id);
        chai_1.expect(transaction.mosaic.amount.compact()).to.be.equal(10000000);
        chai_1.expect(transaction.hash).to.be.equal(signedTransaction.hash);
    });
    it('should throw exception if it is not a aggregate bonded tx', () => {
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        chai_1.expect(() => {
            LockFundsTransaction_1.LockFundsTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10), UInt64_1.UInt64.fromUint(10), signedTransaction, NetworkType_1.NetworkType.MIJIN_TEST);
        }).to.throw(Error);
    });
    describe('size', () => {
<<<<<<< HEAD
        it('should return 178 for LockFundsTransaction transaction byte size', () => {
            const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(), [], NetworkType_1.NetworkType.MIJIN_TEST, []);
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
            const lockFundsTransaction = LockFundsTransaction_1.LockFundsTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10), UInt64_1.UInt64.fromUint(10), signedTransaction, NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(lockFundsTransaction.size).to.be.equal(178);
=======
        it('should return 176 for LockFundsTransaction transaction byte size', () => {
            const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(), [], NetworkType_1.NetworkType.MIJIN_TEST, []);
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
            const lockFundsTransaction = LockFundsTransaction_1.LockFundsTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10), UInt64_1.UInt64.fromUint(10), signedTransaction, NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(lockFundsTransaction.size).to.be.equal(176);
>>>>>>> jwt
        });
    });
});
//# sourceMappingURL=LockFundsTransaction.spec.js.map