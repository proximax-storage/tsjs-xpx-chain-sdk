"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const conf_spec_1 = require("../conf/conf.spec");
const ChainUpgradeHttp_1 = require("../../src/infrastructure/ChainUpgradeHttp");
describe('ChainUpgradeHttp', () => {
    let chainUpgradeHttp = new ChainUpgradeHttp_1.ChainUpgradeHttp(conf_spec_1.APIUrl);
    describe('getChainUpgrade', () => {
        it('should return blockchain version requirements', (done) => {
            chainUpgradeHttp.getChainUpgrade(1000000)
                .subscribe((chainUpgrade) => {
                chai_1.expect(chainUpgrade).not.to.be.undefined;
                chai_1.expect(chainUpgrade.height).not.to.be.equal(0);
                chai_1.expect(chainUpgrade.catapultVersion.compact()).not.to.be.equal(0);
                done();
            });
        });
    });
});
//# sourceMappingURL=ChainUpgradeHttp.spec.js.map