import { SignSchema } from '../../core/crypto';
/**
 * VerifiableTransaction
 * @module transactions/VerifiableTransaction
 * @version 1.0.0
 */
export declare class VerifiableTransaction {
    bytes: any;
    schema: any;
    /**
     * @constructor
     * @param {Uint8Array} bytes Uint8Array after flatbuffers.build.asUint8Array()
     * @param {module:schema/Schema} schema Schema definition corresponding to flatbuffer Schema
     */
    constructor(bytes: any, schema: any);
    /**
     * @param {string} transactionPayload HexString Payload
     * @param {string} generationHash Network generation hash byte
     * @returns {*|string} Returns Transaction Payload hash
     */
    static createTransactionHash(transactionPayload: any, generationHash: any): string;
    /**
     * @param {KeyPair } keyPair KeyPair instance
     * @param {string} generationHash Network generation hash hex
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {module:model/TransactionPayload} - Signed Transaction Payload
     */
    signTransaction(keyPair: any, generationHash: any, signSchema?: SignSchema): {
        payload: string;
        hash: string;
    };
    serialize(): any;
    /**
     * @returns {string} - Serialized Transaction Payload
     */
    serializeUnsignedTransaction(): string;
    /**
     * @param {KeyPair} keyPair KeyPair instance
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {module:model/TransactionPayload} Returns TransactionPayload instance
     */
    signCosignatoriesTransaction(keyPair: any, signSchema?: SignSchema): {
        parentHash: string;
        signature: string;
        signer: any;
    };
    /**
     * Converts the transaction into AggregateTransaction compatible
     * @param {string} [_signer] Signer public key
     * @returns {Array.<*>} AggregateTransaction bytes
     */
    toAggregateTransaction(_signer: any): number[];
}
