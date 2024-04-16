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
 * @module transactions/AccountV2UpgradeTransaction
 */
import { Convert as convert } from '../../core/format';
import { TransactionType } from '../../model/transaction/TransactionType';
import { AccountV2UpgradeTransactionBuffer} from '../buffers/AccountV2UpgradeTransactionBuffer';
import AccountV2UpgradeTransactionSchema from '../schemas/AccountV2UpgradeTransactionSchema';
import {VerifiableTransaction} from './VerifiableTransaction';

import * as flatbuffers from 'flatbuffers';

export class AccountV2UpgradeTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AccountV2UpgradeTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: number;
    maxFee: number[];
    version: number;
    type: number;
    deadline: number[];
    newPublicAccountKey: string;

    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.Account_V2_Upgrade;
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

    addNewPublicAccountKey(newPublicAccountKey) {
        this.newPublicAccountKey = newPublicAccountKey;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = AccountV2UpgradeTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AccountV2UpgradeTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AccountV2UpgradeTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = AccountV2UpgradeTransactionBuffer.createMaxFeeVector(builder, this.maxFee);
        const newPublicAccountKeyVector = AccountV2UpgradeTransactionBuffer.createNewaccountpublickeyVector(builder, convert.hexToUint8(this.newPublicAccountKey));

        AccountV2UpgradeTransactionBuffer.startAccountV2UpgradeTransactionBuffer(builder);
        AccountV2UpgradeTransactionBuffer.addSize(builder, this.size);
        AccountV2UpgradeTransactionBuffer.addSignature(builder, signatureVector);
        AccountV2UpgradeTransactionBuffer.addSigner(builder, signerVector);
        AccountV2UpgradeTransactionBuffer.addVersion(builder, this.version);
        AccountV2UpgradeTransactionBuffer.addType(builder, this.type);
        AccountV2UpgradeTransactionBuffer.addMaxFee(builder, feeVector);
        AccountV2UpgradeTransactionBuffer.addDeadline(builder, deadlineVector);
        AccountV2UpgradeTransactionBuffer.addNewaccountpublickey(builder, newPublicAccountKeyVector);

        // Calculate size

        const codedTransfer = AccountV2UpgradeTransactionBuffer.endAccountV2UpgradeTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();
        return new AccountV2UpgradeTransaction(bytes);
    }
}
