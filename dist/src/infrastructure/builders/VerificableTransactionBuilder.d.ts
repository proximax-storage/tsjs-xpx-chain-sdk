import { VerifiableTransaction } from './VerifiableTransaction';
/**
 * @module transactions/VerifiableTransactionBuilder
 */
/**
 * @callback LambdaBuilder
 * @param {flatbuffers.Builder} builder
 * @return {void}
 */
export default class VerifiableTransactionBuilder {
    bytes: any;
    schema: any;
    /**
     * @param {LambdaBuilder} lambda Callback
     * @returns {VerifiableTransactionBuilder} Returns self instance
     */
    addTransaction(lambda: any): this;
    /**
     * @param {module:schema/Schema} schema Schema corresponding with flatbuffers Schema used on addTransaction
     * @returns {VerifiableTransactionBuilder} Returns self instance
     */
    addSchema(schema: any): this;
    /**
     * @returns {VerifiableTransaction} Returns VerifiableTransaction instance
     */
    build(): VerifiableTransaction;
}
