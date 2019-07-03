import { AggregateTransaction } from './AggregateTransaction';
/**
 * Cosignature transaction is used to sign an aggregate transactions with missing cosignatures.
 */
export declare class CosignatureTransaction {
    readonly transactionToCosign: AggregateTransaction;
    /**
     * @param transactionToCosign
     */
    constructor(/**
                 * Transaction to cosign.
                 */ transactionToCosign: AggregateTransaction);
    /**
     * Create a cosignature transaction
     * @param transactionToCosign - Transaction to cosign.
     * @returns {CosignatureTransaction}
     */
    static create(transactionToCosign: AggregateTransaction): CosignatureTransaction;
}
