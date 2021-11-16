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

import {deepStrictEqual} from 'assert';
import {expect} from 'chai';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {NetworkHarvestMosaic} from '../../../src/model/mosaic/NetworkHarvestMosaic';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';

describe('NetworkHarvestMosaic', () => {

    it('should createComplete an NetworkHarvestMosaic object', () => {

        const currency = NetworkHarvestMosaic.createRelative(1000);

        deepStrictEqual(currency.id.id.toHex(), 'bffb42a19116bdf6');
        expect(currency.amount.compact()).to.be.equal(1000 * 1000000);
    });

    it('should set amount in smallest unit when toDTO()', () => {

        const currency = NetworkHarvestMosaic.createRelative(1000);
        expect(currency.toDTO().amount[0]).to.be.equal(1000 * 1000000);
    });

    it('should have valid hardcoded default values', () => {
        const h = NetworkHarvestMosaic.createAbsolute(0);
        deepStrictEqual(h.ID.id, new NamespaceId([2434186742, 3220914849]).id);
        expect(h.DIVISIBILITY).to.be.equal(6);
        expect(h.TRANSFERABLE).to.be.equal(true);
        expect(h.SUPPLY_MUTABLE).to.be.equal(false);
    });
});
