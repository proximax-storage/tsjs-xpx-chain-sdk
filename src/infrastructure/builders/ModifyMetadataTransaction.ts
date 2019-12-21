// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

/**
 * @module transactions/ModifyMetadataTransaction
 */
import ModifyMetadataTransactionBufferPackage from '../buffers/ModifyMetadataTransactionBuffer';
import {Convert as convert, RawAddress as address} from '../../core/format';
import { VerifiableTransaction } from './VerifiableTransaction';
import ModifyMetadataTransactionSchema from '../schemas/ModifyMetadataTransactionSchema';

const { ModifyMetadataTransactionBuffer, MetadataModificationBuffer } = ModifyMetadataTransactionBufferPackage.Buffers;

const { flatbuffers } = require('flatbuffers');

export default class ModifyMetadataTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, ModifyMetadataTransactionSchema);
    }
}

export class Builder {
    size: any;
    fee: any;
    version: any;
    type: any;
    deadline: any;
    metadataType: any;
    metadataId: any;
    modifications: any;

    constructor() {
        this.fee = [0, 0];
        this.version = 1;
    }

    addSize(size) {
        this.size = size;
        return this;
    }

    addMaxFee(fee) {
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
        const modifications:any[] = [];
        this.modifications.forEach(modification => {
            const modificationKey = modification.key ? convert.hexToUint8(convert.utf8ToHex(modification.key)) : [];
            const modificationValue = modification.value ? convert.hexToUint8(convert.utf8ToHex(modification.value)) : [];
            // check zero value size here (see go for details)
            const valueSizeOffset = MetadataModificationBuffer.createValueSizeVector(builder, [modificationValue.length & 0xff, (modificationValue.length & 0xff00) >> 8]);
            const keyOffset = MetadataModificationBuffer.createKeyVector(builder, modificationKey);
            const valueOffset = MetadataModificationBuffer.createValueVector(builder, modificationValue);
            const size = 4 + 1 + 1 + 2 + modificationKey.length + modificationValue.length
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
            metadataIdDecoded = address.stringToAddress(this.metadataId);
        } else if (this.metadataType === 2 || this.metadataType === 3) {
            metadataIdDecoded = convert.hexToUint8(this.metadataId);
            metadataIdDecoded.reverse();
        } else {
            throw new Error("Unhandled metadataType during ModifyMetadataTransaction serialization");
        }

        const metadataIdVector = ModifyMetadataTransactionBuffer.createMetadataIdVector(builder, metadataIdDecoded);

        ModifyMetadataTransactionBuffer.startModifyMetadataTransactionBuffer(builder);
        ModifyMetadataTransactionBuffer.addSize(builder, this.size);
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

        return new ModifyMetadataTransaction(bytes);
    }
}
