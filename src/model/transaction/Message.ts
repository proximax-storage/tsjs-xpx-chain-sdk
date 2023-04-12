/*
 * Copyright 2023 ProximaX
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

import {Convert as convert} from '../../core/format'

/**
 * An abstract message class that serves as the base class of all message types.
 */
export abstract class Message {
    /**
     * @internal
     * @param hex
     * @returns {string}
     */
    public static decodeHex(hex: string): string {
        let message = "";
        try {
            let uint8Array = convert.hexToUint8(hex);

            message = new TextDecoder().decode(uint8Array);
        } catch (e) {
            
        }

        return message;
    }

    /**
     * @internal
     * @param message
     * @returns {string}
     */
    public static encodeToHex(message: string): string {
        
        let payload = "";
        try {
            let uint8Array = new TextEncoder().encode(message);
            payload = convert.uint8ToHex(uint8Array);
        } catch (e) {
            
        }

        return payload;
    }

    /**
     * @internal
     * @param type
     * @param payload - Hexadecimal message payload
     * @param message
     */
    constructor(/**
                 * Message type
                 */
                public readonly type: number,
                /**
                 * Message payload
                 */
                public readonly payload: string, 
                /**
                 * Message payload
                 */
                public message: string = "") { 
    }

    /**
     * Returns the byte size of the message
     */
    public size(): number{
        return this.payload.length ? this.payload.length / 2 : 0;
    }

    /**
     * Create DTO object
     */
    toDTO() {
        return {
            type: this.type,
            payload: this.payload,
            message: this.message,
        };
    }
}
