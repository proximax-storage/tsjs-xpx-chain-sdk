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

import { Builder } from '../../../infrastructure/builders/storage/NewFinishDownloadTransaction';
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

export class NewFinishDownloadTransaction extends Transaction {

    /**
     * Create a new replicator onboarding transaction object
     * @param deadline - The deadline to include the transaction.
     * @param downloadChannelId - The identifier of the download channel
     * @param feedbackFeeAmount - feedback fee amount
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {NewFinishDownloadTransaction}
     */
    public static create(deadline: Deadline,
                         downloadChannelId: string,
                         feedbackFeeAmount: UInt64,
                         networkType: NetworkType,
                         maxFee?: UInt64): NewFinishDownloadTransaction {
        
        return new NewFinishDownloadTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .downloadChannelId(downloadChannelId)
            .feedbackFeeAmount(feedbackFeeAmount)
            .maxFee(maxFee)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param downloadChannelId - The download channel id hash
     * @param feedbackFeeAmount - feedback fee amount
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly downloadChannelId: string,
                public readonly feedbackFeeAmount: UInt64,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {

        super(TransactionType.FinishDownload,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);

        if(!Convert.isHexString(downloadChannelId) && downloadChannelId.length !== 64){
            throw new Error("downloadChannelId should be 32 bytes hash string")
        }

        if(feedbackFeeAmount.toBigInt() <= BigInt(0)){
            throw new Error("feedbackFeeAmount should be positive value")
        }
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a NewFinishDownloadTransaction
     * @returns {number}
     * @memberof NewFinishDownloadTransaction
     */
    public get size(): number {
        return NewFinishDownloadTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const baseByteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const downloadChannelIdSize = 32;
        const feedbackFeeAmountSize = 8;

        return baseByteSize + downloadChannelIdSize + feedbackFeeAmountSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof NewFinishDownloadTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                downloadChannelId: this.downloadChannelId,
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
            .addFeedbackFeeAmount(this.feedbackFeeAmount.toDTO())
            .build();
    }
}

export class NewFinishDownloadTransactionBuilder extends TransactionBuilder {
    private _downloadChannelId: string;
    private _feedbackFeeAmount: UInt64;

    public downloadChannelId(downloadChannelId: string) {
        this._downloadChannelId = downloadChannelId;
        return this;
    }

    public feedbackFeeAmount(feedbackFeeAmount: UInt64) {
        this._feedbackFeeAmount = feedbackFeeAmount;
        return this;
    }

    public build(): NewFinishDownloadTransaction {
        return new NewFinishDownloadTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.FinishDownload,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(NewFinishDownloadTransaction.calculateSize(), this._feeCalculationStrategy),
            this._downloadChannelId,
            this._feedbackFeeAmount,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
