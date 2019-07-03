/**
 * The block merkle path item
 */
export declare class MerklePathItem {
    readonly position?: number | undefined;
    /**
     * The hash
     */
    readonly hash?: string | undefined;
    /**
     * @param position
     * @param hash
     */
    constructor(/**
                 * The position
                 */ position?: number | undefined, 
    /**
     * The hash
     */
    hash?: string | undefined);
}
