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
const assert_1 = require("assert");
const chai_1 = require("chai");
const MosaicInfo_1 = require("../../../src/model/mosaic/MosaicInfo");
const MosaicProperties_1 = require("../../../src/model/mosaic/MosaicProperties");
const UInt64_1 = require("../../../src/model/UInt64");
const PublicAccount_1 = require("../../../src/model/account/PublicAccount");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const MosaicId_1 = require("../../../src/model/mosaic/MosaicId");
describe('MosaicInfo', () => {
    const mosaicInfoDTO = {
        meta: {
            id: '59FDA0733F17CF0001772CBC',
        },
        mosaic: {
            mosaicId: new MosaicId_1.MosaicId([3646934825, 3576016193]),
            supply: new UInt64_1.UInt64([3403414400, 2095475]),
            height: new UInt64_1.UInt64([1, 0]),
            owner: PublicAccount_1.PublicAccount.createFromPublicKey('B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF', NetworkType_1.NetworkType.MIJIN_TEST),
            revision: 1,
            properties: [
                new UInt64_1.UInt64([6, 0]),
                new UInt64_1.UInt64([3, 0]),
                new UInt64_1.UInt64([1000, 0]),
            ],
        },
    };
    before(() => {
    });
    it('should createComplete an MosaicInfo object', () => {
        const mosaicInfo = new MosaicInfo_1.MosaicInfo(mosaicInfoDTO.meta.id, mosaicInfoDTO.mosaic.mosaicId, mosaicInfoDTO.mosaic.supply, mosaicInfoDTO.mosaic.height, mosaicInfoDTO.mosaic.owner, mosaicInfoDTO.mosaic.revision, new MosaicProperties_1.MosaicProperties(mosaicInfoDTO.mosaic.properties[0], mosaicInfoDTO.mosaic.properties[1].compact(), mosaicInfoDTO.mosaic.properties[2]));
        chai_1.expect(mosaicInfo.metaId).to.be.equal(mosaicInfoDTO.meta.id);
        assert_1.deepEqual(mosaicInfo.mosaicId, mosaicInfoDTO.mosaic.mosaicId);
        assert_1.deepEqual(mosaicInfo.supply, mosaicInfoDTO.mosaic.supply);
        assert_1.deepEqual(mosaicInfo.height, mosaicInfoDTO.mosaic.height);
        chai_1.expect(mosaicInfo.owner).to.be.equal(mosaicInfoDTO.mosaic.owner);
        assert_1.deepEqual(mosaicInfo.revision, mosaicInfoDTO.mosaic.revision);
        chai_1.expect(mosaicInfo.divisibility).to.be.equal(mosaicInfoDTO.mosaic.properties[1].lower);
        assert_1.deepEqual(mosaicInfo.duration, mosaicInfoDTO.mosaic.properties[2]);
    });
    it('should createComplete an MosaicInfo object without duration', () => {
        const mosaicInfo = new MosaicInfo_1.MosaicInfo(mosaicInfoDTO.meta.id, mosaicInfoDTO.mosaic.mosaicId, mosaicInfoDTO.mosaic.supply, mosaicInfoDTO.mosaic.height, mosaicInfoDTO.mosaic.owner, mosaicInfoDTO.mosaic.revision, new MosaicProperties_1.MosaicProperties(mosaicInfoDTO.mosaic.properties[0], mosaicInfoDTO.mosaic.properties[1].compact()));
        chai_1.expect(mosaicInfo.metaId).to.be.equal(mosaicInfoDTO.meta.id);
        assert_1.deepEqual(mosaicInfo.mosaicId, mosaicInfoDTO.mosaic.mosaicId);
        assert_1.deepEqual(mosaicInfo.supply, mosaicInfoDTO.mosaic.supply);
        assert_1.deepEqual(mosaicInfo.height, mosaicInfoDTO.mosaic.height);
        chai_1.expect(mosaicInfo.owner).to.be.equal(mosaicInfoDTO.mosaic.owner);
        assert_1.deepEqual(mosaicInfo.revision, mosaicInfoDTO.mosaic.revision);
        chai_1.expect(mosaicInfo.divisibility).to.be.equal(mosaicInfoDTO.mosaic.properties[1].lower);
        assert_1.deepEqual(mosaicInfo.duration, undefined);
    });
    describe('isSupplyMutable', () => {
        it('should return true when it\'s mutable', () => {
            const mosaicInfo = new MosaicInfo_1.MosaicInfo(mosaicInfoDTO.meta.id, mosaicInfoDTO.mosaic.mosaicId, mosaicInfoDTO.mosaic.supply, mosaicInfoDTO.mosaic.height, mosaicInfoDTO.mosaic.owner, mosaicInfoDTO.mosaic.revision, MosaicProperties_1.MosaicProperties.create({
                supplyMutable: true,
                transferable: false,
                divisibility: mosaicInfoDTO.mosaic.properties[1].compact(),
                duration: mosaicInfoDTO.mosaic.properties[2],
            }));
            chai_1.expect(mosaicInfo.isSupplyMutable()).to.be.equal(true);
        });
        it('should return false when it\'s immutable', () => {
            const mosaicInfo = new MosaicInfo_1.MosaicInfo(mosaicInfoDTO.meta.id, mosaicInfoDTO.mosaic.mosaicId, mosaicInfoDTO.mosaic.supply, mosaicInfoDTO.mosaic.height, mosaicInfoDTO.mosaic.owner, mosaicInfoDTO.mosaic.revision, MosaicProperties_1.MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                divisibility: mosaicInfoDTO.mosaic.properties[1].compact(),
                duration: mosaicInfoDTO.mosaic.properties[2],
            }));
            chai_1.expect(mosaicInfo.isSupplyMutable()).to.be.equal(false);
        });
    });
    describe('isTransferable', () => {
        it('should return true when it\'s transferable', () => {
            const mosaicInfo = new MosaicInfo_1.MosaicInfo(mosaicInfoDTO.meta.id, mosaicInfoDTO.mosaic.mosaicId, mosaicInfoDTO.mosaic.supply, mosaicInfoDTO.mosaic.height, mosaicInfoDTO.mosaic.owner, mosaicInfoDTO.mosaic.revision, MosaicProperties_1.MosaicProperties.create({
                supplyMutable: false,
                transferable: true,
                divisibility: mosaicInfoDTO.mosaic.properties[1].compact(),
                duration: mosaicInfoDTO.mosaic.properties[2],
            }));
            chai_1.expect(mosaicInfo.isTransferable()).to.be.equal(true);
        });
        it('should return false when it\'s not transferable', () => {
            const mosaicInfo = new MosaicInfo_1.MosaicInfo(mosaicInfoDTO.meta.id, mosaicInfoDTO.mosaic.mosaicId, mosaicInfoDTO.mosaic.supply, mosaicInfoDTO.mosaic.height, mosaicInfoDTO.mosaic.owner, mosaicInfoDTO.mosaic.revision, MosaicProperties_1.MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                divisibility: mosaicInfoDTO.mosaic.properties[1].compact(),
                duration: mosaicInfoDTO.mosaic.properties[2],
            }));
            chai_1.expect(mosaicInfo.isTransferable()).to.be.equal(false);
        });
    });
});
//# sourceMappingURL=MosaicInfo.spec.js.map