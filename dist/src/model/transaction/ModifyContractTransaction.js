"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const UInt64_1 = require("../UInt64");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
const ModifyContractTransaction_1 = require("../../infrastructure/builders/ModifyContractTransaction");
class ModifyContractTransaction extends Transaction_1.Transaction {
    /**
     * Create a modify contract transaction object
     * @returns {ModifyContractTransaction}
     */
    static create(networkType, deadline, durationDelta, hash, customers, executors, verifiers, maxFee = new UInt64_1.UInt64([0, 0]), signature, signer, transactionInfo) {
        return new ModifyContractTransaction(TransactionType_1.TransactionType.MODIFY_CONTRACT, networkType, deadline, durationDelta, hash, customers, executors, verifiers, maxFee, signature, signer, transactionInfo);
    }
    constructor(transactionType, networkType, deadline, durationDelta, hash, customers, executors, verifiers, maxFee, signature, signer, transactionInfo) {
        super(transactionType, networkType, TransactionVersion_1.TransactionVersion.MODIFY_CONTRACT, deadline, maxFee, signature, signer, transactionInfo);
        this.durationDelta = durationDelta;
        this.hash = hash;
        this.customers = customers;
        this.executors = executors;
        this.verifiers = verifiers;
    }
    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    get size() {
        const byteSize = 8 // duration delta
            + this.hash.length / 2 // hash (hex)
            + 1 // num customers
            + 1 // num executors
            + 1 // num verifiers
            + 33 * (this.customers.length + this.executors.length + this.verifiers.length);
        return super.size + byteSize;
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
//# sourceMappingURL=ModifyContractTransaction.js.map