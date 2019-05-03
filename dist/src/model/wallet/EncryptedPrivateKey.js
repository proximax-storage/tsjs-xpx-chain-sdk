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
/**
 * EncryptedPrivateKey model
 */
class EncryptedPrivateKey {
    /**
     * @internal
     * @param encryptedKey
     * @param iv
     */
    constructor(
    /**
     * Encrypted private key data
     */
    encryptedKey, 
    /**
     * Initialization vector used in the decrypt process
     */
    iv) {
        this.encryptedKey = encryptedKey;
        this.iv = iv;
    }
    /**
     * @internal
     * Decrypt an encrypted private key
     * @param password
     */
    decrypt(password) {
        const common = {
            password: password.value,
            privateKey: '',
        };
        const wallet = {
            encrypted: this.encryptedKey,
            iv: this.iv,
        };
        js_xpx_catapult_library_1.crypto.passwordToPrivatekey(common, wallet, 'pass:bip32');
        return common.privateKey;
    }
}
exports.EncryptedPrivateKey = EncryptedPrivateKey;
//# sourceMappingURL=EncryptedPrivateKey.js.map