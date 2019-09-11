import { NamespaceName } from '../namespace/NamespaceName';
import { MosaicId } from './MosaicId';
/**
 * Mosaic with linked names
 */
export declare class MosaicNames {
    /**
     * Mosaic Id
     */
    readonly mosaicId: MosaicId;
    /**
     * Address linked namespace names
     */
    readonly names: NamespaceName[];
    /**
     *
     */
    constructor(
    /**
     * Mosaic Id
     */
    mosaicId: MosaicId, 
    /**
     * Address linked namespace names
     */
    names: NamespaceName[]);
}
