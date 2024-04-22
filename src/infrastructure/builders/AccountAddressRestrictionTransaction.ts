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
 * @module transactions/AccountAddressRestrictionTransaction
 */
import { RawAddress as address } from '../../core/format';
import { TransactionType } from '../../model/transaction/TransactionType';
import { AccountAddressRestrictionTransactionBuffer } from '../buffers/AccountAddressRestrictionTransactionBuffer';
import { AddressBuffer } from '../buffers/AddressBuffer';
import AccountAddressRestrictionTransactionSchema from '../schemas/AccountAddressRestrictionTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

import * as flatbuffers from 'flatbuffers';

export default class AccountAddressRestrictionTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AccountAddressRestrictionTransactionSchema);
    }
}

export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    restrictionFlags: number;
    restrictionAdditions: any[];
    restrictionDeletions: any[];
    
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.Account_Address_Restriction;
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
            const addressVector = AddressBuffer
                .createAddressVector(builder, address.stringToAddress(addition));
            AddressBuffer.startAddressBuffer(builder);
            AddressBuffer.addAddress(builder, addressVector);
            restrictionAdditionsArray.push(AddressBuffer.endAddressBuffer(builder));
        });

        const restrictionDeletionsArray: any = [];
        this.restrictionDeletions.forEach((deletion) => {
            const addressVector = AddressBuffer
                .createAddressVector(builder, address.stringToAddress(deletion));
            AddressBuffer.startAddressBuffer(builder);
            AddressBuffer.addAddress(builder, addressVector);
            restrictionDeletionsArray.push(AddressBuffer.endAddressBuffer(builder));
        });

        // Create vectors
        const signatureVector = AccountAddressRestrictionTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AccountAddressRestrictionTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AccountAddressRestrictionTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = AccountAddressRestrictionTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const restrictionAdditionsVector = AccountAddressRestrictionTransactionBuffer
            .createRestrictionAdditionsVector(builder, restrictionAdditionsArray);
        const restrictionDeletionsVector = AccountAddressRestrictionTransactionBuffer
            .createRestrictionDeletionsVector(builder, restrictionDeletionsArray);

        AccountAddressRestrictionTransactionBuffer.startAccountAddressRestrictionTransactionBuffer(builder);
        AccountAddressRestrictionTransactionBuffer.addSize(builder, this.size);
        AccountAddressRestrictionTransactionBuffer.addSignature(builder, signatureVector);
        AccountAddressRestrictionTransactionBuffer.addSigner(builder, signerVector);
        AccountAddressRestrictionTransactionBuffer.addVersion(builder, this.version);
        AccountAddressRestrictionTransactionBuffer.addType(builder, this.type);
        AccountAddressRestrictionTransactionBuffer.addMaxFee(builder, feeVector);
        AccountAddressRestrictionTransactionBuffer.addDeadline(builder, deadlineVector);
        AccountAddressRestrictionTransactionBuffer.addRestrictionFlags(builder, this.restrictionFlags);
        AccountAddressRestrictionTransactionBuffer.addRestrictionAdditionsCount(builder, this.restrictionAdditions.length);
        AccountAddressRestrictionTransactionBuffer.addRestrictionDeletionsCount(builder, this.restrictionDeletions.length);
        AccountAddressRestrictionTransactionBuffer.addAccountRestrictionTransactionBodyReserved1(builder, 0);
        AccountAddressRestrictionTransactionBuffer.addRestrictionAdditions(builder, restrictionAdditionsVector);
        AccountAddressRestrictionTransactionBuffer.addRestrictionDeletions(builder, restrictionDeletionsVector);

        // Calculate size
        const codedAccountAddressRestriction = AccountAddressRestrictionTransactionBuffer
            .endAccountAddressRestrictionTransactionBuffer(builder);
        builder.finish(codedAccountAddressRestriction);

        const bytes = builder.asUint8Array();

        return new AccountAddressRestrictionTransaction(bytes);
    }
}
