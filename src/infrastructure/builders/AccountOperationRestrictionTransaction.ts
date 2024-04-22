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
 * @module transactions/AccountOperationRestrictionTransaction
 */
import { TransactionType } from '../../model/transaction/TransactionType';
import { AccountOperationRestrictionTransactionBuffer } from '../buffers/AccountOperationRestrictionTransactionBuffer';
import AccountOperationRestrictionTransactionSchema from '../schemas/AccountOperationRestrictionTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

import * as flatbuffers from 'flatbuffers';

export default class AccountOperationRestrictionTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AccountOperationRestrictionTransactionSchema);
    }
}

export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    restrictionFlags: number;
    restrictionAdditions: number[];
    restrictionDeletions: number[];
    
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.Account_Operation_Restriction;
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

    addRestrictionFlags(restrictionFlags: number){
        this.restrictionFlags = restrictionFlags;
        return this;
    }

    addRestrictionAdditions(restrictionAdditions) {
        this.restrictionAdditions = restrictionAdditions;
        return this;
    }

    addRestrictionDeletions(restrictionDeletions) {
        this.restrictionDeletions = restrictionDeletions;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = AccountOperationRestrictionTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AccountOperationRestrictionTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AccountOperationRestrictionTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = AccountOperationRestrictionTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const restrictionAdditionsVector = AccountOperationRestrictionTransactionBuffer
            .createRestrictionAdditionsVector(builder, this.restrictionAdditions);
        const restrictionDeletionsVector = AccountOperationRestrictionTransactionBuffer
            .createRestrictionDeletionsVector(builder, this.restrictionDeletions);

        AccountOperationRestrictionTransactionBuffer.startAccountOperationRestrictionTransactionBuffer(builder);
        AccountOperationRestrictionTransactionBuffer.addSize(builder, this.size);
        AccountOperationRestrictionTransactionBuffer.addSignature(builder, signatureVector);
        AccountOperationRestrictionTransactionBuffer.addSigner(builder, signerVector);
        AccountOperationRestrictionTransactionBuffer.addVersion(builder, this.version);
        AccountOperationRestrictionTransactionBuffer.addType(builder, this.type);
        AccountOperationRestrictionTransactionBuffer.addMaxFee(builder, feeVector);
        AccountOperationRestrictionTransactionBuffer.addDeadline(builder, deadlineVector);
        AccountOperationRestrictionTransactionBuffer.addRestrictionFlags(builder, this.restrictionFlags);
        AccountOperationRestrictionTransactionBuffer.addRestrictionAdditionsCount(builder, this.restrictionAdditions.length);
        AccountOperationRestrictionTransactionBuffer.addRestrictionDeletionsCount(builder, this.restrictionDeletions.length);
        AccountOperationRestrictionTransactionBuffer.addAccountRestrictionTransactionBodyReserved1(builder, 0);
        AccountOperationRestrictionTransactionBuffer.addRestrictionAdditions(builder, restrictionAdditionsVector);
        AccountOperationRestrictionTransactionBuffer.addRestrictionDeletions(builder, restrictionDeletionsVector);

        // Calculate size
        const codedAccountOperationRestriction = AccountOperationRestrictionTransactionBuffer
            .endAccountOperationRestrictionTransactionBuffer(builder);
        builder.finish(codedAccountOperationRestriction);

        const bytes = builder.asUint8Array();

        return new AccountOperationRestrictionTransaction(bytes);
    }
}
