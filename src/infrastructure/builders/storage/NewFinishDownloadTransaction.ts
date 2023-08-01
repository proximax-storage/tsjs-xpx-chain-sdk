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
 * @module transactions/FinishDownloadTransaction
 */
import { Convert as convert } from '../../../core/format';
import { TransactionType } from '../../../model/transaction/TransactionType';
import { VerifiableTransaction } from '../VerifiableTransaction';
import FinishDownloadTransactionSchema from '../../schemas/storage/FinishDownloadTransactionSchema';
import { FinishDownloadTransactionBuffer } from '../../buffers/storage/FinishDownloadTransactionBuffer';

import * as flatbuffers from 'flatbuffers';

export default class NewFinishDownloadTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, FinishDownloadTransactionSchema);
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
    feedbackFeeAmount: number[];

    constructor() {
        this.fee = [0, 0];
        this.type = TransactionType.Finish_Download;
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

    addFeedbackFeeAmount(feedbackFeeAmount: number[]) {
        this.feedbackFeeAmount = feedbackFeeAmount;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = FinishDownloadTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = FinishDownloadTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = FinishDownloadTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = FinishDownloadTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const downloadChannelIdVector = FinishDownloadTransactionBuffer.createDownloadChannelIdVector(builder, convert.hexToUint8(this.downloadChannelId));
        const feedbackFeeAmountVector = FinishDownloadTransactionBuffer.createFeedbackFeeAmountVector(builder, this.feedbackFeeAmount);

        FinishDownloadTransactionBuffer.startFinishDownloadTransactionBuffer(builder);
        FinishDownloadTransactionBuffer.addSize(builder, this.size);
        FinishDownloadTransactionBuffer.addSignature(builder, signatureVector);
        FinishDownloadTransactionBuffer.addSigner(builder, signerVector);
        FinishDownloadTransactionBuffer.addVersion(builder, this.version);
        FinishDownloadTransactionBuffer.addType(builder, this.type);
        FinishDownloadTransactionBuffer.addMaxFee(builder, feeVector);
        FinishDownloadTransactionBuffer.addDeadline(builder, deadlineVector);
        FinishDownloadTransactionBuffer.addDownloadChannelId(builder, downloadChannelIdVector);
        FinishDownloadTransactionBuffer.addFeedbackFeeAmount(builder, feedbackFeeAmountVector);

        const codedTransfer = FinishDownloadTransactionBuffer.endFinishDownloadTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new NewFinishDownloadTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
