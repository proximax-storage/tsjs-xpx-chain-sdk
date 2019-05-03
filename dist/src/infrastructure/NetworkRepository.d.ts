import { Observable } from 'rxjs';
import { NetworkType } from '../model/blockchain/NetworkType';
/**
 * Network interface repository.
 *
 * @since 1.0
 */
export interface NetworkRepository {
    /**
     * Get current network type.
     * @return network type enum.
     */
    getNetworkType(): Observable<NetworkType>;
}
