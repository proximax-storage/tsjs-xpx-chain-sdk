"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const operators_1 = require("rxjs/operators");
const AccountHttp_1 = require("../../src/infrastructure/AccountHttp");
const MosaicHttp_1 = require("../../src/infrastructure/MosaicHttp");
const Address_1 = require("../../src/model/account/Address");
const MosaicService_1 = require("../../src/service/MosaicService");
const conf_spec_1 = require("../conf/conf.spec");
const model_1 = require("../../src/model/model");
describe('MosaicService', () => {
    let accountAddress;
    let accountHttp;
    let mosaicHttp;
    it('mosaicsView', () => {
        const mosaicId = new model_1.MosaicId([3294802500, 2243684972]);
        const mosaicService = new MosaicService_1.MosaicService(new AccountHttp_1.AccountHttp(conf_spec_1.APIUrl), new MosaicHttp_1.MosaicHttp(conf_spec_1.APIUrl));
        return mosaicService.mosaicsView([mosaicId]).subscribe((mosaicsView) => {
            const mosaicView = mosaicsView[0];
            chai_1.expect(mosaicView.mosaicInfo).to.be.an.instanceof(model_1.MosaicInfo);
        });
    });
    it('mosaicsView of no existing mosaicId', () => {
        const mosaicId = new model_1.MosaicId([1234, 1234]);
        const mosaicService = new MosaicService_1.MosaicService(new AccountHttp_1.AccountHttp(conf_spec_1.APIUrl), new MosaicHttp_1.MosaicHttp(conf_spec_1.APIUrl));
        return mosaicService.mosaicsView([mosaicId]).subscribe((mosaicsView) => {
            chai_1.expect(mosaicsView.length).to.be.equal(0);
        });
    });
    it('mosaicsAmountView', () => {
        const mosaicService = new MosaicService_1.MosaicService(new AccountHttp_1.AccountHttp(conf_spec_1.APIUrl), new MosaicHttp_1.MosaicHttp(conf_spec_1.APIUrl));
        return mosaicService.mosaicsAmountViewFromAddress(Address_1.Address.createFromRawAddress('SARNASAS2BIAB6LMFA3FPMGBPGIJGK6IJETM3ZSP'))
            .subscribe((mosaicsAmountView) => {
            const mosaicAmountView = mosaicsAmountView[0];
            chai_1.expect(mosaicAmountView.mosaicInfo).to.be.an.instanceof(model_1.MosaicInfo);
        });
    });
    it('mosaicsAmountView of no existing account', () => {
        const mosaicService = new MosaicService_1.MosaicService(new AccountHttp_1.AccountHttp(conf_spec_1.APIUrl), new MosaicHttp_1.MosaicHttp(conf_spec_1.APIUrl));
        return mosaicService.mosaicsAmountViewFromAddress(Address_1.Address.createFromRawAddress('SCKBZAMIQ6F46QMZUANE6E33KA63KA7KEQ5X6WJW'))
            .subscribe((mosaicsAmountView) => {
            chai_1.expect(mosaicsAmountView.length).to.be.equal(0);
        });
    });
    it('mosaicsAmountView', () => {
        const mosaic = new model_1.Mosaic(new model_1.MosaicId([3646934825, 3576016193]), model_1.UInt64.fromUint(1000));
        const mosaicService = new MosaicService_1.MosaicService(new AccountHttp_1.AccountHttp(conf_spec_1.APIUrl), new MosaicHttp_1.MosaicHttp(conf_spec_1.APIUrl));
        return mosaicService.mosaicsAmountView([mosaic]).subscribe((mosaicsAmountView) => {
            const mosaicAmountView = mosaicsAmountView[0];
            chai_1.expect(mosaicAmountView.mosaicInfo).to.be.an.instanceof(model_1.MosaicInfo);
            chai_1.expect(mosaicAmountView.amount.compact()).to.be.equal(1000);
        });
    });
    it('should return the mosaic list skipping the expired mosaics', () => {
        const mosaicService = new MosaicService_1.MosaicService(new AccountHttp_1.AccountHttp(conf_spec_1.APIUrl), new MosaicHttp_1.MosaicHttp(conf_spec_1.APIUrl));
        return conf_spec_1.GetNemesisBlockDataPromise().then(data => {
            return mosaicService.mosaicsAmountViewFromAddress(conf_spec_1.SeedAccount.address).pipe(operators_1.mergeMap((_) => _), operators_1.map((mosaic) => console.log('You have', mosaic.relativeAmount(), mosaic.fullName())), operators_1.toArray()).toPromise();
        });
    });
});
//# sourceMappingURL=MosaicService.spec.js.map