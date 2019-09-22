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
const crypto_1 = require("../../core/crypto");
const Message_1 = require("./Message");
const MessageType_1 = require("./MessageType");
const PlainMessage_1 = require("./PlainMessage");
/**
 * Encrypted Message model
 */
class EncryptedMessage extends Message_1.Message {
    constructor(payload) {
        super(MessageType_1.MessageType.EncryptedMessage, payload);
    }
    size() {
        return (this.payload || '').length / 2;
    }
    /**
     *
     * @param message - Plain message to be encrypted
     * @param recipientPublicAccount - Recipient public account
     * @param privateKey - Sender private key
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {EncryptedMessage}
     */
    static create(message, recipientPublicAccount, privateKey, signSchema = crypto_1.SignSchema.SHA3) {
        return new EncryptedMessage(crypto_1.Crypto.encode(privateKey, recipientPublicAccount.publicKey, message, signSchema).toUpperCase());
    }
    /**
     *
     * @param payload
     */
    static createFromPayload(payload) {
        return new EncryptedMessage(payload);
    }
    /**
     *
     * @param encryptMessage - Encrypted message to be decrypted
     * @param privateKey - Recipient private key
     * @param recipientPublicAccount - Sender public account
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {PlainMessage}
     */
    static decrypt(encryptMessage, privateKey, recipientPublicAccount, signSchema = crypto_1.SignSchema.SHA3) {
        return new PlainMessage_1.PlainMessage(crypto_1.Crypto.decode(privateKey, recipientPublicAccount.publicKey, encryptMessage.payload, signSchema));
    }
}
exports.EncryptedMessage = EncryptedMessage;
//# sourceMappingURL=EncryptedMessage.js.map