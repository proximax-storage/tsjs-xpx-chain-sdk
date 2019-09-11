import { UInt64 } from '../UInt64';
/**
 * Transaction information model included in all transactions
 */
export declare class TransactionInfo {
    /**
     * The block height in which the transaction was included.
     */
    readonly height: UInt64;
    /**
     * The index representing either transaction index/position within block or within an aggregate transaction.
     */
    readonly index: number;
    /**
     * The transaction db id.
     */
    readonly id: string;
    /**
     * The transaction hash.
     */
    readonly hash?: string | undefined;
    /**
     * The transaction merkle hash.
     */
    readonly merkleComponentHash?: string | undefined;
    /**
     * @param height
     * @param index
     * @param id
     * @param hash
     * @param merkleComponentHash
     */
    constructor(
    /**
     * The block height in which the transaction was included.
     */
    height: UInt64, 
    /**
     * The index representing either transaction index/position within block or within an aggregate transaction.
     */
    index: number, 
    /**
     * The transaction db id.
     */
    id: string, 
    /**
     * The transaction hash.
     */
    hash?: string | undefined, 
    /**
     * The transaction merkle hash.
     */
    merkleComponentHash?: string | undefined);
}
