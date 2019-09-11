import { Observable } from 'rxjs';
import { ChainConfig } from '../model/model';
/**
 * Chain interface repository.
 *
 * @since 1.0
 */
export interface ChainConfigRepository {
    /**
     * Gets config at given height
     * @returns Observable<ChainConfig>
     */
    getChainConfig(height: number): Observable<ChainConfig>;
}
