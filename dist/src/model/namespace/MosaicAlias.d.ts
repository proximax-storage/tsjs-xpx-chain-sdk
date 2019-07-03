import { MosaicId } from '../mosaic/MosaicId';
import { Alias } from './Alias';
/**
 * The MosaicAlias structure describe mosaic aliases
 *
 * @since 0.10.2
 */
export declare class MosaicAlias implements Alias {
    readonly type: number;
    /**
     * The alias address
     */
    readonly mosaicId: MosaicId;
    /**
     * Create AddressAlias object
     *
     * @param type
     * @param mosaicId
     */
    constructor(/**
                 * The alias type
                 */ type: number, 
    /**
     * The alias address
     */
    mosaicId: MosaicId);
    /**
     * Compares AddressAlias for equality.
     *
     * @return boolean
     */
    equals(alias: any): boolean;
    /**
     * Get string value of mosaicId
     * @returns {string}
     */
    toHex(): string;
}
