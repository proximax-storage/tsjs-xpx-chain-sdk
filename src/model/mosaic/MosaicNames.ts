import {MosaicId} from './MosaicId';

/**
 * The mosaic names structure stores array of names for a mosaic
 */
export class MosaicNames {

    /**
     * Constructor.
     * @param mosaicId
     * @param names
     */
    constructor(/**
                 * The mosaic id.
                 */
                public readonly mosaicId: MosaicId,
                /**
                 * The array of mosaic names
                 */
                public readonly names: string) {
    }

}
