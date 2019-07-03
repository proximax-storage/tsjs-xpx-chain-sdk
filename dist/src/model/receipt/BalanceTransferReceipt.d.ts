import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Receipt } from './Receipt';
import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';
/**
 * Balance Transfer: A mosaic transfer was triggered.
 */
export declare class BalanceTransferReceipt extends Receipt {
    /**
     * The public account of the sender.
     */
    readonly sender: PublicAccount;
    /**
     * The mosaic recipient address.
     */
    readonly recipient: Address | NamespaceId;
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
     * @param sender - The public account of the sender.
     * @param recipient - The mosaic recipient address.
     * @param mosaicId - The mosaic id.
     * @param amount - The amount of mosaic.
     * @param version - The receipt version
     * @param type - The receipt type
     * @param size - the receipt size
     */
    constructor(
    /**
     * The public account of the sender.
     */
    sender: PublicAccount, 
    /**
     * The mosaic recipient address.
     */
    recipient: Address | NamespaceId, 
    /**
     * The mosaic id.
     */
    mosaicId: MosaicId, 
    /**
     * The amount of mosaic.
     */
    amount: UInt64, version: ReceiptVersion, type: ReceiptType, size?: number);
}
