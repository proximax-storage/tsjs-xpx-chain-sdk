// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {expect} from 'chai';
import { APIUrl } from '../conf/conf.spec';
import { NetworkConfigHttp } from '../../src/infrastructure/NetworkConfigHttp';
describe('NetworkConfigHttp', () => {
    let chainConfigHttp = new NetworkConfigHttp(APIUrl);

    describe('getChainConfig', () => {
        it('should return blockchain config', (done) => {
            chainConfigHttp.getChainConfig(1)
                .subscribe((chainConfig) => {
                    expect(chainConfig.height.compact()).to.be.equal(1);
                    expect(chainConfig.networkConfig).not.to.be.undefined;
                    expect(chainConfig.supportedEntityVersions).not.to.be.undefined;
                    done();
                });
        });
    });
});
