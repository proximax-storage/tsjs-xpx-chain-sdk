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
import { Builder } from '../../infrastructure/builders/MosaicRemoveLevyTransaction';
import { TransactionType } from './TransactionType';
import { calculateFee } from './FeeCalculationStrategy';
import { MosaicId } from '../mosaic/MosaicId';

/**
 * Mosaic Modify levy transaction contains information about levy of mosaic being modified.
 */
export class MosaicRemoveLevyTansaction extends Transaction {

    public mosaicId: MosaicId;

    /**
     * Create a mosaic modify levy transaction object
     * @returns {MosaicRemoveLevyTansaction}
     */
    public static create(
        deadline: Deadline,
        mosaicId: MosaicId,
        networkType: NetworkType,
        maxFee?: UInt64): MosaicRemoveLevyTansaction {
        return new MosaicRemoveLevyTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
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
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        super(transactionType, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.mosaicId = mosaicId;
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        return MosaicRemoveLevyTansaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize()
                        + 8 // mosaicId
        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof MosaicRemoveLevyTansaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                mosaicId: this.mosaicId.toHex()
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
            .build();
    }
}

export class MosaicRemoveLevyTransactionBuilder extends TransactionBuilder {
    private _transactionType: number;
    protected _mosaicId: MosaicId;

    constructor() {
        super();
        this._transactionType = TransactionType.REMOVE_MOSAIC_LEVY;
    }

    public mosaicId(mosaicId: MosaicId) {
        this._mosaicId = mosaicId;
        return this;
    }

    public build(): MosaicRemoveLevyTansaction {
        return new MosaicRemoveLevyTansaction(
            this._transactionType,
            this._networkType,
            this._version || TransactionVersion.MOSAIC_REMOVE_LEVY,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(MosaicRemoveLevyTansaction.calculateSize(), this._feeCalculationStrategy),
            this._mosaicId,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
