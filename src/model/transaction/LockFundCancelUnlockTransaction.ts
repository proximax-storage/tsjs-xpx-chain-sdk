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
import { Builder } from '../../infrastructure/builders/LockFundCancelUnlockTransaction';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { TransactionTypeVersion } from './TransactionTypeVersion';
import { calculateFee, FeeCalculationStrategy } from './FeeCalculationStrategy';

export class LockFundCancelUnlockTransaction extends Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param targetHeight
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        public readonly targetHeight: UInt64,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo) {
            super(TransactionType.Lock_Fund_Cancel_Unlock, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    public static create(deadline: Deadline,
        targetHeight: UInt64,
        networkType: NetworkType,
        maxFee?: UInt64): LockFundCancelUnlockTransaction {
        return new LockFundCancelUnlockTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .targetHeight(targetHeight)
            .build();
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        return LockFundCancelUnlockTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize()
            + 8 // duration
        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof LockFundCancelUnlockTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                targetHeight: this.targetHeight.toDTO()
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
            .addTargetHeight(this.targetHeight.toDTO())
            .build();
    }
}

export class LockFundCancelUnlockTransactionBuilder extends TransactionBuilder {
    private _targetHeight: UInt64;

    constructor() {
        super();
    }

    public targetHeight(targetHeight: UInt64) {
        this._targetHeight = targetHeight;
        return this;
    }

    public build(): LockFundCancelUnlockTransaction {
        return new LockFundCancelUnlockTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Lock_Fund_Cancel_Unlock,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(LockFundCancelUnlockTransaction.calculateSize(), this._feeCalculationStrategy),
            this._targetHeight,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
