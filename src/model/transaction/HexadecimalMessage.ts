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

import {Message} from './Message';
import {MessageType} from './MessageType';
import { Convert as convert } from '../../core/format';

/**
 * The hexadecimal message model defines a hexadecimal string. When sending it to the network we transform the payload to hex-string.
 */
export class HexadecimalMessage extends Message {
    /**
     * Create hexadecimal message object.
     * @returns HexadecimalMessage
     */
    public static create(hexMessage: string): HexadecimalMessage {
        if(!convert.isHexString(hexMessage)){
            throw new Error("message must be in hexadecimal string");
        }
        return new HexadecimalMessage(hexMessage);
    }

    /**
     * @internal
     */
    public static createFromPayload(payload: string): HexadecimalMessage {
        return new HexadecimalMessage(payload);
    }

    /**
     * @internal
     * @param payload
     */
    constructor(payload: string) {
        super(MessageType.HexadecimalMessage, payload);
    }

    public size(): number {
        return (this.payload || '').length / 2;
    }

}
