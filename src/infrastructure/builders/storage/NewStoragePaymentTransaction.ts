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
 * @module transactions/StoragePaymentTransaction
 */
import { Convert as convert } from '../../../core/format';
import { TransactionType } from '../../../model/transaction/TransactionType';
import { VerifiableTransaction } from '../VerifiableTransaction';
import StoragePaymentTransactionSchema from '../../schemas/storage/StoragePaymentTransactionSchema';
import { StoragePaymentTransactionBuffer } from '../../buffers/storage/StoragePaymentTransactionBuffer';

import * as flatbuffers from 'flatbuffers';

export default class NewStoragePaymentTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, StoragePaymentTransactionSchema);
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
    storageUnits: number[];

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

    addStorageUnits(storageUnits: number[]) {
        this.storageUnits = storageUnits;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = StoragePaymentTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = StoragePaymentTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = StoragePaymentTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = StoragePaymentTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const driveKeyVector = StoragePaymentTransactionBuffer.createDriveKeyVector(builder, convert.hexToUint8(this.driveKey));
        const storageUnitsVector = StoragePaymentTransactionBuffer.createStorageUnitsVector(builder, this.storageUnits);
   
        StoragePaymentTransactionBuffer.startStoragePaymentTransactionBuffer(builder);
        StoragePaymentTransactionBuffer.addSize(builder, this.size);
        StoragePaymentTransactionBuffer.addSignature(builder, signatureVector);
        StoragePaymentTransactionBuffer.addSigner(builder, signerVector);
        StoragePaymentTransactionBuffer.addVersion(builder, this.version);
        StoragePaymentTransactionBuffer.addType(builder, this.type);
        StoragePaymentTransactionBuffer.addMaxFee(builder, feeVector);
        StoragePaymentTransactionBuffer.addDeadline(builder, deadlineVector);
        StoragePaymentTransactionBuffer.addDriveKey(builder, driveKeyVector);
        StoragePaymentTransactionBuffer.addStorageUnits(builder, storageUnitsVector);

        const codedTransfer = StoragePaymentTransactionBuffer.endStoragePaymentTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new NewStoragePaymentTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
