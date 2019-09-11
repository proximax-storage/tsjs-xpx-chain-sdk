import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';
/**
 * An abstract transaction class that serves as the base class of all receipts.
 */
export declare abstract class Receipt {
    /**
     * The receipt version.
     */
    readonly version: ReceiptVersion;
    /**
     * The receipt type.
     */
    readonly type: ReceiptType;
    /**
     * The receipt size.
     */
    readonly size?: number | undefined;
    /**
     * @constructor
     * @param size
     * @param version
     * @param type
     */
    constructor(
    /**
     * The receipt version.
     */
    version: ReceiptVersion, 
    /**
     * The receipt type.
     */
    type: ReceiptType, 
    /**
     * The receipt size.
     */
    size?: number | undefined);
}
