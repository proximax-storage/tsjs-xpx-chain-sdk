import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { MosaicId } from '../mosaic/MosaicId';
import { Address } from '../account/Address';
import { MetadataType } from '../metadata/MetadataType';
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
    static createWithAddress(networkType: NetworkType, deadline: Deadline, maxFee: UInt64 | undefined, address: Address, modifications: MetadataModification[], signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo | AggregateTransactionInfo): ModifyMetadataTransaction;
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    static createWithMosaicId(networkType: NetworkType, deadline: Deadline, maxFee: UInt64 | undefined, mosaicId: MosaicId, modifications: MetadataModification[], signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo | AggregateTransactionInfo): ModifyMetadataTransaction;
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    static createWithNamespaceId(networkType: NetworkType, deadline: Deadline, maxFee: UInt64 | undefined, namespaceId: NamespaceId, modifications: MetadataModification[], signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo | AggregateTransactionInfo): ModifyMetadataTransaction;
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
    private constructor();
<<<<<<< HEAD
    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    readonly size: number;
=======
>>>>>>> jwt
}
