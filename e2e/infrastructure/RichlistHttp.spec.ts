// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
import {expect} from 'chai';
import {RichlistHttp} from '../../src/infrastructure/RichlistHttp';
import {MosaicId} from '../../src/model/mosaic/MosaicId';
import {APIUrl, ConfNetworkMosaic } from '../conf/conf.spec';

const richlistHttp = new RichlistHttp(APIUrl);
const mosaicId = ConfNetworkMosaic;
// const richlistHttp = new RichlistHttp('http://localhost:3000');
// const mosaicId = new MosaicId('5CC0E4C7884FA22A');

describe('RichlistHttp', () => {
    describe('getMosaicRichlist', () => {
        it('should return mosaics richlist', (done) => {
            richlistHttp.getMosaicRichlist(mosaicId)
                .subscribe((richlistEntry) => {
                    expect(richlistEntry[0].amount).not.to.be.undefined;
                    expect(richlistEntry[0].address).not.to.be.undefined;
                    expect(richlistEntry[0].publicKey).not.to.be.undefined;
                    console.log(richlistEntry)
                    done();
                });
        });
    });
});
