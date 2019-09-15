import { Observable } from 'rxjs';
import { NetworkType } from '../model/blockchain/NetworkType';
<<<<<<< HEAD
=======
import { Authentication } from './model/models';
>>>>>>> jwt
import { NetworkHttp } from './NetworkHttp';
import { QueryParams } from './QueryParams';
/**
 * Http extended by all http services
 */
export declare abstract class Http {
    private networkHttp;
    private networkType;
<<<<<<< HEAD
=======
    private auth;
    private headers;
>>>>>>> jwt
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
<<<<<<< HEAD
    constructor(networkHttp?: NetworkHttp);
=======
    constructor(networkHttp?: NetworkHttp, auth?: Authentication, headers?: {});
>>>>>>> jwt
    getNetworkTypeObservable(): Observable<NetworkType>;
    queryParams(queryParams?: QueryParams): any;
}
