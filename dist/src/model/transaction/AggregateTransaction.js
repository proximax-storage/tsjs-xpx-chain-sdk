"use strict";
/*
 * Copyright 2018 NEM
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
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("../../core/crypto");
const AggregateTransaction_1 = require("../../infrastructure/builders/AggregateTransaction");
const UInt64_1 = require("../UInt64");
const SignedTransaction_1 = require("./SignedTransaction");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
/**
 * Aggregate innerTransactions contain multiple innerTransactions that can be initiated by different accounts.
 */
class AggregateTransaction extends Transaction_1.Transaction {
    /**
     * @param networkType
     * @param type
     * @param version
     * @param deadline
     * @param maxFee
     * @param innerTransactions
     * @param cosignatures
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType, type, version, deadline, maxFee, 
    /**
     * The array of innerTransactions included in the aggregate transaction.
     */
    innerTransactions, 
    /**
     * The array of transaction cosigners signatures.
     */
    cosignatures, signature, signer, transactionInfo) {
        super(type, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.innerTransactions = innerTransactions;
        this.cosignatures = cosignatures;
    }
    /**
     * Create an aggregate complete transaction object
     * @param deadline - The deadline to include the transaction.
     * @param innerTransactions - The array of inner innerTransactions.
     * @param networkType - The network type.
     * @param cosignatures
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AggregateTransaction}
     */
    static createComplete(deadline, innerTransactions, networkType, cosignatures, maxFee = new UInt64_1.UInt64([0, 0])) {
        return new AggregateTransaction(networkType, TransactionType_1.TransactionType.AGGREGATE_COMPLETE, TransactionVersion_1.TransactionVersion.AGGREGATE_COMPLETE, deadline, maxFee, innerTransactions, cosignatures);
    }
    /**
     * Create an aggregate bonded transaction object
     * @param {Deadline} deadline
     * @param {InnerTransaction[]} innerTransactions
     * @param {NetworkType} networkType
     * @param {AggregateTransactionCosignature[]} cosignatures
     * @param {UInt64} maxFee - (Optional) Max fee defined by the sender
     * @return {AggregateTransaction}
     */
    static createBonded(deadline, innerTransactions, networkType, cosignatures = [], maxFee = new UInt64_1.UInt64([0, 0])) {
        return new AggregateTransaction(networkType, TransactionType_1.TransactionType.AGGREGATE_BONDED, TransactionVersion_1.TransactionVersion.AGGREGATE_BONDED, deadline, maxFee, innerTransactions, cosignatures);
    }
    /**
     * @internal
     * @returns {AggregateTransaction}
     */
    buildTransaction() {
        return new AggregateTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addType(this.type)
            .addFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addTransactions(this.innerTransactions.map((transaction) => {
            return transaction.aggregateTransaction();
        })).build();
    }
    /**
     * @internal
     * Sign transaction with cosignatories creating a new SignedTransaction
     * @param initiatorAccount - Initiator account
     * @param cosignatories - The array of accounts that will cosign the transaction
     * @param generationHash - Network generation hash hex
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {SignedTransaction}
     */
    signTransactionWithCosignatories(initiatorAccount, cosignatories, generationHash, signSchema = crypto_1.SignSchema.SHA3) {
        const aggregateTransaction = this.buildTransaction();
        const signedTransactionRaw = aggregateTransaction
            .signTransactionWithCosigners(initiatorAccount, cosignatories, generationHash, signSchema);
        return new SignedTransaction_1.SignedTransaction(signedTransactionRaw.payload, signedTransactionRaw.hash, initiatorAccount.publicKey, this.type, this.networkType);
    }
    /**
     * @internal
     * Sign transaction with cosignatories collected from cosigned transactions and creating a new SignedTransaction
     * For off chain Aggregated Complete Transaction co-signing.
     * @param initiatorAccount - Initiator account
     * @param {CosignatureSignedTransaction[]} cosignatureSignedTransactions - Array of cosigned transaction
     * @param generationHash - Network generation hash hex
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {SignedTransaction}
     */
    signTransactionGivenSignatures(initiatorAccount, cosignatureSignedTransactions, generationHash, signSchema = crypto_1.SignSchema.SHA3) {
        const aggregateTransaction = this.buildTransaction();
        const signedTransactionRaw = aggregateTransaction.signTransactionGivenSignatures(initiatorAccount, cosignatureSignedTransactions, generationHash, signSchema);
        return new SignedTransaction_1.SignedTransaction(signedTransactionRaw.payload, signedTransactionRaw.hash, initiatorAccount.publicKey, this.type, this.networkType);
    }
    /**
     * Check if account has signed transaction
     * @param publicAccount - Signer public account
     * @returns {boolean}
     */
    signedByAccount(publicAccount) {
        return this.cosignatures.find((cosignature) => cosignature.signer.equals(publicAccount)) !== undefined
            || (this.signer !== undefined && this.signer.equals(publicAccount));
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a AggregateTransaction
     * @returns {number}
     * @memberof AggregateTransaction
     */
    get size() {
        const byteSize = super.size;
        // set static byte size fields
        const byteTransactionsSize = 4;
        // calculate each inner transaction's size
        let byteTransactions = 0;
        this.innerTransactions.map((transaction) => {
            byteTransactions += transaction.size;
        });
        return byteSize + byteTransactionsSize + byteTransactions;
    }
}
exports.AggregateTransaction = AggregateTransaction;
//# sourceMappingURL=AggregateTransaction.js.map