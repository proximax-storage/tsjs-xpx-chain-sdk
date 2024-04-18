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
 * @module transactions/AccountMosaicRestrictionTransaction
 */
import { TransactionType } from '../../model/transaction/TransactionType';
import { AccountMosaicRestrictionTransactionBuffer } from '../buffers/AccountMosaicRestrictionTransactionBuffer';
import { MosaicId } from '../buffers/MosaicIdBuffer';
import AccountMosaicRestrictionTransactionSchema from '../schemas/AccountMosaicRestrictionTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

import * as flatbuffers from 'flatbuffers';

export default class AccountMosaicRestrictionTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AccountMosaicRestrictionTransactionSchema);
    }
}

export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    restrictionFlags: number;
    restrictionAdditions: number[][];
    restrictionDeletions: number[][];
    
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.Account_Mosaic_Restriction;
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

        const restrictionAdditionsArray: any = [];
        this.restrictionAdditions.forEach((addition) => {
            const idVector = MosaicId
                .createIdVector(builder, addition);
            MosaicId.startMosaicId(builder);
            MosaicId.addId(builder, idVector);
            restrictionAdditionsArray.push(MosaicId.endMosaicId(builder));
        });

        const restrictionDeletionsArray: any = [];
        this.restrictionDeletions.forEach((deletion) => {
            const idVector = MosaicId
                .createIdVector(builder, deletion);
            MosaicId.startMosaicId(builder);
            MosaicId.addId(builder, idVector);
            restrictionDeletionsArray.push(MosaicId.endMosaicId(builder));
        });

        // Create vectors
        const signatureVector = AccountMosaicRestrictionTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AccountMosaicRestrictionTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AccountMosaicRestrictionTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = AccountMosaicRestrictionTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const restrictionAdditionsVector = AccountMosaicRestrictionTransactionBuffer
            .createRestrictionAdditionsVector(builder, restrictionAdditionsArray);
        const restrictionDeletionsVector = AccountMosaicRestrictionTransactionBuffer
            .createRestrictionDeletionsVector(builder, restrictionDeletionsArray);

        AccountMosaicRestrictionTransactionBuffer.startAccountMosaicRestrictionTransactionBuffer(builder);
        AccountMosaicRestrictionTransactionBuffer.addSize(builder, this.size);
        AccountMosaicRestrictionTransactionBuffer.addSignature(builder, signatureVector);
        AccountMosaicRestrictionTransactionBuffer.addSigner(builder, signerVector);
        AccountMosaicRestrictionTransactionBuffer.addVersion(builder, this.version);
        AccountMosaicRestrictionTransactionBuffer.addType(builder, this.type);
        AccountMosaicRestrictionTransactionBuffer.addMaxFee(builder, feeVector);
        AccountMosaicRestrictionTransactionBuffer.addDeadline(builder, deadlineVector);
        AccountMosaicRestrictionTransactionBuffer.addRestrictionFlags(builder, this.restrictionFlags);
        AccountMosaicRestrictionTransactionBuffer.addRestrictionAdditionsCount(builder, this.restrictionAdditions.length);
        AccountMosaicRestrictionTransactionBuffer.addRestrictionDeletionsCount(builder, this.restrictionDeletions.length);
        AccountMosaicRestrictionTransactionBuffer.addAccountRestrictionTransactionBodyReserved1(builder, 0);
        AccountMosaicRestrictionTransactionBuffer.addRestrictionAdditions(builder, restrictionAdditionsVector);
        AccountMosaicRestrictionTransactionBuffer.addRestrictionDeletions(builder, restrictionDeletionsVector);

        // Calculate size
        const codedAccountMosaicRestriction = AccountMosaicRestrictionTransactionBuffer
            .endAccountMosaicRestrictionTransactionBuffer(builder);
        builder.finish(codedAccountMosaicRestriction);

        const bytes = builder.asUint8Array();

        return new AccountMosaicRestrictionTransaction(bytes);
    }
}
