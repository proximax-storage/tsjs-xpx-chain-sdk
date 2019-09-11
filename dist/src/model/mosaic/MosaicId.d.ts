import { PublicAccount } from '../account/PublicAccount';
import { Id } from '../Id';
import { MosaicNonce } from '../mosaic/MosaicNonce';
/**
 * The mosaic id structure describes mosaic id
 *
 * @since 1.0
 */
export declare class MosaicId {
    /**
     * Mosaic id
     */
    readonly id: Id;
    /**
     * Create a MosaicId for given `nonce` MosaicNonce and `owner` PublicAccount.
     *
     * @param   nonce   {MosaicNonce}
     * @param   owner   {Account}
     * @return  {MosaicId}
     */
    static createFromNonce(nonce: MosaicNonce, owner: PublicAccount): MosaicId;
    /**
     * Create MosaicId from mosaic id in form of array of number (ex: [3646934825, 3576016193])
     * or the hexadecimal notation thereof in form of a string.
     *
     * @param id
     */
    constructor(id: string | number[]);
    /**
     * Get string value of id
     * @returns {string}
     */
    toHex(): string;
    /**
     * Compares mosaicIds for equality.
     *
     * @return boolean
     */
    equals(other: any): boolean;
    /**
     * Create DTO object.
     */
    toDTO(): {
        id: number[];
    };
}
