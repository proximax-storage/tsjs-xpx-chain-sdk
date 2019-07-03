import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Mosaic } from './Mosaic';
/**
 * NetworkCurrencyMosaic mosaic
 *
 * This represents the per-network currency mosaic. This mosaicId is aliased
 * with namespace name `cat.currency`.
 *
 * @since 0.10.2
 */
export declare class NetworkCurrencyMosaic extends Mosaic {
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
     * Create NetworkCurrencyMosaic with using NetworkCurrencyMosaic as unit.
     *
     * @param amount
     * @returns {NetworkCurrencyMosaic}
     */
    static createRelative(amount: UInt64 | number): NetworkCurrencyMosaic;
    /**
     * Create NetworkCurrencyMosaic with using micro NetworkCurrencyMosaic as unit,
     * 1 NetworkCurrencyMosaic = 1000000 micro NetworkCurrencyMosaic.
     *
     * @param amount
     * @returns {NetworkCurrencyMosaic}
     */
    static createAbsolute(amount: UInt64 | number): NetworkCurrencyMosaic;
}
