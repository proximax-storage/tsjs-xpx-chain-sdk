import { AddressAlias } from '../namespace/AddressAlias';
import { MosaicAlias } from '../namespace/MosaicAlias';
import { ReceiptSource } from './ReceiptSource';
/**
 * The receipt source object.
 */
export declare class ResolutionEntry {
    /**
     * A resolved address or resolved mosaicId (alias).
     */
    readonly resolved: AddressAlias | MosaicAlias;
    /**
     * The receipt source.
     */
    readonly source: ReceiptSource;
    /**
     * @constructor
     * @param resolved - A resolved address or resolved mosaicId (alias).
     * @param source - The receipt source.
     */
    constructor(
    /**
     * A resolved address or resolved mosaicId (alias).
     */
    resolved: AddressAlias | MosaicAlias, 
    /**
     * The receipt source.
     */
    source: ReceiptSource);
}
