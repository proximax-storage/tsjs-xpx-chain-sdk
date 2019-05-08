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
const js_xpx_catapult_library_1 = require("js-xpx-catapult-library");
const Message_1 = require("./Message");
const MessageType_1 = require("./MessageType");
const PlainMessage_1 = require("./PlainMessage");
/**
 * Encrypted Message model
 */
class EncryptedMessage extends Message_1.Message {
    constructor(payload, recipientPublicAccount) {
        super(MessageType_1.MessageType.EncryptedMessage, payload);
        this.recipientPublicAccount = recipientPublicAccount;
    }
    /**
     *
     * @param message - Plain message to be encrypted
     * @param recipientPublicAccount - Recipient public account
     * @param privateKey - Sender private key
     */
    static create(message, recipientPublicAccount, privateKey) {
        return new EncryptedMessage(js_xpx_catapult_library_1.crypto.encode(privateKey, recipientPublicAccount.publicKey, message).toUpperCase(), recipientPublicAccount);
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
     */
    static decrypt(encryptMessage, privateKey, recipientPublicAccount) {
        return new PlainMessage_1.PlainMessage(this.decodeHex(js_xpx_catapult_library_1.crypto.decode(privateKey, recipientPublicAccount.publicKey, encryptMessage.payload)));
    }
}
exports.EncryptedMessage = EncryptedMessage;
//# sourceMappingURL=EncryptedMessage.js.map