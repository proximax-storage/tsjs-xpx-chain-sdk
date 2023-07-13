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

import { Builder } from '../../../infrastructure/builders/storage/NewDownloadTransaction';
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

export class NewDownloadTransaction extends Transaction {

    /**
     * Create a new replicator onboarding transaction object
     * @param deadline - The deadline to include the transaction.
     * @param driveKey - Public key of the drive
     * @param downloadSize - Prepaid Download Size in Mb   
     * @param feedbackFeeAmount - XPXs to lock for future payment for
     * @param listOfPublicKeys - List of public keys
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {NewDownloadTransaction}
     */
    public static create(deadline: Deadline,
                         driveKey: PublicAccount,
                         downloadSize: UInt64,
                         feedbackFeeAmount: UInt64,
                         listOfPublicKeys: PublicAccount[],
                         networkType: NetworkType,
                         maxFee?: UInt64): NewDownloadTransaction {
        
        return new NewDownloadTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .driveKey(driveKey)
            .downloadSize(downloadSize)
            .feedbackFeeAmount(feedbackFeeAmount)
            .listOfPublicKeys(listOfPublicKeys)
            .maxFee(maxFee)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param driveKey - Public key of the drive
     * @param downloadSize - Prepaid Download Size in Mb   
     * @param feedbackFeeAmount - XPXs to lock for future payment for
     * @param listOfPublicKeys - List of public keys
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly driveKey: PublicAccount,
                public readonly downloadSize: UInt64,
                public readonly feedbackFeeAmount: UInt64,
                public readonly listOfPublicKeys: PublicAccount[],
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {

        super(TransactionType.Download,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);

        if(downloadSize.toBigInt() <= BigInt(0)){
            throw new Error("downloadSize should be positive value")
        }

        if(feedbackFeeAmount.toBigInt() < BigInt(0)){
            throw new Error("feedbackFeeAmount should be positive value")
        }
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a NewDownloadTransaction
     * @returns {number}
     * @memberof NewDownloadTransaction
     */
    public get size(): number {
        return NewDownloadTransaction.calculateSize(this.listOfPublicKeys.length);
    }

    public static calculateSize(totalPublicKeys: number): number {
        const baseByteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const driveKeySize = 32;
        const downloadSizeSize = 8;
        const feedbackFeeAmountSize = 8;
        const publicKeysSize = 2;
        const totalPublicKeysSize = totalPublicKeys * 32;

        return baseByteSize + driveKeySize + downloadSizeSize + feedbackFeeAmountSize + publicKeysSize + totalPublicKeysSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof NewDownloadTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                driveKey: this.driveKey.publicKey,
                downloadSize: this.downloadSize.toDTO(),
                feedbackFeeAmount: this.feedbackFeeAmount.toDTO(),
                listOfPublicKeys: this.listOfPublicKeys.map((publicKey) => {
                    return publicKey.toDTO();
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
            .addDriveKey(this.driveKey.publicKey)
            .addDownloadSize(this.downloadSize.toDTO())
            .addFeedbackFeeAmount(this.feedbackFeeAmount.toDTO())
            .addListOfPublicKeys(this.listOfPublicKeys.map((data) => data.publicKey))
            .build();
    }
}

export class NewDownloadTransactionBuilder extends TransactionBuilder {
    private _driveKey: PublicAccount;
    private _downloadSize: UInt64;
    private _feedbackFeeAmount: UInt64;
    private _listOfPublicKeys: PublicAccount[];

    public driveKey(driveKey: PublicAccount) {
        this._driveKey = driveKey;
        return this;
    }

    public downloadSize(downloadSize: UInt64) {
        this._downloadSize = downloadSize;
        return this;
    }

    public feedbackFeeAmount(feedbackFeeAmount: UInt64) {
        this._feedbackFeeAmount = feedbackFeeAmount;
        return this;
    }

    public listOfPublicKeys(listOfPublicKeys: PublicAccount[]) {
        this._listOfPublicKeys = listOfPublicKeys;
        return this;
    }

    public build(): NewDownloadTransaction {
        return new NewDownloadTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Download,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(NewDownloadTransaction.calculateSize(this._listOfPublicKeys.length), this._feeCalculationStrategy),
            this._driveKey,
            this._downloadSize,
            this._feedbackFeeAmount,
            this._listOfPublicKeys,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
