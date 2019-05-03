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
/**
 * The mosaic info structure describes a mosaic.
 */
class MosaicInfo {
    /**
     * @param active
     * @param index
     * @param metaId
     * @param nonce
     * @param supply
     * @param height
     * @param owner
     * @param properties
     * @param levy
     */
    constructor(/**
                 * The meta data id.
                 */ metaId, 
    /**
     * The mosaic id.
     */
    mosaicId, 
    /**
     * The mosaic supply.
     */
    supply, 
    /**
     * The block height were mosaic was created.
     */
    height, 
    /**
     * The public key of the mosaic creator.
     */
    owner, 
    /**
     * The mosaic revision
     */
    revision, 
    /**
     * The mosaic properties.
     */
    properties, 
    /**
     * The optional levy for the mosaic. A creator can demand that each mosaic transfer induces an additional fee.
     */
    levy) {
        this.metaId = metaId;
        this.mosaicId = mosaicId;
        this.supply = supply;
        this.height = height;
        this.owner = owner;
        this.revision = revision;
        this.properties = properties;
        this.levy = levy;
    }
    /**
     * Mosaic divisibility
     * @returns {number}
     */
    get divisibility() {
        return this.properties.divisibility;
    }
    /**
     * Mosaic duration
     * @returns {UInt64}
     */
    get duration() {
        return this.properties.duration;
    }
    /**
     * Is mosaic supply mutable
     * @returns {boolean}
     */
    isSupplyMutable() {
        return this.properties.supplyMutable;
    }
    /**
     * Is mosaic transferable
     * @returns {boolean}
     */
    isTransferable() {
        return this.properties.transferable;
    }
    /**
     * Is levy mutable
     * @returns {boolean}
     */
    isLevyMutable() {
        return this.properties.levyMutable;
    }
}
exports.MosaicInfo = MosaicInfo;
//# sourceMappingURL=MosaicInfo.js.map