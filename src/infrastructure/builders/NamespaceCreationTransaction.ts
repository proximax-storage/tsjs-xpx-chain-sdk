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
 * @module transactions/NamespaceCreationTransaction
 */
import { Convert as convert } from '../../core/format';
import { TransactionType } from '../../model/transaction/TransactionType';
import * as NamespaceCreationTransactionBufferPackage from '../buffers/NamespaceCreationTransactionBuffer';
import NamespaceCreationTransactionSchema from '../schemas/NamespaceCreationTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    RegisterNamespaceTransactionBuffer,
} = NamespaceCreationTransactionBufferPackage.default.Buffers;

import * as flatbuffers from 'flatbuffers';

export default class NamespaceCreationTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, NamespaceCreationTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    namespaceType: any;
    duration: any;
    parentId: any;
    namespaceId: any;
    namespaceName: any;
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.REGISTER_NAMESPACE;
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

    addNamespaceType(namespaceType) {
        this.namespaceType = namespaceType;
        return this;
    }

    addDuration(duration) {
        this.duration = duration;
        return this;
    }

    addParentId(parentId) {
        this.parentId = parentId;
        return this;
    }

    addNamespaceId(namespaceId) {
        this.namespaceId = namespaceId;
        return this;
    }

    addNamespaceName(namespaceName) {
        this.namespaceName = namespaceName;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        const namespaceNameLength = convert.utf8ToHex(this.namespaceName).length / 2;

        // create vectors
        const signatureVector = RegisterNamespaceTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = RegisterNamespaceTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = RegisterNamespaceTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = RegisterNamespaceTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const parentIdVector = 1 === this.namespaceType ? this.parentId : this.duration;
        const durationParentIdVector = RegisterNamespaceTransactionBuffer
            .createDurationParentIdVector(builder, parentIdVector);
        const namespaceIdVector = RegisterNamespaceTransactionBuffer
            .createNamespaceIdVector(builder, this.namespaceId);

        const name = builder.createString(this.namespaceName);

        RegisterNamespaceTransactionBuffer.startRegisterNamespaceTransactionBuffer(builder);
        RegisterNamespaceTransactionBuffer.addSize(builder, this.size);
        RegisterNamespaceTransactionBuffer.addSignature(builder, signatureVector);
        RegisterNamespaceTransactionBuffer.addSigner(builder, signerVector);
        RegisterNamespaceTransactionBuffer.addVersion(builder, this.version);
        RegisterNamespaceTransactionBuffer.addType(builder, this.type);
        RegisterNamespaceTransactionBuffer.addMaxFee(builder, feeVector);
        RegisterNamespaceTransactionBuffer.addDeadline(builder, deadlineVector);
        RegisterNamespaceTransactionBuffer.addNamespaceType(builder, this.namespaceType);
        RegisterNamespaceTransactionBuffer.addDurationParentId(builder, durationParentIdVector);
        RegisterNamespaceTransactionBuffer.addNamespaceId(builder, namespaceIdVector);
        RegisterNamespaceTransactionBuffer.addNamespaceNameSize(builder, namespaceNameLength);
        RegisterNamespaceTransactionBuffer.addNamespaceName(builder, name);

        // Calculate size
        const codedNamespace = RegisterNamespaceTransactionBuffer.endRegisterNamespaceTransactionBuffer(builder);
        builder.finish(codedNamespace);

        const bytes = builder.asUint8Array();
        return new NamespaceCreationTransaction(bytes);
    }
}
