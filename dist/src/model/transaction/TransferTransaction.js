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
const format_1 = require("../../core/format");
const TransferTransaction_1 = require("../../infrastructure/builders/TransferTransaction");
const NamespaceId_1 = require("../namespace/NamespaceId");
const UInt64_1 = require("../UInt64");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
/**
 * Transfer transactions contain data about transfers of mosaics and message to another account.
 */
class TransferTransaction extends Transaction_1.Transaction {
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
    static create(deadline, recipient, mosaics, message, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        return new TransferTransaction(networkType, TransactionVersion_1.TransactionVersion.TRANSFER, deadline, maxFee, recipient, mosaics, message);
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
        const byteSize = super.size;
        // recipient and number of mosaics are static byte size
        const byteRecipient = 25;
        const byteNumMosaics = 2;
        // read message payload size
        const bytePayload = format_1.Convert.hexToUint8(format_1.Convert.utf8ToHex(this.message.payload || '')).length;
        // mosaicId / namespaceId are written on 8 bytes
        const byteMosaics = 8 * this.mosaics.length;
        return byteSize + byteRecipient + byteNumMosaics + bytePayload + byteMosaics;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new TransferTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
<<<<<<< HEAD
            .addMaxFee(this.maxFee.toDTO())
=======
            .addFee(this.maxFee.toDTO())
>>>>>>> jwt
            .addVersion(this.versionToDTO())
            .addRecipient(this.recipientToString())
            .addMosaics(this.mosaics.map((mosaic) => mosaic.toDTO()))
            .addMessage(this.message)
            .build();
    }
}
exports.TransferTransaction = TransferTransaction;
//# sourceMappingURL=TransferTransaction.js.map