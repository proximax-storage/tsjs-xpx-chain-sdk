import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { NamespaceId } from '../namespace/NamespaceId';
import { NamespaceType } from '../namespace/NamespaceType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
/**
 * Accounts can rent a namespace for an amount of blocks and after a this renew the contract.
 * This is done via a RegisterNamespaceTransaction.
 */
export declare class RegisterNamespaceTransaction extends Transaction {
    /**
     * The namespace type could be namespace or sub namespace
     */
    readonly namespaceType: NamespaceType;
    /**
     * The namespace name
     */
    readonly namespaceName: string;
    /**
     * The id of the namespace derived from namespaceName.
     * When creating a sub namespace the namespaceId is derived from namespaceName and parentName.
     */
    readonly namespaceId: NamespaceId;
    /**
     * The number of blocks a namespace is active
     */
    readonly duration?: UInt64 | undefined;
    /**
     * The id of the parent sub namespace
     */
    readonly parentId?: NamespaceId | undefined;
    /**
     * Create a root namespace object
     * @param deadline - The deadline to include the transaction.
     * @param namespaceName - The namespace name.
     * @param duration - The duration of the namespace.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {RegisterNamespaceTransaction}
     */
    static createRootNamespace(deadline: Deadline, namespaceName: string, duration: UInt64, networkType: NetworkType, maxFee?: UInt64): RegisterNamespaceTransaction;
    /**
     * Create a sub namespace object
     * @param deadline - The deadline to include the transaction.
     * @param namespaceName - The namespace name.
     * @param parentNamespace - The parent namespace name.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {RegisterNamespaceTransaction}
     */
    static createSubNamespace(deadline: Deadline, namespaceName: string, parentNamespace: string | NamespaceId, networkType: NetworkType, maxFee?: UInt64): RegisterNamespaceTransaction;
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param namespaceType
     * @param namespaceName
     * @param namespaceId
     * @param duration
     * @param parentId
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType, version: number, deadline: Deadline, maxFee: UInt64, 
    /**
     * The namespace type could be namespace or sub namespace
     */
    namespaceType: NamespaceType, 
    /**
     * The namespace name
     */
    namespaceName: string, 
    /**
     * The id of the namespace derived from namespaceName.
     * When creating a sub namespace the namespaceId is derived from namespaceName and parentName.
     */
    namespaceId: NamespaceId, 
    /**
     * The number of blocks a namespace is active
     */
    duration?: UInt64 | undefined, 
    /**
     * The id of the parent sub namespace
     */
    parentId?: NamespaceId | undefined, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo);
    /**
     * @override Transaction.size()
     * @description get the byte size of a RegisterNamespaceTransaction
     * @returns {number}
     * @memberof RegisterNamespaceTransaction
     */
    readonly size: number;
}
