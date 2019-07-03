import { PublicAccount } from '../account/PublicAccount';
import { UInt64 } from '../UInt64';
import { MosaicId } from './MosaicId';
import { MosaicProperties } from './MosaicProperties';
/**
 * The mosaic info structure describes a mosaic.
 */
export declare class MosaicInfo {
    readonly metaId: string;
    /**
     * The mosaic id.
     */
    readonly mosaicId: MosaicId;
    /**
     * The mosaic supply.
     */
    readonly supply: UInt64;
    /**
     * The block height were mosaic was created.
     */
    readonly height: UInt64;
    /**
     * The public key of the mosaic creator.
     */
    readonly owner: PublicAccount;
    /**
     * The mosaic revision
     */
    readonly revision: number;
    /**
     * The mosaic properties.
     */
    private readonly properties;
    /**
     * @param active
     * @param index
     * @param metaId
     * @param nonce
     * @param supply
     * @param height
     * @param owner
     * @param properties
     */
    constructor(/**
                 * The meta data id.
                 */ metaId: string, 
    /**
     * The mosaic id.
     */
    mosaicId: MosaicId, 
    /**
     * The mosaic supply.
     */
    supply: UInt64, 
    /**
     * The block height were mosaic was created.
     */
    height: UInt64, 
    /**
     * The public key of the mosaic creator.
     */
    owner: PublicAccount, 
    /**
     * The mosaic revision
     */
    revision: number, 
    /**
     * The mosaic properties.
     */
    properties: MosaicProperties);
    /**
     * Mosaic divisibility
     * @returns {number}
     */
    readonly divisibility: number;
    /**
     * Mosaic duration
     * @returns {UInt64}
     */
    readonly duration: UInt64 | undefined;
    /**
     * Is mosaic supply mutable
     * @returns {boolean}
     */
    isSupplyMutable(): boolean;
    /**
     * Is mosaic transferable
     * @returns {boolean}
     */
    isTransferable(): boolean;
}
