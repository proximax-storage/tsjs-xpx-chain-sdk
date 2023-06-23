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

import { Builder } from '../../../infrastructure/builders/storage/NewDownloadPaymentTransaction';
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

export class NewDownloadPaymentTransaction extends Transaction {

    /**
     * Create a new replicator onboarding transaction object
     * @param deadline - The deadline to include the transaction.
     * @param downloadChannelId - The download channel id hash
     * @param downloadSize - The download size
     * @param feedbackFeeAmount - feedback fee amount
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {NewDownloadPaymentTransaction}
     */
    public static create(deadline: Deadline,
                         downloadChannelId: string,
                         downloadSize: UInt64,
                         feedbackFeeAmount: UInt64,
                         networkType: NetworkType,
                         maxFee?: UInt64): NewDownloadPaymentTransaction {
        
        return new NewDownloadPaymentTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .downloadChannelId(downloadChannelId)
            .downloadSize(downloadSize)
            .feedbackFeeAmount(feedbackFeeAmount)
            .maxFee(maxFee)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param downloadChannelId - The identifier of the download channel
     * @param downloadSize - Download size in Mb to add to the prepaid size of the download channel
     * @param feedbackFeeAmount - Amount of XPXs to transfer to the download channel
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly downloadChannelId: string,
                public readonly downloadSize: UInt64,
                public readonly feedbackFeeAmount: UInt64,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {

        super(TransactionType.Download_Payment,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);

        if(!Convert.isHexString(downloadChannelId) && downloadChannelId.length !== 64){
            throw new Error("downloadChannelId should be 32 bytes hash string")
        }

        if(downloadSize.toBigInt() <= BigInt(0)){
            throw new Error("downloadSize should be positive value")
        }

        if(feedbackFeeAmount.toBigInt() <= BigInt(0)){
            throw new Error("feedbackFeeAmount should be positive value")
        }
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a NewDownloadPaymentTransaction
     * @returns {number}
     * @memberof NewDownloadPaymentTransaction
     */
    public get size(): number {
        return NewDownloadPaymentTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const baseByteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const downloadChannelIdSize = 32;
        const downloadSizeSize = 8;
        const feedbackFeeAmountSize = 8;

        return baseByteSize + downloadChannelIdSize + downloadSizeSize + feedbackFeeAmountSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof NewDownloadPaymentTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                downloadChannelId: this.downloadChannelId,
                downloadSize: this.downloadSize.toDTO(),
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
            .addDownloadChannelId(this.downloadChannelId)
            .addDownloadSize(this.downloadSize.toDTO())
            .addFeedbackFeeAmount(this.feedbackFeeAmount.toDTO())
            .build();
    }
}

export class NewDownloadPaymentTransactionBuilder extends TransactionBuilder {
    private _downloadChannelId: string;
    private _downloadSize: UInt64;
    private _feedbackFeeAmount: UInt64;

    public downloadChannelId(downloadChannelId: string) {
        this._downloadChannelId = downloadChannelId;
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

    public build(): NewDownloadPaymentTransaction {
        return new NewDownloadPaymentTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Download_Payment,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(NewDownloadPaymentTransaction.calculateSize(), this._feeCalculationStrategy),
            this._downloadChannelId,
            this._downloadSize,
            this._feedbackFeeAmount,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
