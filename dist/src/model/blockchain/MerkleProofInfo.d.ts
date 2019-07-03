import { MerkleProofInfoPayload } from "./MerkleProofInfoPayload";
/**
 * The block merkle proof info
 */
export declare class MerkleProofInfo {
    readonly payload: MerkleProofInfoPayload;
    /**
     * The merkle proof type
     */
    readonly type: string;
    /**
     * @param payload - The merkle proof payload
     * @param type - The merkle proof type
     */
    constructor(/**
                 * The merkle proof payload
                 */ payload: MerkleProofInfoPayload, 
    /**
     * The merkle proof type
     */
    type: string);
}
