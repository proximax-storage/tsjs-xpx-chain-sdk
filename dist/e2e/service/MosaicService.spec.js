"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const AccountHttp_1 = require("../../src/infrastructure/AccountHttp");
const MosaicHttp_1 = require("../../src/infrastructure/MosaicHttp");
const Address_1 = require("../../src/model/account/Address");
const MosaicService_1 = require("../../src/service/MosaicService");
const conf_spec_1 = require("../conf/conf.spec");
describe('MosaicService', () => {
    it('should return the mosaic list skipping the expired mosaics', () => {
        const mosaicService = new MosaicService_1.MosaicService(new AccountHttp_1.AccountHttp(conf_spec_1.APIUrl), new MosaicHttp_1.MosaicHttp(conf_spec_1.APIUrl));
        const address = Address_1.Address.createFromRawAddress('SCO2JY-N6OJSM-CJPPVS-Z3OX7P-TWPQEJ-GZTI6W-GLKK');
        return mosaicService.mosaicsAmountViewFromAddress(address).pipe(operators_1.mergeMap((_) => _), operators_1.map((mosaic) => console.log('You have', mosaic.relativeAmount(), mosaic.fullName())), operators_1.toArray()).toPromise();
    });
});
//# sourceMappingURL=MosaicService.spec.js.map