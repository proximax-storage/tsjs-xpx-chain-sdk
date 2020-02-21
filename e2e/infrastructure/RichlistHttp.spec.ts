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
