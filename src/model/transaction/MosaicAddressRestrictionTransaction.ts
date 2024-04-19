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
import { Builder } from '../../infrastructure/builders/MosaicAddressRestrictionTransaction';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { TransactionTypeVersion } from './TransactionTypeVersion';
import { calculateFee, FeeCalculationStrategy } from './FeeCalculationStrategy';
import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';

export class MosaicAddressRestrictionTransaction extends Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param mosaicId
     * @param restrictionKey
     * @param previousRestrictionValue
     * @param newRestrictionValue
     * @param targetAddress
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        public readonly mosaicId: MosaicId,
        public readonly restrictionKey: UInt64,
        public readonly previousRestrictionValue: UInt64,
        public readonly newRestrictionValue: UInt64,
        public readonly targetAddress: Address | NamespaceId,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo) {
            super(TransactionType.Mosaic_Address_Restriction, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    public static create(deadline: Deadline,
        mosaicId: MosaicId,
        restrictionKey: UInt64,
        previousRestrictionValue: UInt64,
        newRestrictionValue: UInt64,
        targetAddress: Address | NamespaceId,
        networkType: NetworkType,
        maxFee?: UInt64): MosaicAddressRestrictionTransaction {
        return new MosaicAddressRestrictionTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .mosaicId(mosaicId)
            .restrictionKey(restrictionKey)
            .previousRestrictionValue(previousRestrictionValue)
            .newRestrictionValue(newRestrictionValue)
            .targetAddress(targetAddress)
            .build();
    }

    /**
     * Return the string notation for the set recipient
     * @internal
     * @returns {string}
     */
    public targetAddressToString(): string {

        if (this.targetAddress instanceof NamespaceId) {
            // namespaceId recipient, return hexadecimal notation
            return (this.targetAddress as NamespaceId).toHex();
        }

        // address recipient
        return (this.targetAddress as Address).plain();
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        return MosaicAddressRestrictionTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize()
            + 8 // mosaicId
            + 8 // restrictionKey
            + 8 // previousRestrictionValue
            + 8 // newRestrictionValue
            + 25 // targetAddress
        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof MosaicAddressRestrictionTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                mosaicId: this.mosaicId.toHex(),
                restrictionKey: this.restrictionKey.toDTO(),
                previousRestrictionValue: this.previousRestrictionValue.toDTO(),
                newRestrictionValue: this.newRestrictionValue.toDTO(),
                targetAddress: this.targetAddress.toDTO(),
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
            .addMosaicId(this.mosaicId.toDTO().id)
            .addRestrictionKey(this.restrictionKey.toDTO())
            .addPreviousRestrictionValue(this.previousRestrictionValue.toDTO())
            .addNewRestrictionValue(this.newRestrictionValue.toDTO())
            .addTargetAddress(this.targetAddressToString())
            .build();
    }
}

export class MosaicAddressRestrictionTransactionBuilder extends TransactionBuilder {
    private _mosaicId: MosaicId;
    private _restrictionKey: UInt64;
    private _previousRestrictionValue: UInt64;
    private _newRestrictionValue: UInt64;
    private _targetAddress: Address | NamespaceId;
    constructor() {
        super();
    }

    public mosaicId(mosaicId: MosaicId) {
        this._mosaicId = mosaicId;
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

    public targetAddress(targetAddress: Address | NamespaceId) {
        this._targetAddress = targetAddress;
        return this;
    }

    public build(): MosaicAddressRestrictionTransaction {
        return new MosaicAddressRestrictionTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Mosaic_Address_Restriction,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(MosaicAddressRestrictionTransaction.calculateSize(), this._feeCalculationStrategy),
            this._mosaicId,
            this._restrictionKey,
            this._previousRestrictionValue,
            this._newRestrictionValue,
            this._targetAddress,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
