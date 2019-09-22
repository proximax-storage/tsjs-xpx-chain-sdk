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
const TransferTransaction_1 = require("../../infrastructure/builders/TransferTransaction");
const Transaction_1 = require("./Transaction");
const NamespaceId_1 = require("../namespace/NamespaceId");
const Transaction_2 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
const PlainMessage_1 = require("./PlainMessage");
const FeeCalculationStrategy_1 = require("./FeeCalculationStrategy");
/**
 * Transfer transactions contain data about transfers of mosaics and message to another account.
 */
class TransferTransaction extends Transaction_2.Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param recipient
     * @param mosaics
     * @param message
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType, version, deadline, maxFee, 
    /**
     * The address of the recipient.
     */
    recipient, 
    /**
     * The array of Mosaic objects.
     */
    mosaics, 
    /**
     * The transaction message of 2048 characters.
     */
    message, signature, signer, transactionInfo) {
        super(TransactionType_1.TransactionType.TRANSFER, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.recipient = recipient;
        this.mosaics = mosaics;
        this.message = message;
    }
    /**
     * Create a transfer transaction object
     * @param deadline - The deadline to include the transaction.
     * @param recipient - The recipient of the transaction.
     * @param mosaics - The array of mosaics.
     * @param message - The transaction message.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {TransferTransaction}
     */
    static create(deadline, recipient, mosaics, message, networkType, maxFee) {
        return new TransferTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .recipient(recipient)
            .mosaics(mosaics)
            .message(message)
            .build();
    }
    /**
     * Return the string notation for the set recipient
     * @internal
     * @returns {string}
     */
    recipientToString() {
        if (this.recipient instanceof NamespaceId_1.NamespaceId) {
            // namespaceId recipient, return hexadecimal notation
            return this.recipient.toHex();
        }
        // address recipient
        return this.recipient.plain();
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a TransferTransaction
     * @returns {number}
     * @memberof TransferTransaction
     */
    get size() {
        return TransferTransaction.calculateSize(this.message.size(), this.mosaics.length);
    }
    static calculateSize(messageSize, mosaicsCount) {
        const byteSize = Transaction_2.Transaction.getHeaderSize();
        // recipient and number of mosaics are static byte size
        const byteRecipient = 25;
        const byteNumMosaics = 2;
        return byteSize + byteRecipient + byteNumMosaics + messageSize + 8 * mosaicsCount;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new TransferTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addRecipient(this.recipientToString())
            .addMosaics(this.mosaics.map((mosaic) => mosaic.toDTO()))
            .addMessage(this.message)
            .build();
    }
}
exports.TransferTransaction = TransferTransaction;
class TransferTransactionBuilder extends Transaction_1.TransactionBuilder {
    constructor() {
        super(...arguments);
        this._mosaics = [];
        this._message = PlainMessage_1.EmptyMessage;
    }
    recipient(recipient) {
        this._recipient = recipient;
        return this;
    }
    mosaics(mosaics) {
        this._mosaics = mosaics;
        return this;
    }
    message(message) {
        this._message = message;
        return this;
    }
    build() {
        return new TransferTransaction(this._networkType, TransactionVersion_1.TransactionVersion.TRANSFER, this._deadline ? this._deadline : this._createNewDeadlineFn(), this._maxFee ? this._maxFee : FeeCalculationStrategy_1.calculateFee(TransferTransaction.calculateSize(this._message.size(), this._mosaics.length), this._feeCalculationStrategy), this._recipient, this._mosaics, this._message, this._signature, this._signer, this._transactionInfo);
    }
}
exports.TransferTransactionBuilder = TransferTransactionBuilder;
//# sourceMappingURL=TransferTransaction.js.map