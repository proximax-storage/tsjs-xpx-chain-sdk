// Copyright 2024 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { TransactionType } from '../../model/transaction/TransactionType';
import { MosaicGlobalRestrictionTransactionBuffer } from '../buffers/MosaicGlobalRestrictionTransactionBuffer';
import { VerifiableTransaction } from './VerifiableTransaction';

import * as flatbuffers from 'flatbuffers';
import MosaicGlobalRestrictionTransactionSchema from '../schemas/MosaicGlobalRestrictionTransactionSchema';

/**
 * @module transactions/MosaicGlobalRestrictionTransaction
 */
export default class MosaicGlobalRestrictionTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, MosaicGlobalRestrictionTransactionSchema);
    }
}

export class Builder {
    size: number;
    maxFee: number[];
    version: number;
    type: number;
    deadline: number[];
    mosaicId: number[];
    referenceMosaicId: number[];
    restrictionKey: number[];
    previousRestrictionValue: number[];
    newRestrictionValue: number[];
    previousRestrictionType: number;
    newRestrictionType: number;

    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.Mosaic_Global_Restriction;
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

    addMosaicId(mosaicId) {
        this.mosaicId = mosaicId;
        return this;
    }

    addReferenceMosaicId(referenceMosaicId) {
        this.referenceMosaicId = referenceMosaicId;
        return this;
    }

    addRestrictionKey(restrictionKey) {
        this.restrictionKey = restrictionKey;
        return this;
    }

    addPreviousRestrictionValue(previousRestrictionValue) {
        this.previousRestrictionValue = previousRestrictionValue;
        return this;
    }


    addNewRestrictionValue(newRestrictionValue) {
        this.newRestrictionValue = newRestrictionValue;
        return this;
    }


    addPreviousRestrictionType(previousRestrictionType) {
        this.previousRestrictionType = previousRestrictionType;
        return this;
    }


    addNewRestrictionType(newRestrictionType) {
        this.newRestrictionType = newRestrictionType;
        return this;
    }


    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = MosaicGlobalRestrictionTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = MosaicGlobalRestrictionTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = MosaicGlobalRestrictionTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = MosaicGlobalRestrictionTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const mosaicIdVector = MosaicGlobalRestrictionTransactionBuffer
            .createMosaicIdVector(builder, this.mosaicId);
        const referenceMosaicIdVector = MosaicGlobalRestrictionTransactionBuffer
            .createReferenceMosaicIdVector(builder, this.referenceMosaicId);
        const restrictionKeyVector = MosaicGlobalRestrictionTransactionBuffer
            .createRestrictionKeyVector(builder, this.restrictionKey);
        const previousRestrictionValueVector = MosaicGlobalRestrictionTransactionBuffer
            .createPreviousRestrictionValueVector(builder, this.previousRestrictionValue);
        const newRestrictionValueVector = MosaicGlobalRestrictionTransactionBuffer
            .createNewRestrictionValueVector(builder, this.newRestrictionValue);

        MosaicGlobalRestrictionTransactionBuffer.startMosaicGlobalRestrictionTransactionBuffer(builder);
        MosaicGlobalRestrictionTransactionBuffer.addSize(builder, this.size);
        MosaicGlobalRestrictionTransactionBuffer.addSignature(builder, signatureVector);
        MosaicGlobalRestrictionTransactionBuffer.addSigner(builder, signerVector);
        MosaicGlobalRestrictionTransactionBuffer.addVersion(builder, this.version);
        MosaicGlobalRestrictionTransactionBuffer.addType(builder, this.type);
        MosaicGlobalRestrictionTransactionBuffer.addMaxFee(builder, feeVector);
        MosaicGlobalRestrictionTransactionBuffer.addDeadline(builder, deadlineVector);
        MosaicGlobalRestrictionTransactionBuffer.addMosaicId(builder, mosaicIdVector);
        MosaicGlobalRestrictionTransactionBuffer.addReferenceMosaicId(builder, referenceMosaicIdVector);
        MosaicGlobalRestrictionTransactionBuffer.addRestrictionKey(builder, restrictionKeyVector);
        MosaicGlobalRestrictionTransactionBuffer.addPreviousRestrictionValue(builder, previousRestrictionValueVector);
        MosaicGlobalRestrictionTransactionBuffer.addNewRestrictionValue(builder, newRestrictionValueVector);
        MosaicGlobalRestrictionTransactionBuffer.addPreviousRestrictionType(builder, this.previousRestrictionType);
        MosaicGlobalRestrictionTransactionBuffer.addNewRestrictionType(builder, this.newRestrictionType);

        // Calculate size
        const codedTxn= MosaicGlobalRestrictionTransactionBuffer.endMosaicGlobalRestrictionTransactionBuffer(builder);
        builder.finish(codedTxn);

        const bytes = builder.asUint8Array();

        return new MosaicGlobalRestrictionTransaction(bytes);
    }
}
