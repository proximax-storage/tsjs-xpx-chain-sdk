import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';
/**
 * The alias structure defines an interface for Aliases
 *
 * @since 0.10.2
 */
export interface Alias {
    /**
     * The alias type
     *
     * - 0 : No alias
     * - 1 : Mosaic id alias
     * - 2 : Address alias
     */
    readonly type: number;
    /**
     * The alias address
     */
    readonly address?: Address;
    /**
     * The alias mosaicId
     */
    readonly mosaicId?: MosaicId;
}
