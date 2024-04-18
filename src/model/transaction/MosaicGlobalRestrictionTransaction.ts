// Copyright 2024 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionType } from './TransactionType';
import { NetworkType } from '../blockchain/NetworkType';
import { Deadline } from './Deadline';
import { UInt64 } from '../UInt64';
import { PublicAccount } from '../account/PublicAccount';
import { TransactionInfo } from './TransactionInfo';
import { Builder } from '../../infrastructure/builders/MosaicGlobalRestrictionTransaction';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { TransactionTypeVersion } from './TransactionTypeVersion';
import { calculateFee, FeeCalculationStrategy } from './FeeCalculationStrategy';
import { MosaicRestrictionType } from '../mosaic/MosaicRestriction';
import { MosaicId } from '../mosaic/MosaicId';

export class MosaicGlobalRestrictionTransaction extends Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param mosaicId
     * @param referenceMosaicId
     * @param restrictionKey
     * @param previousRestrictionValue
     * @param newRestrictionValue
     * @param previousRestrictionType
     * @param newRestrictionType
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        public readonly mosaicId: MosaicId,
        public readonly referenceMosaicId: MosaicId,
        public readonly restrictionKey: UInt64,
        public readonly previousRestrictionValue: UInt64,
        public readonly newRestrictionValue: UInt64,
        public readonly previousRestrictionType: MosaicRestrictionType,
        public readonly newRestrictionType: MosaicRestrictionType,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo) {
            super(TransactionType.Mosaic_Global_Restriction, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    public static create(deadline: Deadline,
        mosaicId: MosaicId,
        referenceMosaicId: MosaicId,
        restrictionKey: UInt64,
        previousRestrictionValue: UInt64,
        newRestrictionValue: UInt64,
        previousRestrictionType: MosaicRestrictionType,
        newRestrictionType: MosaicRestrictionType,
        networkType: NetworkType,
        maxFee?: UInt64): MosaicGlobalRestrictionTransaction {
        return new MosaicGlobalRestrictionTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .mosaicId(mosaicId)
            .referenceMosaicId(referenceMosaicId)
            .restrictionKey(restrictionKey)
            .previousRestrictionValue(previousRestrictionValue)
            .newRestrictionValue(newRestrictionValue)
            .previousRestrictionType(previousRestrictionType)
            .newRestrictionType(newRestrictionType)
            .build();
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        return MosaicGlobalRestrictionTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize()
            + 8 // mosaicId
            + 8 // referenceMosaicId
            + 8 // restrictionKey
            + 8 // previousRestrictionValue
            + 8 // newRestrictionValue
            + 1 // previousRestrictionType
            + 1 // newRestrictionType
        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof MosaicGlobalRestrictionTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                mosaicId: this.mosaicId.toHex(),
                referenceMosaicId: this.referenceMosaicId.toHex(),
                restrictionKey: this.restrictionKey.toDTO(),
                previousRestrictionValue: this.previousRestrictionValue.toDTO(),
                newRestrictionValue: this.newRestrictionValue.toDTO(),
                previousRestrictionType: this.previousRestrictionType,
                newRestrictionType: this.newRestrictionType,
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
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addMosaicId(this.mosaicId.toDTO())
            .addReferenceMosaicId(this.referenceMosaicId.toDTO())
            .addRestrictionKey(this.restrictionKey.toDTO())
            .addPreviousRestrictionValue(this.previousRestrictionValue.toDTO())
            .addNewRestrictionValue(this.newRestrictionValue.toDTO())
            .addPreviousRestrictionType(this.previousRestrictionType)
            .addNewRestrictionType(this.newRestrictionType)
            .build();
    }
}

export class MosaicGlobalRestrictionTransactionBuilder extends TransactionBuilder {
    private _mosaicId: MosaicId;
    private _referenceMosaicId: MosaicId;
    private _restrictionKey: UInt64;
    private _previousRestrictionValue: UInt64;
    private _newRestrictionValue: UInt64;
    private _previousRestrictionType: MosaicRestrictionType;
    private _newRestrictionType: MosaicRestrictionType;
    constructor() {
        super();
    }

    public mosaicId(mosaicId: MosaicId) {
        this._mosaicId = mosaicId;
        return this;
    }

    public referenceMosaicId(referenceMosaicId: MosaicId) {
        this._referenceMosaicId = referenceMosaicId;
        return this;
    }

    public restrictionKey(restrictionKey: UInt64) {
        this._restrictionKey = restrictionKey;
        return this;
    }

    public previousRestrictionValue(previousRestrictionValue: UInt64) {
        this._previousRestrictionValue = previousRestrictionValue;
        return this;
    }

    public newRestrictionValue(newRestrictionValue: UInt64) {
        this._newRestrictionValue = newRestrictionValue;
        return this;
    }

    public previousRestrictionType(previousRestrictionType: MosaicRestrictionType) {
        this._previousRestrictionType = previousRestrictionType;
        return this;
    }

    public newRestrictionType(newRestrictionType: MosaicRestrictionType) {
        this._newRestrictionType = newRestrictionType;
        return this;
    }

    public build(): MosaicGlobalRestrictionTransaction {
        return new MosaicGlobalRestrictionTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Mosaic_Global_Restriction,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(MosaicGlobalRestrictionTransaction.calculateSize(), this._feeCalculationStrategy),
            this._mosaicId,
            this._referenceMosaicId,
            this._restrictionKey,
            this._previousRestrictionValue,
            this._newRestrictionValue,
            this._previousRestrictionType,
            this._newRestrictionType,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
