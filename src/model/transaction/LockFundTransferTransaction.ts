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
import { Builder } from '../../infrastructure/builders/LockFundTransferTransaction';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { TransactionTypeVersion } from './TransactionTypeVersion';
import { calculateFee, FeeCalculationStrategy } from './FeeCalculationStrategy';
import { LockFundAction } from './LockFund';
import { Mosaic } from '../mosaic/Mosaic';

export class LockFundTransferTransaction extends Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param duration
     * @param action
     * @param mosaics
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        public readonly duration: UInt64,
        public readonly action: LockFundAction,
        public readonly mosaics: Mosaic[],
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo) {
            super(TransactionType.Lock_Fund_Transfer, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    public static create(deadline: Deadline,
        duration: UInt64,
        action: LockFundAction,
        mosaics: Mosaic[],
        networkType: NetworkType,
        maxFee?: UInt64): LockFundTransferTransaction {
        return new LockFundTransferTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .duration(duration)
            .action(action)
            .mosaics(mosaics)
            .build();
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        return LockFundTransferTransaction.calculateSize(this.mosaics.length);
    }

    public static calculateSize(mosaicsCount: number): number {
        const byteSize = Transaction.getHeaderSize()
            + 8 // duration
            + 1 // action
            + 1 // mosaicsCount
            + (mosaicsCount * 16) // mosaicId + amount
        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof LockFundTransferTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                duration: this.duration.toDTO(),
                action: this.action,
                mosaics: this.mosaics.map((mosaic) => {
                    return mosaic.toDTO();
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
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addDuration(this.duration.toDTO())
            .addAction(this.action)
            .addMosaics(this.mosaics.map((mosaic) => mosaic.toDTO()))
            .build();
    }
}

export class LockFundTransferTransactionBuilder extends TransactionBuilder {
    private _duration: UInt64;
    private _action: LockFundAction;
    private _mosaics: Mosaic[];

    constructor() {
        super();
    }

    public duration(duration: UInt64) {
        this._duration = duration;
        return this;
    }

    public action(action: LockFundAction) {
        this._action = action;
        return this;
    }

    public mosaics(mosaics: Mosaic[]) {
        this._mosaics = mosaics;
        return this;
    }

    public build(): LockFundTransferTransaction {
        return new LockFundTransferTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Lock_Fund_Transfer,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(LockFundTransferTransaction.calculateSize(this._mosaics.length), this._feeCalculationStrategy),
            this._duration,
            this._action,
            this._mosaics,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
