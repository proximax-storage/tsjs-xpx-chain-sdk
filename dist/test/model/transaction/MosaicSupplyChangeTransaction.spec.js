"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const MosaicId_1 = require("../../../src/model/mosaic/MosaicId");
const MosaicSupplyType_1 = require("../../../src/model/mosaic/MosaicSupplyType");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const MosaicSupplyChangeTransaction_1 = require("../../../src/model/transaction/MosaicSupplyChangeTransaction");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
const FeeCalculationStrategy_1 = require("../../../src/model/transaction/FeeCalculationStrategy");
describe('MosaicSupplyChangeTransaction', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction_1.MosaicSupplyChangeTransaction.create(Deadline_1.Deadline.create(), mosaicId, MosaicSupplyType_1.MosaicSupplyType.Increase, UInt64_1.UInt64.fromUint(10), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(mosaicSupplyChangeTransaction.maxFee.compact()).to.be.equal(mosaicSupplyChangeTransaction.size * FeeCalculationStrategy_1.DefaultFeeCalculationStrategy);
    });
    it('should filled maxFee override transaction maxFee', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction_1.MosaicSupplyChangeTransaction.create(Deadline_1.Deadline.create(), mosaicId, MosaicSupplyType_1.MosaicSupplyType.Increase, UInt64_1.UInt64.fromUint(10), NetworkType_1.NetworkType.MIJIN_TEST, new UInt64_1.UInt64([1, 0]));
        chai_1.expect(mosaicSupplyChangeTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(mosaicSupplyChangeTransaction.maxFee.lower).to.be.equal(1);
    });
    it('should createComplete an MosaicSupplyChangeTransaction object and sign it', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction_1.MosaicSupplyChangeTransaction.create(Deadline_1.Deadline.create(), mosaicId, MosaicSupplyType_1.MosaicSupplyType.Increase, UInt64_1.UInt64.fromUint(10), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(mosaicSupplyChangeTransaction.direction).to.be.equal(MosaicSupplyType_1.MosaicSupplyType.Increase);
        chai_1.expect(mosaicSupplyChangeTransaction.delta.lower).to.be.equal(10);
        chai_1.expect(mosaicSupplyChangeTransaction.delta.higher).to.be.equal(0);
        chai_1.expect(mosaicSupplyChangeTransaction.mosaicId.id.lower).to.be.equal(2262289484);
        chai_1.expect(mosaicSupplyChangeTransaction.mosaicId.id.higher).to.be.equal(3405110546);
        const signedTransaction = mosaicSupplyChangeTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('4CCCD78612DDF5CA010A00000000000000');
    });
    describe('size', () => {
        it('should return 139 for MosaicSupplyChange transaction byte size', () => {
            const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
            const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction_1.MosaicSupplyChangeTransaction.create(Deadline_1.Deadline.create(), mosaicId, MosaicSupplyType_1.MosaicSupplyType.Increase, UInt64_1.UInt64.fromUint(10), NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(mosaicSupplyChangeTransaction.size).to.be.equal(139);
        });
    });
});
//# sourceMappingURL=MosaicSupplyChangeTransaction.spec.js.map