/*
 * Copyright 2019 NEM
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
 * @module transactions/HashLockTransaction
 */
import { Convert as convert } from '../../core/format';
import * as LockFundsTransactionBufferPackage from '../buffers/HashLockTransactionBuffer';
import HashLockTransactionSchema from '../schemas/HashLockTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';
import { TransactionType } from '../../model/transaction/TransactionType';

import {flatbuffers} from 'flatbuffers';

const {
    LockFundsTransactionBuffer,
} = LockFundsTransactionBufferPackage.default.Buffers;

export default class HashLockTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, HashLockTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    mosaicId: any;
    mosaicAmount: any;
    duration: any;
    hash: any;
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.LOCK;
    }

    addMaxFee(maxFee) {
        this.maxFee = maxFee;
        return this;
    }

    addVersion(version) {
        this.version = version;
        return this;
    }

    addType(type) {
        this.type = type;
        return this;
    }

    addDeadline(deadline) {
        this.deadline = deadline;
        return this;
    }

    addMosaicId(mosaicId) {
        this.mosaicId = mosaicId;
        return this;
    }

    addMosaicAmount(mosaicAmount) {
        this.mosaicAmount = mosaicAmount;
        return this;
    }

    addDuration(duration) {
        this.duration = duration;
        return this;
    }

    addHash(hash) {
        this.hash = hash;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = LockFundsTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = LockFundsTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = LockFundsTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = LockFundsTransactionBuffer.createMaxFeeVector(builder, this.maxFee);
        const mosaicIdVector = LockFundsTransactionBuffer.createMosaicIdVector(builder, this.mosaicId);
        const mosaicAmountVector = LockFundsTransactionBuffer.createMosaicAmountVector(builder, this.mosaicAmount);
        const durationVector = LockFundsTransactionBuffer.createDurationVector(builder, this.duration);
        const byteHash = convert.hexToUint8(this.hash);
        const hashVector = LockFundsTransactionBuffer.createHashVector(builder, byteHash);

        LockFundsTransactionBuffer.startLockFundsTransactionBuffer(builder);
        LockFundsTransactionBuffer.addSize(builder, 122 + 56);
        LockFundsTransactionBuffer.addSignature(builder, signatureVector);
        LockFundsTransactionBuffer.addSigner(builder, signerVector);
        LockFundsTransactionBuffer.addVersion(builder, this.version);
        LockFundsTransactionBuffer.addType(builder, this.type);
        LockFundsTransactionBuffer.addMaxFee(builder, feeVector);
        LockFundsTransactionBuffer.addDeadline(builder, deadlineVector);
        LockFundsTransactionBuffer.addMosaicId(builder, mosaicIdVector);
        LockFundsTransactionBuffer.addMosaicAmount(builder, mosaicAmountVector);
        LockFundsTransactionBuffer.addDuration(builder, durationVector);
        LockFundsTransactionBuffer.addHash(builder, hashVector);

        const codedHashLock = LockFundsTransactionBuffer.endLockFundsTransactionBuffer(builder);
        builder.finish(codedHashLock);

        const bytes = builder.asUint8Array();
        return new HashLockTransaction(bytes);
    }
}
