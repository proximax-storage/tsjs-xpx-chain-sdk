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
 * @module transactions/DownloadTransaction
 */
import { Convert as convert } from '../../../core/format';
import { TransactionType } from '../../../model/transaction/TransactionType';
import { VerifiableTransaction } from '../VerifiableTransaction';
import DownloadTransactionSchema from '../../schemas/storage/DownloadTransactionSchema';
import { DownloadTransactionBuffer } from '../../buffers/storage/DownloadTransactionBuffer';
import { KeysBuffer } from '../../buffers/storage/KeysBuffer';


import * as flatbuffers from 'flatbuffers';

export default class NewDownloadTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, DownloadTransactionSchema);
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
    downloadSize: number[];
    feedbackFeeAmount: number[];
    listOfPublicKeys: string[];

    constructor() {
        this.fee = [0, 0];
        this.type = TransactionType.Download;
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

    addDownloadSize(downloadSize: number[]) {
        this.downloadSize = downloadSize;
        return this;
    }

    addFeedbackFeeAmount(feedbackFeeAmount: number[]) {
        this.feedbackFeeAmount = feedbackFeeAmount;
        return this;
    }

    addListOfPublicKeys(listOfPublicKeys: string[]) {
        this.listOfPublicKeys = listOfPublicKeys;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);
        const totalPublicKeys = this.listOfPublicKeys.length;
        const totalPublicKeysUint8Array = new Uint8Array([totalPublicKeys, totalPublicKeys >> 8]);

        let publicKeyVectorArray: any = [];
        this.listOfPublicKeys.forEach((publicKey) => {
            const publicKeyVector = KeysBuffer
                .createKeyVector(builder, convert.hexToUint8(publicKey));
                KeysBuffer.startKeysBuffer(builder);
                KeysBuffer.addKey(builder, publicKeyVector);
                publicKeyVectorArray.push(KeysBuffer.endKeysBuffer(builder));
        });

        // Create vectors
        const signatureVector = DownloadTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = DownloadTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = DownloadTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = DownloadTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const driveKeyVector = DownloadTransactionBuffer.createDriveKeyVector(builder, convert.hexToUint8(this.driveKey));
        const downloadSizeVector = DownloadTransactionBuffer.createDownloadSizeVector(builder, this.downloadSize);
        const feedbackFeeAmountVector = DownloadTransactionBuffer.createFeedbackFeeAmountVector(builder, this.feedbackFeeAmount);
        const listOfPublicKeysSizeVector = DownloadTransactionBuffer.createListOfPublicKeysSizeVector(builder, totalPublicKeysUint8Array);
        const listOfPublicKeysVector = DownloadTransactionBuffer.createListOfPublicKeysVector(builder, publicKeyVectorArray);

        DownloadTransactionBuffer.startDownloadTransactionBuffer(builder);
        DownloadTransactionBuffer.addSize(builder, this.size);
        DownloadTransactionBuffer.addSignature(builder, signatureVector);
        DownloadTransactionBuffer.addSigner(builder, signerVector);
        DownloadTransactionBuffer.addVersion(builder, this.version);
        DownloadTransactionBuffer.addType(builder, this.type);
        DownloadTransactionBuffer.addMaxFee(builder, feeVector);
        DownloadTransactionBuffer.addDeadline(builder, deadlineVector);
        DownloadTransactionBuffer.addDriveKey(builder, driveKeyVector);
        DownloadTransactionBuffer.addDownloadSize(builder, downloadSizeVector);
        DownloadTransactionBuffer.addFeedbackFeeAmount(builder, feedbackFeeAmountVector);
        DownloadTransactionBuffer.addListOfPublicKeysSize(builder, listOfPublicKeysSizeVector);
        DownloadTransactionBuffer.addListOfPublicKeys(builder, listOfPublicKeysVector);

        const codedTransfer = DownloadTransactionBuffer.endDownloadTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new NewDownloadTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
