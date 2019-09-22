import { TransactionBuilder } from './Transaction';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { LinkAction } from './LinkAction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
/**
 * Announce an AccountLinkTransaction to delegate the account importance to a proxy account.
 * By doing so, you can enable delegated harvesting
 */
export declare class AccountLinkTransaction extends Transaction {
    /**
     * The public key of the remote account.
     */
    readonly remoteAccountKey: string;
    /**
     * The account link action.
     */
    readonly linkAction: LinkAction;
    /**
     * Create a link account transaction object
     * @param deadline - The deadline to include the transaction.
     * @param remoteAccountKey - The public key of the remote account.
     * @param linkAction - The account link action.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountLinkTransaction}
     */
    static create(deadline: Deadline, remoteAccountKey: string, linkAction: LinkAction, networkType: NetworkType, maxFee?: UInt64): AccountLinkTransaction;
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param remoteAccountKey
     * @param linkAction
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType, version: number, deadline: Deadline, maxFee: UInt64, 
    /**
     * The public key of the remote account.
     */
    remoteAccountKey: string, 
    /**
     * The account link action.
     */
    linkAction: LinkAction, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo);
    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountLinkTransaction
     * @returns {number}
     * @memberof AccountLinkTransaction
     */
    readonly size: number;
    static calculateSize(): number;
}
export declare class AccountLinkTransactionBuilder extends TransactionBuilder {
    private _remoteAccountKey;
    private _linkAction;
    linkAction(linkAction: LinkAction): this;
    remoteAccountKey(remoteAccountKey: string): this;
    build(): AccountLinkTransaction;
}
