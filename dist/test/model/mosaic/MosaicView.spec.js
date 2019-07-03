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
const PublicAccount_1 = require("../../../src/model/account/PublicAccount");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const MosaicId_1 = require("../../../src/model/mosaic/MosaicId");
const MosaicInfo_1 = require("../../../src/model/mosaic/MosaicInfo");
const MosaicProperties_1 = require("../../../src/model/mosaic/MosaicProperties");
const MosaicView_1 = require("../../../src/service/MosaicView");
const UInt64_1 = require("../../../src/model/UInt64");
describe('MosaicView', () => {
    let mosaicInfo;
    before(() => {
        mosaicInfo = new MosaicInfo_1.MosaicInfo('59FDA0733F17CF0001772CBC', new MosaicId_1.MosaicId([3294802500, 2243684972]), new UInt64_1.UInt64([3403414400, 2095475]), // supply
        new UInt64_1.UInt64([1, 0]), // height
        PublicAccount_1.PublicAccount.createFromPublicKey('B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF', NetworkType_1.NetworkType.MIJIN_TEST), 1, // revision
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: true,
            transferable: true,
            divisibility: 2,
            duration: UInt64_1.UInt64.fromUint(1000),
        }));
    });
    it('should createComplete a Mosaic View', () => {
        const mosaicView = new MosaicView_1.MosaicView(mosaicInfo);
        chai_1.expect(mosaicView.mosaicInfo).to.be.an.instanceof(MosaicInfo_1.MosaicInfo);
    });
});
//# sourceMappingURL=MosaicView.spec.js.map