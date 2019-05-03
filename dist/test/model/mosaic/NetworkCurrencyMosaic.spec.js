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
const NetworkCurrencyMosaic_1 = require("../../../src/model/mosaic/NetworkCurrencyMosaic");
const NamespaceId_1 = require("../../../src/model/namespace/NamespaceId");
describe('NetworkCurrencyMosaic', () => {
    it('should createComplete an NetworkCurrencyMosaic object', () => {
        const currency = NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(1000);
        assert_1.deepEqual(currency.id.id.toHex(), '85bbea6cc462b244'); // holds NAMESPACE_ID
        chai_1.expect(currency.amount.compact()).to.be.equal(1000 * 1000000);
    });
    it('should set amount in smallest unit when toDTO()', () => {
        const currency = NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(1000);
        chai_1.expect(currency.toDTO().amount[0]).to.be.equal(1000 * 1000000);
    });
    it('should have valid statics', () => {
        assert_1.deepEqual(NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.NAMESPACE_ID.id, new NamespaceId_1.NamespaceId([3294802500, 2243684972]).id);
        chai_1.expect(NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.DIVISIBILITY).to.be.equal(6);
        chai_1.expect(NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.TRANSFERABLE).to.be.equal(true);
        chai_1.expect(NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.SUPPLY_MUTABLE).to.be.equal(false);
        chai_1.expect(NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.LEVY_MUTABLE).to.be.equal(false);
    });
});
//# sourceMappingURL=NetworkCurrencyMosaic.spec.js.map