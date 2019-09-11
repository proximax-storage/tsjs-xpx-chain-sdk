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
const format_1 = require("../format");
const SignSchema_1 = require("./SignSchema");
const Utility = require("./Utilities");
class KeyPair {
}
/**
 * Creates a key pair from a private key string.
 * @param {string} privateKeyString A hex encoded private key string.
 * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
 * @returns {module:crypto/keyPair~KeyPair} The key pair.
 */
KeyPair.createKeyPairFromPrivateKeyString = (privateKeyString, signSchema = SignSchema_1.SignSchema.SHA3) => {
    const privateKey = format_1.Convert.hexToUint8(privateKeyString);
    // KECCAK_REVERSED_KEY uses reversed private key.
    const secretKey = signSchema === SignSchema_1.SignSchema.SHA3 ? privateKey : format_1.Convert.hexToUint8Reverse(privateKeyString);
    if (Utility.Key_Size !== privateKey.length) {
        throw Error(`private key has unexpected size: ${privateKey.length}`);
    }
    const publicKey = Utility.catapult_crypto.extractPublicKey(secretKey, Utility.catapult_hash.func, signSchema);
    return {
        privateKey,
        publicKey,
    };
};
/**
 * Signs a data buffer with a key pair.
 * @param {module:crypto/keyPair~KeyPair} keyPair The key pair to use for signing.
 * @param {Uint8Array} data The data to sign.
 * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
 * @returns {Uint8Array} The signature.
 */
KeyPair.sign = (keyPair, data, signSchema = SignSchema_1.SignSchema.SHA3) => {
    let secretKey = keyPair.privateKey;
    // KECCAK_REVERSED_KEY uses reversed private key.
    if (signSchema === SignSchema_1.SignSchema.KECCAK_REVERSED_KEY) {
        secretKey = format_1.Convert.hexToUint8Reverse(format_1.Convert.uint8ToHex(secretKey));
    }
    return Utility.catapult_crypto.sign(data, keyPair.publicKey, secretKey, Utility.catapult_hash.createHasher(64, signSchema));
};
/**
 * Verifies a signature.
 * @param {module:crypto/keyPair~PublicKey} publicKey The public key to use for verification.
 * @param {Uint8Array} data The data to verify.
 * @param {Uint8Array} signature The signature to verify.
 * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
 * @returns {boolean} true if the signature is verifiable, false otherwise.
 */
KeyPair.verify = (publicKey, data, signature, signSchema = SignSchema_1.SignSchema.SHA3) => {
    return Utility.catapult_crypto.verify(publicKey, data, signature, Utility.catapult_hash.createHasher(64, signSchema));
};
/**
 * Creates a shared key given a key pair and an arbitrary public key.
 * The shared key can be used for encrypted message passing between the two.
 * @param {module:crypto/keyPair~KeyPair} keyPair The key pair for which to create the shared key.
 * @param {Uint8Array} publicKey The public key for which to create the shared key.
 * @param {Uint8Array} salt A salt that should be applied to the shared key.
 * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
 * @returns {Uint8Array} The shared key.
 */
KeyPair.deriveSharedKey = (keyPair, publicKey, salt, signSchema = SignSchema_1.SignSchema.SHA3) => {
    if (Utility.Key_Size !== salt.length) {
        throw Error(`salt has unexpected size: ${salt.length}`);
    }
    if (Utility.Key_Size !== publicKey.length) {
        throw Error(`public key has unexpected size: ${salt.length}`);
    }
    let secretKey = keyPair.privateKey;
    // KECCAK_REVERSED_KEY uses reversed private key.
    if (signSchema === SignSchema_1.SignSchema.KECCAK_REVERSED_KEY) {
        secretKey = format_1.Convert.hexToUint8Reverse(format_1.Convert.uint8ToHex(secretKey));
    }
    return Utility.catapult_crypto.deriveSharedKey(salt, secretKey, publicKey, Utility.catapult_hash.func, signSchema);
};
exports.KeyPair = KeyPair;
//# sourceMappingURL=KeyPair.js.map