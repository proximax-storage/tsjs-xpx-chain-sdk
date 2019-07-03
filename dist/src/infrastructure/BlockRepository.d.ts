import { Observable } from 'rxjs';
import { BlockInfo } from '../model/blockchain/BlockInfo';
import { MerkleProofInfo } from '../model/blockchain/MerkleProofInfo';
import { Statement } from '../model/receipt/Statement';
import { Transaction } from '../model/transaction/Transaction';
import { QueryParams } from './QueryParams';
/**
 * Blockchain interface repository.
 *
 * @since 1.0
 */
export interface BlockRepository {
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
     * @param limit - Number of blocks returned
     * @returns Observable<BlockInfo[]>
     */
    getBlocksByHeightWithLimit(height: number, limit: number): Observable<BlockInfo[]>;
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
     * Get receipts from a block
     * Returns the receipts linked to a block.
     * @param {Number} height The height of the block.
     * @return Observable<Statement>
     */
    getBlockReceipts(height: number): Observable<Statement>;
}
