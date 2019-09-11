"use strict";
/*
 * Copyright 2019 NEM
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
const NamespaceId_1 = require("../namespace/NamespaceId");
const UInt64_1 = require("../UInt64");
const Mosaic_1 = require("./Mosaic");
/**
 * NetworkCurrencyMosaic mosaic
 *
 * This represents the per-network currency mosaic. This mosaicId is aliased
 * with namespace name `cat.currency`.
 *
 * @since 0.10.2
 */
class NetworkCurrencyMosaic extends Mosaic_1.Mosaic {
    /**
     * constructor
     * @param owner
     * @param amount
     */
    constructor(amount) {
        super(NetworkCurrencyMosaic.NAMESPACE_ID, amount);
    }
    /**
     * Create NetworkCurrencyMosaic with using NetworkCurrencyMosaic as unit.
     *
     * @param amount
     * @returns {NetworkCurrencyMosaic}
     */
    static createRelative(amount) {
        if (typeof amount === 'number') {
            return new NetworkCurrencyMosaic(UInt64_1.UInt64.fromUint(amount * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY)));
        }
        return new NetworkCurrencyMosaic(UInt64_1.UInt64.fromUint(amount.compact() * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY)));
    }
    /**
     * Create NetworkCurrencyMosaic with using micro NetworkCurrencyMosaic as unit,
     * 1 NetworkCurrencyMosaic = 1000000 micro NetworkCurrencyMosaic.
     *
     * @param amount
     * @returns {NetworkCurrencyMosaic}
     */
    static createAbsolute(amount) {
        if (typeof amount === 'number') {
            return new NetworkCurrencyMosaic(UInt64_1.UInt64.fromUint(amount));
        }
        return new NetworkCurrencyMosaic(amount);
    }
}
/**
 * namespaceId of `currency` namespace.
 *
 * @type {Id}
 */
NetworkCurrencyMosaic.NAMESPACE_ID = new NamespaceId_1.NamespaceId('cat.currency');
/**
 * Divisiblity
 * @type {number}
 */
NetworkCurrencyMosaic.DIVISIBILITY = 6;
/**
 * Initial supply
 * @type {number}
 */
NetworkCurrencyMosaic.INITIAL_SUPPLY = 8999999998;
/**
 * Is tranferable
 * @type {boolean}
 */
NetworkCurrencyMosaic.TRANSFERABLE = true;
/**
 * Is Supply mutable
 * @type {boolean}
 */
NetworkCurrencyMosaic.SUPPLY_MUTABLE = false;
exports.NetworkCurrencyMosaic = NetworkCurrencyMosaic;
//# sourceMappingURL=NetworkCurrencyMosaic.js.map