"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const NamespaceId_1 = require("../namespace/NamespaceId");
const UInt64_1 = require("../UInt64");
const Mosaic_1 = require("./Mosaic");
/**
 * NetworkHarvestMosaic mosaic
 *
 * This represents the per-network harvest mosaic. This mosaicId is aliased
 * with namespace name `cat.harvest`.
 *
 * @since 0.10.2
 */
class NetworkHarvestMosaic extends Mosaic_1.Mosaic {
    /**
     * constructor
     * @param owner
     * @param amount
     */
    constructor(amount) {
        super(NetworkHarvestMosaic.NAMESPACE_ID, amount);
    }
    /**
     * Create NetworkHarvestMosaic with using NetworkHarvestMosaic as unit.
     *
     * @param amount
     * @returns {NetworkHarvestMosaic}
     */
    static createRelative(amount) {
        if (typeof amount === 'number') {
            return new NetworkHarvestMosaic(UInt64_1.UInt64.fromUint(amount * Math.pow(10, NetworkHarvestMosaic.DIVISIBILITY)));
        }
        return new NetworkHarvestMosaic(UInt64_1.UInt64.fromUint(amount.compact() * Math.pow(10, NetworkHarvestMosaic.DIVISIBILITY)));
    }
    /**
     * Create NetworkHarvestMosaic with using micro NetworkHarvestMosaic as unit,
     * 1 NetworkHarvestMosaic = 1000000 micro NetworkHarvestMosaic.
     *
     * @param amount
     * @returns {NetworkHarvestMosaic}
     */
    static createAbsolute(amount) {
        if (typeof amount === 'number') {
            return new NetworkHarvestMosaic(UInt64_1.UInt64.fromUint(amount));
        }
        return new NetworkHarvestMosaic(amount);
    }
}
/**
 * namespaceId of `currency` namespace.
 *
 * @type {Id}
 */
NetworkHarvestMosaic.NAMESPACE_ID = new NamespaceId_1.NamespaceId('cat.harvest');
/**
 * Divisiblity
 * @type {number}
 */
NetworkHarvestMosaic.DIVISIBILITY = 3;
/**
 * Initial supply
 * @type {number}
 */
NetworkHarvestMosaic.INITIAL_SUPPLY = 15000000;
/**
 * Is tranferable
 * @type {boolean}
 */
NetworkHarvestMosaic.TRANSFERABLE = true;
/**
 * Is Supply mutable
 * @type {boolean}
 */
NetworkHarvestMosaic.SUPPLY_MUTABLE = true;
exports.NetworkHarvestMosaic = NetworkHarvestMosaic;
//# sourceMappingURL=NetworkHarvestMosaic.js.map