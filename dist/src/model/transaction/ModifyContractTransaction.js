"use strict";
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
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new ModifyContractTransaction_1.Builder()
            .addType(this.type)
            .addVersion(this.versionToDTO())
            .addDeadline(this.deadline.toDTO())
            .addFee(this.maxFee.toDTO())
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