// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

/**
 * @module transactions/MosaicRemoveLevyTransaction
 */
import {Convert as convert, RawAddress as address} from '../../core/format';
import { VerifiableTransaction } from './VerifiableTransaction';
import MosaicRemoveLevyTransactionSchema from '../schemas/MosaicRemoveLevyTransactionSchema';
import {RemoveMosaicLevyTransactionBuffer} from '../buffers/RemoveMosaicLevyTransactionBuffer';

const { flatbuffers } = require('flatbuffers');

export default class MosaicRemoveLevyTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, MosaicRemoveLevyTransactionSchema);
    }
}

export class Builder {
    size: number;
    fee: number[];
    version: number;
    type: number;
    deadline: number[];
    mosaicId: number[];

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

    addMosaicId(mosaicId: number[]) {
        this.mosaicId = mosaicId;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = RemoveMosaicLevyTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = RemoveMosaicLevyTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = RemoveMosaicLevyTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = RemoveMosaicLevyTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const mosaicIdVector = RemoveMosaicLevyTransactionBuffer.createMosaicIdVector(builder, this.mosaicId);

        RemoveMosaicLevyTransactionBuffer.startRemoveMosaicLevyTransactionBuffer(builder);
        RemoveMosaicLevyTransactionBuffer.addSize(builder, this.size);
        RemoveMosaicLevyTransactionBuffer.addSignature(builder, signatureVector);
        RemoveMosaicLevyTransactionBuffer.addSigner(builder, signerVector);
        RemoveMosaicLevyTransactionBuffer.addVersion(builder, this.version);
        RemoveMosaicLevyTransactionBuffer.addType(builder, this.type);
        RemoveMosaicLevyTransactionBuffer.addMaxFee(builder, feeVector);
        RemoveMosaicLevyTransactionBuffer.addDeadline(builder, deadlineVector);
        RemoveMosaicLevyTransactionBuffer.addMosaicId(builder, mosaicIdVector);

        const codedTransfer = RemoveMosaicLevyTransactionBuffer.endRemoveMosaicLevyTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new MosaicRemoveLevyTransaction(bytes);
    }
}
