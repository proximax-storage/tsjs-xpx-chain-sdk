import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';
import { ResolutionEntry } from './ResolutionEntry';
/**
 * When a transaction includes an alias, a so called resolution statement reflects the resolved value for that block:
 * - Address Resolution: An account alias was used in the block.
 * - Mosaic Resolution: A mosaic alias was used in the block.
 */
export declare class ResolutionStatement {
    /**
     * The block height.
     */
    readonly height: number[];
    /**
     * An unresolved address or unresolved mosaicId.
     */
    readonly unresolved: Address | MosaicId;
    /**
     * The array of resolution entries.
     */
    readonly resolutionEntries: ResolutionEntry[];
    /**
     * Receipt - resolution statement object
     * @param height - The block height
     * @param unresolved - An unresolved address or unresolved mosaicId.
     * @param resolutionEntries - The array of resolution entries.
     */
    constructor(
    /**
     * The block height.
     */
    height: number[], 
    /**
     * An unresolved address or unresolved mosaicId.
     */
    unresolved: Address | MosaicId, 
    /**
     * The array of resolution entries.
     */
    resolutionEntries: ResolutionEntry[]);
}
