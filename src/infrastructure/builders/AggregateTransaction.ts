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
 * @module transactions/AggregateTransaction
 */
import { SignSchema } from '../../core/crypto';
import { TransactionType } from '../../model/transaction/TransactionType';
import AggregateTransactionBufferPackage from '../buffers/AggregateTransactionBuffer';
import AggregateTransactionSchema from '../schemas/AggregateTransactionSchema';
import { CosignatureTransaction} from './CosignatureTransaction';
import { VerifiableTransaction } from './VerifiableTransaction';

import {flatbuffers} from 'flatbuffers';

const {
    AggregateTransactionBuffer,
} = AggregateTransactionBufferPackage.Buffers;

export class AggregateTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AggregateTransactionSchema);
    }

    private static recalculateSize(payload) {
        // Calculate new size
        const size = `00000000${(payload.length / 2).toString(16)}`;
        const formatedSize = size.substring(size.length - 8, size.length);
        const littleEndianSize = formatedSize.substring(6, 8) + formatedSize.substring(4, 6) +
            formatedSize.substring(2, 4) + formatedSize.substring(0, 2);

        return littleEndianSize +
            payload.substring(8, payload.length);
    }

    signTransactionWithCosigners(initializer, cosigners, generationHash, signSchema: SignSchema = SignSchema.SHA3) {
        const signedTransaction = this.signTransaction(initializer, generationHash, signSchema);
        cosigners.forEach((cosigner) => {
            const signatureTransaction = new CosignatureTransaction(signedTransaction.hash);
            const signatureCosignTransaction = signatureTransaction.signCosignatoriesTransaction(cosigner, signSchema);
            signedTransaction.payload = signedTransaction.payload +
                signatureCosignTransaction.signer + signatureCosignTransaction.signature;
        });

        // Calculate new size
        signedTransaction.payload = AggregateTransaction.recalculateSize(signedTransaction.payload);

        return signedTransaction;
    }

    signTransactionGivenSignatures(initializer, cosignedSignedTransactions, generationHash, signSchema = SignSchema.SHA3) {
        const signedTransaction = this.signTransaction(initializer, generationHash, signSchema);
        cosignedSignedTransactions.forEach((cosignedTransaction) => {
            signedTransaction.payload = signedTransaction.payload + cosignedTransaction.signer + cosignedTransaction.signature;
        });

        // Calculate new size
        signedTransaction.payload = AggregateTransaction.recalculateSize(signedTransaction.payload);

        return signedTransaction;
    }

    static appendSignatures(signedTransaction, cosignedSignedTransactions) {
        let newPayload = signedTransaction.payload;
        cosignedSignedTransactions.forEach(cosignature => {
            newPayload = newPayload + cosignature.signer + cosignature.signature;
        });

        newPayload = this.recalculateSize(newPayload);

        return {
            payload: newPayload,
            hash: signedTransaction.hash
        };
    }
}
// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    transactions: any;
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.AGGREGATE_COMPLETE;
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

    addTransactions(transactions) {
        let tmp = [];
        for (let i = 0; i < transactions.length; ++i) {
            tmp = tmp.concat(transactions[i]);
        }

        this.transactions = tmp;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = AggregateTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64))
                .map(Number.prototype.valueOf, 0));
        const signerVector = AggregateTransactionBuffer
            .createSignerVector(builder, Array(...Array(32))
                .map(Number.prototype.valueOf, 0));
        const deadlineVector = AggregateTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = AggregateTransactionBuffer.createMaxFeeVector(builder, this.maxFee);
        const modificationsVector = AggregateTransactionBuffer.createTransactionsVector(builder, this.transactions);

        AggregateTransactionBuffer.startAggregateTransactionBuffer(builder);
        AggregateTransactionBuffer.addSize(builder, this.size);
        AggregateTransactionBuffer.addSignature(builder, signatureVector);
        AggregateTransactionBuffer.addSigner(builder, signerVector);
        AggregateTransactionBuffer.addVersion(builder, this.version);
        AggregateTransactionBuffer.addType(builder, this.type);
        AggregateTransactionBuffer.addMaxFee(builder, feeVector);
        AggregateTransactionBuffer.addDeadline(builder, deadlineVector);
        AggregateTransactionBuffer.addTransactionsSize(builder, 0 !== this.transactions.length ? this.transactions.length : 4294967296);
        AggregateTransactionBuffer.addTransactions(builder, modificationsVector);

        // Calculate size
        const codedAggregate = AggregateTransactionBuffer.endAggregateTransactionBuffer(builder);
        builder.finish(codedAggregate);

        const bytes = builder.asUint8Array();
        return new AggregateTransaction(bytes);
    }
}
