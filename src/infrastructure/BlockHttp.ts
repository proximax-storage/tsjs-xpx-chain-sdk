/*
 * Copyright 2023 ProximaX
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

import {from as observableFrom, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {PublicAccount} from '../model/account/PublicAccount';
import {BlockInfo} from '../model/blockchain/BlockInfo';
import { MerklePathItem } from '../model/blockchain/MerklePathItem';
import { MerkleProofInfo } from '../model/blockchain/MerkleProofInfo';
import { MerkleProofInfoPayload } from '../model/blockchain/MerkleProofInfoPayload';
import { Statement } from '../model/receipt/Statement';
import {Transaction} from '../model/transaction/Transaction';
import { TransactionSearch } from '../model/transaction/TransactionSearch';
import {UInt64} from '../model/UInt64';
import { BlockInfoResponse, BlockRoutesApi, BlocksInfoResponse, MerkleProofInfoResponse, StatementsResponse, TransactionSearchResponse } from './api';
import {BlockRepository} from './BlockRepository';
import {Http} from './Http';
import { NetworkHttp } from './NetworkHttp';
import {TransactionQueryParams} from './TransactionQueryParams';
import { CreateStatementFromDTO } from './receipt/CreateReceiptFromDTO';
import {CreateTransactionFromDTO, extractBeneficiary} from './transaction/CreateTransactionFromDTO';
import { RequestOptions } from './RequestOptions';
import { Pagination } from '../model/Pagination';
import { NetworkType } from '../model/model';

/**
 * Blocks returned limits:
 * N_25: 25 blocks.
 * N_50: 50 blocks.
 * N_75: 75 blocks.
 * N_100: 100 blocks.
 */
export enum LimitType {
    N_25 = 25,
    N_50 = 50,
    N_75 = 75,
    N_100 = 100,

}
/**
 * Blockchain http repository.
 *
 * @since 1.0
 */
