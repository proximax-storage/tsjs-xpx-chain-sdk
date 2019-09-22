import { TransactionBuilder } from './Transaction';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { Mosaic } from '../mosaic/Mosaic';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Message } from './Message';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
/**
 * Transfer transactions contain data about transfers of mosaics and message to another account.
 */
export declare class TransferTransaction extends Transaction {
    /**
     * The address of the recipient.
     */
    readonly recipient: Address | NamespaceId;
    /**
     * The array of Mosaic objects.
     */
    readonly mosaics: Mosaic[];
    /**
     * The transaction message of 2048 characters.
     */
    readonly message: Message;
    /**
     * Create a transfer transaction object
     * @param deadline - The deadline to include the transaction.
     * @param recipient - The recipient of the transaction.
     * @param mosaics - The array of mosaics.
     * @param message - The transaction message.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {TransferTransaction}
     */
    static create(deadline: Deadline, recipient: Address | NamespaceId, mosaics: Mosaic[], message: Message, networkType: NetworkType, maxFee?: UInt64): TransferTransaction;
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param recipient
     * @param mosaics
     * @param message
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType, version: number, deadline: Deadline, maxFee: UInt64, 
    /**
     * The address of the recipient.
     */
    recipient: Address | NamespaceId, 
    /**
     * The array of Mosaic objects.
     */
    mosaics: Mosaic[], 
    /**
     * The transaction message of 2048 characters.
     */
    message: Message, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo);
    /**
     * @override Transaction.size()
     * @description get the byte size of a TransferTransaction
     * @returns {number}
     * @memberof TransferTransaction
     */
    readonly size: number;
    static calculateSize(messageSize: number, mosaicsCount: number): number;
}
export declare class TransferTransactionBuilder extends TransactionBuilder {
    private _recipient;
    private _mosaics;
    private _message;
    recipient(recipient: Address | NamespaceId): this;
    mosaics(mosaics: Mosaic[]): this;
    message(message: Message): this;
    build(): TransferTransaction;
}
