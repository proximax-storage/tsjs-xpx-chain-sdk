// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { TransactionType } from '../../model/transaction/TransactionType';
import { LockFundTransferTransactionBuffer } from '../buffers/LockFundTransferTransactionBuffer';
import { MosaicBuffer } from '../buffers/MosaicBuffer';
import { VerifiableTransaction } from './VerifiableTransaction';

import * as flatbuffers from 'flatbuffers';
import LockFundTransferTransactionSchema from '../schemas/LockFundTransferTransactionSchema';

/**
 * @module transactions/LockFundTransferTransaction
 */
export default class LockFundTransferTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, LockFundTransferTransactionSchema);
    }
}

export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    duration: any;
    action: any;
    mosaics: any[];

    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.ADD_EXCHANGE_OFFER;
    }

    addSize(size) {
        this.size = size;
        return this;
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

    addDuration(duration) {
        this.duration = duration;
        return this;
    }

    addAction(action) {
        this.action = action;
        return this;
    }

    addMosaics(mosaics) {
        this.mosaics = mosaics;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        const mosaicsArray: any[] = [];
        this.mosaics.forEach(mosaic => {
            const id = MosaicBuffer.createIdVector(builder, mosaic.id);
            const amount = MosaicBuffer.createAmountVector(builder, mosaic.amount);
            MosaicBuffer.startMosaicBuffer(builder);
            MosaicBuffer.addId(builder, id);
            MosaicBuffer.addAmount(builder, amount);
            mosaicsArray.push(MosaicBuffer.endMosaicBuffer(builder));
        });

        // Create vectors
        const signatureVector = LockFundTransferTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = LockFundTransferTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = LockFundTransferTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = LockFundTransferTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const durationVector = LockFundTransferTransactionBuffer
            .createDurationVector(builder, this.duration);
        const mosaicsVector = LockFundTransferTransactionBuffer
            .createMosaicsVector(builder, mosaicsArray);
        LockFundTransferTransactionBuffer.startLockFundTransferTransactionBuffer(builder);
        LockFundTransferTransactionBuffer.addSize(builder, this.size);
        LockFundTransferTransactionBuffer.addSignature(builder, signatureVector);
        LockFundTransferTransactionBuffer.addSigner(builder, signerVector);
        LockFundTransferTransactionBuffer.addVersion(builder, this.version);
        LockFundTransferTransactionBuffer.addType(builder, this.type);
        LockFundTransferTransactionBuffer.addMaxFee(builder, feeVector);
        LockFundTransferTransactionBuffer.addDeadline(builder, deadlineVector);
        LockFundTransferTransactionBuffer.addDuration(builder, durationVector);
        LockFundTransferTransactionBuffer.addAction(builder, this.action);
        LockFundTransferTransactionBuffer.addMosaicsCount(builder, this.mosaics.length);
        LockFundTransferTransactionBuffer.addMosaics(builder, mosaicsVector);

        // Calculate size
        const codedTxn= LockFundTransferTransactionBuffer.endLockFundTransferTransactionBuffer(builder);
        builder.finish(codedTxn);

        const bytes = builder.asUint8Array();

        return new LockFundTransferTransaction(bytes);
    }
}
