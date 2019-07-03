import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
/**
 * Model representing cosignature of an aggregate transaction.
 */
export declare class AggregateTransactionCosignature {
    readonly signature: string;
    /**
     * The cosigner public account.
     */
    readonly signer: PublicAccount;
    /**
     * @param signature
     * @param signer
     */
    constructor(/**
                 * The signature of aggregate transaction done by the cosigner.
                 */ signature: string, 
    /**
     * The cosigner public account.
     */
    signer: PublicAccount);
    /**
     * Create DTO object
     */
    toDTO(): {
        signature: string;
        signer: {
            publicKey: string;
            address: {
                address: string;
                networkType: NetworkType;
            };
        };
    };
}
