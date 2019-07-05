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
const crypto_1 = require("../../core/crypto");
const format_1 = require("../../core/format");
const EncryptedMessage_1 = require("../transaction/EncryptedMessage");
const Address_1 = require("./Address");
const PublicAccount_1 = require("./PublicAccount");
/**
 * The account structure describes an account private key, public key, address and allows signing transactions.
 */
class Account {
    /**
     * @internal
     * @param address
     * @param keyPair
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     */
    constructor(
    /**
     * The account address.
     */
    address, 
    /**
     * The account keyPair, public and private key.
     */
    keyPair, 
    /**
     * The Sign Schema (KECCAK_REVERSED_KEY / SHA3).
     */
    signSchema = crypto_1.SignSchema.SHA3) {
        this.address = address;
        this.keyPair = keyPair;
        this.signSchema = signSchema;
    }
    /**
     * Create an Account from a given private key
     * @param privateKey - Private key from an account
     * @param networkType - Network type
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {Account}
     */
    static createFromPrivateKey(privateKey, networkType, signSchema = crypto_1.SignSchema.SHA3) {
        const keyPair = crypto_1.KeyPair.createKeyPairFromPrivateKeyString(privateKey, signSchema);
        const address = format_1.RawAddress.addressToString(format_1.RawAddress.publicKeyToAddress(keyPair.publicKey, networkType, signSchema));
        return new Account(Address_1.Address.createFromRawAddress(address), keyPair, signSchema);
    }
    /**
     * Generate a new account
     * @param networkType - Network type
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     */
    static generateNewAccount(networkType, signSchema = crypto_1.SignSchema.SHA3) {
        // Create random bytes
        const randomBytesArray = crypto_1.Crypto.randomBytes(32);
        // Hash random bytes with entropy seed
        // Finalize and keep only 32 bytes
        const hashKey = format_1.Convert.uint8ToHex(randomBytesArray);
        // Create KeyPair from hash key
        const keyPair = crypto_1.KeyPair.createKeyPairFromPrivateKeyString(hashKey, signSchema);
        const address = Address_1.Address.createFromPublicKey(format_1.Convert.uint8ToHex(keyPair.publicKey), networkType, signSchema);
        return new Account(address, keyPair, signSchema);
    }
    /**
     * Create a new encrypted Message
     * @param message - Plain message to be encrypted
     * @param recipientPublicAccount - Recipient public account
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {EncryptedMessage}
     */
    encryptMessage(message, recipientPublicAccount, signSchema = crypto_1.SignSchema.SHA3) {
        return EncryptedMessage_1.EncryptedMessage.create(message, recipientPublicAccount, this.privateKey, signSchema);
    }
    /**
     * Decrypts an encrypted message
     * @param encryptedMessage - Encrypted message
     * @param publicAccount - The public account originally encrypted the message
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {PlainMessage}
     */
    decryptMessage(encryptedMessage, publicAccount, signSchema = crypto_1.SignSchema.SHA3) {
        return EncryptedMessage_1.EncryptedMessage.decrypt(encryptedMessage, this.privateKey, publicAccount, signSchema);
    }
    /**
     * Account public key.
     * @return {string}
     */
    get publicKey() {
        return format_1.Convert.uint8ToHex(this.keyPair.publicKey);
    }
    /**
     * Public account.
     * @return {PublicAccount}
     */
    get publicAccount() {
        return PublicAccount_1.PublicAccount.createFromPublicKey(this.publicKey, this.address.networkType, this.signSchema);
    }
    /**
     * Account private key.
     * @return {string}
     */
    get privateKey() {
        return format_1.Convert.uint8ToHex(this.keyPair.privateKey);
    }
    /**
     * Sign a transaction
     * @param transaction - The transaction to be signed.
     * @param generationHash - Network generation hash hex
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {SignedTransaction}
     */
    sign(transaction, generationHash, signSchema = crypto_1.SignSchema.SHA3) {
        return transaction.signWith(this, generationHash, signSchema);
    }
    /**
     * Sign transaction with cosignatories creating a new SignedTransaction
     * @param transaction - The aggregate transaction to be signed.
     * @param cosignatories - The array of accounts that will cosign the transaction
     * @param generationHash - Network generation hash hex
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {SignedTransaction}
     */
    signTransactionWithCosignatories(transaction, cosignatories, generationHash, signSchema = crypto_1.SignSchema.SHA3) {
        return transaction.signTransactionWithCosignatories(this, cosignatories, generationHash, signSchema);
    }
    /**
     * Sign aggregate signature transaction
     * @param cosignatureTransaction - The aggregate signature transaction.
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {CosignatureSignedTransaction}
     */
    signCosignatureTransaction(cosignatureTransaction, signSchema = crypto_1.SignSchema.SHA3) {
        return cosignatureTransaction.signWith(this, signSchema);
    }
    /**
     * Sign raw data
     * @param data - Data to be signed
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {string} - Signed data result
     */
    signData(data, signSchema = crypto_1.SignSchema.SHA3) {
        return format_1.Convert.uint8ToHex(crypto_1.KeyPair.sign(this.keyPair, format_1.Convert.hexToUint8(format_1.Convert.utf8ToHex(data)), signSchema));
    }
}
exports.Account = Account;
//# sourceMappingURL=Account.js.map