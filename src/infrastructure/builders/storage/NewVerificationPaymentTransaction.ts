/*
 * Copyright 2023 ProximaX
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
 * @module transactions/VerificationPaymentTransaction
 */
import { Convert as convert } from '../../../core/format';
import { TransactionType } from '../../../model/transaction/TransactionType';
import { VerifiableTransaction } from '../VerifiableTransaction';
import VerificationPaymentTransactionSchema from '../../schemas/storage/VerificationPaymentTransactionSchema';
import { VerificationPaymentTransactionBuffer } from '../../buffers/storage/VerificationPaymentTransactionBuffer';

import * as flatbuffers from 'flatbuffers';

export default class NewVerificationPaymentTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, VerificationPaymentTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: number;
    fee: number[];
    version: number;
    type: number;
    deadline: number[];
    driveKey: string;
    verificationFeeAmount: number[];

    constructor() {
        this.fee = [0, 0];
        this.type = TransactionType.Verification_Payment;
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

    addDriveKey(driveKey: string) {
        this.driveKey = driveKey;
        return this;
    }

    addVerificationFeeAmount(verificationFeeAmount: number[]) {
        this.verificationFeeAmount = verificationFeeAmount;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = VerificationPaymentTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = VerificationPaymentTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = VerificationPaymentTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = VerificationPaymentTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const driveKeyVector = VerificationPaymentTransactionBuffer.createDriveKeyVector(builder, convert.hexToUint8(this.driveKey));
        const verificationFeeAmountVector = VerificationPaymentTransactionBuffer.createVerificationFeeAmountVector(builder, this.verificationFeeAmount);
   
        VerificationPaymentTransactionBuffer.startVerificationPaymentTransactionBuffer(builder);
        VerificationPaymentTransactionBuffer.addSize(builder, this.size);
        VerificationPaymentTransactionBuffer.addSignature(builder, signatureVector);
        VerificationPaymentTransactionBuffer.addSigner(builder, signerVector);
        VerificationPaymentTransactionBuffer.addVersion(builder, this.version);
        VerificationPaymentTransactionBuffer.addType(builder, this.type);
        VerificationPaymentTransactionBuffer.addMaxFee(builder, feeVector);
        VerificationPaymentTransactionBuffer.addDeadline(builder, deadlineVector);
        VerificationPaymentTransactionBuffer.addDriveKey(builder, driveKeyVector);
        VerificationPaymentTransactionBuffer.addVerificationFeeAmount(builder, verificationFeeAmountVector);

        const codedTransfer = VerificationPaymentTransactionBuffer.endVerificationPaymentTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new NewVerificationPaymentTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
