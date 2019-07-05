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
const format_1 = require("../../core/format");
const TransactionType_1 = require("../../model/transaction/TransactionType");
const AddressAliasTransactionBuffer_1 = require("../buffers/AddressAliasTransactionBuffer");
const AddressAliasTransactionSchema_1 = require("../schemas/AddressAliasTransactionSchema");
const VerifiableTransaction_1 = require("./VerifiableTransaction");
const { AddressAliasTransactionBuffer, } = AddressAliasTransactionBuffer_1.default.Buffers;
const flatbuffers_1 = require("flatbuffers");
/**
 * @module transactions/AddressAliasTransaction
 */
class AddressAliasTransaction extends VerifiableTransaction_1.VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AddressAliasTransactionSchema_1.default);
    }
}
exports.AddressAliasTransaction = AddressAliasTransaction;
// tslint:disable-next-line:max-classes-per-file
class Builder {
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType_1.TransactionType.ADDRESS_ALIAS;
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
    addAddress(address) {
        this.address = format_1.RawAddress.stringToAddress(address);
        return this;
    }
    build() {
        const builder = new flatbuffers_1.flatbuffers.Builder(1);
        // Create vectors
        const signatureVector = AddressAliasTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AddressAliasTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AddressAliasTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = AddressAliasTransactionBuffer
            .createFeeVector(builder, this.maxFee);
        const namespaceIdVector = AddressAliasTransactionBuffer
            .createNamespaceIdVector(builder, this.namespaceId);
        const addressVector = AddressAliasTransactionBuffer
            .createAddressVector(builder, this.address);
        AddressAliasTransactionBuffer.startAddressAliasTransactionBuffer(builder);
        AddressAliasTransactionBuffer.addSize(builder, 154);
        AddressAliasTransactionBuffer.addSignature(builder, signatureVector);
        AddressAliasTransactionBuffer.addSigner(builder, signerVector);
        AddressAliasTransactionBuffer.addVersion(builder, this.version);
        AddressAliasTransactionBuffer.addType(builder, this.type);
        AddressAliasTransactionBuffer.addFee(builder, feeVector);
        AddressAliasTransactionBuffer.addDeadline(builder, deadlineVector);
        AddressAliasTransactionBuffer.addActionType(builder, this.actionType);
        AddressAliasTransactionBuffer.addNamespaceId(builder, namespaceIdVector);
        AddressAliasTransactionBuffer.addAddress(builder, addressVector);
        // Calculate size
        const codedMosaicChangeSupply = AddressAliasTransactionBuffer.endAddressAliasTransactionBuffer(builder);
        builder.finish(codedMosaicChangeSupply);
        const bytes = builder.asUint8Array();
        return new AddressAliasTransaction(bytes);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=AddressAliasTransaction.js.map