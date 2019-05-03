/**
 * EncryptedPrivateKey model
 */
export declare class EncryptedPrivateKey {
    /**
     * Encrypted private key data
     */
    readonly encryptedKey: string;
    /**
     * Initialization vector used in the decrypt process
     */
    readonly iv: string;
}
