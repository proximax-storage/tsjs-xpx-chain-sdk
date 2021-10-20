// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

/**
 * @module transactions/AccountMetadataTransaction
 */
import {Convert as convert} from '../../core/format';
import { VerifiableTransaction } from './VerifiableTransaction';
import AccountMetadataTransactionSchema from '../schemas/AccountMetadataTransactionSchema';
import {AccountMetadataTransactionBuffer} from '../buffers/AccountMetadataTransactionBuffer';

const { flatbuffers } = require('flatbuffers');

export default class AccountMetadataTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AccountMetadataTransactionSchema);
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
    valueSizeDelta: number;
    value: string | null;
    oldValue: string | null;
    valueSize: number;
    valueDifferences: Uint8Array;

    constructor() {
        this.fee = [0, 0];
        this.version = 1;
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

        // Create vectors
        const signatureVector = AccountMetadataTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AccountMetadataTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AccountMetadataTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = AccountMetadataTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const targetKeyVector = AccountMetadataTransactionBuffer.createTargetKeyVector(builder, convert.hexToUint8(this.targetPublicKey));
        const scopedMetadataKeyVector = AccountMetadataTransactionBuffer.createScopedMetadataKeyVector(builder, this.scopedMetadataKey);
        const valueVector = AccountMetadataTransactionBuffer.createValueVector(builder, this.valueDifferences);

        AccountMetadataTransactionBuffer.startAccountMetadataTransactionBuffer(builder);
        AccountMetadataTransactionBuffer.addSize(builder, this.size);
        AccountMetadataTransactionBuffer.addSignature(builder, signatureVector);
        AccountMetadataTransactionBuffer.addSigner(builder, signerVector);
        AccountMetadataTransactionBuffer.addVersion(builder, this.version);
        AccountMetadataTransactionBuffer.addType(builder, this.type);
        AccountMetadataTransactionBuffer.addMaxFee(builder, feeVector);
        AccountMetadataTransactionBuffer.addDeadline(builder, deadlineVector);
        AccountMetadataTransactionBuffer.addTargetKey(builder, targetKeyVector);
        AccountMetadataTransactionBuffer.addScopedMetadataKey(builder, scopedMetadataKeyVector);
        AccountMetadataTransactionBuffer.addValueSizeDelta(builder, this.valueSizeDelta);
        AccountMetadataTransactionBuffer.addValueSize(builder, this.valueSize);    
        AccountMetadataTransactionBuffer.addValue(builder, valueVector);

        const codedTransfer = AccountMetadataTransactionBuffer.endAccountMetadataTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new AccountMetadataTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
