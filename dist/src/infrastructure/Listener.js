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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const WebSocket = require("ws");
const PublicAccount_1 = require("../model/account/PublicAccount");
const BlockInfo_1 = require("../model/blockchain/BlockInfo");
const NamespaceId_1 = require("../model/namespace/NamespaceId");
const AggregateTransaction_1 = require("../model/transaction/AggregateTransaction");
const CosignatureSignedTransaction_1 = require("../model/transaction/CosignatureSignedTransaction");
const Deadline_1 = require("../model/transaction/Deadline");
const ModifyMultisigAccountTransaction_1 = require("../model/transaction/ModifyMultisigAccountTransaction");
const MultisigCosignatoryModificationType_1 = require("../model/transaction/MultisigCosignatoryModificationType");
const Transaction_1 = require("../model/transaction/Transaction");
const TransactionStatusError_1 = require("../model/transaction/TransactionStatusError");
const TransferTransaction_1 = require("../model/transaction/TransferTransaction");
const UInt64_1 = require("../model/UInt64");
const CreateTransactionFromDTO_1 = require("./transaction/CreateTransactionFromDTO");
var ListenerChannelName;
(function (ListenerChannelName) {
    ListenerChannelName["block"] = "block";
    ListenerChannelName["confirmedAdded"] = "confirmedAdded";
    ListenerChannelName["unconfirmedAdded"] = "unconfirmedAdded";
    ListenerChannelName["unconfirmedRemoved"] = "unconfirmedRemoved";
    ListenerChannelName["aggregateBondedAdded"] = "partialAdded";
    ListenerChannelName["aggregateBondedRemoved"] = "partialRemoved";
    ListenerChannelName["cosignature"] = "cosignature";
    ListenerChannelName["modifyMultisigAccount"] = "modifyMultisigAccount";
    ListenerChannelName["status"] = "status";
})(ListenerChannelName || (ListenerChannelName = {}));
/**
 * Listener service
 */
