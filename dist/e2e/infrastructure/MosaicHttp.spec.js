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
const MosaicHttp_1 = require("../../src/infrastructure/MosaicHttp");
const MosaicId_1 = require("../../src/model/mosaic/MosaicId");
const NamespaceId_1 = require("../../src/model/namespace/NamespaceId");
const conf_spec_1 = require("../conf/conf.spec");
describe('MosaicHttp', () => {
    const mosaicId = new MosaicId_1.MosaicId([3646934825, 3576016193]);
    const namespaceId = new NamespaceId_1.NamespaceId([929036875, 2226345261]);
    const mosaicHttp = new MosaicHttp_1.MosaicHttp(conf_spec_1.APIUrl);
    describe('getMosaic', () => {
        it('should return mosaic given mosaicId', (done) => {
            mosaicHttp.getMosaic(mosaicId)
                .subscribe((mosaicInfo) => {
                chai_1.expect(mosaicInfo.height.lower).to.be.equal(1);
                chai_1.expect(mosaicInfo.height.higher).to.be.equal(0);
                chai_1.expect(mosaicInfo.divisibility).to.be.equal(6);
                chai_1.expect(mosaicInfo.isSupplyMutable()).to.be.equal(false);
                chai_1.expect(mosaicInfo.isTransferable()).to.be.equal(true);
                chai_1.expect(mosaicInfo.isLevyMutable()).to.be.equal(false);
                done();
            });
        });
    });
    describe('getMosaics', () => {
        it('should return mosaics given array of mosaicIds', (done) => {
            mosaicHttp.getMosaics([mosaicId])
                .subscribe((mosaicInfos) => {
                chai_1.expect(mosaicInfos[0].height.lower).to.be.equal(1);
                chai_1.expect(mosaicInfos[0].height.higher).to.be.equal(0);
                chai_1.expect(mosaicInfos[0].divisibility).to.be.equal(6);
                chai_1.expect(mosaicInfos[0].isSupplyMutable()).to.be.equal(false);
                chai_1.expect(mosaicInfos[0].isTransferable()).to.be.equal(true);
                chai_1.expect(mosaicInfos[0].isLevyMutable()).to.be.equal(false);
                done();
            });
        });
    });
});
//# sourceMappingURL=MosaicHttp.spec.js.map