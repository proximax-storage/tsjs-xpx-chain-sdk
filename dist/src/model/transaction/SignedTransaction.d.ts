import { NetworkType } from '../blockchain/NetworkType';
/**
 * SignedTransaction object is used to transfer the transaction data and the signature to NIS
 * in order to initiate and broadcast a transaction.
 */
export declare class SignedTransaction {
    readonly payload: string;
    /**
     * Transaction hash
     */
    readonly hash: string;
    /**
     * Transaction signer
     */
    readonly signer: string;
    /**
     * Transaction type
     */
    readonly type: number;
    /**
     * Signer network type
     */
    readonly networkType: NetworkType;
    /**
     * @internal
     * @param payload
     * @param hash
     * @param signer
     * @param type
     * @param networkType
     */
    constructor(/**
                 * Transaction serialized data
                 */ payload: string, 
    /**
     * Transaction hash
     */
    hash: string, 
    /**
     * Transaction signer
     */
    signer: string, 
    /**
     * Transaction type
     */
    type: number, 
    /**
     * Signer network type
     */
    networkType: NetworkType);
    /**
     * Create DTO object
     */
    toDTO(): {
        payload: string;
        hash: string;
        signer: string;
        type: number;
        networkType: NetworkType;
    };
}
