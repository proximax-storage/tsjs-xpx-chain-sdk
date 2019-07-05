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
 * @module transactions/SecretProofTransaction
 */
const format_1 = require("../../core/format");
const TransactionType_1 = require("../../model/transaction/TransactionType");
const SecretProofTransactionBufferPackage = require("../buffers/SecretProofTransactionBuffer");
const SecretProofTransactionSchema_1 = require("../schemas/SecretProofTransactionSchema");
const VerifiableTransaction_1 = require("./VerifiableTransaction");
const flatbuffers_1 = require("flatbuffers");
const { SecretProofTransactionBuffer, } = SecretProofTransactionBufferPackage.default.Buffers;
class SecretProofTransaction extends VerifiableTransaction_1.VerifiableTransaction {
    constructor(bytes) {
        super(bytes, SecretProofTransactionSchema_1.default);
    }
}
exports.default = SecretProofTransaction;
// tslint:disable-next-line:max-classes-per-file
class Builder {
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType_1.TransactionType.SECRET_PROOF;
    }
    addFee(maxFee) {
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
    addHashAlgorithm(hashAlgorithm) {
        this.hashAlgorithm = hashAlgorithm;
        return this;
    }
    addSecret(secret) {
        this.secret = secret;
        return this;
    }
    addRecipient(recipient) {
        this.recipient = format_1.RawAddress.stringToAddress(recipient);
        return this;
    }
    addProof(proof) {
        this.proof = proof;
        return this;
    }
    build() {
        const builder = new flatbuffers_1.flatbuffers.Builder(1);
        // Create vectors
        const signatureVector = SecretProofTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = SecretProofTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = SecretProofTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = SecretProofTransactionBuffer.createFeeVector(builder, this.maxFee);
        const byteSecret = format_1.Convert.hexToUint8(64 > this.secret.length ? this.secret + '0'.repeat(64 - this.secret.length) : this.secret);
        const secretVector = SecretProofTransactionBuffer.createSecretVector(builder, byteSecret);
        const recipientVector = SecretProofTransactionBuffer.createRecipientVector(builder, this.recipient);
        const byteProof = format_1.Convert.hexToUint8(this.proof);
        const proofVector = SecretProofTransactionBuffer.createProofVector(builder, byteProof);
        SecretProofTransactionBuffer.startSecretProofTransactionBuffer(builder);
        SecretProofTransactionBuffer.addSize(builder, 180 + byteProof.length);
        SecretProofTransactionBuffer.addSignature(builder, signatureVector);
        SecretProofTransactionBuffer.addSigner(builder, signerVector);
        SecretProofTransactionBuffer.addVersion(builder, this.version);
        SecretProofTransactionBuffer.addType(builder, this.type);
        SecretProofTransactionBuffer.addFee(builder, feeVector);
        SecretProofTransactionBuffer.addDeadline(builder, deadlineVector);
        SecretProofTransactionBuffer.addHashAlgorithm(builder, this.hashAlgorithm);
        SecretProofTransactionBuffer.addSecret(builder, secretVector);
        SecretProofTransactionBuffer.addRecipient(builder, recipientVector);
        SecretProofTransactionBuffer.addProofSize(builder, byteProof.length);
        SecretProofTransactionBuffer.addProof(builder, proofVector);
        const codedSecretProof = SecretProofTransactionBuffer.endSecretProofTransactionBuffer(builder);
        builder.finish(codedSecretProof);
        const bytes = builder.asUint8Array();
        return new SecretProofTransaction(bytes);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=SecretProofTransaction.js.map