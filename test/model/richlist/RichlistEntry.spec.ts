// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {expect} from 'chai';
import {Address} from '../../../src/model/account/Address';
import {RichlistEntry} from '../../../src/model/richlist/RichlistEntry';
import {UInt64} from '../../../src/model/UInt64';

describe('RichlistEntry', () => {

    it('should be create richlist entry', () => {
        const address = Address.createFromRawAddress('SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2');
        const publicKey = 'c2f93346e27ce6ad1a9f8f5e3066f8326593a406bdf357acb041e2f9ab402efe';
        const mosaicAmt = UInt64.fromUint(500);

        const result = RichlistEntry.create(address, publicKey, mosaicAmt);

        expect(result.address).to.be.equal(address);
        expect(result.publicKey).to.be.equal(publicKey);
        expect(result.amount).to.be.equal(mosaicAmt);
    });
});
