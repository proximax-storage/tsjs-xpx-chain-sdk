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

import { Builder } from '../../../infrastructure/builders/storage/NewVerificationPaymentTransaction';
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

export class NewVerificationPaymentTransaction extends Transaction {

    /**
     * Create a new replicator onboarding transaction object
     * @param deadline - The deadline to include the transaction.
     * @param driveKey - Public key of the drive
     * @param verificationFeeAmount - Amount of XPXs to transfer to the drive
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {NewVerificationPaymentTransaction}
     */
    public static create(deadline: Deadline,
                         driveKey: PublicAccount,
                         verificationFeeAmount: UInt64,
                         networkType: NetworkType,
                         maxFee?: UInt64): NewVerificationPaymentTransaction {
        
        return new NewVerificationPaymentTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .driveKey(driveKey)
            .verificationFeeAmount(verificationFeeAmount)
            .maxFee(maxFee)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param driveKey - The drive key
     * @param verificationFeeAmount - The verification fee amount
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly driveKey: PublicAccount,
                public readonly verificationFeeAmount: UInt64,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {

        super(TransactionType.Verification_Payment,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);

        if(verificationFeeAmount.toBigInt() <= BigInt(0)){
            throw new Error("verificationFeeAmount should be positive value")
        }
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a NewVerificationPaymentTransaction
     * @returns {number}
     * @memberof NewVerificationPaymentTransaction
     */
    public get size(): number {
        return NewVerificationPaymentTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const baseByteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const driveKeySize = 32;
        const verificationFeeAmountSize = 8;

        return baseByteSize + driveKeySize + verificationFeeAmountSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof NewVerificationPaymentTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                driveKey: this.driveKey.toDTO(),
                verificationFeeAmount: this.verificationFeeAmount.toDTO()
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
            .addDriveKey(this.driveKey.publicKey)
            .addVerificationFeeAmount(this.verificationFeeAmount.toDTO())
            .build();
    }
}

export class NewVerificationPaymentTransactionBuilder extends TransactionBuilder {
    private _driveKey: PublicAccount;
    private _verificationFeeAmountSize: UInt64;

    public driveKey(driveKey: PublicAccount) {
        this._driveKey = driveKey;
        return this;
    }

    public verificationFeeAmount(verificationFeeAmount: UInt64) {
        this._verificationFeeAmountSize = verificationFeeAmount;
        return this;
    }

    public build(): NewVerificationPaymentTransaction {
        return new NewVerificationPaymentTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Verification_Payment,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(NewVerificationPaymentTransaction.calculateSize(), this._feeCalculationStrategy),
            this._driveKey,
            this._verificationFeeAmountSize,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
