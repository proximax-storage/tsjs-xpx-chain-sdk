/*
 * Copyright 2023 ProximaX
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

import { DerivationScheme } from "../../core/crypto";
import { Convert } from "../../core/format";
import { NetworkType, TransactionTypeVersion } from "../model";

/**
 * Static class containing transaction version.
 *
 * Currently transaction version contain: 
 * network type (uint8)
 * derivation scheme (uint8)
 * empty byte (uint8) - blank
 * transaction type version (uint8)
 */
export class TransactionVersion {

    /**
     * @param {NetworkType} - Network type
     * @param {DerivationScheme} - Derivation scheme
     * @param {number} - Transaction type version
     */
    constructor(
        public readonly networkType: NetworkType,
        public signatureDScheme: DerivationScheme,
        public readonly txnTypeVersion: TransactionTypeVersion
    ){}

    public convertToDTO(){
        return (this.networkType << 24) + (this.signatureDScheme << 16) + this.txnTypeVersion;
    }

    public static createInit(networkType: NetworkType, txnTypeVersion: TransactionTypeVersion){
        return new TransactionVersion(networkType, DerivationScheme.Unset, txnTypeVersion);
    }

    public static createFromUint32(version: number){
        if(version > 0xFFFFFFFF){
            throw new Error("Invalid version number range, must be within uint32 number");
        }
        let hexString = version.toString(16);
        let filledHexString = hexString.padStart(8, "0");

        return new TransactionVersion(
            parseInt(filledHexString.substring(0, 2), 16),
            parseInt(filledHexString.substring(2, 4), 16),
            parseInt(filledHexString.substring(6), 16)
        )
    }

    public static createFromHex(hexString: string){
        if(!Convert.isHexString(hexString)){
            throw new Error("Invalid hex string");
        }

        if(hexString.length !== 8){
            throw new Error("Invalid hex string length");
        }

        return new TransactionVersion(
            parseInt(hexString.substring(0, 2), 16),
            parseInt(hexString.substring(2, 4), 16),
            parseInt(hexString.substring(6), 16)
        )
    }

    public static createFromPayloadHex(hexString: string){
        if(!Convert.isHexString(hexString)){
            throw new Error("Invalid hex string");
        }

        if(hexString.length !== 8){
            throw new Error("Invalid hex string length");
        }

        let hexStringReversed = Convert.hexReverse(hexString);

        return new TransactionVersion(
            parseInt(hexStringReversed.substring(0, 2), 16),
            parseInt(hexStringReversed.substring(2, 4), 16),
            parseInt(hexStringReversed.substring(6), 16)
        )
    }
}
