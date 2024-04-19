/*
 * Copyright 2024 ProximaX
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
 * @module transactions/VrfLinkTransaction
 */
import { Convert as convert } from '../../core/format';
import { TransactionType } from '../../model/transaction/TransactionType';
import { VrfLinkTransactionBuffer} from '../buffers/VrfLinkTransactionBuffer';
import VrfLinkTransactionSchema from '../schemas/VrfLinkTransactionSchema';
import {VerifiableTransaction} from './VerifiableTransaction';

import * as flatbuffers from 'flatbuffers';

export class VrfLinkTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, VrfLinkTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: number;
    maxFee: number[];
    version: number;
    type: number;
    deadline: number[];
    remoteAccountKey: string;
    linkAction: number;

    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.Vrf_Key_Link;
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

    addRemoteAccountKey(remoteAccountKey) {
        this.remoteAccountKey = remoteAccountKey;
        return this;
    }

    addLinkAction(linkAction){
        this.linkAction = linkAction;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = VrfLinkTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = VrfLinkTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = VrfLinkTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = VrfLinkTransactionBuffer.createMaxFeeVector(builder, this.maxFee);
        const remoteAccountKeyVector = VrfLinkTransactionBuffer.createRemoteAccountKeyVector(builder, convert.hexToUint8(this.remoteAccountKey));

        VrfLinkTransactionBuffer.startVrfLinkTransactionBuffer(builder);
        VrfLinkTransactionBuffer.addSize(builder, this.size);
        VrfLinkTransactionBuffer.addSignature(builder, signatureVector);
        VrfLinkTransactionBuffer.addSigner(builder, signerVector);
        VrfLinkTransactionBuffer.addVersion(builder, this.version);
        VrfLinkTransactionBuffer.addType(builder, this.type);
        VrfLinkTransactionBuffer.addMaxFee(builder, feeVector);
        VrfLinkTransactionBuffer.addDeadline(builder, deadlineVector);
        VrfLinkTransactionBuffer.addRemoteAccountKey(builder, remoteAccountKeyVector);
        VrfLinkTransactionBuffer.addLinkAction(builder, this.linkAction);

        // Calculate size

        const codedTxn = VrfLinkTransactionBuffer.endVrfLinkTransactionBuffer(builder);
        builder.finish(codedTxn);

        const bytes = builder.asUint8Array();
        return new VrfLinkTransaction(bytes);
    }
}
