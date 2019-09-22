"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("./Transaction");
const TransactionVersion_1 = require("./TransactionVersion");
const ModifyContractTransaction_1 = require("../../infrastructure/builders/ModifyContractTransaction");
const TransactionType_1 = require("./TransactionType");
const FeeCalculationStrategy_1 = require("./FeeCalculationStrategy");
class ModifyContractTransaction extends Transaction_1.Transaction {
    /**
     * Create ModifyContractTransaction object
     * @returns {ModifyContractTransaction}
     */
    static create(networkType, deadline, durationDelta, hash, customers, executors, verifiers, maxFee) {
        return new ModifyContractTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .durationDelta(durationDelta)
            .hash(hash)
            .customers(customers)
            .executors(executors)
            .verifiers(verifiers)
            .build();
    }
    constructor(networkType, deadline, durationDelta, hash, customers, executors, verifiers, maxFee, signature, signer, transactionInfo) {
        super(TransactionType_1.TransactionType.MODIFY_CONTRACT, networkType, TransactionVersion_1.TransactionVersion.MODIFY_CONTRACT, deadline, maxFee, signature, signer, transactionInfo);
        this.durationDelta = durationDelta;
        this.hash = hash;
        this.customers = customers;
        this.executors = executors;
        this.verifiers = verifiers;
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    get size() {
        return ModifyContractTransaction.calculateSize(this.hash.length, this.customers.length, this.executors.length, this.verifiers.length);
    }
    static calculateSize(hashLength, customersCount, executorsCount, verifiersCount) {
        const byteSize = Transaction_1.Transaction.getHeaderSize()
            + 8 // duration delta
            + hashLength / 2 // hash (hex)
            + 1 // num customers
            + 1 // num executors
            + 1 // num verifiers
            + 33 * (customersCount + executorsCount + verifiersCount);
        return byteSize;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new ModifyContractTransaction_1.Builder()
            .addType(this.type)
            .addVersion(this.versionToDTO())
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addHash(this.hash)
            .addDurationDelta(this.durationDelta.toDTO())
            .addCustomers(this.customers)
            .addExecutors(this.executors)
            .addVerifiers(this.verifiers)
            .build();
    }
}
exports.ModifyContractTransaction = ModifyContractTransaction;
class ModifyContractTransactionBuilder extends Transaction_1.TransactionBuilder {
    durationDelta(durationDelta) {
        this._durationDelta = durationDelta;
        return this;
    }
    hash(hash) {
        this._hash = hash;
        return this;
    }
    customers(customers) {
        this._customers = customers;
        return this;
    }
    executors(executors) {
        this._executors = executors;
        return this;
    }
    verifiers(verifiers) {
        this._verifiers = verifiers;
        return this;
    }
    build() {
        return new ModifyContractTransaction(this._networkType, this._deadline ? this._deadline : this._createNewDeadlineFn(), this._durationDelta, this._hash, this._customers, this._executors, this._verifiers, this._maxFee ? this._maxFee : FeeCalculationStrategy_1.calculateFee(ModifyContractTransaction.calculateSize(this._hash.length, this._customers.length, this._executors.length, this._verifiers.length), this._feeCalculationStrategy), this._signature, this._signer, this._transactionInfo);
    }
}
exports.ModifyContractTransactionBuilder = ModifyContractTransactionBuilder;
//# sourceMappingURL=ModifyContractTransaction.js.map