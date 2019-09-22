import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { MetadataType } from '../metadata/MetadataType';
import { TransactionType } from './TransactionType';
import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
export declare enum MetadataModificationType {
    ADD = 0,
    REMOVE = 1
}
/**
 * Represents single metadata modification - add/remove of the key/value pair
 *
 * @param type
 * @param key
 * @param value
 */
export declare class MetadataModification {
    type: MetadataModificationType;
    key: string;
    value: string | undefined;
    constructor(type: MetadataModificationType, key: string, value?: string);
}
/**
 * Modify metadata transaction contains information about metadata being modified.
 */
export declare class ModifyMetadataTransaction extends Transaction {
    metadataType: MetadataType;
    metadataId: string;
    modifications: MetadataModification[];
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    static createWithAddress(networkType: NetworkType, deadline: Deadline, address: Address, modifications: MetadataModification[], maxFee?: UInt64): ModifyMetadataTransaction;
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    static createWithMosaicId(networkType: NetworkType, deadline: Deadline, mosaicId: MosaicId, modifications: MetadataModification[], maxFee?: UInt64): ModifyMetadataTransaction;
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    static createWithNamespaceId(networkType: NetworkType, deadline: Deadline, namespaceId: NamespaceId, modifications: MetadataModification[], maxFee?: UInt64): ModifyMetadataTransaction;
    /**
     * @param transactionType
     * @param networkType
     * @param deadline
     * @param maxFee
     * @param metadataType
     * @param metadataId
     * @param modifications
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(transactionType: number, networkType: NetworkType, deadline: Deadline, maxFee: UInt64, metadataType: number, metadataId: string, modifications: MetadataModification[], signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo | AggregateTransactionInfo);
    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    readonly size: number;
    static calculateSize(type: TransactionType, modifications: MetadataModification[]): number;
}
declare class ModifyMetadataTransactionBuilder extends TransactionBuilder {
    private _transactionType;
    protected _metadataType: MetadataType;
    protected _metadataId: string;
    private _modifications;
    constructor(transactionType: number);
    modifications(modifications: MetadataModification[]): this;
    build(): ModifyMetadataTransaction;
}
export declare class ModifyAccountMetadataTransactionBuilder extends ModifyMetadataTransactionBuilder {
    address(address: Address): this;
    constructor();
}
export declare class ModifyMosaicMetadataTransactionBuilder extends ModifyMetadataTransactionBuilder {
    mosaicId(mosaicId: MosaicId): this;
    constructor();
}
export declare class ModifyNamespaceMetadataTransactionBuilder extends ModifyMetadataTransactionBuilder {
    namespaceId(namespaceId: NamespaceId): this;
    constructor();
}
export {};
