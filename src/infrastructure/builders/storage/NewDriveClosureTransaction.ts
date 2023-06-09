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
 * @module transactions/DriveClosureTransaction
 */
import { Convert as convert } from '../../../core/format';
import { TransactionType } from '../../../model/transaction/TransactionType';
import { VerifiableTransaction } from '../VerifiableTransaction';
import DriveClosureTransactionSchema from '../../schemas/storage/DriveClosureTransactionSchema';
import { DriveClosureTransactionBuffer } from '../../buffers/storage/DriveClosureTransactionBuffer';

import * as flatbuffers from 'flatbuffers';

export default class NewDriveClosureTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, DriveClosureTransactionSchema);
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

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = DriveClosureTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = DriveClosureTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = DriveClosureTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = DriveClosureTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const driveKeyVector = DriveClosureTransactionBuffer.createDriveKeyVector(builder, convert.hexToUint8(this.driveKey));
               
        DriveClosureTransactionBuffer.startDriveClosureTransactionBuffer(builder);
        DriveClosureTransactionBuffer.addSize(builder, this.size);
        DriveClosureTransactionBuffer.addSignature(builder, signatureVector);
        DriveClosureTransactionBuffer.addSigner(builder, signerVector);
        DriveClosureTransactionBuffer.addVersion(builder, this.version);
        DriveClosureTransactionBuffer.addType(builder, this.type);
        DriveClosureTransactionBuffer.addMaxFee(builder, feeVector);
        DriveClosureTransactionBuffer.addDeadline(builder, deadlineVector);
        DriveClosureTransactionBuffer.addDriveKey(builder, driveKeyVector);

        const codedTransfer = DriveClosureTransactionBuffer.endDriveClosureTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new NewDriveClosureTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
