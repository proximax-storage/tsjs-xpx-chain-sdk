import { Observable } from 'rxjs';
import { NetworkType } from '../model/blockchain/NetworkType';
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
    constructor(url: string, networkHttp?: NetworkHttp);
    getNetworkTypeObservable(): Observable<NetworkType>;
}
