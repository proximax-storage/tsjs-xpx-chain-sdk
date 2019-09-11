import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Mosaic } from './Mosaic';
/**
 * NetworkHarvestMosaic mosaic
 *
 * This represents the per-network harvest mosaic. This mosaicId is aliased
 * with namespace name `cat.harvest`.
 *
 * @since 0.10.2
 */
export declare class NetworkHarvestMosaic extends Mosaic {
    /**
     * namespaceId of `currency` namespace.
     *
     * @type {Id}
     */
    static NAMESPACE_ID: NamespaceId;
    /**
     * Divisiblity
     * @type {number}
     */
    static DIVISIBILITY: number;
    /**
     * Initial supply
     * @type {number}
     */
    static INITIAL_SUPPLY: number;
    /**
     * Is tranferable
     * @type {boolean}
     */
    static TRANSFERABLE: boolean;
    /**
     * Is Supply mutable
     * @type {boolean}
     */
    static SUPPLY_MUTABLE: boolean;
    /**
     * constructor
     * @param owner
     * @param amount
     */
    private constructor();
    /**
     * Create NetworkHarvestMosaic with using NetworkHarvestMosaic as unit.
     *
     * @param amount
     * @returns {NetworkHarvestMosaic}
     */
    static createRelative(amount: UInt64 | number): NetworkHarvestMosaic;
    /**
     * Create NetworkHarvestMosaic with using micro NetworkHarvestMosaic as unit,
     * 1 NetworkHarvestMosaic = 1000000 micro NetworkHarvestMosaic.
     *
     * @param amount
     * @returns {NetworkHarvestMosaic}
     */
    static createAbsolute(amount: UInt64 | number): NetworkHarvestMosaic;
}
