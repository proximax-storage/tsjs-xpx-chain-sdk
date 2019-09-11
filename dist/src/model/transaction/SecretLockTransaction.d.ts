import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { Mosaic } from '../mosaic/Mosaic';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { HashType } from './HashType';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
export declare class SecretLockTransaction extends Transaction {
    /**
     * The locked mosaic.
     */
    readonly mosaic: Mosaic;
    /**
     * The duration for the funds to be released or returned.
     */
    readonly duration: UInt64;
    /**
     * The hash algorithm, secret is generated with.
     */
    readonly hashType: HashType;
    /**
     * The proof hashed.
     */
    readonly secret: string;
    /**
     * The recipient of the funds.
     */
    readonly recipient: Address;
    /**
     * Create a secret lock transaction object.
     *
     * @param deadline - The deadline to include the transaction.
     * @param mosaic - The locked mosaic.
     * @param duration - The funds lock duration.
     * @param hashType - The hash algorithm secret is generated with.
     * @param secret - The proof hashed.
     * @param recipient - The recipient of the funds.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     *
     * @return a SecretLockTransaction instance
     */
    static create(deadline: Deadline, mosaic: Mosaic, duration: UInt64, hashType: HashType, secret: string, recipient: Address, networkType: NetworkType, maxFee?: UInt64): SecretLockTransaction;
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param mosaic
     * @param duration
     * @param hashType
     * @param secret
     * @param recipient
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType, version: number, deadline: Deadline, maxFee: UInt64, 
    /**
     * The locked mosaic.
     */
    mosaic: Mosaic, 
    /**
     * The duration for the funds to be released or returned.
     */
    duration: UInt64, 
    /**
     * The hash algorithm, secret is generated with.
     */
    hashType: HashType, 
    /**
     * The proof hashed.
     */
    secret: string, 
    /**
     * The recipient of the funds.
     */
    recipient: Address, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo);
    /**
     * @override Transaction.size()
     * @description get the byte size of a SecretLockTransaction
     * @returns {number}
     * @memberof SecretLockTransaction
     */
    readonly size: number;
}
