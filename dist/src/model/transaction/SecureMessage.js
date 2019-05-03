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
const Message_1 = require("./Message");
class SecureMessage extends Message_1.Message {
    static create(message, publicKey, privateKey) {
        const encodedMessage = js_xpx_catapult_library_1.crypto.nemencrypt(privateKey, publicKey, js_xpx_catapult_library_1.convert.hexToUint8(js_xpx_catapult_library_1.convert.utf8ToHex(message)));
        return new SecureMessage(js_xpx_catapult_library_1.convert.uint8ToHex(encodedMessage), message);
    }
    /**
     *
     */
    static createFromDTO(payload) {
        return new SecureMessage(payload);
    }
    /**
     * @internal
     * @param hexEncodedPayload
     * @param payload
     */
    constructor(hexEncodedPayload, payload) {
        super(1, hexEncodedPayload, payload);
    }
    decrypt(publicKey, privateKey) {
        const decodedMessage = js_xpx_catapult_library_1.crypto.nemdecrypt(privateKey, publicKey, js_xpx_catapult_library_1.convert.hexToUint8(this.hexEncodedPayload));
        return Message_1.Message.decodeHex(js_xpx_catapult_library_1.convert.uint8ToHex(decodedMessage));
    }
}
exports.SecureMessage = SecureMessage;
//# sourceMappingURL=SecureMessage.js.map