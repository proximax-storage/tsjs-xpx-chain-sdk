import { UInt64 } from '../UInt64';
/**
 * The blockchain score structure describes blockchain difficulty.
 */
export declare class BlockchainScore {
    readonly scoreLow: UInt64;
    /**
     * High part of the blockchain score.
     */
    readonly scoreHigh: UInt64;
    /**
     * @param scoreLow
     * @param scoreHigh
     */
    constructor(/**
                 * Low part of the blockchain score.
                 */ scoreLow: UInt64, 
    /**
     * High part of the blockchain score.
     */
    scoreHigh: UInt64);
}
