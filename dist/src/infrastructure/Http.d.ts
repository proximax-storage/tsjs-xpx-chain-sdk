import { ApiClient } from 'js-xpx-catapult-library';
import { Observable } from 'rxjs';
import { NetworkType } from '../model/blockchain/NetworkType';
import { Authentications } from '../model/http/Authentications';
import { NetworkHttp } from './NetworkHttp';
/**
 * Http extended by all http services
 */
export declare abstract class Http {
    /**
     * @internal
     */
    protected readonly apiClient: ApiClient;
    private networkHttp;
    private networkType;
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp, authentications?: Authentications, defaultHeaders?: object);
    getNetworkTypeObservable(): Observable<NetworkType>;
}
