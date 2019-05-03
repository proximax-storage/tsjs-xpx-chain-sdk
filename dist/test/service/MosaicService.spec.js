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
const AccountHttp_1 = require("../../src/infrastructure/AccountHttp");
const MosaicHttp_1 = require("../../src/infrastructure/MosaicHttp");
const Address_1 = require("../../src/model/account/Address");
const Mosaic_1 = require("../../src/model/mosaic/Mosaic");
const MosaicId_1 = require("../../src/model/mosaic/MosaicId");
const MosaicInfo_1 = require("../../src/model/mosaic/MosaicInfo");
const UInt64_1 = require("../../src/model/UInt64");
const MosaicService_1 = require("../../src/service/MosaicService");
const conf = require("../conf/conf.spec");
describe('MosaicService', () => {
    it('mosaicsView', () => {
        const mosaicId = new MosaicId_1.MosaicId([3294802500, 2243684972]);
        const mosaicService = new MosaicService_1.MosaicService(new AccountHttp_1.AccountHttp(conf.NIS2_URL), new MosaicHttp_1.MosaicHttp(conf.NIS2_URL));
        return mosaicService.mosaicsView([mosaicId]).subscribe((mosaicsView) => {
            const mosaicView = mosaicsView[0];
            chai_1.expect(mosaicView.mosaicInfo).to.be.an.instanceof(MosaicInfo_1.MosaicInfo);
        });
    });
    it('mosaicsView of no existing mosaicId', () => {
        const mosaicId = new MosaicId_1.MosaicId([1234, 1234]);
        const mosaicService = new MosaicService_1.MosaicService(new AccountHttp_1.AccountHttp(conf.NIS2_URL), new MosaicHttp_1.MosaicHttp(conf.NIS2_URL));
        return mosaicService.mosaicsView([mosaicId]).subscribe((mosaicsView) => {
            chai_1.expect(mosaicsView.length).to.be.equal(0);
        });
    });
    it('mosaicsAmountView', () => {
        const mosaicService = new MosaicService_1.MosaicService(new AccountHttp_1.AccountHttp(conf.NIS2_URL), new MosaicHttp_1.MosaicHttp(conf.NIS2_URL));
        return mosaicService.mosaicsAmountViewFromAddress(Address_1.Address.createFromRawAddress('SARNASAS2BIAB6LMFA3FPMGBPGIJGK6IJETM3ZSP'))
            .subscribe((mosaicsAmountView) => {
            const mosaicAmountView = mosaicsAmountView[0];
            chai_1.expect(mosaicAmountView.mosaicInfo).to.be.an.instanceof(MosaicInfo_1.MosaicInfo);
        });
    });
    it('mosaicsAmountView of no existing account', () => {
        const mosaicService = new MosaicService_1.MosaicService(new AccountHttp_1.AccountHttp(conf.NIS2_URL), new MosaicHttp_1.MosaicHttp(conf.NIS2_URL));
        return mosaicService.mosaicsAmountViewFromAddress(Address_1.Address.createFromRawAddress('SCKBZAMIQ6F46QMZUANE6E33KA63KA7KEQ5X6WJW'))
            .subscribe((mosaicsAmountView) => {
            chai_1.expect(mosaicsAmountView.length).to.be.equal(0);
        });
    });
    it('mosaicsAmountView', () => {
        const mosaic = new Mosaic_1.Mosaic(new MosaicId_1.MosaicId([3646934825, 3576016193]), UInt64_1.UInt64.fromUint(1000));
        const mosaicService = new MosaicService_1.MosaicService(new AccountHttp_1.AccountHttp(conf.NIS2_URL), new MosaicHttp_1.MosaicHttp(conf.NIS2_URL));
        return mosaicService.mosaicsAmountView([mosaic]).subscribe((mosaicsAmountView) => {
            const mosaicAmountView = mosaicsAmountView[0];
            chai_1.expect(mosaicAmountView.mosaicInfo).to.be.an.instanceof(MosaicInfo_1.MosaicInfo);
            chai_1.expect(mosaicAmountView.amount.compact()).to.be.equal(1000);
        });
    });
});
//# sourceMappingURL=MosaicService.spec.js.map