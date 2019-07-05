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
 * @module transactions/AccountLinkTransaction
 */
const format_1 = require("../../core/format");
const TransactionType_1 = require("../../model/transaction/TransactionType");
const AccountLinkTransactionBuffer_1 = require("../buffers/AccountLinkTransactionBuffer");
const AccountLinkTransactionSchema_1 = require("../schemas/AccountLinkTransactionSchema");
const VerifiableTransaction_1 = require("./VerifiableTransaction");
const flatbuffers_1 = require("flatbuffers");
const { AccountLinkTransactionBuffer, } = AccountLinkTransactionBuffer_1.default.Buffers;
class AccountLinkTransaction extends VerifiableTransaction_1.VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AccountLinkTransactionSchema_1.default);
    }
}
exports.AccountLinkTransaction = AccountLinkTransaction;
// tslint:disable-next-line:max-classes-per-file
class Builder {
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType_1.TransactionType.LINK_ACCOUNT;
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
    addRemoteAccountKey(remoteAccountKey) {
        this.remoteAccountKey = format_1.Convert.hexToUint8(remoteAccountKey);
        return this;
    }
    addLinkAction(linkAction) {
        this.linkAction = linkAction;
        return this;
    }
    build() {
        const builder = new flatbuffers_1.flatbuffers.Builder(1);
        // Create vectors
        const signatureVector = AccountLinkTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AccountLinkTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AccountLinkTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = AccountLinkTransactionBuffer.createFeeVector(builder, this.maxFee);
        const remoteAccountKeyVector = AccountLinkTransactionBuffer.createRemoteAccountKeyVector(builder, this.remoteAccountKey);
        AccountLinkTransactionBuffer.startAccountLinkTransactionBuffer(builder);
        AccountLinkTransactionBuffer.addSize(builder, 153);
        AccountLinkTransactionBuffer.addSignature(builder, signatureVector);
        AccountLinkTransactionBuffer.addSigner(builder, signerVector);
        AccountLinkTransactionBuffer.addVersion(builder, this.version);
        AccountLinkTransactionBuffer.addType(builder, this.type);
        AccountLinkTransactionBuffer.addFee(builder, feeVector);
        AccountLinkTransactionBuffer.addDeadline(builder, deadlineVector);
        AccountLinkTransactionBuffer.addRemoteAccountKey(builder, remoteAccountKeyVector);
        AccountLinkTransactionBuffer.addLinkAction(builder, this.linkAction);
        // Calculate size
        const codedTransfer = AccountLinkTransactionBuffer.endAccountLinkTransactionBuffer(builder);
        builder.finish(codedTransfer);
        const bytes = builder.asUint8Array();
        return new AccountLinkTransaction(bytes);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=AccountLinkTransaction.js.map