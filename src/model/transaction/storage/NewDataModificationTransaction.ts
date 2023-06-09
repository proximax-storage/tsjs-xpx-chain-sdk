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

import { Builder } from '../../../infrastructure/builders/storage/NewDataModificationTransaction';
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

export class NewDataModificationTransaction extends Transaction {

    /**
     * Create a new replicator onboarding transaction object
     * @param deadline - The deadline to include the transaction.
     * @param driveKey - The drive key
     * @param downloadDataCdi - The download data CDI hash
     * @param uploadSize - The upload size
     * @param feedbackFeeAmount - The feedback fee amount.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {NewDataModificationTransaction}
     */
    public static create(deadline: Deadline,
                         driveKey: PublicAccount,
                         downloadDataCdi: string,
                         uploadSize: UInt64,
                         feedbackFeeAmount: UInt64,
                         networkType: NetworkType,
                         maxFee?: UInt64): NewDataModificationTransaction {
        
        return new NewDataModificationTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .driveKey(driveKey)
            .downloadDataCdi(downloadDataCdi)
            .uploadSize(uploadSize)
            .feedbackFeeAmount(feedbackFeeAmount)
            .maxFee(maxFee)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param driveKey - Public key of the drive
     * @param downloadDataCdi - Download data CDI of modification hash
     * @param uploadSize - Size of upload in MB
     * @param feedbackFeeAmount - Amount of XPXs to transfer to the drive
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
                public readonly uploadSize: UInt64,
                public readonly feedbackFeeAmount: UInt64,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {

        super(TransactionType.DataModification,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    
        if(!Convert.isHexString(downloadDataCdi) && downloadDataCdi.length !== 64 ){
            throw new Error("downloadDataCdi should be 32 bytes hash string")
        }

        if(uploadSize.toBigInt() <= BigInt(0)){
            throw new Error("uploadSize should be positive value")
        }

        if(feedbackFeeAmount.toBigInt() <= BigInt(0)){
            throw new Error("feedbackFeeAmount should be positive value")
        }
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a NewDataModificationTransaction
     * @returns {number}
     * @memberof NewDataModificationTransaction
     */
    public get size(): number {
        return NewDataModificationTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const baseByteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const driveKeySize = 32;
        const downloadDataCdiSize = 32;
        const uploadSizeSize = 8;
        const feedbackFeeAmountSize = 8;

        return baseByteSize + driveKeySize + downloadDataCdiSize + uploadSizeSize + feedbackFeeAmountSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof NewDataModificationTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                driveKey: this.driveKey.toDTO(),
                downloadDataCdi: this.downloadDataCdi,
                uploadSize: this.uploadSize.toDTO(),
                feedbackFeeAmount: this.feedbackFeeAmount.toDTO()
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
            .addUploadSize(this.uploadSize.toDTO())
            .addFeedbackFeeAmount(this.feedbackFeeAmount.toDTO())
            .build();
    }
}

export class NewDataModificationTransactionBuilder extends TransactionBuilder {
    private _driveKey: PublicAccount;
    private _downloadDataCdi: string;
    private _uploadSize: UInt64;
    private _feedbackFeeAmount: UInt64;

    public driveKey(driveKey: PublicAccount) {
        this._driveKey = driveKey;
        return this;
    }

    public downloadDataCdi(downloadDataCdi: string) {
        this._downloadDataCdi = downloadDataCdi;
        return this;
    }

    public uploadSize(uploadSize: UInt64) {
        this._uploadSize = uploadSize;
        return this;
    }

    public feedbackFeeAmount(feedbackFeeAmount: UInt64) {
        this._feedbackFeeAmount = feedbackFeeAmount;
        return this;
    }

    public build(): NewDataModificationTransaction {
        return new NewDataModificationTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.DataModification,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(NewDataModificationTransaction.calculateSize(), this._feeCalculationStrategy),
            this._driveKey,
            this._downloadDataCdi,
            this._uploadSize,
            this._feedbackFeeAmount,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
