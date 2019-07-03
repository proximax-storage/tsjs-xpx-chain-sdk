import { Observable } from 'rxjs';
import { BlockchainScore } from '../model/blockchain/BlockchainScore';
import { UInt64 } from '../model/UInt64';
/**
 * Chain interface repository.
 *
 * @since 1.0
 */
export interface ChainRepository {
    /**
     * Gets current blockchain height
     * @returns Observable<UInt64>
     */
    getBlockchainHeight(): Observable<UInt64>;
    /**
     * Gets current blockchain score
     * @returns Observable<BlockchainScore>
     */
    getBlockchainScore(): Observable<BlockchainScore>;
}
