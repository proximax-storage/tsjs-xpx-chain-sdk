import { Observable } from 'rxjs';
import { ChainUpgrade } from '../model/model';
/**
 * Chain interface repository.
 *
 * @since 1.0
 */
export interface ChainUpgradeRepository {
    /**
     * Gets required version at given height
     * @returns Observable<ChainUpgrade>
     */
    getChainUpgrade(height: number): Observable<ChainUpgrade>;
}
