"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const TransactionType_1 = require("../../model/transaction/TransactionType");
const MosaicAliasTransactionBuffer_1 = require("../buffers/MosaicAliasTransactionBuffer");
const MosaicAliasTransactionSchema_1 = require("../schemas/MosaicAliasTransactionSchema");
const VerifiableTransaction_1 = require("./VerifiableTransaction");
const { MosaicAliasTransactionBuffer, } = MosaicAliasTransactionBuffer_1.default.Buffers;
const flatbuffers_1 = require("flatbuffers");
/**
 * @module transactions/MosaicAliasTransaction
 */
class MosaicAliasTransaction extends VerifiableTransaction_1.VerifiableTransaction {
    constructor(bytes) {
        super(bytes, MosaicAliasTransactionSchema_1.default);
    }
}
exports.default = MosaicAliasTransaction;
// tslint:disable-next-line:max-classes-per-file
class Builder {
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType_1.TransactionType.MOSAIC_ALIAS;
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
    addActionType(actionType) {
        this.actionType = actionType;
        return this;
    }
    addNamespaceId(namespaceId) {
        this.namespaceId = namespaceId;
        return this;
    }
    addMosaicId(mosaicId) {
        this.mosaicId = mosaicId;
        return this;
    }
    build() {
        const builder = new flatbuffers_1.flatbuffers.Builder(1);
        // Create vectors
        const signatureVector = MosaicAliasTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = MosaicAliasTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = MosaicAliasTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = MosaicAliasTransactionBuffer
            .createFeeVector(builder, this.maxFee);
        const namespaceIdVector = MosaicAliasTransactionBuffer
            .createNamespaceIdVector(builder, this.namespaceId);
        const mosaicIdVector = MosaicAliasTransactionBuffer
            .createMosaicIdVector(builder, this.mosaicId);
        MosaicAliasTransactionBuffer.startMosaicAliasTransactionBuffer(builder);
        MosaicAliasTransactionBuffer.addSize(builder, 137);
        MosaicAliasTransactionBuffer.addSignature(builder, signatureVector);
        MosaicAliasTransactionBuffer.addSigner(builder, signerVector);
        MosaicAliasTransactionBuffer.addVersion(builder, this.version);
        MosaicAliasTransactionBuffer.addType(builder, this.type);
        MosaicAliasTransactionBuffer.addFee(builder, feeVector);
        MosaicAliasTransactionBuffer.addDeadline(builder, deadlineVector);
        MosaicAliasTransactionBuffer.addActionType(builder, this.actionType);
        MosaicAliasTransactionBuffer.addNamespaceId(builder, namespaceIdVector);
        MosaicAliasTransactionBuffer.addMosaicId(builder, mosaicIdVector);
        // Calculate size
        const codedMosaicChangeSupply = MosaicAliasTransactionBuffer.endMosaicAliasTransactionBuffer(builder);
        builder.finish(codedMosaicChangeSupply);
        const bytes = builder.asUint8Array();
        return new MosaicAliasTransaction(bytes);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=MosaicAliasTransaction.js.map