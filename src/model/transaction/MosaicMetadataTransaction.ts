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
import { Builder } from '../../infrastructure/builders/MosaicMetadataTransaction';
import { TransactionType } from './TransactionType';
import { calculateFee } from './FeeCalculationStrategy';
import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { KeyGenerator } from '../../core/format/KeyGenerator';
import { Convert } from '../../core/format/Convert'

/**
 * Create/ modify a metadata transaction entry contains information about metadata .
 */
export class MosaicMetadataTransaction extends Transaction {

    targetPublicKey: PublicAccount;
    scopedMetadataKey: UInt64;
    targetMosaicId: MosaicId;
    valueSizeDelta: number;
    valueSize: number;
    value: string | null;
    oldValue: string | null;
    valueDifferences: Uint8Array;

    public static create(
        deadline: Deadline,
        targetPublicKey: PublicAccount,
        targetMosaicId: MosaicId,
        scopedMetadataKeyString: string | UInt64,
        value: string,
        oldValue: string,
        networkType: NetworkType,
        maxFee?: UInt64
    ): MosaicMetadataTransaction {
        let scopedMetadataKey = scopedMetadataKeyString instanceof UInt64 ? scopedMetadataKeyString : KeyGenerator.generateUInt64Key(scopedMetadataKeyString);
        let valueSizeDelta = (Convert.utf8ToHex(value).length /2) - (Convert.utf8ToHex(oldValue).length / 2);
        let valueSize = Math.max(Convert.utf8ToHex(value).length/2, Convert.utf8ToHex(oldValue).length/2, 0);

        let valueUint8Array = new Uint8Array(valueSize);
        valueUint8Array.set(Convert.hexToUint8(Convert.utf8ToHex(value)), 0);
        let oldValueUint8Array = new Uint8Array(valueSize);
        oldValueUint8Array.set(Convert.hexToUint8(Convert.utf8ToHex(oldValue)), 0);
        let valueDifferenceBytes = new Uint8Array(valueSize);

        for(let i =0; i < valueSize; ++i){
            valueDifferenceBytes[i] = valueUint8Array[i] ^ oldValueUint8Array[i];
        }

        return new MosaicMetadataTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .scopedMetadataKey(scopedMetadataKey)
            .targetPublicKey(targetPublicKey)
            .targetMosaicId(targetMosaicId)
            .valueSizeDelta(valueSizeDelta)
            .value(value)
            .oldValue(oldValue)
            .valueSize(valueSize)
            .valueDifferences(valueDifferenceBytes)
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
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        scopedMetadataKey: UInt64,
        targetPublicKey: PublicAccount,
        targetMosaicId: MosaicId,
        valueSizeDelta: number,
        value: string | null,
        oldValue: string | null,
        valueSize: number,
        valueDifferences: Uint8Array,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        let transactionType = TransactionType.MOSAIC_METADATA_NEM;
        super(transactionType, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.scopedMetadataKey = scopedMetadataKey;
        this.targetPublicKey = targetPublicKey;
        this.targetMosaicId = targetMosaicId;
        this.valueSizeDelta = valueSizeDelta;
        this.value = value;
        this.oldValue = oldValue;
        this.valueSize = valueSize;
        this.valueDifferences = valueDifferences;
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        return MosaicMetadataTransaction.calculateSize(this.valueSize);
    }

    public static calculateSize(valueSize: number): number {
        const byteSize = Transaction.getHeaderSize()
                        + 8  // scopedMetadataKey
                        + 32 // targetPublicKey - pk
                        + 8 // mosaicId
                        + 2 // valueDeltaSize 
                        + 2 // value size
                        + valueSize
        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof MosaicMetadataTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                scopedMetadataKey: this.scopedMetadataKey.toDTO(),
                targetPublicKey: this.targetPublicKey.publicKey,
                targetMosaicId: this.targetMosaicId.toDTO(),
                valueSizeDelta: this.valueSizeDelta,
                value: this.value,
                oldValue: this.oldValue,
                valueSize: this.valueSize,
                valueDifferences: Convert.uint8ToHex(this.valueDifferences) 
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
            .addTargetMosaicId(this.targetMosaicId.id.toDTO())
            .addValueSizeDelta(this.valueSizeDelta)
            .addValue(this.value)
            .addValueSize(this.valueSize)
            .addValueDifferences(this.valueDifferences)
            .addOldValue(this.oldValue)
            .build();
    }
}

export class MosaicMetadataTransactionBuilder extends TransactionBuilder {
    private _transactionType: number;
    protected _targetPublicKey: PublicAccount;
    protected _scopedMetadataKey: UInt64;
    protected _targetMosaicId: MosaicId;
    protected _valueSizeDelta: number;
    protected _value: string | null;
    protected _oldValue: string | null;
    protected _valueSize: number;
    protected _valueDifferences: Uint8Array;

    constructor() {
        super();
        this._transactionType = TransactionType.MOSAIC_METADATA_NEM;
    }

    public targetPublicKey(targetPublicKey: PublicAccount){
        this._targetPublicKey = targetPublicKey;
        return this;
    }

    public scopedMetadataKey(scopedMetadataKey: UInt64){
        this._scopedMetadataKey = scopedMetadataKey;
        return this;
    }

    public targetMosaicId(targetMosaicId: MosaicId){
        this._targetMosaicId = targetMosaicId;
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

    public valueSize(valueSize: number){
        this._valueSize = valueSize;
        return this;
    }

    public valueDifferences(_valueDifferences: Uint8Array){
        this._valueDifferences = _valueDifferences;
        return this;
    }

    public build(): MosaicMetadataTransaction {
        return new MosaicMetadataTransaction(
            this._networkType,
            this._version || TransactionVersion.MOSAIC_METADATA_NEM,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(MosaicMetadataTransaction.calculateSize(this._valueSize), this._feeCalculationStrategy),
            this._scopedMetadataKey,
            this._targetPublicKey,
            this._targetMosaicId,
            this._valueSizeDelta,
            this._value,
            this._oldValue,
            this._valueSize,
            this._valueDifferences,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}