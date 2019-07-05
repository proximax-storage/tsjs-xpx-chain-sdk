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
const js_joda_1 = require("js-joda");
const crypto_1 = require("../../core/crypto");
const format_1 = require("../../core/format");
const Account_1 = require("../account/Account");
const Address_1 = require("../account/Address");
const EncryptedPrivateKey_1 = require("./EncryptedPrivateKey");
const Wallet_1 = require("./Wallet");
/**
 * Simple wallet model generates a private key from a PRNG
 */
class SimpleWallet extends Wallet_1.Wallet {
    /**
     * @internal
     * @param name
     * @param network
     * @param address
     * @param creationDate
     * @param encryptedPrivateKey
     */
    constructor(name, network, address, creationDate, 
    /**
     * The encrypted private key and information to decrypt it
     */
    encryptedPrivateKey) {
        super(name, network, address, creationDate, 'simple_v1');
        this.encryptedPrivateKey = encryptedPrivateKey;
    }
    /**
     * Create a Simple wallet
     * @param name - Wallet name
     * @param password - Password to encrypt wallet
     * @param network - Network id
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {SimpleWallet}
     */
    static create(name, password, network, signSchema = crypto_1.SignSchema.SHA3) {
        // Create random bytes
        const randomBytesArray = crypto_1.Crypto.randomBytes(32);
        // Hash random bytes with entropy seed
        // Finalize and keep only 32 bytes
        const hashKey = format_1.Convert.uint8ToHex(randomBytesArray); // TODO: derive private key correctly
        // Create KeyPair from hash key
        const keyPair = crypto_1.KeyPair.createKeyPairFromPrivateKeyString(hashKey, signSchema);
        // Create address from public key
        const address = Address_1.Address.createFromPublicKey(format_1.Convert.uint8ToHex(keyPair.publicKey), network);
        // Encrypt private key using password
        const encrypted = crypto_1.Crypto.encodePrivateKey(hashKey, password.value);
        const encryptedPrivateKey = new EncryptedPrivateKey_1.EncryptedPrivateKey(encrypted.ciphertext, encrypted.iv);
        return new SimpleWallet(name, network, address, js_joda_1.LocalDateTime.now(), encryptedPrivateKey);
    }
    /**
     * Create a SimpleWallet from private key
     * @param name - Wallet name
     * @param password - Password to encrypt wallet
     * @param privateKey - Wallet private key
     * @param network - Network id
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {SimpleWallet}
     */
    static createFromPrivateKey(name, password, privateKey, network, signSchema = crypto_1.SignSchema.SHA3) {
        // Create KeyPair from hash key
        const keyPair = crypto_1.KeyPair.createKeyPairFromPrivateKeyString(privateKey, signSchema);
        // Create address from public key
        const address = Address_1.Address.createFromPublicKey(format_1.Convert.uint8ToHex(keyPair.publicKey), network, signSchema);
        // Encrypt private key using password
        const encrypted = crypto_1.Crypto.encodePrivateKey(privateKey, password.value);
        const encryptedPrivateKey = new EncryptedPrivateKey_1.EncryptedPrivateKey(encrypted.ciphertext, encrypted.iv);
        return new SimpleWallet(name, network, address, js_joda_1.LocalDateTime.now(), encryptedPrivateKey);
    }
    /**
     * Open a wallet and generate an Account
     * @param password - Password to decrypt private key
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {Account}
     */
    open(password, signSchema = crypto_1.SignSchema.SHA3) {
        return Account_1.Account.createFromPrivateKey(this.encryptedPrivateKey.decrypt(password), this.network, signSchema);
    }
}
exports.SimpleWallet = SimpleWallet;
//# sourceMappingURL=SimpleWallet.js.map