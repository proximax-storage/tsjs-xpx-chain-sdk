import { Observable } from 'rxjs';
import { NetworkType } from '../model/blockchain/NetworkType';
import { Http } from './Http';
<<<<<<< HEAD
=======
import { Authentication } from './model/models';
>>>>>>> jwt
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
<<<<<<< HEAD
    constructor(url: string);
=======
    constructor(url: string, auth?: Authentication, headers?: {});
>>>>>>> jwt
    /**
     * Get current network type.
     *
     * @return network type enum.
     */
    getNetworkType(): Observable<NetworkType>;
}
