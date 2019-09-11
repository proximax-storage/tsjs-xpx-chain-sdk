"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module transactions/ChainConfigTransaction
 */
const TransactionType_1 = require("../../model/transaction/TransactionType");
const ChainConfigTransactionBuffer_1 = require("../buffers/ChainConfigTransactionBuffer");
const ChainConfigTransactionSchema_1 = require("../schemas/ChainConfigTransactionSchema");
const VerifiableTransaction_1 = require("./VerifiableTransaction");
const { CatapultConfigTransactionBuffer, } = ChainConfigTransactionBuffer_1.default.Buffers;
const flatbuffers_1 = require("flatbuffers");
class ChainConfigTransaction extends VerifiableTransaction_1.VerifiableTransaction {
    constructor(bytes) {
        super(bytes, ChainConfigTransactionSchema_1.default);
    }
}
exports.default = ChainConfigTransaction;
class Builder {
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType_1.TransactionType.CHAIN_CONFIGURE;
    }
    addMaxFee(maxFee) {
        this.maxFee = maxFee;
        return this;
    }
    addApplyHeightDelta(applyHeightDelta) {
        this.applyHeightDelta = applyHeightDelta;
        return this;
    }
    addBlockChainConfig(blockChainConfig) {
        this.blockChainConfig = blockChainConfig.split('').map(n => n.charCodeAt(0));
        return this;
    }
    addSupportedEntityVersions(supportedEntityVersions) {
        this.supportedEntityVersions = supportedEntityVersions.split('').map(n => n.charCodeAt(0));
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
    build() {
        const builder = new flatbuffers_1.flatbuffers.Builder(1);
        const signatureVector = CatapultConfigTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = CatapultConfigTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = CatapultConfigTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = CatapultConfigTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const applyHeightDeltaVector = CatapultConfigTransactionBuffer
            .createApplyHeightDeltaVector(builder, this.applyHeightDelta);
        const blockChainConfigVector = CatapultConfigTransactionBuffer
            .createBlockChainConfigVector(builder, this.blockChainConfig);
        const supportedEntityVersionsVector = CatapultConfigTransactionBuffer
            .createSupportedEntityVersionsVector(builder, this.supportedEntityVersions);
        CatapultConfigTransactionBuffer.startCatapultConfigTransactionBuffer(builder);
        CatapultConfigTransactionBuffer.addSize(builder, 122 + 8 + 2 + 2 + this.blockChainConfig.length + this.supportedEntityVersions.length);
        CatapultConfigTransactionBuffer.addSignature(builder, signatureVector);
        CatapultConfigTransactionBuffer.addSigner(builder, signerVector);
        CatapultConfigTransactionBuffer.addVersion(builder, this.version);
        CatapultConfigTransactionBuffer.addType(builder, this.type);
        CatapultConfigTransactionBuffer.addMaxFee(builder, feeVector);
        CatapultConfigTransactionBuffer.addDeadline(builder, deadlineVector);
        CatapultConfigTransactionBuffer.addApplyHeightDelta(builder, applyHeightDeltaVector);
        CatapultConfigTransactionBuffer.addBlockChainConfigSize(builder, this.blockChainConfig.length);
        CatapultConfigTransactionBuffer.addSupportedEntityVersionsSize(builder, this.supportedEntityVersions.length);
        CatapultConfigTransactionBuffer.addBlockChainConfig(builder, blockChainConfigVector);
        CatapultConfigTransactionBuffer.addSupportedEntityVersions(builder, supportedEntityVersionsVector);
        // Calculate size
        const codedChainConfig = CatapultConfigTransactionBuffer.endCatapultConfigTransactionBuffer(builder);
        builder.finish(codedChainConfig);
        const bytes = builder.asUint8Array();
        return new ChainConfigTransaction(bytes);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=ChainConfigTransaction.js.map