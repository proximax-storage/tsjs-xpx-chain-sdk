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
 * @module transactions/DataModificationTransaction
 */
import { Convert as convert } from '../../../core/format';
import { TransactionType } from '../../../model/transaction/TransactionType';
import { VerifiableTransaction } from '../VerifiableTransaction';
import DataModificationTransactionSchema from '../../schemas/storage/DataModificationTransactionSchema';
import { DataModificationTransactionBuffer } from '../../buffers/storage/DataModificationTransactionBuffer';

import * as flatbuffers from 'flatbuffers';

export default class NewDataModificationTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, DataModificationTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: number;
    fee: number[];
    version: number;
    type: number;
    deadline: number[];
    driveKey: string;
    downloadDataCdi: string;
    uploadSize: number[];
    feedbackFeeAmount: number[];

    constructor() {
        this.fee = [0, 0];
        this.version = 1;
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

    addDriveKey(driveKey: string) {
        this.driveKey = driveKey;
        return this;
    }

    addDownloadDataCdi(downloadDataCdi: string) {
        this.downloadDataCdi = downloadDataCdi;
        return this;
    }

    addUploadSize(uploadSize: number[]) {
        this.uploadSize = uploadSize;
        return this;
    }

    addFeedbackFeeAmount(feedbackFeeAmount: number[]) {
        this.feedbackFeeAmount = feedbackFeeAmount;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = DataModificationTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = DataModificationTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = DataModificationTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = DataModificationTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const driveKeyVector = DataModificationTransactionBuffer.createDriveKeyVector(builder, convert.hexToUint8(this.driveKey));

        const downloadDataCdiVector = DataModificationTransactionBuffer.createDownloadDataCdiVector(builder, convert.hexToUint8(this.downloadDataCdi));
        const uploadSizeVector = DataModificationTransactionBuffer.createUploadSizeVector(builder, this.uploadSize);
        const feedbackFeeAmountVector = DataModificationTransactionBuffer.createFeedbackFeeAmountVector(builder, this.feedbackFeeAmount);
               
        DataModificationTransactionBuffer.startDataModificationTransactionBuffer(builder);
        DataModificationTransactionBuffer.addSize(builder, this.size);
        DataModificationTransactionBuffer.addSignature(builder, signatureVector);
        DataModificationTransactionBuffer.addSigner(builder, signerVector);
        DataModificationTransactionBuffer.addVersion(builder, this.version);
        DataModificationTransactionBuffer.addType(builder, this.type);
        DataModificationTransactionBuffer.addMaxFee(builder, feeVector);
        DataModificationTransactionBuffer.addDeadline(builder, deadlineVector);
        DataModificationTransactionBuffer.addDriveKey(builder, driveKeyVector);
        DataModificationTransactionBuffer.addDownloadDataCdi(builder, downloadDataCdiVector);
        DataModificationTransactionBuffer.addUploadSize(builder, uploadSizeVector);
        DataModificationTransactionBuffer.addFeedbackFeeAmount(builder, feedbackFeeAmountVector);

        const codedTransfer = DataModificationTransactionBuffer.endDataModificationTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new NewDataModificationTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
