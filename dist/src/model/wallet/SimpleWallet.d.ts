import { SignSchema } from '../../core/crypto';
import { Account } from '../account/Account';
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
     * Create a Simple wallet
     * @param name - Wallet name
     * @param password - Password to encrypt wallet
     * @param network - Network id
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {SimpleWallet}
     */
    static create(name: string, password: Password, network: NetworkType, signSchema?: SignSchema): SimpleWallet;
    /**
     * Create a SimpleWallet from private key
     * @param name - Wallet name
     * @param password - Password to encrypt wallet
     * @param privateKey - Wallet private key
     * @param network - Network id
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {SimpleWallet}
     */
    static createFromPrivateKey(name: string, password: Password, privateKey: string, network: NetworkType, signSchema?: SignSchema): SimpleWallet;
    /**
     * Open a wallet and generate an Account
     * @param password - Password to decrypt private key
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {Account}
     */
    open(password: Password, signSchema?: SignSchema): Account;
}
