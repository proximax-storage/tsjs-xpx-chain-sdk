"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const conf_spec_1 = require("../conf/conf.spec");
const ChainConfigHttp_1 = require("../../src/infrastructure/ChainConfigHttp");
describe('ChainConfigHttp', () => {
    let chainConfigHttp = new ChainConfigHttp_1.ChainConfigHttp(conf_spec_1.APIUrl);
    describe('getChainConfig', () => {
        it('should return blockchain config', (done) => {
            chainConfigHttp.getChainConfig(1)
                .subscribe((chainConfig) => {
                chai_1.expect(chainConfig.height.compact()).to.be.equal(1);
                chai_1.expect(chainConfig.blockChainConfig).not.to.be.undefined;
                chai_1.expect(chainConfig.supportedEntityVersions).not.to.be.undefined;
                done();
            });
        });
    });
});
//# sourceMappingURL=ChainConfigHttp.spec.js.map