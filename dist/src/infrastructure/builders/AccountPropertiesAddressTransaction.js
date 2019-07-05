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
 * @module transactions/AccountPropertiesAddressTransaction
 */
const format_1 = require("../../core/format");
const TransactionType_1 = require("../../model/transaction/TransactionType");
const AccountPropertiesAddressTransactionBuffer_1 = require("../buffers/AccountPropertiesAddressTransactionBuffer");
const AccountPropertiesAddressModificationTransactionSchema_1 = require("../schemas/AccountPropertiesAddressModificationTransactionSchema");
const VerifiableTransaction_1 = require("./VerifiableTransaction");
const { AccountPropertiesAddressTransactionBuffer, PropertyAddressModificationBuffer, } = AccountPropertiesAddressTransactionBuffer_1.default.Buffers;
const flatbuffers_1 = require("flatbuffers");
class AccountPropertiesAddressTransaction extends VerifiableTransaction_1.VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AccountPropertiesAddressModificationTransactionSchema_1.default);
    }
}
exports.default = AccountPropertiesAddressTransaction;
// tslint:disable-next-line:max-classes-per-file
class Builder {
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType_1.TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS;
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
    addPropertyType(propertyType) {
        this.propertyType = propertyType;
        return this;
    }
    addModifications(modifications) {
        this.modifications = modifications;
        return this;
    }
    build() {
        const builder = new flatbuffers_1.flatbuffers.Builder(1);
        // Create modifications
        const modificationsArray = [];
        this.modifications.forEach((modification) => {
            const addressModificationVector = PropertyAddressModificationBuffer
                .createValueVector(builder, format_1.RawAddress.stringToAddress(modification.value));
            PropertyAddressModificationBuffer.startPropertyAddressModificationBuffer(builder);
            PropertyAddressModificationBuffer.addModificationType(builder, modification.type);
            PropertyAddressModificationBuffer.addValue(builder, addressModificationVector);
            modificationsArray.push(PropertyAddressModificationBuffer.endPropertyAddressModificationBuffer(builder));
        });
        // Create vectors
        const signatureVector = AccountPropertiesAddressTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AccountPropertiesAddressTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AccountPropertiesAddressTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = AccountPropertiesAddressTransactionBuffer
            .createFeeVector(builder, this.maxFee);
        const modificationVector = AccountPropertiesAddressTransactionBuffer
            .createModificationsVector(builder, modificationsArray);
        AccountPropertiesAddressTransactionBuffer.startAccountPropertiesAddressTransactionBuffer(builder);
        AccountPropertiesAddressTransactionBuffer.addSize(builder, 122 + (26 * this.modifications.length));
        AccountPropertiesAddressTransactionBuffer.addSignature(builder, signatureVector);
        AccountPropertiesAddressTransactionBuffer.addSigner(builder, signerVector);
        AccountPropertiesAddressTransactionBuffer.addVersion(builder, this.version);
        AccountPropertiesAddressTransactionBuffer.addType(builder, this.type);
        AccountPropertiesAddressTransactionBuffer.addFee(builder, feeVector);
        AccountPropertiesAddressTransactionBuffer.addDeadline(builder, deadlineVector);
        AccountPropertiesAddressTransactionBuffer.addPropertyType(builder, this.propertyType);
        AccountPropertiesAddressTransactionBuffer.addModificationCount(builder, this.modifications.length);
        AccountPropertiesAddressTransactionBuffer.addModifications(builder, modificationVector);
        // Calculate size
        const codedAccountPropertiesAddress = AccountPropertiesAddressTransactionBuffer.endAccountPropertiesAddressTransactionBuffer(builder);
        builder.finish(codedAccountPropertiesAddress);
        const bytes = builder.asUint8Array();
        return new AccountPropertiesAddressTransaction(bytes);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=AccountPropertiesAddressTransaction.js.map