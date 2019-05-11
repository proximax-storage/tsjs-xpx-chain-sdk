import { LocalDateTime } from 'js-joda';
import { Account } from '../account/Account';
import { Address } from '../account/Address';
import { NetworkType } from '../blockchain/NetworkType';
import { EncryptedPrivateKey } from './EncryptedPrivateKey';
import { Password } from './Password';
import { Wallet } from './Wallet';
/**
 * Simple wallet model generates a private key from a PRNG
 */
export declare class SimpleWallet extends Wallet {
    /**
     * The encrypted private key and information to decrypt it
     */
    readonly encryptedPrivateKey: EncryptedPrivateKey;
    /**
     * @internal
     * @param name
     * @param network
     * @param address
     * @param creationDate
     * @param encryptedPrivateKey
     */
    constructor(name: string, network: NetworkType, address: Address, creationDate: LocalDateTime, 
    /**
     * The encrypted private key and information to decrypt it
     */
    encryptedPrivateKey: EncryptedPrivateKey);
    /**
     * Create a Simple wallet
     * @param name - Wallet name
     * @param password - Password to encrypt wallet
     * @param network - Network id
     * @returns {SimpleWallet}
     */
    static create(name: string, password: Password, network: NetworkType): SimpleWallet;
    /**
     * Create a SimpleWallet from private key
     * @param name - Wallet name
     * @param password - Password to encrypt wallet
     * @param privateKey - Wallet private key
     * @param network - Network id
     * @returns {SimpleWallet}
     */
    static createFromPrivateKey(name: string, password: Password, privateKey: string, network: NetworkType): SimpleWallet;
    /**
     * Open a wallet and generate an Account
     * @param password - Password to decrypt private key
     * @returns {Account}
     */
    open(password: Password): Account;
}