class Listener {
    /**
     * Constructor
     * @param config - Listener configuration
     * @param websocketInjected - (Optional) WebSocket injected when using listeners in client
     */
    constructor(/**
                 * Listener configuration.
                 */ config, 
    /**
     * WebSocket injected when using listeners in client.
     */
    websocketInjected) {
        this.config = config;
        this.websocketInjected = websocketInjected;
        this.config = config.replace(/\/$/, '');
        this.url = `${this.config}/ws`;
        this.messageSubject = new rxjs_1.Subject();
    }
    /**
     * Open web socket connection.
     * @returns Promise<Void>
     */
    open() {
        return new Promise((resolve, reject) => {
            if (this.webSocket === undefined || this.webSocket.readyState === WebSocket.CLOSED) {
                if (this.websocketInjected) {
                    this.webSocket = new this.websocketInjected(this.url);
                }
                else {
                    this.webSocket = new WebSocket(this.url);
                }
                this.webSocket.onopen = () => {
                    console.log('connection open');
                };
                this.webSocket.onerror = (err) => {
                    console.log('WebSocket Error ');
                    console.log(err);
                    reject(err);
                };
                this.webSocket.onmessage = (msg) => {
                    const message = JSON.parse(msg.data);
                    if (message.uid) {
                        this.uid = message.uid;
                        resolve();
                    }
                    else if (message.transaction) {
                        this.messageSubject.next({ channelName: message.meta.channelName, message: CreateTransactionFromDTO_1.CreateTransactionFromDTO(message) });
                    }
                    else if (message.block) {
                        const networkType = parseInt(message.block.version.toString(16).substr(0, 2), 16);
                        this.messageSubject.next({
                            channelName: ListenerChannelName.block, message: new BlockInfo_1.BlockInfo(message.meta.hash, message.meta.generationHash, message.meta.totalFee ? new UInt64_1.UInt64(message.meta.totalFee) : new UInt64_1.UInt64([0, 0]), message.meta.numTransactions, message.block.signature, PublicAccount_1.PublicAccount.createFromPublicKey(message.block.signer, networkType), networkType, parseInt(message.block.version.toString(16).substr(2, 2), 16), // Tx version
                            message.block.type, new UInt64_1.UInt64(message.block.height), new UInt64_1.UInt64(message.block.timestamp), new UInt64_1.UInt64(message.block.difficulty), message.block.feeMultiplier, message.block.previousBlockHash, message.block.blockTransactionsHash, message.block.blockReceiptsHash, message.block.stateHash, CreateTransactionFromDTO_1.extractBeneficiary(message, networkType)),
                        });
                    }
                    else if (message.status) {
                        this.messageSubject.next({
                            channelName: ListenerChannelName.status, message: new TransactionStatusError_1.TransactionStatusError(message.hash, message.status, Deadline_1.Deadline.createFromDTO(message.deadline)),
                        });
                    }
                    else if (message.meta) {
                        this.messageSubject.next({ channelName: message.meta.channelName, message: message.meta.hash });
                    }
                    else if (message.parentHash) {
                        this.messageSubject.next({
                            channelName: ListenerChannelName.cosignature,
                            message: new CosignatureSignedTransaction_1.CosignatureSignedTransaction(message.parentHash, message.signature, message.signer),
                        });
                    }
                };
            }
            else {
                resolve();
            }
        });
    }
    /**
     * returns a boolean that repressents the open state
     * @returns a boolean
     */
    isOpen() {
        if (this.webSocket) {
            return this.webSocket.readyState === WebSocket.OPEN;
        }
        return false;
    }
    /**
     * Close web socket connection.
     * @returns void
     */
    close() {
        if (this.webSocket && (this.webSocket.readyState === WebSocket.OPEN || this.webSocket.readyState === WebSocket.CONNECTING)) {
            this.webSocket.close();
        }
    }
    /**
     * Terminate web socket connection.
     * @returns void
     */
    terminate() {
        if (this.webSocket) {
            this.webSocket.close();
        }
    }
    /**
     * Returns an observable stream of BlockInfo.
     * Each time a new Block is added into the blockchain,
     * it emits a new BlockInfo in the event stream.
     *
     * @return an observable stream of BlockInfo
     */
    newBlock() {
        this.subscribeTo('block');
        return this.messageSubject
            .asObservable().pipe(operators_1.share(), operators_1.filter((_) => _.channelName === ListenerChannelName.block), operators_1.filter((_) => _.message instanceof BlockInfo_1.BlockInfo), operators_1.map((_) => _.message));
    }
    /**
     * Returns an observable stream of Transaction for a specific address.
     * Each time a transaction is in confirmed state an it involves the address,
     * it emits a new Transaction in the event stream.
     *
     * @param address address we listen when a transaction is in confirmed state
     * @return an observable stream of Transaction with state confirmed
     */
    confirmed(address) {
        this.subscribeTo(`confirmedAdded/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(operators_1.filter((_) => _.channelName === ListenerChannelName.confirmedAdded), operators_1.filter((_) => _.message instanceof Transaction_1.Transaction), operators_1.map((_) => _.message), operators_1.filter((_) => this.transactionFromAddress(_, address)));
    }
    /**
     * Returns an observable stream of Transaction for a specific address.
     * Each time a transaction is in unconfirmed state an it involves the address,
     * it emits a new Transaction in the event stream.
     *
     * @param address address we listen when a transaction is in unconfirmed state
     * @return an observable stream of Transaction with state unconfirmed
     */
    unconfirmedAdded(address) {
        this.subscribeTo(`unconfirmedAdded/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(operators_1.filter((_) => _.channelName === ListenerChannelName.unconfirmedAdded), operators_1.filter((_) => _.message instanceof Transaction_1.Transaction), operators_1.map((_) => _.message), operators_1.filter((_) => this.transactionFromAddress(_, address)));
    }
    /**
     * Returns an observable stream of Transaction Hashes for specific address.
     * Each time a transaction with state unconfirmed changes its state,
     * it emits a new message with the transaction hash in the event stream.
     *
     * @param address address we listen when a transaction is removed from unconfirmed state
     * @return an observable stream of Strings with the transaction hash
     */
    unconfirmedRemoved(address) {
        this.subscribeTo(`unconfirmedRemoved/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(operators_1.filter((_) => _.channelName === ListenerChannelName.unconfirmedRemoved), operators_1.filter((_) => typeof _.message === 'string'), operators_1.map((_) => _.message));
    }
    /**
     * Return an observable of {@link AggregateTransaction} for specific address.
     * Each time an aggregate bonded transaction is announced,
     * it emits a new {@link AggregateTransaction} in the event stream.
     *
     * @param address address we listen when a transaction with missing signatures state
     * @return an observable stream of AggregateTransaction with missing signatures state
     */
    aggregateBondedAdded(address) {
        this.subscribeTo(`partialAdded/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(operators_1.filter((_) => _.channelName === ListenerChannelName.aggregateBondedAdded), operators_1.filter((_) => _.message instanceof AggregateTransaction_1.AggregateTransaction), operators_1.map((_) => _.message), operators_1.filter((_) => this.transactionFromAddress(_, address)));
    }
    /**
     * Returns an observable stream of Transaction Hashes for specific address.
     * Each time an aggregate bonded transaction is announced,
     * it emits a new message with the transaction hash in the event stream.
     *
     * @param address address we listen when a transaction is confirmed or rejected
     * @return an observable stream of Strings with the transaction hash
     */
    aggregateBondedRemoved(address) {
        this.subscribeTo(`partialRemoved/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(operators_1.filter((_) => _.channelName === ListenerChannelName.aggregateBondedRemoved), operators_1.filter((_) => typeof _.message === 'string'), operators_1.map((_) => _.message));
    }
    /**
     * Returns an observable stream of {@link TransactionStatusError} for specific address.
     * Each time a transaction contains an error,
     * it emits a new message with the transaction status error in the event stream.
     *
     * @param address address we listen to be notified when some error happened
     * @return an observable stream of {@link TransactionStatusError}
     */
    status(address) {
        this.subscribeTo(`status/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(operators_1.filter((_) => _.channelName === ListenerChannelName.status), operators_1.filter((_) => _.message instanceof TransactionStatusError_1.TransactionStatusError), operators_1.map((_) => _.message));
    }
    /**
     * Returns an observable stream of {@link CosignatureSignedTransaction} for specific address.
     * Each time a cosigner signs a transaction the address initialized,
     * it emits a new message with the cosignatory signed transaction in the even stream.
     *
     * @param address address we listen when a cosignatory is added to some transaction address sent
     * @return an observable stream of {@link CosignatureSignedTransaction}
     */
    cosignatureAdded(address) {
        this.subscribeTo(`cosignature/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(operators_1.filter((_) => _.channelName === ListenerChannelName.cosignature), operators_1.filter((_) => _.message instanceof CosignatureSignedTransaction_1.CosignatureSignedTransaction), operators_1.map((_) => _.message));
    }
    /**
     * @internal
     * Subscribes to a channelName.
     * @param channel - Channel subscribed to.
     */
    subscribeTo(channel) {
        const subscriptionMessage = {
            uid: this.uid,
            subscribe: channel,
        };
        this.webSocket.send(JSON.stringify(subscriptionMessage));
    }
    /**
     * @internal
     * @param channel - Channel to unsubscribe
     */
    unsubscribeTo(channel) {
        const unsubscribeMessage = {
            uid: this.uid,
            unsubscribe: channel,
        };
        this.webSocket.send(JSON.stringify(unsubscribeMessage));
    }
    /**
     * @internal
     * Filters if a transaction has been initiated or signed by an address
     * @param transaction - Transaction object
     * @param address - Address
     * @returns boolean
     */
    transactionFromAddress(transaction, address) {
        let transactionFromAddress = this.transactionHasSignerOrReceptor(transaction, address);
        if (transaction instanceof AggregateTransaction_1.AggregateTransaction) {
            transaction.cosignatures.map((_) => {
                if (_.signer.address.equals(address)) {
                    transactionFromAddress = true;
                }
            });
            transaction.innerTransactions.map((innerTransaction) => {
                if (this.transactionHasSignerOrReceptor(innerTransaction, address)) {
                    transactionFromAddress = true;
                }
            });
        }
        return transactionFromAddress;
    }
    /**
     * @internal
     * @param transaction
     * @param address
     * @returns {boolean}
     */
    transactionHasSignerOrReceptor(transaction, address) {
        if (address instanceof NamespaceId_1.NamespaceId) {
            return transaction instanceof TransferTransaction_1.TransferTransaction
                && transaction.recipient.equals(address);
        }
        return transaction.signer.address.equals(address) || (transaction instanceof TransferTransaction_1.TransferTransaction
            && transaction.recipient.equals(address));
    }
    /**
     * @internal
     * Filters if an account has been added to multi signatories
     * @param transaction - Transaction object
     * @param address - Address
     * @returns boolean
     */
    // tslint:disable-next-line:adjacent-overload-signatures
    accountAddedToMultiSig(transaction, address) {
        if (transaction instanceof ModifyMultisigAccountTransaction_1.ModifyMultisigAccountTransaction) {
            transaction.modifications.map((_) => {
                if (_.type === MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Add && _.cosignatoryPublicAccount.address.equals(address)) {
                    return true;
                }
            });
        }
        return false;
    }
}
exports.Listener = Listener;
//# sourceMappingURL=Listener.js.map