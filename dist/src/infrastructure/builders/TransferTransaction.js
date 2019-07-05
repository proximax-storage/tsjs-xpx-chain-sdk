"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module transactions/TransferTransaction
 */
const format_1 = require("../../core/format");
const TransferTransactionBufferPackage = require("../../infrastructure/buffers/TransferTransactionBuffer");
const VerifiableTransaction_1 = require("../../infrastructure/builders/VerifiableTransaction");
const TransferTransactionSchema_1 = require("../../infrastructure/schemas/TransferTransactionSchema");
const TransactionType_1 = require("../../model/transaction/TransactionType");
const flatbuffers_1 = require("flatbuffers");
const MessageType_1 = require("../../model/transaction/MessageType");
const { TransferTransactionBuffer, MessageBuffer, MosaicBuffer, } = TransferTransactionBufferPackage.default.Buffers;
class TransferTransaction extends VerifiableTransaction_1.VerifiableTransaction {
    constructor(bytes) {
        super(bytes, TransferTransactionSchema_1.default);
    }
}
exports.default = TransferTransaction;
// tslint:disable-next-line:max-classes-per-file
class Builder {
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType_1.TransactionType.TRANSFER;
    }
    addFee(maxFee) {
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
    addRecipient(recipient) {
        if (/^[0-9a-fA-F]{16}$/.test(recipient)) {
            // received hexadecimal notation of namespaceId (alias)
            this.recipient = format_1.RawAddress.aliasToRecipient(format_1.Convert.hexToUint8(recipient));
        }
        else {
            // received recipient address
            this.recipient = format_1.RawAddress.stringToAddress(recipient);
        }
        return this;
    }
    addMessage(message) {
        this.message = message;
        return this;
    }
    addMosaics(mosaics) {
        this.mosaics = mosaics.sort((a, b) => {
            if (Number(a.id[1]) > b.id[1]) {
                return 1;
            }
            else if (a.id[1] < b.id[1]) {
                return -1;
            }
            return 0;
        });
        return this;
    }
    build() {
        const builder = new flatbuffers_1.flatbuffers.Builder(1);
        // Constants
        // Create message
        let bytePayload;
        if (this.message.type === MessageType_1.MessageType.EncryptedMessage) {
            bytePayload = format_1.Convert.hexToUint8(this.message.payload);
        }
        else {
            bytePayload = format_1.Convert.hexToUint8(format_1.Convert.utf8ToHex(this.message.payload));
        }
        const payload = MessageBuffer.createPayloadVector(builder, bytePayload);
        MessageBuffer.startMessageBuffer(builder);
        MessageBuffer.addType(builder, this.message.type);
        MessageBuffer.addPayload(builder, payload);
        const message = MessageBuffer.endMessageBuffer(builder);
        // Create mosaics
        const mosaics = [];
        this.mosaics.forEach(mosaic => {
            const id = MosaicBuffer.createIdVector(builder, mosaic.id);
            const amount = MosaicBuffer.createAmountVector(builder, mosaic.amount);
            MosaicBuffer.startMosaicBuffer(builder);
            MosaicBuffer.addId(builder, id);
            MosaicBuffer.addAmount(builder, amount);
            mosaics.push(MosaicBuffer.endMosaicBuffer(builder));
        });
        // Create vectors
        const signatureVector = TransferTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = TransferTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = TransferTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = TransferTransactionBuffer.createFeeVector(builder, this.maxFee);
        const recipientVector = TransferTransactionBuffer.createRecipientVector(builder, this.recipient);
        const mosaicsVector = TransferTransactionBuffer.createMosaicsVector(builder, mosaics);
        TransferTransactionBuffer.startTransferTransactionBuffer(builder);
        TransferTransactionBuffer.addSize(builder, 149 + (16 * this.mosaics.length) + bytePayload.length);
        TransferTransactionBuffer.addSignature(builder, signatureVector);
        TransferTransactionBuffer.addSigner(builder, signerVector);
        TransferTransactionBuffer.addVersion(builder, this.version);
        TransferTransactionBuffer.addType(builder, this.type);
        TransferTransactionBuffer.addFee(builder, feeVector);
        TransferTransactionBuffer.addDeadline(builder, deadlineVector);
        TransferTransactionBuffer.addRecipient(builder, recipientVector);
        TransferTransactionBuffer.addNumMosaics(builder, this.mosaics.length);
        TransferTransactionBuffer.addMessageSize(builder, bytePayload.length + 1);
        TransferTransactionBuffer.addMessage(builder, message);
        TransferTransactionBuffer.addMosaics(builder, mosaicsVector);
        // Calculate size
        const codedTransfer = TransferTransactionBuffer.endTransferTransactionBuffer(builder);
        builder.finish(codedTransfer);
        const bytes = builder.asUint8Array();
        return new TransferTransaction(bytes);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=TransferTransaction.js.map