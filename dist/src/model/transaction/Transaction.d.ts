import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { TransactionInfo } from './TransactionInfo';
/**
 * An abstract transaction class that serves as the base class of all NEM transactions.
 */
export declare abstract class Transaction {
    readonly type: number;
    /**
     * The network type.
     */
    readonly networkType: NetworkType;
    /**
     * The transaction version number.
     */
    readonly version: number;
    /**
     * The deadline to include the transaction.
     */
    readonly deadline: Deadline;
    /**
     * A sender of a transaction must specify during the transaction definition a max_fee,
     * meaning the maximum fee the account allows to spend for this transaction.
     */
    readonly maxFee: UInt64;
    /**
     * The transaction signature (missing if part of an aggregate transaction).
     */
    readonly signature?: string | undefined;
    /**
     * The account of the transaction creator.
     */
    readonly signer?: PublicAccount | undefined;
    /**
     * Transactions meta data object contains additional information about the transaction.
     */
    readonly transactionInfo?: TransactionInfo | AggregateTransactionInfo | undefined;
    /**
     * @constructor
     * @param type
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(/**
                 * The transaction type.
                 */ type: number, 
    /**
     * The network type.
     */
    networkType: NetworkType, 
    /**
     * The transaction version number.
     */
    version: number, 
    /**
     * The deadline to include the transaction.
     */
    deadline: Deadline, 
    /**
     * A sender of a transaction must specify during the transaction definition a max_fee,
     * meaning the maximum fee the account allows to spend for this transaction.
     */
    maxFee: UInt64, 
    /**
     * The transaction signature (missing if part of an aggregate transaction).
     */
    signature?: string | undefined, 
    /**
     * The account of the transaction creator.
     */
    signer?: PublicAccount | undefined, 
    /**
     * Transactions meta data object contains additional information about the transaction.
     */
    transactionInfo?: TransactionInfo | AggregateTransactionInfo | undefined);
    /**
     * Convert an aggregate transaction to an inner transaction including transaction signer.
     * @param signer - Transaction signer.
     * @returns InnerTransaction
     */
    toAggregate(signer: PublicAccount): InnerTransaction;
    /**
     * Transaction pending to be included in a block
     * @returns {boolean}
     */
    isUnconfirmed(): boolean;
    /**
     * Transaction included in a block
     * @returns {boolean}
     */
    isConfirmed(): boolean;
    /**
     * Returns if a transaction has missing signatures.
     * @returns {boolean}
     */
    hasMissingSignatures(): boolean;
    /**
     * Transaction is not known by the network
     * @return {boolean}
     */
    isUnannounced(): boolean;
    /**
     * @description reapply a given value to the transaction in an immutable way
     * @param {Deadline} deadline
     * @returns {Transaction}
     * @memberof Transaction
     */
    reapplyGiven(deadline?: Deadline): Transaction;
    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    readonly size: number;
    /**
     * @description Serialize a transaction object
     * @returns {string}
     * @memberof Transaction
     */
    serialize(): string;
    /**
     * @description Create JSON object
     * @returns {Object}
     * @memberof Transaction
     */
    toJSON(): {
        transaction: any;
    };
}
