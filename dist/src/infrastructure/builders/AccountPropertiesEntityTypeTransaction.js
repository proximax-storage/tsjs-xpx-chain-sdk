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
 * @module transactions/AccountPropertiesEntityTypeTransaction
 */
const TransactionType_1 = require("../../model/transaction/TransactionType");
const AccountPropertiesEntityTypeTransactionBuffer_1 = require("../buffers/AccountPropertiesEntityTypeTransactionBuffer");
const AccountPropertiesEntityTypeModificationTransactionSchema_1 = require("../schemas/AccountPropertiesEntityTypeModificationTransactionSchema");
const VerifiableTransaction_1 = require("./VerifiableTransaction");
const { AccountPropertiesEntityTypeTransactionBuffer, PropertyEntityTypeModificationBuffer, } = AccountPropertiesEntityTypeTransactionBuffer_1.default.Buffers;
const flatbuffers_1 = require("flatbuffers");
class AccountPropertiesEntityTypeTransaction extends VerifiableTransaction_1.VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AccountPropertiesEntityTypeModificationTransactionSchema_1.default);
    }
}
exports.default = AccountPropertiesEntityTypeTransaction;
// tslint:disable-next-line:max-classes-per-file
class Builder {
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType_1.TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE;
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
            PropertyEntityTypeModificationBuffer.startPropertyEntityTypeModificationBuffer(builder);
            PropertyEntityTypeModificationBuffer.addModificationType(builder, modification.type);
            PropertyEntityTypeModificationBuffer.addValue(builder, modification.value);
            modificationsArray.push(PropertyEntityTypeModificationBuffer.endPropertyEntityTypeModificationBuffer(builder));
        });
        // Create vectors
        const signatureVector = AccountPropertiesEntityTypeTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AccountPropertiesEntityTypeTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AccountPropertiesEntityTypeTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = AccountPropertiesEntityTypeTransactionBuffer
            .createFeeVector(builder, this.maxFee);
        const modificationVector = AccountPropertiesEntityTypeTransactionBuffer
            .createModificationsVector(builder, modificationsArray);
        AccountPropertiesEntityTypeTransactionBuffer.startAccountPropertiesEntityTypeTransactionBuffer(builder);
        AccountPropertiesEntityTypeTransactionBuffer.addSize(builder, 122 + (3 * this.modifications.length));
        AccountPropertiesEntityTypeTransactionBuffer.addSignature(builder, signatureVector);
        AccountPropertiesEntityTypeTransactionBuffer.addSigner(builder, signerVector);
        AccountPropertiesEntityTypeTransactionBuffer.addVersion(builder, this.version);
        AccountPropertiesEntityTypeTransactionBuffer.addType(builder, this.type);
        AccountPropertiesEntityTypeTransactionBuffer.addFee(builder, feeVector);
        AccountPropertiesEntityTypeTransactionBuffer.addDeadline(builder, deadlineVector);
        AccountPropertiesEntityTypeTransactionBuffer.addPropertyType(builder, this.propertyType);
        AccountPropertiesEntityTypeTransactionBuffer.addModificationCount(builder, this.modifications.length);
        AccountPropertiesEntityTypeTransactionBuffer.addModifications(builder, modificationVector);
        // Calculate size
        const codedAccountPropertiesAddress = AccountPropertiesEntityTypeTransactionBuffer
            .endAccountPropertiesEntityTypeTransactionBuffer(builder);
        builder.finish(codedAccountPropertiesAddress);
        const bytes = builder.asUint8Array();
        return new AccountPropertiesEntityTypeTransaction(bytes);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=AccountPropertiesEntityTypeTransaction.js.map