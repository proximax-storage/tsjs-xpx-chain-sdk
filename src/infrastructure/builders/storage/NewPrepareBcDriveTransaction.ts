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
 * @module transactions/PrepareBcDriveTransaction
 */
import { Convert as convert } from '../../../core/format';
import { TransactionType } from '../../../model/transaction/TransactionType';
import { VerifiableTransaction } from '../VerifiableTransaction';
import PrepareBcDriveTransactionSchema from '../../schemas/storage/PrepareBcDriveTransactionSchema';
import { PrepareBcDriveTransactionBuffer } from '../../buffers/storage/PrepareBcDriveTransactionBuffer';

import * as flatbuffers from 'flatbuffers';

export default class NewPrepareBcDriveTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, PrepareBcDriveTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: number;
    fee: number[];
    version: number;
    type: number;
    deadline: number[];
    driveSize: number[];
    verificationFeeAmount: number[];
    replicatorCount: number;

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

    addDriveSize(driveSize: number[]) {
        this.driveSize = driveSize;
        return this;
    }

    addVerificationFeeAmount(verificationFeeAmount: number[]) {
        this.verificationFeeAmount = verificationFeeAmount;
        return this;
    }

    addReplicatorCount(replicatorCount: number) {
        this.replicatorCount = replicatorCount;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = PrepareBcDriveTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = PrepareBcDriveTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = PrepareBcDriveTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = PrepareBcDriveTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const driveSizeVector = PrepareBcDriveTransactionBuffer.createDriveSizeVector(builder, this.driveSize);
        const verificationFeeAmountVector = PrepareBcDriveTransactionBuffer.createDriveSizeVector(builder, this.verificationFeeAmount);
               
        PrepareBcDriveTransactionBuffer.startPrepareBcDriveTransactionBuffer(builder);
        PrepareBcDriveTransactionBuffer.addSize(builder, this.size);
        PrepareBcDriveTransactionBuffer.addSignature(builder, signatureVector);
        PrepareBcDriveTransactionBuffer.addSigner(builder, signerVector);
        PrepareBcDriveTransactionBuffer.addVersion(builder, this.version);
        PrepareBcDriveTransactionBuffer.addType(builder, this.type);
        PrepareBcDriveTransactionBuffer.addMaxFee(builder, feeVector);
        PrepareBcDriveTransactionBuffer.addDeadline(builder, deadlineVector);
        PrepareBcDriveTransactionBuffer.addDriveSize(builder, driveSizeVector);
        PrepareBcDriveTransactionBuffer.addVerificationFeeAmount(builder, verificationFeeAmountVector);
        PrepareBcDriveTransactionBuffer.addReplicatorCount(builder, this.replicatorCount);

        const codedTransfer = PrepareBcDriveTransactionBuffer.endPrepareBcDriveTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new NewPrepareBcDriveTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
