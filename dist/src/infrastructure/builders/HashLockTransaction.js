"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module transactions/HashLockTransaction
 */
const format_1 = require("../../core/format");
<<<<<<< HEAD
const LockFundsTransactionBufferPackage = require("../buffers/HashLockTransactionBuffer");
=======
const HashLockTransactionBufferPackage = require("../buffers/HashLockTransactionBuffer");
>>>>>>> jwt
const HashLockTransactionSchema_1 = require("../schemas/HashLockTransactionSchema");
const VerifiableTransaction_1 = require("./VerifiableTransaction");
const TransactionType_1 = require("../../model/transaction/TransactionType");
const flatbuffers_1 = require("flatbuffers");
<<<<<<< HEAD
const { LockFundsTransactionBuffer, } = LockFundsTransactionBufferPackage.default.Buffers;
=======
const { HashLockTransactionBuffer, } = HashLockTransactionBufferPackage.default.Buffers;
>>>>>>> jwt
class HashLockTransaction extends VerifiableTransaction_1.VerifiableTransaction {
    constructor(bytes) {
        super(bytes, HashLockTransactionSchema_1.default);
    }
}
exports.default = HashLockTransaction;
// tslint:disable-next-line:max-classes-per-file
class Builder {
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType_1.TransactionType.LOCK;
    }
<<<<<<< HEAD
    addMaxFee(maxFee) {
=======
    addFee(maxFee) {
>>>>>>> jwt
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
        const builder = new flatbuffers_1.flatbuffers.Builder(1);
        // Create vectors
<<<<<<< HEAD
        const signatureVector = LockFundsTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = LockFundsTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = LockFundsTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = LockFundsTransactionBuffer.createMaxFeeVector(builder, this.maxFee);
        const mosaicIdVector = LockFundsTransactionBuffer.createMosaicIdVector(builder, this.mosaicId);
        const mosaicAmountVector = LockFundsTransactionBuffer.createMosaicAmountVector(builder, this.mosaicAmount);
        const durationVector = LockFundsTransactionBuffer.createDurationVector(builder, this.duration);
        const byteHash = format_1.Convert.hexToUint8(this.hash);
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
=======
        const signatureVector = HashLockTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = HashLockTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = HashLockTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = HashLockTransactionBuffer.createFeeVector(builder, this.maxFee);
        const mosaicIdVector = HashLockTransactionBuffer.createMosaicIdVector(builder, this.mosaicId);
        const mosaicAmountVector = HashLockTransactionBuffer.createMosaicAmountVector(builder, this.mosaicAmount);
        const durationVector = HashLockTransactionBuffer.createDurationVector(builder, this.duration);
        const byteHash = format_1.Convert.hexToUint8(this.hash);
        const hashVector = HashLockTransactionBuffer.createHashVector(builder, byteHash);
        HashLockTransactionBuffer.startHashLockTransactionBuffer(builder);
        HashLockTransactionBuffer.addSize(builder, 176);
        HashLockTransactionBuffer.addSignature(builder, signatureVector);
        HashLockTransactionBuffer.addSigner(builder, signerVector);
        HashLockTransactionBuffer.addVersion(builder, this.version);
        HashLockTransactionBuffer.addType(builder, this.type);
        HashLockTransactionBuffer.addFee(builder, feeVector);
        HashLockTransactionBuffer.addDeadline(builder, deadlineVector);
        HashLockTransactionBuffer.addMosaicId(builder, mosaicIdVector);
        HashLockTransactionBuffer.addMosaicAmount(builder, mosaicAmountVector);
        HashLockTransactionBuffer.addDuration(builder, durationVector);
        HashLockTransactionBuffer.addHash(builder, hashVector);
        const codedHashLock = HashLockTransactionBuffer.endHashLockTransactionBuffer(builder);
>>>>>>> jwt
        builder.finish(codedHashLock);
        const bytes = builder.asUint8Array();
        return new HashLockTransaction(bytes);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=HashLockTransaction.js.map