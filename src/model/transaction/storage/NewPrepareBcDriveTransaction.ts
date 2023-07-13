/*
 * Copyright 2023 ProximaX
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Builder } from '../../../infrastructure/builders/storage/NewPrepareBcDriveTransaction';
import {VerifiableTransaction} from '../../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../../account/PublicAccount';
import { NetworkType } from '../../blockchain/NetworkType';
import { UInt64 } from '../../UInt64';
import { Deadline } from '../Deadline';
import { Transaction, TransactionBuilder } from '../Transaction';
import { TransactionInfo } from '../TransactionInfo';
import { TransactionType } from '../TransactionType';
import { TransactionTypeVersion } from '../TransactionTypeVersion';
import { calculateFee } from '../FeeCalculationStrategy';

export class NewPrepareBcDriveTransaction extends Transaction {

    /**
     * Create a new replicator onboarding transaction object
     * @param deadline - The deadline to include the transaction.
     * @param driveSize - Size of drive
     * @param verificationFeeAmount - Amount of XPXs to transfer to the drive
     * @param replicatorCount - Number of replicators 
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {NewPrepareBcDriveTransaction}
     */
    public static create(deadline: Deadline,
                         driveSize: UInt64,
                         verificationFeeAmount: UInt64,
                         replicatorCount: number, 
                         networkType: NetworkType,
                         maxFee?: UInt64): NewPrepareBcDriveTransaction {
        
        return new NewPrepareBcDriveTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .driveSize(driveSize)
            .verificationFeeAmount(verificationFeeAmount)
            .replicatorCount(replicatorCount)
            .maxFee(maxFee)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param driveSize
     * @param verificationFeeAmount
     * @param replicatorCount
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly driveSize: UInt64,
                public readonly verificationFeeAmount: UInt64,
                public readonly replicatorCount: number,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {

        super(TransactionType.Prepare_Bc_Drive,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);

        if(driveSize.toBigInt() <= BigInt(0)){
            throw new Error("driveSize should be positive value")
        }

        if(verificationFeeAmount.toBigInt() <= BigInt(0)){
            throw new Error("verificationFeeAmount should be positive value")
        }

        if(replicatorCount <= 0){
            throw new Error("replicatorCount should be positive value")
        }
        else if(replicatorCount > 0xFFFF){
            throw new Error("replicatorCount out of range, should be uint16 value")
        }
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a NewPrepareBcDriveTransaction
     * @returns {number}
     * @memberof NewPrepareBcDriveTransaction
     */
    public get size(): number {
        return NewPrepareBcDriveTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const baseByteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const driveSizeSize = 8;
        const verificationFeeAmountSize = 8;
        const replicatorCountSize = 2;

        return baseByteSize + driveSizeSize + verificationFeeAmountSize + replicatorCountSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof NewPrepareBcDriveTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                driveSize: this.driveSize.toDTO(),
                verificationFeeAmount: this.verificationFeeAmount.toDTO(),
                replicatorCount: this.replicatorCount,
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
            .addDriveSize(this.driveSize.toDTO())
            .addVerificationFeeAmount(this.verificationFeeAmount.toDTO())
            .addReplicatorCount(this.replicatorCount)
            .build();
    }
}

export class NewPrepareBcDriveTransactionBuilder extends TransactionBuilder {
    private _driveSize: UInt64;
    private _verificationFeeAmount: UInt64;
    private _replicatorCount: number;

    public driveSize(driveSize: UInt64) {
        this._driveSize = driveSize;
        return this;
    }

    public verificationFeeAmount(verificationFeeAmount: UInt64) {
        this._verificationFeeAmount = verificationFeeAmount;
        return this;
    }

    public replicatorCount(replicatorCount: number) {
        this._replicatorCount = replicatorCount;
        return this;
    }

    public build(): NewPrepareBcDriveTransaction {
        return new NewPrepareBcDriveTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Prepare_Bc_Drive,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(NewPrepareBcDriveTransaction.calculateSize(), this._feeCalculationStrategy),
            this._driveSize,
            this._verificationFeeAmount,
            this._replicatorCount,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
