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

import {NetworkType} from '../blockchain/NetworkType';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { Convert as convert } from '../../core/format/Convert';

/**
 * SignedTransaction object is used to transfer the transaction data and the signature to the server
 * in order to initiate and broadcast a transaction.
 */
export class SignedTransaction {
    /**
     * @internal
     * @param payload
     * @param hash
     * @param signer
     * @param type
     * @param networkType
     */
    constructor(/**
                 * Transaction serialized data
                 */
                public readonly payload: string,
                /**
                 * Transaction hash
                 */
                public readonly hash: string,
                /**
                 * Transaction signer
                 */
                public readonly signer: string,
                /**
                 * Transaction type
                 */
                public readonly type: number,
                /**
                 * Signer network type
                 */
                public readonly networkType: NetworkType) {
        if (hash.length !== 64) {
            throw new Error('hash must be 64 characters long');
        }
    }

    /**
     * @param transactionPayload
     * @param generationHash
     */
    static createFromPayload(transactionPayload: string, generationHash: string): SignedTransaction{
        const transactionHash = VerifiableTransaction.createTransactionHash(transactionPayload, Array.from(convert.hexToUint8(generationHash)));

        const sizeLength        = 8;
        const signatureLength   = 128;
        const publicKeyLength   = 64;
        const versionLength     = 8;
        const typeLength        = 4;
        const signature = transactionPayload.substring(8, 136);
        const signer = transactionPayload.substring(136, 200);
        const networkType = extractNetwork(transactionPayload.substring(200, 208));
        const type = parseInt(convert.uint8ToHex(convert.hexToUint8(transactionPayload.substring(208, 212)).reverse()), 16);

        if(signature === "0".repeat(128) || signer === "0".repeat(64) ){
            throw new Error('No signature found in payload');
        }

        return new SignedTransaction(transactionPayload, transactionHash, signer, type, networkType);
    }

    /**
     * Create DTO object
     */
    toDTO() {
        return {
            payload: this.payload,
            hash: this.hash,
            signer: this.signer,
            type: this.type,
            networkType: this.networkType,
        };
    }
}


/**
 * @internal
 * @param versionHex - Transaction version in hex
 * @returns {NetworkType}
 */
 const extractNetwork = (versionHex: string): NetworkType => {
    const networkType = convert.hexToUint8(versionHex)[3];
    if (networkType === NetworkType.MAIN_NET) {
        return NetworkType.MAIN_NET;
    } else if (networkType === NetworkType.TEST_NET) {
        return NetworkType.TEST_NET;
    } else if (networkType === NetworkType.MIJIN) {
        return NetworkType.MIJIN;
    } else if (networkType === NetworkType.MIJIN_TEST) {
        return NetworkType.MIJIN_TEST;
    } else if (networkType === NetworkType.PRIVATE) {
        return NetworkType.PRIVATE;
    } else if (networkType === NetworkType.PRIVATE_TEST) {
        return (NetworkType.PRIVATE_TEST)
    }
    throw new Error('Unimplemented network type');
};