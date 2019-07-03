import { Mosaic } from '../mosaic/Mosaic';
import { UInt64 } from '../UInt64';
import { Address } from './Address';
import { PublicAccount } from './PublicAccount';
/**
 * The account info structure describes basic information for an account.
 */
export declare class AccountInfo {
    /**
     * Account metadata
     */
    readonly meta: any;
    /**
     * Address of the account.
     */
    readonly address: Address;
    /**
     * Height when the address was published.
     */
    readonly addressHeight: UInt64;
    /**
     * Public key of the account.
     */
    readonly publicKey: string;
    /**
     * Height when the public key was published.
     */
    readonly publicKeyHeight: UInt64;
    /**
     * Mosaics hold by the account.
     */
    readonly mosaics: Mosaic[];
    /**
     *
     */
    constructor(// TODO: meta not implemented in nis
    /**
     * Account metadata
     */
    meta: any, 
    /**
     * Address of the account.
     */
    address: Address, 
    /**
     * Height when the address was published.
     */
    addressHeight: UInt64, 
    /**
     * Public key of the account.
     */
    publicKey: string, 
    /**
     * Height when the public key was published.
     */
    publicKeyHeight: UInt64, 
    /**
     * Mosaics hold by the account.
     */
    mosaics: Mosaic[]);
    /**
     * Returns account public account.
     * @returns {PublicAccount}
     */
    readonly publicAccount: PublicAccount;
}
