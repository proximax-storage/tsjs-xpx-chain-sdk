import { Observable } from 'rxjs';
import { NetworkType } from '../model/blockchain/NetworkType';
import { Authentication } from './model/models';
import { NetworkHttp } from './NetworkHttp';
import { QueryParams } from './QueryParams';
/**
 * Http extended by all http services
 */
export declare abstract class Http {
    private networkHttp;
    private networkType;
    private auth;
    private headers;
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(networkHttp?: NetworkHttp, auth?: Authentication, headers?: {});
    getNetworkTypeObservable(): Observable<NetworkType>;
    queryParams(queryParams?: QueryParams): any;
}
