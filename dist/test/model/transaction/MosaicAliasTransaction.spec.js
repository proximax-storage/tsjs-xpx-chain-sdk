"use strict";
/*
 * Copyright 2019 NEM
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
const AliasActionType_1 = require("../../../src/model/namespace/AliasActionType");
const NamespaceId_1 = require("../../../src/model/namespace/NamespaceId");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const MosaicAliasTransaction_1 = require("../../../src/model/transaction/MosaicAliasTransaction");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
const FeeCalculationStrategy_1 = require("../../../src/model/transaction/FeeCalculationStrategy");
describe('MosaicAliasTransaction', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction_1.MosaicAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, mosaicId, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(mosaicAliasTransaction.maxFee.compact()).to.be.equal(mosaicAliasTransaction.size * FeeCalculationStrategy_1.DefaultFeeCalculationStrategy);
    });
    it('should filled maxFee override transaction maxFee', () => {
        const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction_1.MosaicAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, mosaicId, NetworkType_1.NetworkType.MIJIN_TEST, new UInt64_1.UInt64([1, 0]));
        chai_1.expect(mosaicAliasTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(mosaicAliasTransaction.maxFee.lower).to.be.equal(1);
    });
    it('should createComplete an MosaicAliasTransaction object and sign it', () => {
        const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction_1.MosaicAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, mosaicId, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(mosaicAliasTransaction.actionType).to.be.equal(AliasActionType_1.AliasActionType.Link);
        chai_1.expect(mosaicAliasTransaction.namespaceId.id.lower).to.be.equal(33347626);
        chai_1.expect(mosaicAliasTransaction.namespaceId.id.higher).to.be.equal(3779697293);
        chai_1.expect(mosaicAliasTransaction.mosaicId.id.lower).to.be.equal(2262289484);
        chai_1.expect(mosaicAliasTransaction.mosaicId.id.higher).to.be.equal(3405110546);
        const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('002AD8FC018D9A49E14CCCD78612DDF5CA');
    });
    describe('size', () => {
        it('should return 139 for MosaicAliasTransaction transaction byte size', () => {
            const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
            const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
            const mosaicAliasTransaction = MosaicAliasTransaction_1.MosaicAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, mosaicId, NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(mosaicAliasTransaction.size).to.be.equal(139);
        });
    });
});
//# sourceMappingURL=MosaicAliasTransaction.spec.js.map