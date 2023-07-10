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

/**
 * @module transactions/DownloadPaymentTransaction
 */
import { Convert as convert } from '../../../core/format';
import { TransactionType } from '../../../model/transaction/TransactionType';
import { VerifiableTransaction } from '../VerifiableTransaction';
import DownloadPaymentTransactionSchema from '../../schemas/storage/DownloadPaymentTransactionSchema';
import { DownloadPaymentTransactionBuffer } from '../../buffers/storage/DownloadPaymentTransactionBuffer';

import * as flatbuffers from 'flatbuffers';

export default class NewDownloadPaymentTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, DownloadPaymentTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: number;
    fee: number[];
    version: number;
    type: number;
    deadline: number[];
    downloadChannelId: string;
    downloadSize: number[];
    feedbackFeeAmount: number[];

    constructor() {
        this.fee = [0, 0];
        this.type = TransactionType.Download_Payment;
    }

    addSize(size: number) {
        this.size = size;
        return this;
    }

    addMaxFee(fee: number[]) {
        this.fee = fee;
        return this;
    }

    addVersion(version: number) {
        this.version = version;
        return this;
    }

    addType(type: number) {
        this.type = type;
        return this;
    }

    addDeadline(deadline: number[]) {
        this.deadline = deadline;
        return this;
    }

    addDownloadChannelId(downloadChannelId: string) {
        this.downloadChannelId = downloadChannelId;
        return this;
    }

    addDownloadSize(downloadSize: number[]) {
        this.downloadSize = downloadSize;
        return this;
    }

    addFeedbackFeeAmount(feedbackFeeAmount: number[]) {
        this.feedbackFeeAmount = feedbackFeeAmount;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = DownloadPaymentTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = DownloadPaymentTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = DownloadPaymentTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = DownloadPaymentTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const downloadChannelIdVector = DownloadPaymentTransactionBuffer.createDownloadChannelIdVector(builder, convert.hexToUint8(this.downloadChannelId));
        const downloadSizeVector = DownloadPaymentTransactionBuffer.createDownloadSizeVector(builder, this.downloadSize);
        const feedbackFeeAmountVector = DownloadPaymentTransactionBuffer.createFeedbackFeeAmountVector(builder, this.feedbackFeeAmount);

        DownloadPaymentTransactionBuffer.startDownloadPaymentTransactionBuffer(builder);
        DownloadPaymentTransactionBuffer.addSize(builder, this.size);
        DownloadPaymentTransactionBuffer.addSignature(builder, signatureVector);
        DownloadPaymentTransactionBuffer.addSigner(builder, signerVector);
        DownloadPaymentTransactionBuffer.addVersion(builder, this.version);
        DownloadPaymentTransactionBuffer.addType(builder, this.type);
        DownloadPaymentTransactionBuffer.addMaxFee(builder, feeVector);
        DownloadPaymentTransactionBuffer.addDeadline(builder, deadlineVector);
        DownloadPaymentTransactionBuffer.addDownloadChannelId(builder, downloadChannelIdVector);
        DownloadPaymentTransactionBuffer.addDownloadSize(builder, downloadSizeVector);
        DownloadPaymentTransactionBuffer.addFeedbackFeeAmount(builder, feedbackFeeAmountVector);

        const codedTransfer = DownloadPaymentTransactionBuffer.endDownloadPaymentTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new NewDownloadPaymentTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
