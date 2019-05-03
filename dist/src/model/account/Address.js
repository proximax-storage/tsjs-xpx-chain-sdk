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
const NetworkType_1 = require("../blockchain/NetworkType");
/**
 * The address structure describes an address with its network
 */
class Address {
    /**
     * @internal
     * @param address
     * @param networkType
     */
    constructor(/**
                         * The address value.
                         */ address, 
    /**
     * The NEM network type.
     */
    networkType) {
        this.address = address;
        this.networkType = networkType;
    }
    /**
     * Create from private key
     * @param publicKey - The account public key.
     * @param networkType - The NEM network type.
     * @returns {Address}
     */
    static createFromPublicKey(publicKey, networkType) {
        const publicKeyUint8 = js_xpx_catapult_library_1.convert.hexToUint8(publicKey);
        const address = js_xpx_catapult_library_1.address
            .addressToString(js_xpx_catapult_library_1.address.publicKeyToAddress(publicKeyUint8, networkType));
        return new Address(address, networkType);
    }
    /**
     * Create an Address from a given raw address.
     * @param rawAddress - Address in string format.
     *                  ex: SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3 or SB3KUB-HATFCP-V7UZQL-WAQ2EU-R6SIHB-SBEOED-DDF3
     * @returns {Address}
     */
    static createFromRawAddress(rawAddress) {
        let networkType;
        const addressTrimAndUpperCase = rawAddress
            .trim()
            .toUpperCase()
            .replace(/-/g, '');
        if (addressTrimAndUpperCase.length !== 40) {
            throw new Error('Address ' + addressTrimAndUpperCase + ' has to be 40 characters long');
        }
        if (addressTrimAndUpperCase.charAt(0) === 'S') {
            networkType = NetworkType_1.NetworkType.MIJIN_TEST;
        }
        else if (addressTrimAndUpperCase.charAt(0) === 'M') {
            networkType = NetworkType_1.NetworkType.MIJIN;
        }
        else if (addressTrimAndUpperCase.charAt(0) === 'V') {
            networkType = NetworkType_1.NetworkType.TEST_NET;
        }
        else if (addressTrimAndUpperCase.charAt(0) === 'X') {
            networkType = NetworkType_1.NetworkType.MAIN_NET;
        }
        else if (addressTrimAndUpperCase.charAt(0) === 'W') {
            networkType = NetworkType_1.NetworkType.PRIVATE_TEST;
        }
        else if (addressTrimAndUpperCase.charAt(0) === 'Z') {
            networkType = NetworkType_1.NetworkType.PRIVATE;
        }
        else {
            throw new Error('Address Network unsupported');
        }
        return new Address(addressTrimAndUpperCase, networkType);
    }
    /**
     * @internal
     * Create an Address from a given encoded address.
     * @param {string} encoded
     * @return {Address}
     */
    static createFromEncoded(encoded) {
        return Address.createFromRawAddress(js_xpx_catapult_library_1.address
            .addressToString(js_xpx_catapult_library_1.convert.hexToUint8(encoded)));
    }
    /**
     * Get address in plain format ex: SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3.
     * @returns {string}
     */
    plain() {
        return this.address;
    }
    /**
     * Get address in pretty format ex: SB3KUB-HATFCP-V7UZQL-WAQ2EU-R6SIHB-SBEOED-DDF3.
     * @returns {string}
     */
    pretty() {
        return this.address.match(/.{1,6}/g).join('-');
    }
    /**
     * Compares addresses for equality
     * @param address - Address
     * @returns {boolean}
     */
    equals(address) {
        return this.plain() === address.plain() && this.networkType === address.networkType;
    }
    /**
     * Create DTO object
     */
    toDTO() {
        return {
            address: this.address,
            networkType: this.networkType,
        };
    }
}
exports.Address = Address;
//# sourceMappingURL=Address.js.map