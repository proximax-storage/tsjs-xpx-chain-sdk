/*
 * Copyright 2023 ProximaX
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

import axios from 'axios';
import { AxiosResponse } from 'axios';
import {from as observableFrom, Observable, throwError as observableThrowError} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {PublicAccount} from '../model/account/PublicAccount';
import {CosignatureSignedTransaction} from '../model/transaction/CosignatureSignedTransaction';
import {Deadline} from '../model/transaction/Deadline';
import {SignedTransaction} from '../model/transaction/SignedTransaction';
import { SyncAnnounce } from '../model/transaction/SyncAnnounce';
import {Transaction} from '../model/transaction/Transaction';
import {TransactionAnnounceResponse} from '../model/transaction/TransactionAnnounceResponse';
import {TransactionInfo} from '../model/transaction/TransactionInfo';
import {TransactionStatus} from '../model/transaction/TransactionStatus';
import {TransactionType} from '../model/transaction/TransactionType';
import {TransactionCount} from '../model/transaction/TransactionCount';
import {UInt64} from '../model/UInt64';
import { AnnounceTransactionInfoDTO,
         BlockInfoDTO, BlockRoutesApi,
         TransactionInfoDTO,
         TransactionSearchDTO,
         TransactionRoutesApi,
         TransactionStatusDTO,
         BlockInfoResponse,
         TransactionInfoResponse,
         TransactionsInfoResponse,
         TransactionSearchResponse,
         AnnounceTransactionResponse,
         TransactionsStatusResponse,
         TransactionStatusResponse,
         TransactionsCountResponse
        } from './api';
import {Http} from './Http';
import {CreateTransactionFromDTO} from './transaction/CreateTransactionFromDTO';
import {TransactionRepository} from './TransactionRepository';
import {TransactionGroupType} from '../model/transaction/TransactionGroupType';
import {TransactionSearch} from '../model/transaction/TransactionSearch';
import {TransactionQueryParams} from './TransactionQueryParams';
import { RequestOptions } from './RequestOptions';
import { Pagination } from '../model/Pagination';

/**
 * Transaction http repository.
 *
 * @since 1.0
 */
export class TransactionHttp extends Http implements TransactionRepository {
    /**
     * @internal
     * xpx chain Library transaction routes api
     */
    private transactionRoutesApi: TransactionRoutesApi;

