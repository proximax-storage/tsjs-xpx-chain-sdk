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

import {convert, crypto} from 'proximax-nem2-library';
import {Message} from './Message';

export class SecureMessage extends Message {

    public static create(message: string, publicKey: string, privateKey: string): SecureMessage {
        const encodedMessage = crypto.nemencrypt(privateKey, publicKey, convert.hexToUint8(convert.utf8ToHex(message)));
        return new SecureMessage(convert.uint8ToHex(encodedMessage));
    }

    /**
     *
     */
    public static createFromDTO(payload: string): SecureMessage {
        return new SecureMessage(payload);
    }

    /**
     * @internal
     * @param payload
     */
    constructor(payload: string) {
        super(1, payload);
    }

    public decrypt(publicKey: string, privateKey: string): string {
        const decodedMessage = crypto.nemdecrypt(privateKey, publicKey, convert.hexToUint8(this.payload));
        return Message.decodeHex(convert.uint8ToHex(decodedMessage));
    }
}
