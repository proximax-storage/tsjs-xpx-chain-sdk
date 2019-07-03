import { Receipt } from './Receipt';
import { ReceiptSource } from './ReceiptSource';
/**
 * A transaction statement is a collection of receipts linked with a transaction in a particular block.
 * - Balance Transfer: A mosaic transfer was triggered.
 * - Balance Change: A mosaic credit or debit was triggered.
 * - Artifact Expiry: An artifact (e.g. namespace, mosaic) expired.
 */
export declare class TransactionStatement {
    /**
     * The block height.
     */
    readonly height: number[];
    /**
     * The receipt source.
     */
    readonly source: ReceiptSource;
    /**
     * The array of receipt headers.
     */
    readonly receipts: Receipt[];
    /**
     * Receipt - transaction statement object
     * @param height - The block height
     * @param source - The receipt source
     * @param receipts - The array of receipt headers.
     */
    constructor(
    /**
     * The block height.
     */
    height: number[], 
    /**
     * The receipt source.
     */
    source: ReceiptSource, 
    /**
     * The array of receipt headers.
     */
    receipts: Receipt[]);
}
