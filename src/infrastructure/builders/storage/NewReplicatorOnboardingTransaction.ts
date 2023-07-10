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
 * @module transactions/NewReplicatorOnboardingTransaction
 */
import { Convert as convert } from '../../../core/format';
import { TransactionType } from '../../../model/transaction/TransactionType';
import { VerifiableTransaction } from '../VerifiableTransaction';
import ReplicatorOnboardingTransactionSchema from '../../schemas/storage/ReplicatorOnboardingTransactionSchema';
import { ReplicatorOnboardingTransactionBuffer } from '../../buffers/storage/ReplicatorOnboardingTransactionBuffer';

import * as flatbuffers from 'flatbuffers';

export default class NewReplicatorOnboardingTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, ReplicatorOnboardingTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: number;
    fee: number[];
    version: number;
    type: number;
    deadline: number[];
    capacity: number[];

    constructor() {
        this.fee = [0, 0];
        this.type = TransactionType.Replicator_Onboarding;
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

    addCapacity(capacity: number[]) {
        this.capacity = capacity;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = ReplicatorOnboardingTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = ReplicatorOnboardingTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = ReplicatorOnboardingTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = ReplicatorOnboardingTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const capacityVector = ReplicatorOnboardingTransactionBuffer.createCapacityVector(builder, this.capacity);
        
        ReplicatorOnboardingTransactionBuffer.startReplicatorOnboardingTransactionBuffer(builder);
        ReplicatorOnboardingTransactionBuffer.addSize(builder, this.size);
        ReplicatorOnboardingTransactionBuffer.addSignature(builder, signatureVector);
        ReplicatorOnboardingTransactionBuffer.addSigner(builder, signerVector);
        ReplicatorOnboardingTransactionBuffer.addVersion(builder, this.version);
        ReplicatorOnboardingTransactionBuffer.addType(builder, this.type);
        ReplicatorOnboardingTransactionBuffer.addMaxFee(builder, feeVector);
        ReplicatorOnboardingTransactionBuffer.addDeadline(builder, deadlineVector);
        ReplicatorOnboardingTransactionBuffer.addCapacity(builder, capacityVector);

        const codedTransfer = ReplicatorOnboardingTransactionBuffer.endReplicatorOnboardingTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new NewReplicatorOnboardingTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
