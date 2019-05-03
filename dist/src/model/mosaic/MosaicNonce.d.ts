/**
 * The mosaic nonce structure
 *
 * @since 1.0
 */
export declare class MosaicNonce {
    /**
     * Mosaic nonce
     */
    readonly nonce: Uint8Array;
    /**
     * Create a random MosaicNonce
     *
     * @return  {MosaicNonce}
     */
    static createRandom(): MosaicNonce;
    /**
     * Create a MosaicNonce from hexadecimal notation.
     *
     * @param   hex     {string}
     * @return  {MosaicNonce}
     */
    static createFromHex(hex: string): MosaicNonce;
    /**
     * Create MosaicNonce from Uint8Array
     *
     * @param id
     */
    constructor(nonce: Uint8Array);
}
