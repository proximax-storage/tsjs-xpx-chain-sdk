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

import { Builder } from '../../../infrastructure/builders/storage/NewDataModificationCancelTransaction';
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
import { Convert } from '../../../core/format/Convert';

export class NewDataModificationCancelTransaction extends Transaction {

    /**
     * Create a new replicator onboarding transaction object
     * @param deadline - The deadline to include the transaction.
     * @param driveKey - The drive key
     * @param downloadDataCdi - The download data CDI hash
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {NewDataModificationCancelTransaction}
     */
    public static create(deadline: Deadline,
                         driveKey: PublicAccount,
                         downloadDataCdi: string,
                         networkType: NetworkType,
                         maxFee?: UInt64): NewDataModificationCancelTransaction {
        
        return new NewDataModificationCancelTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .driveKey(driveKey)
            .downloadDataCdi(downloadDataCdi)
            .maxFee(maxFee)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param driveKey - Public key of the drive 
     * @param downloadDataCdi - Identifier of the transaction that initiated the modification
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly driveKey: PublicAccount,
                public readonly downloadDataCdi: string,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {

        super(TransactionType.Data_Modification_Cancel,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);

        if(!Convert.isHexString(downloadDataCdi) || downloadDataCdi.length !== 64){
            throw new Error("downloadDataCdi should be 32 bytes hexadecimal string")
        }
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a NewDataModificationCancelTransaction
     * @returns {number}
     * @memberof NewDataModificationCancelTransaction
     */
    public get size(): number {
        return NewDataModificationCancelTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const baseByteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const driveKeySize = 32;
        const downloadDataCdiSize = 32;

        return baseByteSize + driveKeySize + downloadDataCdiSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof NewDataModificationCancelTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                driveKey: this.driveKey.toDTO(),
                downloadDataCdi: this.downloadDataCdi
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
            .addDownloadDataCdi(this.downloadDataCdi)
            .build();
    }
}

export class NewDataModificationCancelTransactionBuilder extends TransactionBuilder {
    private _driveKey: PublicAccount;
    private _downloadDataCdi: string;

    public driveKey(driveKey: PublicAccount) {
        this._driveKey = driveKey;
        return this;
    }

    public downloadDataCdi(downloadDataCdi: string) {
        this._downloadDataCdi = downloadDataCdi;
        return this;
    }

    public build(): NewDataModificationCancelTransaction {
        return new NewDataModificationCancelTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Data_Modification_Cancel,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(NewDataModificationCancelTransaction.calculateSize(), this._feeCalculationStrategy),
            this._driveKey,
            this._downloadDataCdi,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