    /**
     * @internal
     * xpx chain Library blockchain routes api
     */
    private blockRoutesApi: BlockRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(private readonly url: string) {
        super();
        this.transactionRoutesApi = new TransactionRoutesApi(url);
        this.blockRoutesApi = new BlockRoutesApi(url);
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     * @returns Observable<Transaction>
     */
    public getTransaction(transactionId: string, requestOptions?: RequestOptions): Observable<Transaction> {
        return observableFrom(this.transactionRoutesApi.getTransaction(transactionId, requestOptions)).pipe(
            map((response: TransactionInfoResponse) => {
                return CreateTransactionFromDTO(response.body);
            })
        );
    }

    /**
     * Gets an array of transactions for different transaction ids
     * @param transactionIds - Array of transactions id and/or hash.
     * @returns Observable<Transaction[]>
     */
    public getTransactions(transactionIds: string[], transactionGroupType: TransactionGroupType = TransactionGroupType.CONFIRMED, requestOptions?: RequestOptions): Observable<Transaction[]> {
        const transactionIdsBody = {
            transactionIds,
        };
        return observableFrom(
            this.transactionRoutesApi.getTransactions(transactionIdsBody, transactionGroupType, requestOptions)).pipe(
                map((response: TransactionsInfoResponse) => {
                    return response.body.map((transactionDTO) => {
                        return CreateTransactionFromDTO(transactionDTO);
                    });
                })
            );
    }

    /**
     * Gets an array of transactions for different transaction ids
     * @param transactionIds - Array of transactions id and/or hash.
     * @returns Observable<Transaction[]>
     */
     public getTransactionsCount(transactionTypes: TransactionType[], transactionGroupType: TransactionGroupType = TransactionGroupType.CONFIRMED, requestOptions?: RequestOptions): Observable<TransactionCount[]> {
        const transactionTypesBody = {
            transactionTypes
        };
        return observableFrom(
            this.transactionRoutesApi.getTransactionsCount(transactionTypesBody, transactionGroupType, requestOptions)).pipe(
                map((response: TransactionsCountResponse) => {
                    return response.body.map((transactionCountDTO) => {
                        return new TransactionCount(transactionCountDTO.type, transactionCountDTO.count);
                        }
                    );
                })
            );
    }

    /**
     * Gets a transaction status for a transaction hash
     * @param hash - Transaction hash.
     * @returns Observable<TransactionStatus>
     */
    public getTransactionStatus(transactionHash: string, requestOptions?: RequestOptions): Observable<TransactionStatus> {
        return observableFrom(this.transactionRoutesApi.getTransactionStatus(transactionHash, requestOptions)).pipe(
            map((response: TransactionStatusResponse) => {
                const transactionStatusDTO = response.body;
                return new TransactionStatus(
                    transactionStatusDTO.status,
                    transactionStatusDTO.group,
                    transactionStatusDTO.hash,
                    transactionStatusDTO.deadline ? Deadline.createFromDTO(transactionStatusDTO.deadline) : undefined,
                    transactionStatusDTO.height ? new UInt64(transactionStatusDTO.height) : undefined);
            }));
    }

    /**
     * Gets an array of transaction status for different transaction hashes
     * @param transactionHashes - Array of transaction hash
     * @returns Observable<TransactionStatus[]>
     */
    public getTransactionsStatuses(transactionHashes: string[], requestOptions?: RequestOptions): Observable<TransactionStatus[]> {
        const transactionHashesBody = {
            hashes: transactionHashes,
        };
        return observableFrom(
            this.transactionRoutesApi.getTransactionsStatuses(transactionHashesBody, requestOptions)).pipe(
            map((response: TransactionsStatusResponse) => {
                return response.body.map((transactionStatusDTO) => {
                    return new TransactionStatus(
                        transactionStatusDTO.status,
                        transactionStatusDTO.group,
                        transactionStatusDTO.hash,
                        transactionStatusDTO.deadline ? Deadline.createFromDTO(transactionStatusDTO.deadline) : undefined,
                        transactionStatusDTO.height ? new UInt64(transactionStatusDTO.height) : undefined);
                });
            }));
    }

    /**
     * Send a signed transaction
     * @param signedTransaction - Signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    public announce(signedTransaction: SignedTransaction, requestOptions?: RequestOptions): Observable<TransactionAnnounceResponse> {
        return observableFrom(this.transactionRoutesApi.announceTransaction(signedTransaction, requestOptions)).pipe(
            map((response: AnnounceTransactionResponse) => {
                return new TransactionAnnounceResponse(response.body.message);
            }));
    }

    /**
     * Send a signed transaction with missing signatures
     * @param signedTransaction - Signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    public announceAggregateBonded(signedTransaction: SignedTransaction, requestOptions?: RequestOptions): Observable<TransactionAnnounceResponse> {
        if (signedTransaction.type !== TransactionType.AGGREGATE_BONDED) {
            // return observableThrowError(()=> new Error('Only Transaction Type 0x4241 is allowed for announce aggregate bonded'));
            throw new Error('Only Transaction Type 0x4241 is allowed for announce aggregate bonded');
        }
        return observableFrom(this.transactionRoutesApi.announcePartialTransaction(signedTransaction, requestOptions)).pipe(
            map((response: AnnounceTransactionResponse) => {
                return new TransactionAnnounceResponse(response.body.message);
            }));
    }

    /**
     * Send a cosignature signed transaction of an already announced transaction
     * @param cosignatureSignedTransaction - Cosignature signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    public announceAggregateBondedCosignature(
        cosignatureSignedTransaction: CosignatureSignedTransaction, requestOptions?: RequestOptions): Observable<TransactionAnnounceResponse> {
        return observableFrom(this.transactionRoutesApi.announceCosignatureTransaction(cosignatureSignedTransaction, requestOptions)).pipe(
            map((response: AnnounceTransactionResponse) => {
                return new TransactionAnnounceResponse(response.body.message);
            }));
    }

    /**
     * Gets a transaction's effective paid fee
     * @param transactionId - Transaction id or hash.
     * @returns Observable<number>
     */
    public getTransactionEffectiveFee(transactionId: string, requestOptions?: RequestOptions): Observable<number> {
        return observableFrom(this.transactionRoutesApi.getTransaction(transactionId, requestOptions)).pipe(
            mergeMap((response: TransactionInfoResponse) => {
                // parse transaction to take advantage of `size` getter overload
                const transaction = CreateTransactionFromDTO(response.body);
                const uintHeight = (transaction.transactionInfo as TransactionInfo).height;

                // now read block details
                return observableFrom(this.blockRoutesApi.getBlockByHeight(uintHeight.compact(), requestOptions)).pipe(
                map((response: BlockInfoResponse) => {

                    // @see https://bcdocs.xpxsirius.io/docs/cheatsheet/#fee
                    // effective_fee = feeMultiplier x transaction::size
                    return response.body.block.feeMultiplier * transaction.size;
                }));
            }), catchError((err) => {
                return observableThrowError(()=> new Error(err));
            }));
    }

    /**
     * Search transactions
     * @param searchType - Transaction group type.
     * @param queryParams - Transaction Query Params
     * @returns Observable<TransactionSearch>
     */
    public searchTransactions(searchType: TransactionGroupType, queryParams?: TransactionQueryParams, requestOptions?: RequestOptions): Observable<TransactionSearch> {
        return observableFrom(this.transactionRoutesApi.searchTransactions(searchType, queryParams, requestOptions)).pipe(
            map((response: TransactionSearchResponse) => {
                let transactions = response.body.data.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO);
                });
                let paginationData = new Pagination(
                    response.body.pagination.totalEntries, 
                    response.body.pagination.pageNumber,
                    response.body.pagination.pageSize,
                    response.body.pagination.totalPages
                );
                return new TransactionSearch(transactions, paginationData)
            })
        )
    }

    /**
     * Search unconfirmed transaction by transaction hash
     * @param txnHash - Transaction hash.
     * @returns Observable<Transaction>
     */
     public getUnconfirmedTransaction(txnHash: string, requestOptions?: RequestOptions): Observable<Transaction> {
        return observableFrom(this.transactionRoutesApi.searchTransaction(TransactionGroupType.UNCONFIRMED, txnHash, requestOptions)).pipe(
            map((response: TransactionInfoResponse) => {
                return CreateTransactionFromDTO(response.body);
            })
        )
    }

    /**
     * Search partial transaction by transaction hash
     * @param txnHash - Transaction hash.
     * @returns Observable<Transaction>
     */
     public getPartialTransaction(txnHash: string, requestOptions?: RequestOptions): Observable<Transaction> {
        return observableFrom(this.transactionRoutesApi.searchTransaction(TransactionGroupType.PARTIAL, txnHash, requestOptions)).pipe(
            map((response: TransactionInfoResponse) => {
                return CreateTransactionFromDTO(response.body);
            })
        )
    }
}
