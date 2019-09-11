import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { Receipt } from './Receipt';
import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';
/**
 * Artifact Expiry: An artifact (e.g. namespace, mosaic) expired.
 */
export declare class ArtifactExpiryReceipt extends Receipt {
    readonly artifactId: MosaicId | NamespaceId;
    /**
     * Artifact expiry receipt
     * @param artifactId -The id of the artifact (eg. namespace, mosaic).
     * @param version - The receipt version
     * @param type - The receipt type
     * @param size - the receipt size
     */
    constructor(artifactId: MosaicId | NamespaceId, version: ReceiptVersion, type: ReceiptType, size?: number);
}
