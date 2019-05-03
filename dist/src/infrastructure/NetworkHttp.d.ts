import { Observable } from 'rxjs';
import { NetworkType } from '../model/blockchain/NetworkType';
import { Http } from './Http';
import { NetworkRepository } from './NetworkRepository';
/**
 * Network http repository.
 *
 * @since 1.0
 */
export declare class NetworkHttp extends Http implements NetworkRepository {
    /**
     * Constructor
     * @param url
     */
    constructor(url: string);
    /**
     * Get current network type.
     *
     * @return network type enum.
     */
    getNetworkType(): Observable<NetworkType>;
}
