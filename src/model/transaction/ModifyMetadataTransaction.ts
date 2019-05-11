import { ModifyMetadataTransaction as ModifyMetadataTransactionLibrary, VerifiableTransaction } from 'js-xpx-catapult-library';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { MosaicId } from '../mosaic/MosaicId';
import { Address } from '../account/Address';

export enum MetadataModificationType {
    ADD = 0,
    REMOVE = 1
}

export enum MetadataType {
    NONE = 0,
    ADDRESS = 1,
    MOSAIC = 2,
    NAMESPACE = 3
}

/**
 * Represents single metadata modification - add/remove of the key/value pair
 * 
 * @param type
 * @param key
 * @param value
 */
export class MetadataModification {
    public type: MetadataModificationType;
    public key: string;
    public value: string | undefined;
    constructor(type: MetadataModificationType, key: string, value?: string) {
        this.type = type;
        this.key = key;
        this.value = value ? value : undefined;
    }
}

/**
 * Modify metadata transaction contains information about metadata being modified.
 */
export class ModifyMetadataTransaction extends Transaction {

    public metadataType: MetadataType;
    public metadataId: string;
    public modifications: MetadataModification[];

    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    public static createWithAddress(
        networkType: NetworkType,
        deadline: Deadline,
        maxFee: UInt64 = new UInt64([0, 0]),
        address: Address,
        modifications: MetadataModification[],
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo
    ): ModifyMetadataTransaction {
        return new ModifyMetadataTransaction(
            TransactionType.MODIFY_ACCOUNT_METADATA,
            networkType,
            deadline,
            maxFee,
            MetadataType.ADDRESS,
            address.plain(),
            modifications,
            signature,
            signer,
            transactionInfo);
    }
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    public static createWithMosaicId(
        networkType: NetworkType,
        deadline: Deadline,
        maxFee: UInt64 = new UInt64([0, 0]),
        mosaicId: MosaicId,
        modifications: MetadataModification[],
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo
    ): ModifyMetadataTransaction {
        return new ModifyMetadataTransaction(
            TransactionType.MODIFY_MOSAIC_METADATA,
            networkType,
            deadline,
            maxFee,
            MetadataType.MOSAIC,
            mosaicId.toHex(),
            modifications,
            signature,
            signer,
            transactionInfo);
    }
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    public static createWithNamespaceId(
        networkType: NetworkType,
        deadline: Deadline,
        maxFee: UInt64 = new UInt64([0, 0]),
        namespaceId: NamespaceId,
        modifications: MetadataModification[],
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo
    ): ModifyMetadataTransaction {
        return new ModifyMetadataTransaction(
            TransactionType.MODIFY_NAMESPACE_METADATA,
            networkType,
            deadline,
            maxFee,
            MetadataType.NAMESPACE,
            namespaceId.toHex(),
            modifications,
            signature,
            signer,
            transactionInfo);
    }

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
    private constructor(
        transactionType: number,
        networkType: NetworkType,
        deadline: Deadline,
        maxFee: UInt64,
        metadataType: number,
        metadataId: string,
        modifications: MetadataModification[],
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        super(transactionType, networkType, TransactionVersion.MODIFY_METADATA, deadline, maxFee, signature, signer, transactionInfo);
        this.metadataType = metadataType;
        this.metadataId = metadataId;
        this.modifications = modifications;
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new ModifyMetadataTransactionLibrary.Builder()
            .addType(this.type)
            .addVersion(this.versionToDTO())
            .addDeadline(this.deadline.toDTO())
            .addFee(this.maxFee.toDTO())
            .addMetadataType(this.metadataType)
            .addMetadataId(this.metadataId)
            .addModifications(this.modifications)
            .build();
    }
}
