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
     * @returns {module:model/TransactionPayload} - Signed Transaction Payload
     */
    signTransaction(keyPair: any, generationHash: any): {
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
     * @returns {module:model/TransactionPayload} Returns TransactionPayload instance
     */
    signCosignatoriesTransaction(keyPair: any): {
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
