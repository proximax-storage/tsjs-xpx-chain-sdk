import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
/**
 * Transaction status contains basic of a transaction announced to the blockchain.
 */
export declare class TransactionStatus {
    /**
     * The transaction status group "failed", "unconfirmed", "confirmed", etc...
     */
    readonly group: string;
    /**
     * The transaction status being the error name in case of failure and success otherwise.
     */
    readonly status: string;
    /**
     * The transaction hash.
     */
    readonly hash: string;
    /**
     * The transaction deadline.
     */
    readonly deadline: Deadline;
    /**
     * The height of the block at which it was confirmed or rejected.
     */
    readonly height: UInt64;
    /**
     * @param group
     * @param status
     * @param hash
     * @param deadline
     * @param height
     */
    constructor(
    /**
     * The transaction status group "failed", "unconfirmed", "confirmed", etc...
     */
    group: string, 
    /**
     * The transaction status being the error name in case of failure and success otherwise.
     */
    status: string, 
    /**
     * The transaction hash.
     */
    hash: string, 
    /**
     * The transaction deadline.
     */
    deadline: Deadline, 
    /**
     * The height of the block at which it was confirmed or rejected.
     */
    height: UInt64);
}
