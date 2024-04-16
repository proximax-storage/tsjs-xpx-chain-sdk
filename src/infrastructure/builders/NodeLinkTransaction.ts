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
 * @module transactions/NodeLinkTransaction
 */
import { Convert as convert } from '../../core/format';
import { TransactionType } from '../../model/transaction/TransactionType';
import { NodeLinkTransactionBuffer} from '../buffers/NodeLinkTransactionBuffer';
import NodeLinkTransactionSchema from '../schemas/NodeLinkTransactionSchema';
import {VerifiableTransaction} from './VerifiableTransaction';

import * as flatbuffers from 'flatbuffers';

export class NodeLinkTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, NodeLinkTransactionSchema);
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
        this.type = TransactionType.Node_Key_Link;
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
        const signatureVector = NodeLinkTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = NodeLinkTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = NodeLinkTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = NodeLinkTransactionBuffer.createMaxFeeVector(builder, this.maxFee);
        const remoteAccountKeyVector = NodeLinkTransactionBuffer.createRemoteAccountKeyVector(builder, convert.hexToUint8(this.remoteAccountKey));

        NodeLinkTransactionBuffer.startNodeLinkTransactionBuffer(builder);
        NodeLinkTransactionBuffer.addSize(builder, this.size);
        NodeLinkTransactionBuffer.addSignature(builder, signatureVector);
        NodeLinkTransactionBuffer.addSigner(builder, signerVector);
        NodeLinkTransactionBuffer.addVersion(builder, this.version);
        NodeLinkTransactionBuffer.addType(builder, this.type);
        NodeLinkTransactionBuffer.addMaxFee(builder, feeVector);
        NodeLinkTransactionBuffer.addDeadline(builder, deadlineVector);
        NodeLinkTransactionBuffer.addRemoteAccountKey(builder, remoteAccountKeyVector);
        NodeLinkTransactionBuffer.addLinkAction(builder, this.linkAction);

        // Calculate size

        const codedTransfer = NodeLinkTransactionBuffer.endNodeLinkTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();
        return new NodeLinkTransaction(bytes);
    }
}
