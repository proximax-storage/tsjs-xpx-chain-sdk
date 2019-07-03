import { Observable } from 'rxjs';
import { NetworkType } from '../model/blockchain/NetworkType';
import { NetworkHttp } from './NetworkHttp';
import { QueryParams } from './QueryParams';
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
    constructor(networkHttp?: NetworkHttp);
    getNetworkTypeObservable(): Observable<NetworkType>;
    queryParams(queryParams?: QueryParams): any;
}
