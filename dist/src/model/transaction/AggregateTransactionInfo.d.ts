import { UInt64 } from '../UInt64';
import { TransactionInfo } from './TransactionInfo';
/**
 * Inner transaction information model included in all aggregate inner transactions
 */
export declare class AggregateTransactionInfo extends TransactionInfo {
    /**
     * The hash of the aggregate transaction.
     */
    readonly aggregateHash: string;
    /**
     * The id of the aggregate transaction.
     */
    readonly aggregateId: string;
    /**
     * @param height
     * @param index
     * @param id
     * @param aggregateHash
     * @param aggregateId
     */
    constructor(height: UInt64, index: number, id: string, 
    /**
     * The hash of the aggregate transaction.
     */
    aggregateHash: string, 
    /**
     * The id of the aggregate transaction.
     */
    aggregateId: string);
}
