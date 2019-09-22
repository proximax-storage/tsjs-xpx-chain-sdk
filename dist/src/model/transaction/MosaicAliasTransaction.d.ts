import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { AliasActionType } from '../namespace/AliasActionType';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
export declare class MosaicAliasTransaction extends Transaction {
    /**
     * The alias action type.
     */
    readonly actionType: AliasActionType;
    /**
     * The namespace id that will be an alias.
     */
    readonly namespaceId: NamespaceId;
    /**
     * The mosaic id.
     */
    readonly mosaicId: MosaicId;
    /**
     * Create a mosaic alias transaction object
     * @param deadline - The deadline to include the transaction.
     * @param actionType - The alias action type.
     * @param namespaceId - The namespace id.
     * @param mosaicId - The mosaic id.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {MosaicAliasTransaction}
     */
    static create(deadline: Deadline, actionType: AliasActionType, namespaceId: NamespaceId, mosaicId: MosaicId, networkType: NetworkType, maxFee?: UInt64): MosaicAliasTransaction;
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param actionType
     * @param namespaceId
     * @param mosaicId
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType, version: number, deadline: Deadline, maxFee: UInt64, 
    /**
     * The alias action type.
     */
    actionType: AliasActionType, 
    /**
     * The namespace id that will be an alias.
     */
    namespaceId: NamespaceId, 
    /**
     * The mosaic id.
     */
    mosaicId: MosaicId, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo);
    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicAliasTransaction
     * @returns {number}
     * @memberof MosaicAliasTransaction
     */
    readonly size: number;
    static calculateSize(): number;
}
export declare class MosaicAliasTransactionBuilder extends TransactionBuilder {
    private _actionType;
    private _namespaceId;
    private _mosaicId;
    actionType(actionType: AliasActionType): this;
    namespaceId(namespaceId: NamespaceId): this;
    mosaicId(mosaicId: MosaicId): this;
    build(): MosaicAliasTransaction;
}
