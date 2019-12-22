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
import { Convert as convert } from '../../core/format/Convert';
import { TransactionType } from '../../model/transaction/TransactionType';
import MosaicAliasTransactionBufferPackage from '../buffers/AliasTransactionBuffer';
import MosaicAliasTransactionSchema from '../schemas/MosaicAliasTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    AliasTransactionBuffer,
} = MosaicAliasTransactionBufferPackage.Buffers;

import {flatbuffers} from 'flatbuffers';

/**
 * @module transactions/MosaicAliasTransaction
 */
export default class MosaicAliasTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, MosaicAliasTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    mosaicId: any;
    actionType: any;
    namespaceId: any;
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.MOSAIC_ALIAS;
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

    addActionType(actionType) {
        this.actionType = actionType;
        return this;
    }

    addNamespaceId(namespaceId) {
        this.namespaceId = namespaceId;
        return this;
    }

    addMosaicId(mosaicId) {
        this.mosaicId = mosaicId;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = AliasTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AliasTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AliasTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = AliasTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const namespaceIdVector = AliasTransactionBuffer
            .createNamespaceIdVector(builder, this.namespaceId);
        const mosaicIdVector = AliasTransactionBuffer
            .createAliasIdVector(builder, new Uint8Array(convert.UInt64ToUint8Array(this.mosaicId)));

        AliasTransactionBuffer.startAliasTransactionBuffer(builder);
        AliasTransactionBuffer.addSize(builder, this.size);
        AliasTransactionBuffer.addSignature(builder, signatureVector);
        AliasTransactionBuffer.addSigner(builder, signerVector);
        AliasTransactionBuffer.addVersion(builder, this.version);
        AliasTransactionBuffer.addType(builder, this.type);
        AliasTransactionBuffer.addMaxFee(builder, feeVector);
        AliasTransactionBuffer.addDeadline(builder, deadlineVector);
        AliasTransactionBuffer.addActionType(builder, this.actionType);
        AliasTransactionBuffer.addNamespaceId(builder, namespaceIdVector);
        AliasTransactionBuffer.addAliasId(builder, mosaicIdVector);

        // Calculate size
        const codedMosaicChangeSupply = AliasTransactionBuffer.endAliasTransactionBuffer(builder);
        builder.finish(codedMosaicChangeSupply);

        const bytes = builder.asUint8Array();

        return new MosaicAliasTransaction(bytes);
    }
}
