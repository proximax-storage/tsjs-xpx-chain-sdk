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
 * @module transactions/AccountRestrictionsEntityTypeTransaction
 */
const TransactionType_1 = require("../../model/transaction/TransactionType");
const AccountPropertiesTransactionBuffer_1 = require("../buffers/AccountPropertiesTransactionBuffer");
const AccountRestrictionsEntityTypeModificationTransactionSchema_1 = require("../schemas/AccountRestrictionsEntityTypeModificationTransactionSchema");
const VerifiableTransaction_1 = require("./VerifiableTransaction");
const { AccountPropertiesTransactionBuffer, PropertyModificationBuffer, } = AccountPropertiesTransactionBuffer_1.default.Buffers;
const flatbuffers_1 = require("flatbuffers");
class AccountRestrictionsEntityTypeTransaction extends VerifiableTransaction_1.VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AccountRestrictionsEntityTypeModificationTransactionSchema_1.default);
    }
}
exports.default = AccountRestrictionsEntityTypeTransaction;
// tslint:disable-next-line:max-classes-per-file
class Builder {
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType_1.TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION;
    }
    addMaxFee(maxFee) {
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
    addRestrictionType(restrictionType) {
        this.restrictionType = restrictionType;
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
            const entityTypeModificationVector = PropertyModificationBuffer
                .createValueVector(builder, new Uint8Array([
                (modification.value & 0xff) >> 0,
                (modification.value & 0xff00) >> 8,
            ]));
            PropertyModificationBuffer.startPropertyModificationBuffer(builder);
            PropertyModificationBuffer.addModificationType(builder, modification.type);
            PropertyModificationBuffer.addValue(builder, entityTypeModificationVector);
            modificationsArray.push(PropertyModificationBuffer.endPropertyModificationBuffer(builder));
        });
        // Create vectors
        const signatureVector = AccountPropertiesTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AccountPropertiesTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AccountPropertiesTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = AccountPropertiesTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const modificationVector = AccountPropertiesTransactionBuffer
            .createModificationsVector(builder, modificationsArray);
        AccountPropertiesTransactionBuffer.startAccountPropertiesTransactionBuffer(builder);
        AccountPropertiesTransactionBuffer.addSize(builder, 122 + 2 + (3 * this.modifications.length));
        AccountPropertiesTransactionBuffer.addSignature(builder, signatureVector);
        AccountPropertiesTransactionBuffer.addSigner(builder, signerVector);
        AccountPropertiesTransactionBuffer.addVersion(builder, this.version);
        AccountPropertiesTransactionBuffer.addType(builder, this.type);
        AccountPropertiesTransactionBuffer.addMaxFee(builder, feeVector);
        AccountPropertiesTransactionBuffer.addDeadline(builder, deadlineVector);
        AccountPropertiesTransactionBuffer.addPropertyType(builder, this.restrictionType);
        AccountPropertiesTransactionBuffer.addModificationCount(builder, this.modifications.length);
        AccountPropertiesTransactionBuffer.addModifications(builder, modificationVector);
        // Calculate size
        const codedAccountRestrictionsAddress = AccountPropertiesTransactionBuffer
            .endAccountPropertiesTransactionBuffer(builder);
        builder.finish(codedAccountRestrictionsAddress);
        const bytes = builder.asUint8Array();
        return new AccountRestrictionsEntityTypeTransaction(bytes);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=AccountRestrictionsEntityTypeTransaction.js.map