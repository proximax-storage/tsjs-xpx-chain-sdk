/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @module transactions/MosaicCreationTransaction
 */
import { TransactionType } from '../../model/transaction/TransactionType';
import MosaicCreationTransactionBufferPackage from '../buffers/MosaicCreationTransactionBuffer';
import {
    schema as MosaicCreationTransactionSchema,
    schemaNoDuration as MosaicCreationTransactionSchemaNoDuration,
} from '../schemas/MosaicCreationTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

import * as flatbuffers from 'flatbuffers';
import { MosaicPropertyType } from '../../model/mosaic/MosaicPropertyType';

const {
    MosaicDefinitionTransactionBuffer,
} = MosaicCreationTransactionBufferPackage.Buffers;

export default class MosaicCreationTransaction extends VerifiableTransaction {
    constructor(bytes, schema) {
        super(bytes, schema);
    }
}
// tslint:disable-next-line: max-classes-per-file
export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    mosaicId: any;
    flags: any;
    nonce: any;
    divisibility: any;
    duration: any;
    constructor() {
        this.flags = 0;
        this.maxFee = [0, 0];
        this.type = TransactionType.MOSAIC_DEFINITION;
        this.nonce = 0;
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

    addNonce(nonce) {
        this.nonce = nonce;
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

    addDivisibility(divisibility) {
        this.divisibility = divisibility;
        return this;
    }

    addSupplyMutable() {
        this.flags += 1;
        return this;
    }

    addTransferability() {
        this.flags += 2;
        return this;
    }

    addLevyMutable() {
        this.flags += 4;
        return this;
    }

    addMosaicId(mosaicId) {
        this.mosaicId = mosaicId;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = MosaicDefinitionTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = MosaicDefinitionTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = MosaicDefinitionTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = MosaicDefinitionTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const mosaicNonceVector = MosaicDefinitionTransactionBuffer
            .createMosaicNonceVector(builder, this.nonce);
        const mosaicIdVector = MosaicDefinitionTransactionBuffer
            .createMosaicIdVector(builder, this.mosaicId);

        const durationVector = MosaicDefinitionTransactionBuffer
            .createDurationVector(builder, this.duration);

        const durationProvided = 0 < this.duration.length;

        MosaicDefinitionTransactionBuffer.startMosaicDefinitionTransactionBuffer(builder);
        MosaicDefinitionTransactionBuffer.addSize(builder, this.size);
        MosaicDefinitionTransactionBuffer.addSignature(builder, signatureVector);
        MosaicDefinitionTransactionBuffer.addSigner(builder, signerVector);
        MosaicDefinitionTransactionBuffer.addVersion(builder, this.version);
        MosaicDefinitionTransactionBuffer.addType(builder, this.type);
        MosaicDefinitionTransactionBuffer.addMaxFee(builder, feeVector);
        MosaicDefinitionTransactionBuffer.addDeadline(builder, deadlineVector);
        MosaicDefinitionTransactionBuffer.addMosaicNonce(builder, mosaicNonceVector);
        MosaicDefinitionTransactionBuffer.addMosaicId(builder, mosaicIdVector);
        MosaicDefinitionTransactionBuffer.addNumOptionalProperties(builder, (durationProvided ? 1 : 0));
        MosaicDefinitionTransactionBuffer.addFlags(builder, this.flags);
        MosaicDefinitionTransactionBuffer.addDivisibility(builder, this.divisibility);

        if (durationProvided) {
            MosaicDefinitionTransactionBuffer.addIndicateDuration(builder, MosaicPropertyType.Duration);
            MosaicDefinitionTransactionBuffer.addDuration(builder, durationVector);
        }

        // Calculate size

        const codedMosaicCreation = MosaicDefinitionTransactionBuffer.endMosaicDefinitionTransactionBuffer(builder);
        builder.finish(codedMosaicCreation);

        const bytes = builder.asUint8Array();

        const schema = durationProvided ? MosaicCreationTransactionSchema : MosaicCreationTransactionSchemaNoDuration;
        return new MosaicCreationTransaction(bytes, schema);
    }
}
