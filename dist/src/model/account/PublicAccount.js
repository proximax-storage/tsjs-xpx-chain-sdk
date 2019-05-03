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
const js_xpx_catapult_library_1 = require("js-xpx-catapult-library");
const Address_1 = require("./Address");
const Hash512 = 64;
/**
 * The public account structure contains account's address and public key.
 */
class PublicAccount {
    /**
     * @internal
     * @param publicKey
     * @param address
     */
    constructor(
    /**
     * The account public private.
     */
    publicKey, 
    /**
     * The account address.
     */
    address) {
        this.publicKey = publicKey;
        this.address = address;
    }
    /**
     * Create a PublicAccount from a public key and network type.
     * @param publicKey Public key
     * @param networkType Network type
     * @returns {PublicAccount}
     */
    static createFromPublicKey(publicKey, networkType) {
        if (publicKey == null || (publicKey.length !== 64 && publicKey.length !== 66)) {
            throw new Error('Not a valid public key');
        }
        const address = Address_1.Address.createFromPublicKey(publicKey, networkType);
        return new PublicAccount(publicKey, address);
    }
    /**
     * Verify a signature.
     *
     * @param {string} data - The data to verify.
     * @param {string} signature - The signature to verify.
     *
     * @return {boolean}  - True if the signature is valid, false otherwise.
     */
    verifySignature(data, signature) {
        if (!signature) {
            throw new Error('Missing argument');
        }
        if (signature.length / 2 !== Hash512) {
            throw new Error('Signature length is incorrect');
        }
        if (!js_xpx_catapult_library_1.convert.isHexString(signature)) {
            throw new Error('Signature must be hexadecimal only');
        }
        // Convert signature key to Uint8Array
        const convertedSignature = js_xpx_catapult_library_1.convert.hexToUint8(signature);
        // Convert to Uint8Array
        const convertedData = js_xpx_catapult_library_1.convert.hexToUint8(js_xpx_catapult_library_1.convert.utf8ToHex(data));
        return js_xpx_catapult_library_1.KeyPair.verify(js_xpx_catapult_library_1.convert.hexToUint8(this.publicKey), convertedData, convertedSignature);
    }
    /**
     * Compares public accounts for equality.
     * @param publicAccount
     * @returns {boolean}
     */
    equals(publicAccount) {
        return this.publicKey === publicAccount.publicKey && this.address.plain() === publicAccount.address.plain();
    }
    /**
     * Create DTO object
     */
    toDTO() {
        return {
            publicKey: this.publicKey,
            address: this.address.toDTO(),
        };
    }
}
exports.PublicAccount = PublicAccount;
//# sourceMappingURL=PublicAccount.js.map