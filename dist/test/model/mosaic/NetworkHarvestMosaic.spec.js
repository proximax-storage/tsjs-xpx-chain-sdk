"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const chai_1 = require("chai");
const NetworkHarvestMosaic_1 = require("../../../src/model/mosaic/NetworkHarvestMosaic");
const NamespaceId_1 = require("../../../src/model/namespace/NamespaceId");
describe('NetworkHarvestMosaic', () => {
    it('should createComplete an NetworkHarvestMosaic object', () => {
        const currency = NetworkHarvestMosaic_1.NetworkHarvestMosaic.createRelative(1000);
        assert_1.deepEqual(currency.id.id.toHex(), '941299b2b7e1291c');
        chai_1.expect(currency.amount.compact()).to.be.equal(1000 * 1000);
    });
    it('should set amount in smallest unit when toDTO()', () => {
        const currency = NetworkHarvestMosaic_1.NetworkHarvestMosaic.createRelative(1000);
        chai_1.expect(currency.toDTO().amount[0]).to.be.equal(1000 * 1000);
    });
    it('should have valid statics', () => {
        assert_1.deepEqual(NetworkHarvestMosaic_1.NetworkHarvestMosaic.NAMESPACE_ID.id, new NamespaceId_1.NamespaceId([3084986652, 2484246962]).id);
        chai_1.expect(NetworkHarvestMosaic_1.NetworkHarvestMosaic.DIVISIBILITY).to.be.equal(3);
        chai_1.expect(NetworkHarvestMosaic_1.NetworkHarvestMosaic.TRANSFERABLE).to.be.equal(true);
        chai_1.expect(NetworkHarvestMosaic_1.NetworkHarvestMosaic.SUPPLY_MUTABLE).to.be.equal(true);
    });
});
//# sourceMappingURL=NetworkHarvestMosaic.spec.js.map