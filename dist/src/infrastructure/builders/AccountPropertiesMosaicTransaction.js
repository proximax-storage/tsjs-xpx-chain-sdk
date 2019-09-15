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
 * @module transactions/AccountPropertiesMosaicTransaction
 */
const TransactionType_1 = require("../../model/transaction/TransactionType");
const AccountPropertiesMosaicTransactionBuffer_1 = require("../buffers/AccountPropertiesMosaicTransactionBuffer");
const AccountPropertiesMosaicModificationTransactionSchema_1 = require("../schemas/AccountPropertiesMosaicModificationTransactionSchema");
const VerifiableTransaction_1 = require("./VerifiableTransaction");
const { AccountPropertiesMosaicTransactionBuffer, PropertyMosaicModificationBuffer, } = AccountPropertiesMosaicTransactionBuffer_1.default.Buffers;
const flatbuffers_1 = require("flatbuffers");
class AccountPropertiesMosaicTransaction extends VerifiableTransaction_1.VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AccountPropertiesMosaicModificationTransactionSchema_1.default);
    }
}
exports.default = AccountPropertiesMosaicTransaction;
// tslint:disable-next-line:max-classes-per-file
class Builder {
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType_1.TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC;
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
            const addressModificationVector = PropertyMosaicModificationBuffer
                .createValueVector(builder, modification.value);
            PropertyMosaicModificationBuffer.startPropertyMosaicModificationBuffer(builder);
            PropertyMosaicModificationBuffer.addModificationType(builder, modification.type);
            PropertyMosaicModificationBuffer.addValue(builder, addressModificationVector);
            modificationsArray.push(PropertyMosaicModificationBuffer.endPropertyMosaicModificationBuffer(builder));
        });
        // Create vectors
        const signatureVector = AccountPropertiesMosaicTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AccountPropertiesMosaicTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AccountPropertiesMosaicTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = AccountPropertiesMosaicTransactionBuffer
            .createFeeVector(builder, this.maxFee);
        const modificationVector = AccountPropertiesMosaicTransactionBuffer
            .createModificationsVector(builder, modificationsArray);
        AccountPropertiesMosaicTransactionBuffer.startAccountPropertiesMosaicTransactionBuffer(builder);
        AccountPropertiesMosaicTransactionBuffer.addSize(builder, 122 + (9 * this.modifications.length));
        AccountPropertiesMosaicTransactionBuffer.addSignature(builder, signatureVector);
        AccountPropertiesMosaicTransactionBuffer.addSigner(builder, signerVector);
        AccountPropertiesMosaicTransactionBuffer.addVersion(builder, this.version);
        AccountPropertiesMosaicTransactionBuffer.addType(builder, this.type);
        AccountPropertiesMosaicTransactionBuffer.addFee(builder, feeVector);
        AccountPropertiesMosaicTransactionBuffer.addDeadline(builder, deadlineVector);
        AccountPropertiesMosaicTransactionBuffer.addPropertyType(builder, this.propertyType);
        AccountPropertiesMosaicTransactionBuffer.addModificationCount(builder, this.modifications.length);
        AccountPropertiesMosaicTransactionBuffer.addModifications(builder, modificationVector);
        // Calculate size
        const codedAccountPropertiesMosaic = AccountPropertiesMosaicTransactionBuffer.endAccountPropertiesMosaicTransactionBuffer(builder);
        builder.finish(codedAccountPropertiesMosaic);
        const bytes = builder.asUint8Array();
        return new AccountPropertiesMosaicTransaction(bytes);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=AccountPropertiesMosaicTransaction.js.map