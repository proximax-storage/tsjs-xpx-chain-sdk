<<<<<<< HEAD
import { SignSchema } from '../../core/crypto';
=======
>>>>>>> jwt
import { Account } from '../account/Account';
import { AggregateTransaction } from './AggregateTransaction';
import { CosignatureSignedTransaction } from './CosignatureSignedTransaction';
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
    /**
     * Co-sign transaction with transaction payload (off chain)
     * Creating a new CosignatureSignedTransaction
     * @param account - The signing account
     * @param payload - off transaction payload (aggregated transaction is unannounced)
<<<<<<< HEAD
     * @param generationHash - Network generation hash
     * @returns {CosignatureSignedTransaction}
     */
    static signTransactionPayload(account: Account, payload: string, generationHash: string, signSchema?: SignSchema): CosignatureSignedTransaction;
    /**
     * @internal
     * Serialize and sign transaction creating a new SignedTransaction
     * @param account
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {CosignatureSignedTransaction}
     */
    signWith(account: Account, signSchema?)
=======
     * @param gernationHash - Network generation hash
     * @returns {CosignatureSignedTransaction}
     */
    static signTransactionPayload(account: Account, payload: string, gernationHash: string): CosignatureSignedTransaction;
>>>>>>> jwt
}
