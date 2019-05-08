import { Observable } from 'rxjs';
import { NetworkType } from '../model/blockchain/NetworkType';
import { Authentications } from '../model/http/Authentications';
import { NetworkHttp } from './NetworkHttp';
/**
 * Http extended by all http services
 */
export declare abstract class Http {
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
