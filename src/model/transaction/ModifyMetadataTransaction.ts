// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionVersion } from './TransactionVersion';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { MetadataType } from '../metadata/MetadataType';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { Builder } from '../../infrastructure/builders/ModifyMetadataTransaction';
import { TransactionType } from './TransactionType';
import { calculateFee } from './FeeCalculationStrategy';
import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';

export enum MetadataModificationType {
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
export class MetadataModification {
    public type: MetadataModificationType;
    public key: string;
    public value: string | undefined;
    constructor(type: MetadataModificationType, key: string, value?: string) {
        this.type = type;
        this.key = key;
        this.value = value ? value : undefined;
    }

    public toDTO() {
        return {
            type: this.type,
            key: this.key,
            value: this.value
        }
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
        address: Address,
        modifications: MetadataModification[],
        maxFee?: UInt64): ModifyMetadataTransaction {
        return new ModifyAccountMetadataTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .address(address)
            .modifications(modifications)
            .build();
    }
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    public static createWithMosaicId(
        networkType: NetworkType,
        deadline: Deadline,
        mosaicId: MosaicId,
        modifications: MetadataModification[],
        maxFee?: UInt64): ModifyMetadataTransaction {
        return new ModifyMosaicMetadataTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .mosaicId(mosaicId)
            .modifications(modifications)
            .build();
    }
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    public static createWithNamespaceId(
        networkType: NetworkType,
        deadline: Deadline,
        namespaceId: NamespaceId,
        modifications: MetadataModification[],
        maxFee?: UInt64): ModifyMetadataTransaction {
        return new ModifyNamespaceMetadataTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .namespaceId(namespaceId)
            .modifications(modifications)
            .build();
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
    constructor(
        transactionType: number,
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        metadataType: number,
        metadataId: string,
        modifications: MetadataModification[],
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        super(transactionType, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.metadataType = metadataType;
        this.metadataId = metadataId;
        this.modifications = modifications;
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        return ModifyMetadataTransaction.calculateSize(this.type, this.modifications);
    }

    public static calculateSize(type: TransactionType, modifications: MetadataModification[]): number {
        const modificationsSize = modifications.map(m => 4 + 1 + 1 + 2 + m.key.length + (m.value ? m.value.length : 0)).reduce((p,n) => p+n, 0);
        const byteSize = Transaction.getHeaderSize()
                        + 1 // type
                        + (type === TransactionType.MODIFY_ACCOUNT_METADATA ? 25 : 8) // id
                        + modificationsSize
        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof ModifyMetadataTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                metadataType: this.metadataType,
                metadataId: this.metadataId,
                modifications: this.modifications.map(modification => {
                    return modification.toDTO();
                })
            }
        }
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new Builder()
            .addSize(this.size)
            .addType(this.type)
            .addVersion(this.versionToDTO())
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addMetadataType(this.metadataType)
            .addMetadataId(this.metadataId)
            .addModifications(this.modifications)
            .build();
    }
}

class ModifyMetadataTransactionBuilder extends TransactionBuilder {
    private _transactionType: number;
    protected _metadataType: MetadataType;
    protected _metadataId: string;
    private _modifications: MetadataModification[];

    constructor(transactionType: number) {
        super();
        this._transactionType = transactionType;
    }

    public modifications(modifications: MetadataModification[]) {
        this._modifications = modifications;
        return this;
    }

    public build(): ModifyMetadataTransaction {
        return new ModifyMetadataTransaction(
            this._transactionType,
            this._networkType,
            this._version || TransactionVersion.MODIFY_METADATA,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(ModifyMetadataTransaction.calculateSize(this._transactionType, this._modifications), this._feeCalculationStrategy),
            this._metadataType,
            this._metadataId,
            this._modifications,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}

export class ModifyAccountMetadataTransactionBuilder extends ModifyMetadataTransactionBuilder {
    public address(address: Address) {
        this._metadataType = MetadataType.ADDRESS;
        this._metadataId = address.plain();
        return this;
    }

    constructor() {
        super(TransactionType.MODIFY_ACCOUNT_METADATA);
    }
}

export class ModifyMosaicMetadataTransactionBuilder extends ModifyMetadataTransactionBuilder {
    public mosaicId(mosaicId: MosaicId) {
        this._metadataType = MetadataType.MOSAIC;
        this._metadataId = mosaicId.toHex();
        return this;
    }

    constructor() {
        super(TransactionType.MODIFY_MOSAIC_METADATA);
    }
}

export class ModifyNamespaceMetadataTransactionBuilder extends ModifyMetadataTransactionBuilder {
    public namespaceId(namespaceId: NamespaceId) {
        this._metadataType = MetadataType.NAMESPACE;
        this._metadataId = namespaceId.toHex();
        return this;
    }

    constructor() {
        super(TransactionType.MODIFY_NAMESPACE_METADATA);
    }
}
