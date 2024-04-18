// Copyright 2024 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { Convert as convert, RawAddress as address} from '../../core/format';
import { TransactionType } from '../../model/transaction/TransactionType';
import { MosaicAddressRestrictionTransactionBuffer } from '../buffers/MosaicAddressRestrictionTransactionBuffer';
import { VerifiableTransaction } from './VerifiableTransaction';

import * as flatbuffers from 'flatbuffers';
import MosaicAddressRestrictionTransactionSchema from '../schemas/MosaicAddressRestrictionTransactionSchema';

/**
 * @module transactions/MosaicAddressRestrictionTransaction
 */
export default class MosaicAddressRestrictionTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, MosaicAddressRestrictionTransactionSchema);
    }
}

export class Builder {
    size: number;
    maxFee: number[];
    version: number;
    type: number;
    deadline: number[];
    mosaicId: number[];
    restrictionKey: number[];
    previousRestrictionValue: number[];
    newRestrictionValue: number[];
    targetAddress: Uint8Array;

    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.Mosaic_Address_Restriction;
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

    addTargetAddress(targetAddress) {
        if (/^[0-9a-fA-F]{16}$/.test(targetAddress)) {
            // received hexadecimal notation of namespaceId (alias)
            this.targetAddress = address.aliasToRecipient(convert.hexToUint8(targetAddress));
        } else {
            // received recipient address
            this.targetAddress = address.stringToAddress(targetAddress);
        }
        return this;
    }


    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = MosaicAddressRestrictionTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = MosaicAddressRestrictionTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = MosaicAddressRestrictionTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = MosaicAddressRestrictionTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const mosaicIdVector = MosaicAddressRestrictionTransactionBuffer
            .createMosaicIdVector(builder, this.mosaicId);
        const restrictionKeyVector = MosaicAddressRestrictionTransactionBuffer
            .createRestrictionKeyVector(builder, this.restrictionKey);
        const previousRestrictionValueVector = MosaicAddressRestrictionTransactionBuffer
            .createPreviousRestrictionValueVector(builder, this.previousRestrictionValue);
        const newRestrictionValueVector = MosaicAddressRestrictionTransactionBuffer
            .createNewRestrictionValueVector(builder, this.newRestrictionValue);
        const targetAddressVector = MosaicAddressRestrictionTransactionBuffer
            .createTargetAddressVector(builder, this.targetAddress);

        MosaicAddressRestrictionTransactionBuffer.startMosaicAddressRestrictionTransactionBuffer(builder);
        MosaicAddressRestrictionTransactionBuffer.addSize(builder, this.size);
        MosaicAddressRestrictionTransactionBuffer.addSignature(builder, signatureVector);
        MosaicAddressRestrictionTransactionBuffer.addSigner(builder, signerVector);
        MosaicAddressRestrictionTransactionBuffer.addVersion(builder, this.version);
        MosaicAddressRestrictionTransactionBuffer.addType(builder, this.type);
        MosaicAddressRestrictionTransactionBuffer.addMaxFee(builder, feeVector);
        MosaicAddressRestrictionTransactionBuffer.addDeadline(builder, deadlineVector);
        MosaicAddressRestrictionTransactionBuffer.addMosaicId(builder, mosaicIdVector);
        MosaicAddressRestrictionTransactionBuffer.addRestrictionKey(builder, restrictionKeyVector);
        MosaicAddressRestrictionTransactionBuffer.addPreviousRestrictionValue(builder, previousRestrictionValueVector);
        MosaicAddressRestrictionTransactionBuffer.addNewRestrictionValue(builder, newRestrictionValueVector);
        MosaicAddressRestrictionTransactionBuffer.addTargetAddress(builder, targetAddressVector);

        // Calculate size
        const codedTxn= MosaicAddressRestrictionTransactionBuffer.endMosaicAddressRestrictionTransactionBuffer(builder);
        builder.finish(codedTxn);

        const bytes = builder.asUint8Array();

        return new MosaicAddressRestrictionTransaction(bytes);
    }
}