export class BlockHttp extends Http implements BlockRepository {
    /**
     * @internal
     * xpx chain Library block routes api
     */
    private blockRoutesApi: BlockRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.blockRoutesApi = new BlockRoutesApi(url);
    }

    /**
     * Gets a BlockInfo for a given block height
     * @param height - Block height
     * @returns Observable<BlockInfo>
     */
    public getBlockByHeight(height: number, requestOptions?: RequestOptions): Observable<BlockInfo> {
        return observableFrom(this.blockRoutesApi.getBlockByHeight(height, requestOptions))
        .pipe(map((response: BlockInfoResponse) => {
            const blockDTO = response.body;
            const networkType = parseInt((blockDTO.block.version >>> 0).toString(16).substring(0, 2), 16); // ">>> 0" hack makes it effectively an Uint32
            return new BlockInfo(
                blockDTO.meta.hash,
                blockDTO.meta.generationHash,
                new UInt64(blockDTO.meta.totalFee),
                blockDTO.meta.numTransactions,
                blockDTO.block.signature,
                PublicAccount.createFromPublicKey(blockDTO.block.signer, networkType),
                networkType,
                parseInt((blockDTO.block.version >>> 0).toString(16).substring(2, 4), 16), // Tx version
                blockDTO.block.type,
                new UInt64(blockDTO.block.height),
                new UInt64(blockDTO.block.timestamp),
                new UInt64(blockDTO.block.difficulty),
                blockDTO.block.feeMultiplier,
                blockDTO.block.previousBlockHash,
                blockDTO.block.blockTransactionsHash,
                blockDTO.block.blockReceiptsHash,
                blockDTO.block.stateHash,
                extractBeneficiary(blockDTO, networkType),
            );
        }));
    }

    /**
     * Gets array of transactions included in a block for a block height
     * @param height - Block height
     * @param txnQueryParam - (Optional) Transaction Query params
     * @returns Observable<Transaction[]>
     */
    public getBlockTransactions(height: number, txnQueryParam?: TransactionQueryParams, requestOptions?: RequestOptions): Observable<Transaction[]> {
        return observableFrom(
            this.blockRoutesApi.getBlockTransactions(height, txnQueryParam, requestOptions))
                .pipe(map((response: TransactionSearchResponse) => {
                    let transactions: Transaction[] = [];
                    if(response.body.data.length){
                        transactions = response.body.data.map((transactionDTO) => {
                            return CreateTransactionFromDTO(transactionDTO);
                        });
                    }
                    return transactions;
        }));
    }

    /**
     * Gets array of transactions included in a block for a block height
     * @param height - Block height
     * @param txnQueryParam - (Optional) Transaction Query params
     * @returns Observable<TransactionSearch>
     */
    public getBlockTransactionsWithPagination(height: number, txnQueryParam?: TransactionQueryParams, requestOptions?: RequestOptions): Observable<TransactionSearch> {
        return observableFrom(
            this.blockRoutesApi.getBlockTransactions(height, txnQueryParam, requestOptions))
                .pipe(map((response: TransactionSearchResponse) => {
                    let transactions: Transaction[] = [];
                    if(response.body.data.length){
                        transactions = response.body.data.map((transactionDTO) => {
                            return CreateTransactionFromDTO(transactionDTO);
                        });
                    }

                    let paginationData = new Pagination(
                        response.body.pagination.totalEntries, 
                        response.body.pagination.pageNumber,
                        response.body.pagination.pageSize,
                        response.body.pagination.totalPages
                    );
                    
                    return new TransactionSearch(transactions, paginationData);
        }));
    }

    /**
     * Gets array of BlockInfo for a block height with limit
     * @param height - Block height from which will be the first block in the array
     * @param limit - Number of blocks returned. Limit value only available in 25, 50. 75 and 100. (default 25)
     * @returns Observable<BlockInfo[]>
     */
    public getBlocksByHeightWithLimit(height: number, limit: LimitType = LimitType.N_25, requestOptions?: RequestOptions): Observable<BlockInfo[]> {
        return observableFrom(
            this.blockRoutesApi.getBlocksByHeightWithLimit(height, limit, requestOptions))
            .pipe(map((response: BlocksInfoResponse) => {
                return response.body.map((blockDTO) => {
                    const networkType = parseInt((blockDTO.block.version >>> 0).toString(16).substring(0, 2), 16);
                    return new BlockInfo(
                        blockDTO.meta.hash,
                        blockDTO.meta.generationHash,
                        new UInt64(blockDTO.meta.totalFee),
                        blockDTO.meta.numTransactions,
                        blockDTO.block.signature,
                        PublicAccount.createFromPublicKey(blockDTO.block.signer, networkType),
                        networkType,
                        parseInt((blockDTO.block.version >>> 0).toString(16).substring(2, 4), 16), // Tx version
                        blockDTO.block.type,
                        new UInt64(blockDTO.block.height),
                        new UInt64(blockDTO.block.timestamp),
                        new UInt64(blockDTO.block.difficulty),
                        blockDTO.block.feeMultiplier,
                        blockDTO.block.previousBlockHash,
                        blockDTO.block.blockTransactionsHash,
                        blockDTO.block.blockReceiptsHash,
                        blockDTO.block.stateHash,
                        extractBeneficiary(blockDTO, networkType),
                    );
                });
            }));
    }

    /**
     * Get the merkle path for a given a receipt statement hash and block
     * Returns the merkle path for a [receipt statement or resolution](https://nemtech.github.io/concepts/receipt.html)
     * linked to a block. The path is the complementary data needed to calculate the merkle root.
     * A client can compare if the calculated root equals the one recorded in the block header,
     * verifying that the receipt was linked with the block.
     * @param height The height of the block.
     * @param hash The hash of the receipt statement or resolution.
     * @return Observable<MerkleProofInfo>
     */
    public getMerkleReceipts(height: number, hash: string, requestOptions?: RequestOptions): Observable<MerkleProofInfo> {
        return observableFrom(
            this.blockRoutesApi.getMerkleReceipts(height, hash, requestOptions))
            .pipe(map((response: MerkleProofInfoResponse) => {
                const merkleProofReceipt = response.body;
                return new MerkleProofInfo(
                    new MerkleProofInfoPayload(
                        merkleProofReceipt.payload.merklePath!.map(
                            (payload) => new MerklePathItem(payload.position, payload.hash))),
                    merkleProofReceipt.type,
                );
        }));
    }

    /**
     * Get the merkle path for a given a transaction and block
     * Returns the merkle path for a [transaction](https://nemtech.github.io/concepts/transaction.html)
     * included in a block. The path is the complementary data needed to calculate the merkle root.
     * A client can compare if the calculated root equals the one recorded in the block header,
     * verifying that the transaction was included in the block.
     * @param height The height of the block.
     * @param hash The hash of the transaction.
     * @return Observable<MerkleProofInfo>
     */
    public getMerkleTransaction(height: number, hash: string, requestOptions?: RequestOptions): Observable<MerkleProofInfo> {
        return observableFrom(
            this.blockRoutesApi.getMerkleReceipts(height, hash, requestOptions))
            .pipe(map((response: MerkleProofInfoResponse) => {
                const merkleProofTransaction = response.body;
                return new MerkleProofInfo(
                    new MerkleProofInfoPayload(
                        merkleProofTransaction.payload.merklePath!.map((payload) => new MerklePathItem(payload.position, payload.hash))),
                        merkleProofTransaction.type,
                );
        }));
    }

    /**
     * Gets an array receipts for a block height.
     * @param height - Block height from which will be the first block in the array
     * @param queryParams - (Optional) Query params
     * @returns Observable<Statement>
     */
    public getBlockReceipts(height: number, requestOptions?: RequestOptions): Observable<Statement> {
        return this.getNetworkTypeObservable(requestOptions).pipe(
            mergeMap((networkType: NetworkType) => observableFrom(
                this.blockRoutesApi.getBlockReceipts(height, requestOptions)).pipe(
                    map((response: StatementsResponse) => {
                        return CreateStatementFromDTO(response.body, networkType);
                    }),
                ),
            ),
        );
    }
}
