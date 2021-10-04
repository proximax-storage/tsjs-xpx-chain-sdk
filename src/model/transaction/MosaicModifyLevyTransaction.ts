// Copyright 2021 ProximaX Limited. All rights reserved.
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
import { Builder } from '../../infrastructure/builders/MosaicModifyLevyTransaction';
import { TransactionType } from './TransactionType';
import { calculateFee } from './FeeCalculationStrategy';
import { MosaicId } from '../mosaic/MosaicId';
import { MosaicLevy } from '../mosaic/MosaicLevy';
import { MosaicLevyType } from '../mosaic/MosaicLevyType';

/**
 * Mosaic Modify levy transaction contains information about levy of mosaic being modified.
 */
export class MosaicModifyLevyTansaction extends Transaction {

    public mosaicId: MosaicId;
    public mosaicLevy: MosaicLevy;

    /**
     * Create a mosaic modify levy transaction object
     * @returns {MosaicModifyLevyTansaction}
     */
    public static create(
        deadline: Deadline,
        mosaicId: MosaicId,
        mosaicLevy: MosaicLevy,
        networkType: NetworkType,
        maxFee?: UInt64): MosaicModifyLevyTansaction {
        return new MosaicModifyLevyTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .mosaicLevy(mosaicLevy)
            .mosaicId(mosaicId)
            .build();
    }

    /**
     * @param transactionType
     * @param networkType
     * @param deadline
     * @param maxFee
     * @param mosaicId
     * @param mosaicLevy
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
        mosaicId: MosaicId,
        mosaicLevy: MosaicLevy,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        
        if (mosaicLevy.type === MosaicLevyType.LevyNone) {
            throw new Error('Levy type not allowed');
        };
        super(transactionType, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.mosaicId = mosaicId;
        this.mosaicLevy = mosaicLevy;
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        return MosaicModifyLevyTansaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize()
                        + 8 // mosaicId
                        + 1 // levy type
                        + 25 // levy recipient
                        + 8 // levy mosaicId
                        + 8 // levy fee
        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof MosaicModifyLevyTansaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                mosaicId: this.mosaicId.toHex(),
                mosaicLevy: {
                    type: this.mosaicLevy.type,
                    mosaicId: this.mosaicLevy.mosaicId,
                    recipient: this.mosaicLevy.recipient,
                    fee: this.mosaicLevy.fee.compact(),
                }
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
            .addMosaicId(this.mosaicId.id.toDTO())
            .addLevyType(this.mosaicLevy.type)
            .addLevyRecipeint(this.mosaicLevy.recipient.plain())
            .addLevyMosaicId(this.mosaicLevy.mosaicId.id.toDTO())
            .addLevyFee(this.mosaicLevy.fee.toDTO())
            .build();
    }
}

export class MosaicModifyLevyTransactionBuilder extends TransactionBuilder {
    private _transactionType: number;
    protected _mosaicId: MosaicId;
    protected _mosaicLevy: MosaicLevy;

    constructor() {
        super();
        this._transactionType = TransactionType.MODIFY_MOSAIC_LEVY;
    }

    public mosaicId(mosaicId: MosaicId) {
        this._mosaicId = mosaicId;
        return this;
    }

    public mosaicLevy(mosaicLevy: MosaicLevy) {
        this._mosaicLevy = mosaicLevy;
        return this;
    }

    public build(): MosaicModifyLevyTansaction {
        return new MosaicModifyLevyTansaction(
            this._transactionType,
            this._networkType,
            this._version || TransactionVersion.MOSAIC_MODIFY_LEVY,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(MosaicModifyLevyTansaction.calculateSize(), this._feeCalculationStrategy),
            this._mosaicId,
            this._mosaicLevy,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
