import { NetworkType } from '../blockchain/NetworkType';
import { Address } from './Address';
/**
 * The public account structure contains account's address and public key.
 */
export declare class PublicAccount {
    /**
     * The account public private.
     */
    readonly publicKey: string;
    /**
     * The account address.
     */
    readonly address: Address;
    /**
     * Create a PublicAccount from a public key and network type.
     * @param publicKey Public key
     * @param networkType Network type
     * @returns {PublicAccount}
     */
    static createFromPublicKey(publicKey: string, networkType: NetworkType): PublicAccount;
    /**
     * Verify a signature.
     *
     * @param {string} data - The data to verify.
     * @param {string} signature - The signature to verify.
     *
     * @return {boolean}  - True if the signature is valid, false otherwise.
     */
    verifySignature(data: string, signature: string): boolean;
    /**
     * Compares public accounts for equality.
     * @param publicAccount
     * @returns {boolean}
     */
    equals(publicAccount: PublicAccount): boolean;
    /**
     * Create DTO object
     */
    toDTO(): {
        publicKey: string;
        address: {
            address: string;
            networkType: NetworkType;
        };
    };
}
