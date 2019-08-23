// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {expect} from 'chai';
import { APIUrl } from '../conf/conf.spec';
import { ChainUpgradeHttp } from '../../src/infrastructure/ChainUpgradeHttp';
describe('ChainUpgradeHttp', () => {
    let chainUpgradeHttp = new ChainUpgradeHttp(APIUrl);

    describe('getChainUpgrade', () => {
        it('should return blockchain version requirements', (done) => {
            chainUpgradeHttp.getChainUpgrade(1000000)
                .subscribe((chainUpgrade) => {
                    expect(chainUpgrade).not.to.be.undefined;
                    expect(chainUpgrade.height).not.to.be.equal(0);
                    expect(chainUpgrade.catapultVersion.compact()).not.to.be.equal(0);
                    done();
                });
        });
    });
});
