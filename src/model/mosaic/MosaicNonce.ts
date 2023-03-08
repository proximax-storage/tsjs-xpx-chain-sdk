/*
 * Copyright 2023 ProximaX
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
import {Crypto} from '../../core/crypto';
import { Convert as convert} from '../../core/format';
/**
 * The mosaic nonce structure
 *
 * @since 1.0
 */
export class MosaicNonce {

    /**
     * Mosaic nonce
     */
    public readonly nonce: Uint8Array;

    /**
     * Create a random MosaicNonce
     *
     * @return  {MosaicNonce}
     */
    public static createRandom(): MosaicNonce {
        const bytes = Crypto.randomBytes(4);
        const nonce = new Uint8Array(bytes);
        return new MosaicNonce(nonce);
    }

    /**
     * Create a MosaicNonce from hexadecimal notation.
     *
     * @param   hex     {string}
     * @return  {MosaicNonce}
     */
    public static createFromHex(hex: string): MosaicNonce {
        const uint8 = convert.hexToUint8Reverse(hex);

        if (uint8.length !== 4) {
            throw new Error('Expected 4 bytes for Nonce and got ' + uint8.length + ' instead.');
        }

        return new MosaicNonce(uint8);
    }

    /**
     * Create a MosaicNonce from a number.
     *
     * @param   nonce     {number}
     * @return  {MosaicNonce}
     */
     public static createFromNumber(nonce: number): MosaicNonce {

        if(nonce > 0xFFFFFFFF){
            throw new Error('Number exceed more than 4 bytes of number representation.');
        }

        let hexNumber = nonce.toString(16);

        if(hexNumber.length % 2 === 1){
            hexNumber = "0" + hexNumber;
        }

        let missingPaddingNum = 8 - hexNumber.length; 

        if(missingPaddingNum){
            hexNumber = "0".repeat(missingPaddingNum) + hexNumber;
        }

        return MosaicNonce.createFromHex(hexNumber);
    }

    /**
     * Create MosaicNonce from Uint8Array
     *
     * @param id
     */
    constructor(nonce: Uint8Array) {
        if (nonce.length !== 4) {
            throw Error('Invalid byte size for nonce, should be 4 bytes but received ' + nonce.length);
        }

        this.nonce = nonce;
    }

    toNumber(){
        const hex = convert.uint8ToHex(this.nonce);
        return parseInt(convert.hexReverse(hex), 16);
    }

    /**
     * @internal
     * @returns {[number,number,number,number]}
     */
    public toDTO(): Uint8Array {
        return this.nonce;
    }
}
