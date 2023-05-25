/*
 * Copyright 2019 NEM
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

// import { Builder } from '../../../infrastructure/builders/NewReplicatorOnboardingTransaction';
import {VerifiableTransaction} from '../../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../../account/PublicAccount';
import { RestrictionType } from '../../account/RestrictionType';
import { NetworkType } from '../../blockchain/NetworkType';
import { UInt64 } from '../../UInt64';
// import { AccountRestrictionModification } from './AccountRestrictionModification';
import { Deadline } from '../Deadline';
import { Transaction, TransactionBuilder } from '../Transaction';
import { TransactionInfo } from '../TransactionInfo';
import { TransactionType } from '../TransactionType';
import { TransactionTypeVersion } from '../TransactionTypeVersion';
import { calculateFee } from '../FeeCalculationStrategy';

export class NewReplicatorOnboardingTransaction extends Transaction {

    /**
     * Create a new replicator onboarding transaction object
     * @param deadline - The deadline to include the transaction.
     * @param capacity - The replicator capacity
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {NewReplicatorOnboardingTransaction}
     */
    public static create(deadline: Deadline,
                         capacity: UInt64,
                         networkType: NetworkType,
                         maxFee?: UInt64): NewReplicatorOnboardingTransaction {

        // if(capacity.equals([0,0])){
        //     throw new Error("capacity should be positive")
        // }
        
        return new NewReplicatorOnboardingTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .capacity(capacity)
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
                public readonly capacity: UInt64,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.ReplicatorOnboarding,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a NewReplicatorOnboardingTransaction
     * @returns {number}
     * @memberof NewReplicatorOnboardingTransaction
     */
    public get size(): number {
        return NewReplicatorOnboardingTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const baseByteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const capacity = 8;

        return baseByteSize + capacity;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof NewReplicatorOnboardingTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                capacity: this.capacity.toDTO(),
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
            .addCapacity(this.capacity)
            .build();
    }
}

export class NewReplicatorOnboardingTransactionBuilder extends TransactionBuilder {
    private _capacity: UInt64;

    public capacity(capacity: UInt64) {
        this._capacity = capacity;
        return this;
    }

    public build(): NewReplicatorOnboardingTransaction {
        return new NewReplicatorOnboardingTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.ReplicatorOnboarding,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(NewReplicatorOnboardingTransaction.calculateSize(), this._feeCalculationStrategy),
            this._capacity,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
