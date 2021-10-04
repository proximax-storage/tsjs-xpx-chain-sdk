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
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { Builder } from '../../infrastructure/builders/NamespaceMetadataTransaction';
import { TransactionType } from './TransactionType';
import { calculateFee } from './FeeCalculationStrategy';
import { NamespaceId } from '../namespace/NamespaceId';
import { KeyGenerator } from '../../core/format/KeyGenerator';
import { Convert } from '../../core/format/Convert'

/**
 * Create/ modify a metadata transaction entry contains information about metadata .
 */
export class NamespaceMetadataTransaction extends Transaction {

    targetPublicKey: PublicAccount;
    scopedMetadataKey: UInt64;
    targetNamespaceId: NamespaceId;
    valueSizeDelta: number;
    value: string;
    oldValue: string;

    public static create(
        deadline: Deadline,
        targetPublicKey: PublicAccount,
        targetNamespaceId: NamespaceId,
        scopedMetadataKeyString: string,
        value: string,
        oldValue: string,
        networkType: NetworkType,
        maxFee?: UInt64
    ): NamespaceMetadataTransaction {
        let scopedMetadataKey = KeyGenerator.generateUInt64Key(scopedMetadataKeyString);
        let valueSizeDelta = (Convert.utf8ToHex(value).length /2) - (Convert.utf8ToHex(oldValue).length / 2);

        return new NamespaceMetadataTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .scopedMetadataKey(scopedMetadataKey)
            .targetPublicKey(targetPublicKey)
            .targetNamespaceId(targetNamespaceId)
            .valueSizeDelta(valueSizeDelta)
            .value(value)
            .oldValue(oldValue)
            .build();
    }

    /**
     * @param transactionType
     * @param networkType
     * @param version
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
        scopedMetadataKey: UInt64,
        targetPublicKey: PublicAccount,
        targetNamespaceId: NamespaceId,
        valueSizeDelta: number,
        value: string,
        oldValue: string,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        super(transactionType, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.scopedMetadataKey = scopedMetadataKey;
        this.targetPublicKey = targetPublicKey;
        this.targetNamespaceId = targetNamespaceId;
        this.valueSizeDelta = valueSizeDelta;
        this.value = value;
        this.oldValue = oldValue;
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        return NamespaceMetadataTransaction.calculateSize(this.value, this.oldValue);
    }

    public static calculateSize(newValue: string, oldValue: string,): number {
        const newValueSize = Convert.utf8ToHex(newValue).length / 2;
        const oldValueSize = Convert.utf8ToHex(oldValue).length / 2;
        let longerByteLength = Math.max(newValueSize, oldValueSize);
        const byteSize = Transaction.getHeaderSize()
                        + 8  // scopedMetadataKey
                        + 32 // targetPublicKey - pk
                        + 8 // NamespaceId
                        + 2 // valueDeltaSize 
                        + 2 // value size
                        + longerByteLength
        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof NamespaceMetadataTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                scopedMetadataKey: this.scopedMetadataKey,
                targetPublicKey: this.targetPublicKey,
                targetNamespaceId: this.targetNamespaceId,
                valueSizeDelta: this.valueSizeDelta,
                value: this.value,
                oldValue: this.oldValue
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
            .addTargetPublicKey(this.targetPublicKey.publicKey)
            .addScopedMetadataKey(this.scopedMetadataKey.toDTO())
            .addTargetNamespaceId(this.targetNamespaceId.id.toDTO())
            .addValueSizeDelta(this.valueSizeDelta)
            .addValue(this.value)
            .addOldValue(this.oldValue)
            .build();
    }
}

export class NamespaceMetadataTransactionBuilder extends TransactionBuilder {
    private _transactionType: number;
    protected _targetPublicKey: PublicAccount;
    protected _scopedMetadataKey: UInt64;
    protected _targetNamespaceId: NamespaceId;
    protected _valueSizeDelta: number;
    protected _value: string;
    protected _oldValue: string;

    constructor() {
        super();
        this._transactionType = TransactionType.NAMESPACE_METADATA_NEM;
    }

    public targetPublicKey(targetPublicKey: PublicAccount){
        this._targetPublicKey = targetPublicKey;
        return this;
    }

    public scopedMetadataKey(scopedMetadataKey: UInt64){
        this._scopedMetadataKey = scopedMetadataKey;
        return this;
    }

    public targetNamespaceId(targetNamespaceId: NamespaceId){
        this._targetNamespaceId = targetNamespaceId;
        return this;
    }

    public valueSizeDelta(valueSizeDelta: number){
        this._valueSizeDelta = valueSizeDelta;
        return this;
    }

    public value(value: string){
        this._value = value;
        return this;
    }

    public oldValue(oldValue: string){
        this._oldValue = oldValue;
        return this;
    }

    public build(): NamespaceMetadataTransaction {
        return new NamespaceMetadataTransaction(
            this._transactionType,
            this._networkType,
            this._version || TransactionVersion.NAMESPACE_METADATA_NEM,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(NamespaceMetadataTransaction.calculateSize(this._value, this._oldValue), this._feeCalculationStrategy),
            this._scopedMetadataKey,
            this._targetPublicKey,
            this._targetNamespaceId,
            this._valueSizeDelta,
            this._value,
            this._oldValue,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}