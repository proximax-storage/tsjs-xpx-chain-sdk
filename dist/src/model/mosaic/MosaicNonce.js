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
const crypto_1 = require("../../core/crypto");
const format_1 = require("../../core/format");
/**
 * The mosaic nonce structure
 *
 * @since 1.0
 */
class MosaicNonce {
    /**
     * Create a random MosaicNonce
     *
     * @return  {MosaicNonce}
     */
    static createRandom() {
        const bytes = crypto_1.Crypto.randomBytes(4);
        const nonce = new Uint8Array(bytes);
        return new MosaicNonce(nonce);
    }
    /**
     * Create a MosaicNonce from hexadecimal notation.
     *
     * @param   hex     {string}
     * @return  {MosaicNonce}
     */
    static createFromHex(hex) {
        const uint8 = format_1.Convert.hexToUint8(hex);
        if (uint8.length !== 4) {
            throw new Error('Expected 4 bytes for Nonce and got ' + hex.length + ' instead.');
        }
        return new MosaicNonce(uint8);
    }
    /**
     * Create MosaicNonce from Uint8Array
     *
     * @param id
     */
    constructor(nonce) {
        if (nonce.length !== 4) {
            throw Error('Invalid byte size for nonce, should be 4 bytes but received ' + nonce.length);
        }
        this.nonce = nonce;
    }
    /**
     * @internal
     * @returns {[number,number,number,number]}
     */
    toDTO() {
        return this.nonce;
    }
}
exports.MosaicNonce = MosaicNonce;
//# sourceMappingURL=MosaicNonce.js.map