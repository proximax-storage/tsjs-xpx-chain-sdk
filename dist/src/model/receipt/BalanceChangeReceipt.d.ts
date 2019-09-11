import { PublicAccount } from '../account/PublicAccount';
import { MosaicId } from '../mosaic/MosaicId';
import { UInt64 } from '../UInt64';
import { Receipt } from './Receipt';
import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';
/**
 * Balance Change: A mosaic credit or debit was triggered.
 */
export declare class BalanceChangeReceipt extends Receipt {
    /**
     * The target account public account.
     */
    readonly account: PublicAccount;
    /**
     * The mosaic id.
     */
    readonly mosaicId: MosaicId;
    /**
     * The amount of mosaic.
     */
    readonly amount: UInt64;
    /**
     * Balance change expiry receipt
     * @param account - The target account public account.
     * @param mosaicId - The mosaic id.
     * @param amount - The amount of mosaic.
     * @param version - The receipt version
     * @param type - The receipt type
     * @param size - the receipt size
     */
    constructor(
    /**
     * The target account public account.
     */
    account: PublicAccount, 
    /**
     * The mosaic id.
     */
    mosaicId: MosaicId, 
    /**
     * The amount of mosaic.
     */
    amount: UInt64, version: ReceiptVersion, type: ReceiptType, size?: number);
}
