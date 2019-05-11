import { Password } from './Password';
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
    /**
     * @internal
     * @param encryptedKey
     * @param iv
     */
    constructor(
    /**
     * Encrypted private key data
     */
    encryptedKey: string, 
    /**
     * Initialization vector used in the decrypt process
     */
    iv: string);
    /**
     * @internal
     * Decrypt an encrypted private key
     * @param password
     */
    decrypt(password: Password): string;
}
