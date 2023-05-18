// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

/**
 * @module transactions/MosaicModifyLevyTransaction
 */
import {Convert as convert, RawAddress as address} from '../../core/format';
import { VerifiableTransaction } from './VerifiableTransaction';
import MosaicModifyLevyTransactionSchema from '../schemas/MosaicModifyLevyTransactionSchema';
import {ModifyMosaicLevyTransactionBuffer} from '../buffers/ModifyMosaicLevyTransactionBuffer';
import {MosaicLevy} from '../buffers/MosaicLevyBuffer';

import * as flatbuffers from 'flatbuffers';

export default class MosaicModifyLevyTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, MosaicModifyLevyTransactionSchema);
    }
}

export class Builder {
    size: number;
    fee: number[];
    version: number;
    type: number;
    deadline: number[];
    mosaicId: number[];
    levyType: number;
    levyRecipeint: Uint8Array;
    levyMosaicId: number[];
    levyFee: number[];

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

    addLevyType(levyType: number) {
        this.levyType = levyType;
        return this;
    }

    addLevyRecipeint(plainAddress: string) {
        this.levyRecipeint = address.stringToAddress(plainAddress);
        return this;
    }

    addLevyMosaicId(levyMosaicId: number[]) {
        this.levyMosaicId = levyMosaicId;
        return this;
    }

    addLevyFee(levyFee: number[]) {
        this.levyFee = levyFee;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = ModifyMosaicLevyTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = ModifyMosaicLevyTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = ModifyMosaicLevyTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = ModifyMosaicLevyTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const mosaicIdVector = ModifyMosaicLevyTransactionBuffer.createMosaicIdVector(builder, this.mosaicId);

        const levyRecipientVector = MosaicLevy.createRecipientVector(builder, this.levyRecipeint);
        const levyMosaicIdVector = MosaicLevy.createMosaicIdVector(builder, this.levyMosaicId);
        const levyFeeVector = MosaicLevy.createFeeVector(builder, this.levyFee);

        const levyVector = MosaicLevy.createMosaicLevy(builder, this.levyType, levyRecipientVector, levyMosaicIdVector, levyFeeVector); 

        ModifyMosaicLevyTransactionBuffer.startModifyMosaicLevyTransactionBuffer(builder);
        ModifyMosaicLevyTransactionBuffer.addSize(builder, this.size);
        ModifyMosaicLevyTransactionBuffer.addSignature(builder, signatureVector);
        ModifyMosaicLevyTransactionBuffer.addSigner(builder, signerVector);
        ModifyMosaicLevyTransactionBuffer.addVersion(builder, this.version);
        ModifyMosaicLevyTransactionBuffer.addType(builder, this.type);
        ModifyMosaicLevyTransactionBuffer.addMaxFee(builder, feeVector);
        ModifyMosaicLevyTransactionBuffer.addDeadline(builder, deadlineVector);
        ModifyMosaicLevyTransactionBuffer.addMosaicId(builder,mosaicIdVector);
        ModifyMosaicLevyTransactionBuffer.addLevy(builder, levyVector);

        const codedTransfer = ModifyMosaicLevyTransactionBuffer.endModifyMosaicLevyTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new MosaicModifyLevyTransaction(bytes);
    }
}
