// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { TransactionType } from '../../model/transaction/TransactionType';
import { LockFundCancelUnlockTransactionBuffer } from '../buffers/LockFundCancelUnlockTransactionBuffer';
import { VerifiableTransaction } from './VerifiableTransaction';

import * as flatbuffers from 'flatbuffers';
import LockFundCancelUnlockTransactionSchema from '../schemas/LockFundCancelUnlockTransactionSchema';

/**
 * @module transactions/LockFundCancelUnlockTransaction
 */
export default class LockFundCancelUnlockTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, LockFundCancelUnlockTransactionSchema);
    }
}

export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    targetHeight: any;

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

    addTargetHeight(targetHeight) {
        this.targetHeight = targetHeight;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = LockFundCancelUnlockTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = LockFundCancelUnlockTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = LockFundCancelUnlockTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = LockFundCancelUnlockTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const targetHeightVector = LockFundCancelUnlockTransactionBuffer
            .createTargetHeightVector(builder, this.targetHeight);

        LockFundCancelUnlockTransactionBuffer.startLockFundCancelUnlockTransactionBuffer(builder);
        LockFundCancelUnlockTransactionBuffer.addSize(builder, this.size);
        LockFundCancelUnlockTransactionBuffer.addSignature(builder, signatureVector);
        LockFundCancelUnlockTransactionBuffer.addSigner(builder, signerVector);
        LockFundCancelUnlockTransactionBuffer.addVersion(builder, this.version);
        LockFundCancelUnlockTransactionBuffer.addType(builder, this.type);
        LockFundCancelUnlockTransactionBuffer.addMaxFee(builder, feeVector);
        LockFundCancelUnlockTransactionBuffer.addDeadline(builder, deadlineVector);
        LockFundCancelUnlockTransactionBuffer.addTargetHeight(builder, targetHeightVector);


        // Calculate size
        const codedTxn= LockFundCancelUnlockTransactionBuffer.endLockFundCancelUnlockTransactionBuffer(builder);
        builder.finish(codedTxn);

        const bytes = builder.asUint8Array();

        return new LockFundCancelUnlockTransaction(bytes);
    }
}
