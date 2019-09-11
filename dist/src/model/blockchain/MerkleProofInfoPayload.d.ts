import { MerklePathItem } from "./MerklePathItem";
/**
 * The block merkle proof payload
 */
export declare class MerkleProofInfoPayload {
    readonly merklePath: MerklePathItem[];
    /**
     * @param merklePath
     */
    constructor(/**
                 * The merkle path item
                 */ merklePath: MerklePathItem[]);
}
