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
const utf8_1 = require("utf8");
/**
 * An abstract message class that serves as the base class of all message types.
 */
class Message {
    /**
     * @internal
     * @param type
     * @param payload
     */
    constructor(/**
                 * Message type
                 */ type, 
    /**
     * Message payload
     */
    payload) {
        this.type = type;
        this.payload = payload;
    }
    /**
     * @internal
     * @param hex
     * @returns {string}
     */
    static decodeHex(hex) {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        try {
            return utf8_1.decode(str);
        }
        catch (e) {
            return str;
        }
    }
    /**
     * Create DTO object
     */
    toDTO() {
        return {
            type: this.type,
            payload: this.payload,
        };
    }
}
exports.Message = Message;
//# sourceMappingURL=Message.js.map