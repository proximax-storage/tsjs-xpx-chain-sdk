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
 * @module transactions/ReplicatorOffboardingTransaction
 */
import { Convert as convert } from '../../../core/format';
import { TransactionType } from '../../../model/transaction/TransactionType';
import { VerifiableTransaction } from '../VerifiableTransaction';
import ReplicatorOffboardingTransactionSchema from '../../schemas/storage/ReplicatorOffboardingTransactionSchema';
import { ReplicatorOffboardingTransactionBuffer } from '../../buffers/storage/ReplicatorOffboardingTransactionBuffer';

import * as flatbuffers from 'flatbuffers';

export default class ReplicatorOffboardingTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, ReplicatorOffboardingTransactionSchema);
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
        this.type = TransactionType.Replicator_Offboarding;
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
        const signatureVector = ReplicatorOffboardingTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = ReplicatorOffboardingTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = ReplicatorOffboardingTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = ReplicatorOffboardingTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const driveKeyVector = ReplicatorOffboardingTransactionBuffer.createDriveKeyVector(builder, convert.hexToUint8(this.driveKey));
        
        ReplicatorOffboardingTransactionBuffer.startReplicatorOffboardingTransactionBuffer(builder);
        ReplicatorOffboardingTransactionBuffer.addSize(builder, this.size);
        ReplicatorOffboardingTransactionBuffer.addSignature(builder, signatureVector);
        ReplicatorOffboardingTransactionBuffer.addSigner(builder, signerVector);
        ReplicatorOffboardingTransactionBuffer.addVersion(builder, this.version);
        ReplicatorOffboardingTransactionBuffer.addType(builder, this.type);
        ReplicatorOffboardingTransactionBuffer.addMaxFee(builder, feeVector);
        ReplicatorOffboardingTransactionBuffer.addDeadline(builder, deadlineVector);
        ReplicatorOffboardingTransactionBuffer.addDriveKey(builder, driveKeyVector);

        const codedTransfer = ReplicatorOffboardingTransactionBuffer.endReplicatorOffboardingTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new ReplicatorOffboardingTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
