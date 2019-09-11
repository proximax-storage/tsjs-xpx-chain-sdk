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
const MosaicNonce_1 = require("../../../src/model/mosaic/MosaicNonce");
const MosaicProperties_1 = require("../../../src/model/mosaic/MosaicProperties");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const MosaicDefinitionTransaction_1 = require("../../../src/model/transaction/MosaicDefinitionTransaction");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
describe('MosaicDefinitionTransaction', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should default maxFee field be set to 0', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: true,
            transferable: true,
            divisibility: 3,
            duration: UInt64_1.UInt64.fromUint(1000),
        }), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(mosaicDefinitionTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(mosaicDefinitionTransaction.maxFee.lower).to.be.equal(0);
    });
    it('should filled maxFee override transaction maxFee', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: true,
            transferable: true,
            divisibility: 3,
            duration: UInt64_1.UInt64.fromUint(1000),
        }), NetworkType_1.NetworkType.MIJIN_TEST, new UInt64_1.UInt64([1, 0]));
        chai_1.expect(mosaicDefinitionTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(mosaicDefinitionTransaction.maxFee.lower).to.be.equal(1);
    });
    it('should createComplete an MosaicDefinitionTransaction object and sign it with flags 7', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: true,
            transferable: true,
            divisibility: 3,
            duration: UInt64_1.UInt64.fromUint(1000),
        }), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.duration.lower).to.be.equal(1000);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.duration.higher).to.be.equal(0);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.divisibility).to.be.equal(3);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.supplyMutable).to.be.equal(true);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.transferable).to.be.equal(true);
        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('E6DE84B8010000000000000001030302E803000000000000');
    });
    it('should createComplete an MosaicDefinitionTransaction object and sign it with flags 0', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            divisibility: 3,
            duration: UInt64_1.UInt64.fromUint(1000),
        }), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.duration.lower).to.be.equal(1000);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.duration.higher).to.be.equal(0);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.divisibility).to.be.equal(3);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.supplyMutable).to.be.equal(false);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.transferable).to.be.equal(false);
        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('E6DE84B8010000000000000001000302E803000000000000');
    });
    describe('size', () => {
        it('should return 146 for MosaicDefinition transaction byte size', () => {
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties_1.MosaicProperties.create({
                supplyMutable: true,
                transferable: true,
                divisibility: 3,
                duration: UInt64_1.UInt64.fromUint(1000),
            }), NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(mosaicDefinitionTransaction.size).to.be.equal(146);
        });
    });
    it('should createComplete an MosaicDefinitionTransaction object and sign it without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            divisibility: 3,
        }), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.divisibility).to.be.equal(3);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.supplyMutable).to.be.equal(false);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.transferable).to.be.equal(false);
        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('E6DE84B80100000000000000000003');
    });
    it('should createComplete an MosaicDefinitionTransaction object and sign it without duration with zero nonce', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0x00, 0x00, 0x00, 0x00])), // zero nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            divisibility: 3,
        }), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.divisibility).to.be.equal(3);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.supplyMutable).to.be.equal(false);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.transferable).to.be.equal(false);
        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('000000000100000000000000000003');
    });
});
//# sourceMappingURL=MosaicDefinitionTransaction.spec.js.map