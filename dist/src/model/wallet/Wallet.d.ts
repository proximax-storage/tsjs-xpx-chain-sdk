import { LocalDateTime } from 'js-joda';
import { Account } from '../account/Account';
import { Address } from '../account/Address';
import { NetworkType } from '../blockchain/NetworkType';
import { Password } from './Password';
/**
 * Wallet base model
 */
export declare abstract class Wallet {
    /**
     * The wallet's name
     */
    readonly name: string;
    /**
     * The wallet's network
     */
    readonly network: NetworkType;
    /**
     * The wallet's address
     */
    readonly address: Address;
    /**
     * The wallet's creation date
     */
    readonly creationDate: LocalDateTime;
    /**
     * Wallet schema number
     */
    readonly schema: string;
    /**
     * @internal
     * @param name
     * @param network
     * @param address
     * @param creationDate
     * @param schema
     */
    constructor(
    /**
     * The wallet's name
     */
    name: string, 
    /**
     * The wallet's network
     */
    network: NetworkType, 
    /**
     * The wallet's address
     */
    address: Address, 
    /**
     * The wallet's creation date
     */
    creationDate: LocalDateTime, 
    /**
     * Wallet schema number
     */
    schema: string);
    /**
     * Abstract open wallet method returning an account from current wallet.
     * @param password - Password to open wallet.
     * @returns {Account}
     */
    abstract open(password: Password): Account;
}
