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

import { crypto } from '@thomas.tran/nem2-library';
import { Message } from './Message';
import { PlainMessage } from './PlainMessage';

export class SecureMessage extends Message {

    public recipientPublicKey?: string;

    public static create(message: string, recipientPublicKey: string, privateKey: string): SecureMessage {
        const encodedMessage = crypto.encode(privateKey, recipientPublicKey, message);
        return new SecureMessage(encodedMessage, recipientPublicKey);
    }

    public static decrypt(encodedMessage: string, recipientPublicKey: string, privateKey: string): PlainMessage {
        const decodedMessage = crypto.decode(privateKey, recipientPublicKey, encodedMessage);
        return new PlainMessage(PlainMessage.decodeHex(decodedMessage));
    }

    /**
     * @internal
     */
    public static createFromDTO(payload: string): SecureMessage {
        return new SecureMessage(payload);
    }

    /**
     * @internal
     * @param payload
     */
    constructor(payload: string, recipientPublicKey?: string) {
        super(2, payload);
        this.recipientPublicKey = recipientPublicKey;
    }
}
