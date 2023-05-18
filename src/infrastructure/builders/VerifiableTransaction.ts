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
import { KeyPair, DerivationScheme } from '../../core/crypto';
import { SHA3Hasher as sha3Hasher } from '../../core/crypto/SHA3Hasher';
import { Convert as convert } from '../../core/format';

/**
 * VerifiableTransaction
 * @module transactions/VerifiableTransaction
 * @version 1.0.0
 */
export class VerifiableTransaction {
    bytes: any;
    schema: any;
    /**
     * @constructor
     * @param {Uint8Array} bytes Uint8Array after flatbuffers.build.asUint8Array()
     * @param {module:schema/Schema} schema Schema definition corresponding to flatbuffer Schema
     */
    constructor(bytes, schema) {
        this.bytes = bytes;
        this.schema = schema;
    }

    /**
     * @param {string} transactionPayload HexString Payload
     * @param {string} generationHash Network generation hash byte
     * @returns {*|string} Returns Transaction Payload hash
     */
    static createTransactionHash(transactionPayload, generationHashBytes) {
        const byteBuffer = Array.from(convert.hexToUint8(transactionPayload));
        const signingBytes = byteBuffer
            .slice(4, 36)
            .concat(byteBuffer
                .slice(4 + 64, 4 + 64 + 32))
            .concat(generationHashBytes)
            .concat(byteBuffer
                .splice(4 + 64 + 32, byteBuffer.length));

        const hash = new Uint8Array(32);

        sha3Hasher.func(hash, new Uint8Array(signingBytes), 32);

        return convert.uint8ArrayToHex(hash);
    }

    /**
     * @param {KeyPair } keyPair KeyPair instance
     * @param {string} generationHash Network generation hash hex
     * @param {DerivationScheme} dScheme The derivation scheme
     * @returns {module:model/TransactionPayload} - Signed Transaction Payload
     */
    signTransaction(keyPair, generationHash, dScheme: DerivationScheme = DerivationScheme.Ed25519Sha3) {
        const generationHashBytes = Array.from(convert.hexToUint8(generationHash));
        const byteBuffer = this.serialize();
        const signingBytes = new Uint8Array(generationHashBytes.concat(byteBuffer.slice(4 + 64 + 32)));
        const keyPairEncoded = KeyPair.createKeyPairFromPrivateKeyString(keyPair.privateKey, dScheme);
        const signature = Array.from(KeyPair.sign(keyPair, new Uint8Array(signingBytes), dScheme));
        const signedTransactionBuffer = byteBuffer
            .splice(0, 4)
            .concat(signature)
            .concat(Array.from(keyPairEncoded.publicKey))
            .concat(byteBuffer
                .splice(64 + 32, byteBuffer.length));
        const payload = convert.uint8ArrayToHex(signedTransactionBuffer);
        return {
            payload,
            hash: VerifiableTransaction.createTransactionHash(payload, generationHashBytes),
        };
    }

    serialize() {
        return this.schema.serialize(Array.from(this.bytes));
    }

    /**
     * @returns {string} - Serialized Transaction Payload
     */
    serializeUnsignedTransaction() {
        return convert.uint8ArrayToHex(this.serialize());
    }

    /**
     * @param {KeyPair} keyPair KeyPair instance
     * @param {DerivationScheme} dScheme The derivation scheme
     * @returns {module:model/TransactionPayload} Returns TransactionPayload instance
     */
    signCosignatoriesTransaction(keyPair, dScheme: DerivationScheme = DerivationScheme.Ed25519Sha3) {
        const signature = KeyPair.sign(keyPair, new Uint8Array(this.bytes), dScheme);
        return {
            parentHash: convert.uint8ArrayToHex(this.bytes),
            signature: convert.uint8ArrayToHex(signature),
            scheme: convert.uint8ToHex(dScheme),
            signer: keyPair.publicKey,
        };
    }

    /**
     * @param {KeyPair} keyPair KeyPair instance
     * @param {DerivationScheme} dScheme The derivation scheme
     * @returns {module:model/TransactionPayload} Returns TransactionPayload instance
     */
    signCosignatoriesTransactionV1(keyPair) {
        const signature = KeyPair.sign(keyPair, new Uint8Array(this.bytes), DerivationScheme.Ed25519Sha3);
        return {
            parentHash: convert.uint8ArrayToHex(this.bytes),
            signature: convert.uint8ArrayToHex(signature),
            signer: keyPair.publicKey,
        };
    }

    /**
     * Converts the transaction into AggregateTransaction compatible
     * @param {string} [_signer] Signer public key
     * @returns {Array.<*>} AggregateTransaction bytes
     */
    toAggregateTransaction(_signer) {
        const signer = convert.hexToUint8(_signer);
        let resultBytes = this.schema.serialize(Array.from(this.bytes));
        resultBytes.splice(0, 4 + 64 + 32);
        resultBytes = Array.from(signer).concat(resultBytes);
        resultBytes.splice(32 + 4 + 2, 16);
        return Array.from((new Uint8Array([
            (resultBytes.length + 4 & 0x000000ff),
            (resultBytes.length + 4 & 0x0000ff00) >> 8,
            (resultBytes.length + 4 & 0x00ff0000) >> 16,
            (resultBytes.length + 4 & 0xff000000) >> 24,
        ]))).concat(resultBytes);
    }
}
