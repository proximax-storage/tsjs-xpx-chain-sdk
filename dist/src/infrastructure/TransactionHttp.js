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
const requestPromise = require("request-promise-native");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const PublicAccount_1 = require("../model/account/PublicAccount");
const Deadline_1 = require("../model/transaction/Deadline");
const SyncAnnounce_1 = require("../model/transaction/SyncAnnounce");
const TransactionAnnounceResponse_1 = require("../model/transaction/TransactionAnnounceResponse");
const TransactionStatus_1 = require("../model/transaction/TransactionStatus");
const TransactionType_1 = require("../model/transaction/TransactionType");
const UInt64_1 = require("../model/UInt64");
const api_1 = require("./api");
const Http_1 = require("./Http");
const CreateTransactionFromDTO_1 = require("./transaction/CreateTransactionFromDTO");
/**
 * Transaction http repository.
 *
 * @since 1.0
 */
class TransactionHttp extends Http_1.Http {
    /**
     * Constructor
     * @param url
     */
    constructor(url) {
        super();
        this.url = url;
        this.transactionRoutesApi = new api_1.TransactionRoutesApi(url);
        this.blockRoutesApi = new api_1.BlockRoutesApi(url);
    }
    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     * @returns Observable<Transaction>
     */
    getTransaction(transactionId) {
        return rxjs_1.from(this.transactionRoutesApi.getTransaction(transactionId)).pipe(operators_1.map((transactionDTO) => {
            return CreateTransactionFromDTO_1.CreateTransactionFromDTO(transactionDTO);
        }));
    }
    /**
     * Gets an array of transactions for different transaction ids
     * @param transactionIds - Array of transactions id and/or hash.
     * @returns Observable<Transaction[]>
     */
    getTransactions(transactionIds) {
        const transactionIdsBody = {
            transactionIds,
        };
        return rxjs_1.from(this.transactionRoutesApi.getTransactions(transactionIdsBody)).pipe(operators_1.map((transactionsDTO) => {
            return transactionsDTO.map((transactionDTO) => {
                return CreateTransactionFromDTO_1.CreateTransactionFromDTO(transactionDTO);
            });
        }));
    }
    /**
     * Gets a transaction status for a transaction hash
     * @param hash - Transaction hash.
     * @returns Observable<TransactionStatus>
     */
    getTransactionStatus(transactionHash) {
        return rxjs_1.from(this.transactionRoutesApi.getTransactionStatus(transactionHash)).pipe(operators_1.map((transactionStatusDTO) => {
            return new TransactionStatus_1.TransactionStatus(transactionStatusDTO.status, transactionStatusDTO.group, transactionStatusDTO.hash, transactionStatusDTO.deadline ? Deadline_1.Deadline.createFromDTO(transactionStatusDTO.deadline) : undefined, transactionStatusDTO.height ? new UInt64_1.UInt64(transactionStatusDTO.height) : undefined);
        }));
    }
    /**
     * Gets an array of transaction status for different transaction hashes
     * @param transactionHashes - Array of transaction hash
     * @returns Observable<TransactionStatus[]>
     */
    getTransactionsStatuses(transactionHashes) {
        const transactionHashesBody = {
            hashes: transactionHashes,
        };
        return rxjs_1.from(this.transactionRoutesApi.getTransactionsStatuses(transactionHashesBody)).pipe(operators_1.map((transactionStatusesDTO) => {
            return transactionStatusesDTO.map((transactionStatusDTO) => {
                return new TransactionStatus_1.TransactionStatus(transactionStatusDTO.status, transactionStatusDTO.group, transactionStatusDTO.hash, transactionStatusDTO.deadline ? Deadline_1.Deadline.createFromDTO(transactionStatusDTO.deadline) : undefined, transactionStatusDTO.height ? new UInt64_1.UInt64(transactionStatusDTO.height) : undefined);
            });
        }));
    }
    /**
     * Send a signed transaction
     * @param signedTransaction - Signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    announce(signedTransaction) {
        return rxjs_1.from(this.transactionRoutesApi.announceTransaction(signedTransaction)).pipe(operators_1.map((transactionAnnounceResponseDTO) => {
            return new TransactionAnnounceResponse_1.TransactionAnnounceResponse(transactionAnnounceResponseDTO.message);
        }));
    }
    /**
     * Send a signed transaction with missing signatures
     * @param signedTransaction - Signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    announceAggregateBonded(signedTransaction) {
        if (signedTransaction.type !== TransactionType_1.TransactionType.AGGREGATE_BONDED) {
            return rxjs_1.throwError('Only Transaction Type 0x4241 is allowed for announce aggregate bonded');
        }
        return rxjs_1.from(this.transactionRoutesApi.announcePartialTransaction(signedTransaction)).pipe(operators_1.map((transactionAnnounceResponseDTO) => {
            return new TransactionAnnounceResponse_1.TransactionAnnounceResponse(transactionAnnounceResponseDTO.message);
        }));
    }
    /**
     * Send a cosignature signed transaction of an already announced transaction
     * @param cosignatureSignedTransaction - Cosignature signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    announceAggregateBondedCosignature(cosignatureSignedTransaction) {
        return rxjs_1.from(this.transactionRoutesApi.announceCosignatureTransaction(cosignatureSignedTransaction)).pipe(operators_1.map((transactionAnnounceResponseDTO) => {
            return new TransactionAnnounceResponse_1.TransactionAnnounceResponse(transactionAnnounceResponseDTO.message);
        }));
    }
    announceSync(signedTx) {
        const address = PublicAccount_1.PublicAccount.createFromPublicKey(signedTx.signer, signedTx.networkType).address;
        const syncAnnounce = new SyncAnnounce_1.SyncAnnounce(signedTx.payload, signedTx.hash, address.plain());
        return rxjs_1.from(requestPromise.put({ url: this.url + `/transaction/sync`, body: syncAnnounce, json: true })).pipe(operators_1.map((response) => {
            if (response.status !== undefined) {
                throw new TransactionStatus_1.TransactionStatus('failed', response.status, response.hash, Deadline_1.Deadline.createFromDTO(response.deadline), UInt64_1.UInt64.fromUint(0));
            }
            else {
                return CreateTransactionFromDTO_1.CreateTransactionFromDTO(response);
            }
        }), operators_1.catchError((err) => {
            if (err.statusCode === 405) {
                return rxjs_1.throwError('non sync server');
            }
            return rxjs_1.throwError(err);
        }));
    }
    /**
     * Gets a transaction's effective paid fee
     * @param transactionId - Transaction id or hash.
     * @returns Observable<number>
     */
    getTransactionEffectiveFee(transactionId) {
        return rxjs_1.from(this.transactionRoutesApi.getTransaction(transactionId)).pipe(operators_1.mergeMap((transactionDTO) => {
            // parse transaction to take advantage of `size` getter overload
            const transaction = CreateTransactionFromDTO_1.CreateTransactionFromDTO(transactionDTO);
            const uintHeight = transaction.transactionInfo.height;
            // now read block details
            return rxjs_1.from(this.blockRoutesApi.getBlockByHeight(uintHeight.compact())).pipe(operators_1.map((blockDTO) => {
                // @see https://nemtech.github.io/concepts/transaction.html#fees
                // effective_fee = feeMultiplier x transaction::size
                return blockDTO.block.feeMultiplier * transaction.size;
            }));
        }), operators_1.catchError((err) => {
            return rxjs_1.throwError(err);
        }));
    }
}
exports.TransactionHttp = TransactionHttp;
//# sourceMappingURL=TransactionHttp.js.map