// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

/**
 * @module transactions/ModifyContractTransaction
 */
import ModifyContractTransactionBufferPackage from '../buffers/ModifyContractTransactionBuffer';
import {Convert as convert} from '../../core/format';
import { VerifiableTransaction } from './VerifiableTransaction';
import ModifyContractTransactionSchema from '../schemas/ModifyContractTransactionSchema';

const { CosignatoryModificationBuffer, ModifyContractTransactionBuffer } = ModifyContractTransactionBufferPackage.Buffers;

const { flatbuffers } = require('flatbuffers');

export default class ModifyContractTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, ModifyContractTransactionSchema);
    }
}

export class Builder {
    fee: any;
    version: any;
    type: any;
    deadline: any;
    durationDelta: any;
    hash: any;
    customers: any[];
    executors: any[];
    verifiers: any[];

    constructor() {
        this.fee = [0, 0];
        this.version = 1;
        this.customers = [];
        this.executors = [];
        this.verifiers = [];
    }

    addMaxFee(fee) {
        this.fee = fee;
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

    addDurationDelta(durationDelta) {
        this.durationDelta = durationDelta;
        return this;
    }

    addHash(hash) {
        this.hash = hash;
        return this;
    }

    addCustomers(customers: any[]) {
        this.customers = customers;
        return this;
    }

    addExecutors(executors: any[]) {
        this.executors = executors;
        return this;
    }

    addVerifiers(verifiers: any[]) {
        this.verifiers = verifiers;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);
        // Constants

        // Create customers
        const customersArray: any[] = [];
        this.customers.forEach(customer => {
            const cosignatoryPublicKeyVector = CosignatoryModificationBuffer
                .createCosignatoryPublicKeyVector(builder, convert.hexToUint8(customer.cosignatoryPublicAccount.publicKey));
            CosignatoryModificationBuffer.startCosignatoryModificationBuffer(builder);
            CosignatoryModificationBuffer.addType(builder, customer.type);
            CosignatoryModificationBuffer.addCosignatoryPublicKey(builder, cosignatoryPublicKeyVector);
            customersArray.push(CosignatoryModificationBuffer.endCosignatoryModificationBuffer(builder));
        });
        // Create executors
        const executorsArray:any[] = [];
        this.executors.forEach(executor => {
            const cosignatoryPublicKeyVector = CosignatoryModificationBuffer
                .createCosignatoryPublicKeyVector(builder, convert.hexToUint8(executor.cosignatoryPublicAccount.publicKey));
            CosignatoryModificationBuffer.startCosignatoryModificationBuffer(builder);
            CosignatoryModificationBuffer.addType(builder, executor.type);
            CosignatoryModificationBuffer.addCosignatoryPublicKey(builder, cosignatoryPublicKeyVector);
            executorsArray.push(CosignatoryModificationBuffer.endCosignatoryModificationBuffer(builder));
        });
        // Create verifiers
        const verifiersArray:any[] = [];
        this.verifiers.forEach(verifier => {
            const cosignatoryPublicKeyVector = CosignatoryModificationBuffer
                .createCosignatoryPublicKeyVector(builder, convert.hexToUint8(verifier.cosignatoryPublicAccount.publicKey));
            CosignatoryModificationBuffer.startCosignatoryModificationBuffer(builder);
            CosignatoryModificationBuffer.addType(builder, verifier.type);
            CosignatoryModificationBuffer.addCosignatoryPublicKey(builder, cosignatoryPublicKeyVector);
            verifiersArray.push(CosignatoryModificationBuffer.endCosignatoryModificationBuffer(builder));
        });

        // Create vectors
        const signatureVector = ModifyContractTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = ModifyContractTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = ModifyContractTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = ModifyContractTransactionBuffer.createMaxFeeVector(builder, this.fee);
        const durationDeltaVector = ModifyContractTransactionBuffer.createDurationDeltaVector(builder, this.durationDelta);
        const hashVector = ModifyContractTransactionBuffer.createHashVector(builder, convert.hexToUint8(this.hash));
        const customersVector = ModifyContractTransactionBuffer.createCustomersVector(builder, customersArray);
        const executorsVector = ModifyContractTransactionBuffer.createExecutorsVector(builder, executorsArray);
        const verifiersVector = ModifyContractTransactionBuffer.createVerifiersVector(builder, verifiersArray);

        const size = 122 + 8 + this.hash.length/2 + 3 + 33*(this.customers.length + this.executors.length + this.verifiers.length);

        ModifyContractTransactionBuffer.startModifyContractTransactionBuffer(builder);
        ModifyContractTransactionBuffer.addSize(builder, size);
        ModifyContractTransactionBuffer.addSignature(builder, signatureVector);
        ModifyContractTransactionBuffer.addSigner(builder, signerVector);
        ModifyContractTransactionBuffer.addVersion(builder, this.version);
        ModifyContractTransactionBuffer.addType(builder, this.type);
        ModifyContractTransactionBuffer.addMaxFee(builder, feeVector);
        ModifyContractTransactionBuffer.addDeadline(builder, deadlineVector);
        ModifyContractTransactionBuffer.addDurationDelta(builder, durationDeltaVector);
        ModifyContractTransactionBuffer.addHash(builder, hashVector);
        ModifyContractTransactionBuffer.addNumCustomers(builder, this.customers.length);
        ModifyContractTransactionBuffer.addNumExecutors(builder, this.executors.length);
        ModifyContractTransactionBuffer.addNumVerifiers(builder, this.verifiers.length);
        ModifyContractTransactionBuffer.addCustomers(builder, customersVector);
        ModifyContractTransactionBuffer.addExecutors(builder, executorsVector);
        ModifyContractTransactionBuffer.addVerifiers(builder, verifiersVector);

        // Calculate size

        const codedTransfer = ModifyContractTransactionBuffer.endModifyContractTransactionBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();
        if (bytes.length !== size) {
            // throw new Error("Declared size differs from actual bytes.length during ModifyContractTransaction serialization")
        }
        return new ModifyContractTransaction(bytes);
    }
}
