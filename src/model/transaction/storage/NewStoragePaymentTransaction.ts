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

import { Builder } from '../../../infrastructure/builders/storage/NewStoragePaymentTransaction';
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

export class NewStoragePaymentTransaction extends Transaction {

    /**
     * Create a new replicator onboarding transaction object
     * @param deadline - The deadline to include the transaction.
     * @param driveKey - Public key of the drive
     * @param storageUnits - Amount of storage units to transfer to the drive
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {NewStoragePaymentTransaction}
     */
    public static create(deadline: Deadline,
                         driveKey: PublicAccount,
                         storageUnits: UInt64,
                         networkType: NetworkType,
                         maxFee?: UInt64): NewStoragePaymentTransaction {
        
        return new NewStoragePaymentTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .driveKey(driveKey)
            .storageUnits(storageUnits)
            .maxFee(maxFee)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param driveKey - Public key of the drive
     * @param storageUnits - Amount of storage units to transfer to the drive
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly driveKey: PublicAccount,
                public readonly storageUnits: UInt64,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {

        super(TransactionType.StoragePayment,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);

        if(storageUnits.toBigInt() <= BigInt(0)){
            throw new Error("storageUnits should be positive value")
        }
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a NewStoragePaymentTransaction
     * @returns {number}
     * @memberof NewStoragePaymentTransaction
     */
    public get size(): number {
        return NewStoragePaymentTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const baseByteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const driveKeySize = 32;
        const storageUnitsSize = 8;

        return baseByteSize + driveKeySize + storageUnitsSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof NewStoragePaymentTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                driveKey: this.driveKey.toDTO(),
                storageUnits: this.storageUnits.toDTO()
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
            .addStorageUnits(this.storageUnits.toDTO())
            .build();
    }
}

export class NewStoragePaymentTransactionBuilder extends TransactionBuilder {
    private _driveKey: PublicAccount;
    private _storageUnits: UInt64;

    public driveKey(driveKey: PublicAccount) {
        this._driveKey = driveKey;
        return this;
    }

    public storageUnits(storageUnits: UInt64) {
        this._storageUnits = storageUnits;
        return this;
    }

    public build(): NewStoragePaymentTransaction {
        return new NewStoragePaymentTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.StoragePayment,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(NewStoragePaymentTransaction.calculateSize(), this._feeCalculationStrategy),
            this._driveKey,
            this._storageUnits,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
