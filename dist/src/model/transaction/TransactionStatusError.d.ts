import { Deadline } from './Deadline';
/**
 * Transaction status error model returned by listeners
 */
export declare class TransactionStatusError {
    /**
     * The transaction hash.
     */
    readonly hash: string;
    /**
     * The status error message.
     */
    readonly status: string;
    /**
     * The transaction deadline.
     */
    readonly deadline: Deadline;
    /**
     * @internal
     * @param hash
     * @param status
     * @param deadline
     */
    constructor(
    /**
     * The transaction hash.
     */
    hash: string, 
    /**
     * The status error message.
     */
    status: string, 
    /**
     * The transaction deadline.
     */
    deadline: Deadline);
}
