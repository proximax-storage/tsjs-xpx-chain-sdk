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
const SerializeTransactionToJSON_1 = require("../../infrastructure/transaction/SerializeTransactionToJSON");
const Deadline_1 = require("./Deadline");
const SignedTransaction_1 = require("./SignedTransaction");
const TransactionType_1 = require("./TransactionType");
/**
 * An abstract transaction class that serves as the base class of all NEM transactions.
 */
class Transaction {
    /**
     * @constructor
     * @param type
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(/**
                 * The transaction type.
                 */ type, 
    /**
     * The network type.
     */
    networkType, 
    /**
     * The transaction version number.
     */
    version, 
    /**
     * The deadline to include the transaction.
     */
    deadline, 
    /**
     * A sender of a transaction must specify during the transaction definition a max_fee,
     * meaning the maximum fee the account allows to spend for this transaction.
     */
    maxFee, 
    /**
     * The transaction signature (missing if part of an aggregate transaction).
     */
    signature, 
    /**
     * The account of the transaction creator.
     */
    signer, 
    /**
     * Transactions meta data object contains additional information about the transaction.
     */
    transactionInfo) {
        this.type = type;
        this.networkType = networkType;
        this.version = version;
        this.deadline = deadline;
        this.maxFee = maxFee;
        this.signature = signature;
        this.signer = signer;
        this.transactionInfo = transactionInfo;
    }
    /**
     * @internal
     * Serialize and sign transaction creating a new SignedTransaction
     * @param account - The account to sign the transaction
     * @param generationHash - Network generation hash hex
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {SignedTransaction}
     */
    signWith(account, generationHash, signSchema = crypto_1.SignSchema.SHA3) {
        const transaction = this.buildTransaction();
        const signedTransactionRaw = transaction.signTransaction(account, generationHash, signSchema);
        return new SignedTransaction_1.SignedTransaction(signedTransactionRaw.payload, signedTransactionRaw.hash, account.publicKey, this.type, this.networkType);
    }
    /**
     * @internal
     * @returns {Array<number>}
     */
    aggregateTransaction() {
        return this.buildTransaction().toAggregateTransaction(this.signer.publicKey);
    }
    /**
     * Convert an aggregate transaction to an inner transaction including transaction signer.
     * @param signer - Transaction signer.
     * @returns InnerTransaction
     */
    toAggregate(signer) {
        if (this.type === TransactionType_1.TransactionType.AGGREGATE_BONDED || this.type === TransactionType_1.TransactionType.AGGREGATE_COMPLETE) {
            throw new Error('Inner transaction cannot be an aggregated transaction.');
        }
        return Object.assign({ __proto__: Object.getPrototypeOf(this) }, this, { signer });
    }
    /**
     * Transaction pending to be included in a block
     * @returns {boolean}
     */
    isUnconfirmed() {
        return this.transactionInfo != null && this.transactionInfo.height.compact() === 0
            && this.transactionInfo.hash === this.transactionInfo.merkleComponentHash;
    }
    /**
     * Transaction included in a block
     * @returns {boolean}
     */
    isConfirmed() {
        return this.transactionInfo != null && this.transactionInfo.height.compact() > 0;
    }
    /**
     * Returns if a transaction has missing signatures.
     * @returns {boolean}
     */
    hasMissingSignatures() {
        return this.transactionInfo != null && this.transactionInfo.height.compact() === 0 &&
            this.transactionInfo.hash !== this.transactionInfo.merkleComponentHash;
    }
    /**
     * Transaction is not known by the network
     * @return {boolean}
     */
    isUnannounced() {
        return this.transactionInfo == null;
    }
    /**
     * @internal
     */
    versionToDTO() {
        return (this.networkType << 8) + this.version;
    }
    /**
     * @internal
     */
    versionToHex() {
        return '0x' + this.versionToDTO().toString(16);
    }
    /**
     * @description reapply a given value to the transaction in an immutable way
     * @param {Deadline} deadline
     * @returns {Transaction}
     * @memberof Transaction
     */
    reapplyGiven(deadline = Deadline_1.Deadline.create()) {
        if (this.isUnannounced()) {
            return Object.assign({ __proto__: Object.getPrototypeOf(this) }, this, { deadline });
        }
        throw new Error('an Announced transaction can\'t be modified');
    }
    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    get size() {
        const byteSize = 4 // size
            + 64 // signature
            + 32 // signer
            + 2 // version
            + 2 // type
            + 8 // maxFee
            + 8; // deadline
        return byteSize;
    }
    /**
     * @description Serialize a transaction object
     * @returns {string}
     * @memberof Transaction
     */
    serialize() {
        const transaction = this.buildTransaction();
        return transaction.serializeUnsignedTransaction();
    }
    /**
     * @description Create JSON object
     * @returns {Object}
     * @memberof Transaction
     */
    toJSON() {
        const commonTransactionObject = {
            type: this.type,
            networkType: this.networkType,
            version: this.versionToDTO(),
            maxFee: this.maxFee.toDTO(),
            deadline: this.deadline.toDTO(),
            signature: this.signature ? this.signature : '',
        };
        if (this.signer) {
            Object.assign(commonTransactionObject, { signer: this.signer.publicKey });
        }
        const childClassObject = SerializeTransactionToJSON_1.SerializeTransactionToJSON(this);
        return { transaction: Object.assign(commonTransactionObject, childClassObject) };
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map