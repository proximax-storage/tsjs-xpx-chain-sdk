import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { MosaicId } from './MosaicId';
/**
 * A mosaic describes an instance of a mosaic definition.
 * Mosaics can be transferred by means of a transfer transaction.
 */
export declare class Mosaic {
    /**
     * The mosaic id
     */
    readonly id: MosaicId | NamespaceId;
    /**
     * The mosaic amount. The quantity is always given in smallest units for the mosaic
     * i.e. if it has a divisibility of 3 the quantity is given in millis.
     */
    readonly amount: UInt64;
    /**
     * Constructor
     * @param id
     * @param amount
     */
    constructor(
    /**
     * The mosaic id
     */
    id: MosaicId | NamespaceId, 
    /**
     * The mosaic amount. The quantity is always given in smallest units for the mosaic
     * i.e. if it has a divisibility of 3 the quantity is given in millis.
     */
    amount: UInt64);
}
