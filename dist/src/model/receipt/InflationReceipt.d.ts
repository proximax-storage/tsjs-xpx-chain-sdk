import { MosaicId } from '../mosaic/MosaicId';
import { UInt64 } from '../UInt64';
import { Receipt } from './Receipt';
import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';
/**
 * Balance Transfer: A mosaic transfer was triggered.
 */
export declare class InflationReceipt extends Receipt {
    /**
     * The mosaic id.
     */
    readonly mosaicId: MosaicId;
    /**
     * The amount of mosaic.
     */
    readonly amount: UInt64;
    /**
     * Balance transfer expiry receipt
     * @param mosaicId - The mosaic id.
     * @param amount - The amount of mosaic.
     * @param version - The receipt version
     * @param type - The receipt type
     * @param size - the receipt size
     */
    constructor(
    /**
     * The mosaic id.
     */
    mosaicId: MosaicId, 
    /**
     * The amount of mosaic.
     */
    amount: UInt64, version: ReceiptVersion, type: ReceiptType, size?: number);
}
