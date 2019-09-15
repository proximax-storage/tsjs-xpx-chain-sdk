"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module transactions/ModifyMetadataTransaction
 */
const ModifyMetadataTransactionBuffer_1 = require("../buffers/ModifyMetadataTransactionBuffer");
const format_1 = require("../../core/format");
const VerifiableTransaction_1 = require("./VerifiableTransaction");
const ModifyMetadataTransactionSchema_1 = require("../schemas/ModifyMetadataTransactionSchema");
const { ModifyMetadataTransactionBuffer, MetadataModificationBuffer } = ModifyMetadataTransactionBuffer_1.default.Buffers;
const { flatbuffers } = require('flatbuffers');
class ModifyMetadataTransaction extends VerifiableTransaction_1.VerifiableTransaction {
    constructor(bytes) {
        super(bytes, ModifyMetadataTransactionSchema_1.default);
    }
}
exports.default = ModifyMetadataTransaction;
class Builder {
    constructor() {
        this.fee = [0, 0];
        this.version = 1;
    }
<<<<<<< HEAD
    addMaxFee(fee) {
=======
    addFee(fee) {
>>>>>>> jwt
        this.fee = fee;
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
    addMetadataType(metadataType) {
        this.metadataType = metadataType;
        return this;
    }
    addMetadataId(metadataId) {
        this.metadataId = metadataId;
        return this;
    }
    addModifications(modifications) {
        this.modifications = modifications;
        return this;
    }
    build() {
        const builder = new flatbuffers.Builder(1);
        // Constants
        // Create modifications
        const modifications = [];
        let modificationsSumSize = 0;
        this.modifications.forEach(modification => {
            const modificationKey = modification.key ? format_1.Convert.hexToUint8(format_1.Convert.utf8ToHex(modification.key)) : [];
            const modificationValue = modification.value ? format_1.Convert.hexToUint8(format_1.Convert.utf8ToHex(modification.value)) : [];
            // check zero value size here (see go for details)
            const valueSizeOffset = MetadataModificationBuffer.createValueSizeVector(builder, [modificationValue.length & 0xff, (modificationValue.length & 0xff00) >> 8]);
            const keyOffset = MetadataModificationBuffer.createKeyVector(builder, modificationKey);
            const valueOffset = MetadataModificationBuffer.createValueVector(builder, modificationValue);
            const size = 4 + 1 + 1 + 2 + modificationKey.length + modificationValue.length;
            modificationsSumSize = modificationsSumSize + size;
            MetadataModificationBuffer.startMetadataModificationBuffer(builder);
            MetadataModificationBuffer.addSize(builder, size);
            MetadataModificationBuffer.addModificationType(builder, modification.type);
            MetadataModificationBuffer.addKeySize(builder, modificationKey.length);
            MetadataModificationBuffer.addValueSize(builder, valueSizeOffset);
            MetadataModificationBuffer.addKey(builder, keyOffset);
            MetadataModificationBuffer.addValue(builder, valueOffset);
            modifications.push(MetadataModificationBuffer.endMetadataModificationBuffer(builder));
        });
        // Create vectors
        const signatureVector = ModifyMetadataTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = ModifyMetadataTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = ModifyMetadataTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = ModifyMetadataTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const modificationsVector = ModifyMetadataTransactionBuffer.createModificationsVector(builder, modifications);
        let metadataIdDecoded;
        if (this.metadataType === 1) {
            metadataIdDecoded = format_1.RawAddress.stringToAddress(this.metadataId);
        }
        else if (this.metadataType === 2 || this.metadataType === 3) {
            metadataIdDecoded = format_1.Convert.hexToUint8(this.metadataId);
            metadataIdDecoded.reverse();
        }
        else {
            throw new Error("Unhandled metadataType during ModifyMetadataTransaction serialization");
        }
        // TODO: different types/lengths
        const metadataIdVector = ModifyMetadataTransactionBuffer.createMetadataIdVector(builder, metadataIdDecoded);
<<<<<<< HEAD
        const size = 122 + 1 + metadataIdDecoded.length + modificationsSumSize;
=======
        const size = 120 + 1 + metadataIdDecoded.length + modificationsSumSize;
>>>>>>> jwt
        ModifyMetadataTransactionBuffer.startModifyMetadataTransactionBuffer(builder);
        ModifyMetadataTransactionBuffer.addSize(builder, size);
        ModifyMetadataTransactionBuffer.addSignature(builder, signatureVector);
        ModifyMetadataTransactionBuffer.addSigner(builder, signerVector);
        ModifyMetadataTransactionBuffer.addVersion(builder, this.version);
        ModifyMetadataTransactionBuffer.addType(builder, this.type);
        ModifyMetadataTransactionBuffer.addMaxFee(builder, feeVector);
        ModifyMetadataTransactionBuffer.addDeadline(builder, deadlineVector);
        ModifyMetadataTransactionBuffer.addMetadataType(builder, this.metadataType);
        ModifyMetadataTransactionBuffer.addMetadataId(builder, metadataIdVector);
        ModifyMetadataTransactionBuffer.addModifications(builder, modificationsVector);
        // Calculate size
        const codedTransfer = ModifyMetadataTransactionBuffer.endModifyMetadataTransactionBuffer(builder);
        builder.finish(codedTransfer);
        const bytes = builder.asUint8Array();
        if (bytes.length !== size) {
            // throw new Error("Declared size differs from actual bytes.length during ModifyMetadataTransaction serialization")
        }
        return new ModifyMetadataTransaction(bytes);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=ModifyMetadataTransaction.js.map