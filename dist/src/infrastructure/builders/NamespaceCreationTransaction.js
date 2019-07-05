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
 * @module transactions/NamespaceCreationTransaction
 */
const format_1 = require("../../core/format");
const TransactionType_1 = require("../../model/transaction/TransactionType");
const NamespaceCreationTransactionBufferPackage = require("../buffers/NamespaceCreationTransactionBuffer");
const NamespaceCreationTransactionSchema_1 = require("../schemas/NamespaceCreationTransactionSchema");
const VerifiableTransaction_1 = require("./VerifiableTransaction");
const { NamespaceCreationTransactionBuffer, } = NamespaceCreationTransactionBufferPackage.default.Buffers;
const flatbuffers_1 = require("flatbuffers");
class NamespaceCreationTransaction extends VerifiableTransaction_1.VerifiableTransaction {
    constructor(bytes) {
        super(bytes, NamespaceCreationTransactionSchema_1.default);
    }
}
exports.default = NamespaceCreationTransaction;
// tslint:disable-next-line:max-classes-per-file
class Builder {
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType_1.TransactionType.REGISTER_NAMESPACE;
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
    addNamespaceType(namespaceType) {
        this.namespaceType = namespaceType;
        return this;
    }
    addDuration(duration) {
        this.duration = duration;
        return this;
    }
    addParentId(parentId) {
        this.parentId = parentId;
        return this;
    }
    addNamespaceId(namespaceId) {
        this.namespaceId = namespaceId;
        return this;
    }
    addNamespaceName(namespaceName) {
        this.namespaceName = namespaceName;
        return this;
    }
    build() {
        const builder = new flatbuffers_1.flatbuffers.Builder(1);
        const namespaceNameLength = format_1.Convert.utf8ToHex(this.namespaceName).length / 2;
        // create vectors
        const signatureVector = NamespaceCreationTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = NamespaceCreationTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = NamespaceCreationTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = NamespaceCreationTransactionBuffer
            .createFeeVector(builder, this.maxFee);
        const parentIdVector = 1 === this.namespaceType ? this.parentId : this.duration;
        const durationParentIdVector = NamespaceCreationTransactionBuffer
            .createDurationParentIdVector(builder, parentIdVector);
        const namespaceIdVector = NamespaceCreationTransactionBuffer
            .createNamespaceIdVector(builder, this.namespaceId);
        const name = builder.createString(this.namespaceName);
        NamespaceCreationTransactionBuffer.startNamespaceCreationTransactionBuffer(builder);
        NamespaceCreationTransactionBuffer.addSize(builder, 138 + namespaceNameLength);
        NamespaceCreationTransactionBuffer.addSignature(builder, signatureVector);
        NamespaceCreationTransactionBuffer.addSigner(builder, signerVector);
        NamespaceCreationTransactionBuffer.addVersion(builder, this.version);
        NamespaceCreationTransactionBuffer.addType(builder, this.type);
        NamespaceCreationTransactionBuffer.addFee(builder, feeVector);
        NamespaceCreationTransactionBuffer.addDeadline(builder, deadlineVector);
        NamespaceCreationTransactionBuffer.addNamespaceType(builder, this.namespaceType);
        NamespaceCreationTransactionBuffer.addDurationParentId(builder, durationParentIdVector);
        NamespaceCreationTransactionBuffer.addNamespaceId(builder, namespaceIdVector);
        NamespaceCreationTransactionBuffer.addNamespaceNameSize(builder, namespaceNameLength);
        NamespaceCreationTransactionBuffer.addNamespaceName(builder, name);
        // Calculate size
        const codedNamespace = NamespaceCreationTransactionBuffer.endNamespaceCreationTransactionBuffer(builder);
        builder.finish(codedNamespace);
        const bytes = builder.asUint8Array();
        return new NamespaceCreationTransaction(bytes);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=NamespaceCreationTransaction.js.map