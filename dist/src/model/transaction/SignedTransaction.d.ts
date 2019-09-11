import { NetworkType } from '../blockchain/NetworkType';
/**
 * SignedTransaction object is used to transfer the transaction data and the signature to the server
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
