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

import { Builder } from '../../../infrastructure/builders/storage/ReplicatorOffboardingTransaction';
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

export class ReplicatorOffboardingTransaction extends Transaction {

    /**
     * Create a new replicator onboarding transaction object
     * @param deadline - The deadline to include the transaction.
     * @param capacity - The replicator capacity
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ReplicatorOffboardingTransaction}
     */
    public static create(deadline: Deadline,
                         driveKey: PublicAccount,
                         networkType: NetworkType,
                         maxFee?: UInt64): ReplicatorOffboardingTransaction {

        // if(capacity.equals([0,0])){
        //     throw new Error("capacity should be positive")
        // }
        
        return new ReplicatorOffboardingTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .driveKey(driveKey)
            .maxFee(maxFee)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param capacity
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly driveKey: PublicAccount,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.ReplicatorOffboarding,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a ReplicatorOffboardingTransaction
     * @returns {number}
     * @memberof ReplicatorOffboardingTransaction
     */
    public get size(): number {
        return ReplicatorOffboardingTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const baseByteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const driveKeySize = 32;

        return baseByteSize + driveKeySize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof ReplicatorOffboardingTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                driveKey: this.driveKey.toDTO(),
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
            .build();
    }
}

export class ReplicatorOffboardingTransactionBuilder extends TransactionBuilder {
    private _driveKey: PublicAccount;

    public driveKey(driveKey: PublicAccount) {
        this._driveKey = driveKey;
        return this;
    }

    public build(): ReplicatorOffboardingTransaction {
        return new ReplicatorOffboardingTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.ReplicatorOffboarding,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(ReplicatorOffboardingTransaction.calculateSize(), this._feeCalculationStrategy),
            this._driveKey,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
