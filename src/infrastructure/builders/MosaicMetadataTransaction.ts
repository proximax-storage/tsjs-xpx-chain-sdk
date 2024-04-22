// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

/**
 * @module transactions/MosaicMetadataTransaction
 */
import {Convert as convert} from '../../core/format';
import { VerifiableTransaction } from './VerifiableTransaction';
import MosaicMetadataTransactionSchema from '../schemas/MosaicMetadataTransactionSchema';
import {MetadataTransactionBuffer} from '../buffers/MetadataTransactionBuffer';

import * as flatbuffers from 'flatbuffers';

export default class MosaicMetadataTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, MosaicMetadataTransactionSchema);
    }
}

export class Builder {
    size: number;
    fee: number[];
    version: number;
    type: number;
    deadline: number[];
    targetPublicKey: string;
    scopedMetadataKey: number[];
    targetMosaicId: number[];
    valueSizeDelta: number;
    value: string | null;
    oldValue: string | null;
    valueSize: number;
    valueDifferences: Uint8Array;

    constructor() {
        this.fee = [0, 0];
    }

    addSize(size: number) {
        this.size = size;
        return this;
    }

    addMaxFee(fee: number[]) {
        this.fee = fee;
        return this;
    }

    addVersion(version: number) {
        this.version = version;
        return this;
    }

    addType(type: number) {
        this.type = type;
        return this;
    }

    addDeadline(deadline: number[]) {
        this.deadline = deadline;
        return this;
    }

    addTargetPublicKey(targetPublicKey: string) {
        this.targetPublicKey = targetPublicKey;
        return this;
    }

    addScopedMetadataKey(scopedMetadataKey: number[]) {
        this.scopedMetadataKey = scopedMetadataKey;
        return this;
    }

    addTargetMosaicId(targetMosaicId: number[]) {
        this.targetMosaicId = targetMosaicId;
        return this;
    }

    addValueSizeDelta(valueSizeDelta: number) {
        this.valueSizeDelta = valueSizeDelta;
        return this;
    }

    addValue(value: string | null) {
        this.value = value;
        return this;
    }

    addOldValue(oldValue: string | null) {
        this.oldValue = oldValue;
        return this;
    }

    addValueSize(valueSize: number) {
        this.valueSize = valueSize;
        return this;
    }

    addValueDifferences(valueDifferences: Uint8Array) {
        this.valueDifferences = valueDifferences;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        const targetIdUint32 = new Uint32Array(this.targetMosaicId);
        const valueSizeDeltaUint8Array = new Uint8Array([this.valueSizeDelta, this.valueSizeDelta >> 8]);
        const valueSizeUint8Array = new Uint8Array([this.valueSize, this.valueSize >> 8]);

        // Create vectors
        const signatureVector = MetadataTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = MetadataTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = MetadataTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = MetadataTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const targetKeyVector = MetadataTransactionBuffer.createTargetKeyVector(builder, convert.hexToUint8(this.targetPublicKey));
        const scopedMetadataKeyVector = MetadataTransactionBuffer.createScopedMetadataKeyVector(builder, this.scopedMetadataKey);
        const targetIdVector = MetadataTransactionBuffer.createTargetIdVector(builder, targetIdUint32);
        const valueSizeDeltaVector = MetadataTransactionBuffer.createValueSizeDeltaVector(builder, valueSizeDeltaUint8Array);
        const valueSizeVector = MetadataTransactionBuffer.createValueSizeDeltaVector(builder, valueSizeUint8Array);
        const valueVector = MetadataTransactionBuffer.createValueVector(builder, this.valueDifferences);
        
        MetadataTransactionBuffer.startMetadataTransactionBuffer(builder);
        MetadataTransactionBuffer.addSize(builder, this.size);
        MetadataTransactionBuffer.addSignature(builder, signatureVector);
        MetadataTransactionBuffer.addSigner(builder, signerVector);
        MetadataTransactionBuffer.addVersion(builder, this.version);
        MetadataTransactionBuffer.addType(builder, this.type);
        MetadataTransactionBuffer.addMaxFee(builder, feeVector);
        MetadataTransactionBuffer.addDeadline(builder, deadlineVector);
        MetadataTransactionBuffer.addTargetKey(builder, targetKeyVector);
        MetadataTransactionBuffer.addScopedMetadataKey(builder, scopedMetadataKeyVector);
        MetadataTransactionBuffer.addTargetId(builder, targetIdVector);
        MetadataTransactionBuffer.addValueSizeDelta(builder, valueSizeDeltaVector);
        MetadataTransactionBuffer.addValueSize(builder, valueSizeVector);
        MetadataTransactionBuffer.addValue(builder, valueVector);

        const codedTransfer = MetadataTransactionBuffer.endMetadataTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new MosaicMetadataTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
