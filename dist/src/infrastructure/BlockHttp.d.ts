import { Observable } from 'rxjs';
import { BlockInfo } from '../model/blockchain/BlockInfo';
import { MerkleProofInfo } from '../model/blockchain/MerkleProofInfo';
import { Statement } from '../model/receipt/Statement';
import { Transaction } from '../model/transaction/Transaction';
import { BlockRepository } from './BlockRepository';
import { Http } from './Http';
import { NetworkHttp } from './NetworkHttp';
import { QueryParams } from './QueryParams';
/**
 * Blocks returned limits:
 * N_25: 25 blocks.
 * N_50: 50 blocks.
 * N_75: 75 blocks.
 * N_100: 100 blocks.
 */
export declare enum LimitType {
    N_25 = 25,
    N_50 = 50,
    N_75 = 75,
    N_100 = 100
}
/**
 * Blockchain http repository.
 *
 * @since 1.0
 */
export declare class BlockHttp extends Http implements BlockRepository {
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp);
    /**
     * Gets a BlockInfo for a given block height
     * @param height - Block height
     * @returns Observable<BlockInfo>
     */
    getBlockByHeight(height: number): Observable<BlockInfo>;
    /**
     * Gets array of transactions included in a block for a block height
     * @param height - Block height
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    getBlockTransactions(height: number, queryParams?: QueryParams): Observable<Transaction[]>;
    /**
     * Gets array of BlockInfo for a block height with limit
     * @param height - Block height from which will be the first block in the array
     * @param limit - Number of blocks returned. Limit value only available in 25, 50. 75 and 100. (default 25)
     * @returns Observable<BlockInfo[]>
     */
    getBlocksByHeightWithLimit(height: number, limit?: LimitType): Observable<BlockInfo[]>;
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
    getMerkleReceipts(height: number, hash: string): Observable<MerkleProofInfo>;
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
    getMerkleTransaction(height: number, hash: string): Observable<MerkleProofInfo>;
    /**
     * Gets an array receipts for a block height.
     * @param height - Block height from which will be the first block in the array
     * @param queryParams - (Optional) Query params
     * @returns Observable<Statement>
     */
    getBlockReceipts(height: number): Observable<Statement>;
}
