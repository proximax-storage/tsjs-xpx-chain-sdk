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
 * @module transactions/DataModificationCancelTransaction
 */
import { Convert as convert } from '../../../core/format';
import { TransactionType } from '../../../model/transaction/TransactionType';
import { VerifiableTransaction } from '../VerifiableTransaction';
import DataModificationCancelTransactionSchema from '../../schemas/storage/DataModificationCancelTransactionSchema';
import { DataModificationCancelTransactionBuffer } from '../../buffers/storage/DataModificationCancelTransactionBuffer';

import * as flatbuffers from 'flatbuffers';

export default class NewDataModificationCancelTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, DataModificationCancelTransactionSchema);
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
        this.type = TransactionType.Data_Modification_Cancel;
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

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = DataModificationCancelTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = DataModificationCancelTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = DataModificationCancelTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = DataModificationCancelTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const driveKeyVector = DataModificationCancelTransactionBuffer.createDriveKeyVector(builder, convert.hexToUint8(this.driveKey));
        const downloadDataCdiVector = DataModificationCancelTransactionBuffer.createDownloadDataCdiVector(builder, convert.hexToUint8(this.downloadDataCdi));
   
        DataModificationCancelTransactionBuffer.startDataModificationCancelTransactionBuffer(builder);
        DataModificationCancelTransactionBuffer.addSize(builder, this.size);
        DataModificationCancelTransactionBuffer.addSignature(builder, signatureVector);
        DataModificationCancelTransactionBuffer.addSigner(builder, signerVector);
        DataModificationCancelTransactionBuffer.addVersion(builder, this.version);
        DataModificationCancelTransactionBuffer.addType(builder, this.type);
        DataModificationCancelTransactionBuffer.addMaxFee(builder, feeVector);
        DataModificationCancelTransactionBuffer.addDeadline(builder, deadlineVector);
        DataModificationCancelTransactionBuffer.addDriveKey(builder, driveKeyVector);
        DataModificationCancelTransactionBuffer.addDownloadDataCdi(builder, downloadDataCdiVector);

        const codedTransfer = DataModificationCancelTransactionBuffer.endDataModificationCancelTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new NewDataModificationCancelTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
