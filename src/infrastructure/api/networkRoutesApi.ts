/**
 * Sirius REST API Reference
 * No description provided (https://bcdocs.xpxsirius.io/endpoints/v0.9.0/#tag/Network-routes) * 
 */

 import axios from 'axios';
 import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
import { NetworkTypeDTO } from '../model/networkTypeDTO';

import { ObjectSerializer } from '../model/models';
import { RequestOptions } from '../RequestOptions';

import { HttpError, RequestFile } from './apis';

export interface NetworkTypeResponse{
    response: AxiosResponse;
    body: NetworkTypeDTO;
}

let defaultBasePath = 'http://localhost:3000';

export enum NetworkRoutesApiApiKeys {
}

export class NetworkRoutesApi {
    protected _basePath = defaultBasePath;
    protected _defaultHeaders : { [name: string]: string; } = { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
    };
    protected _useQuerystring : boolean = false;

    constructor(basePath?: string);
    constructor(basePathOrUsername: string, password?: string, basePath?: string) {
        if (password) {
            if (basePath) {
                this.basePath = basePath;
            }
        } else {
            if (basePathOrUsername) {
                this.basePath = basePathOrUsername
            }
        }
    }

    set useQuerystring(value: boolean) {
        this._useQuerystring = value;
    }

    set basePath(basePath: string) {
        this._basePath = basePath;
    }

    set defaultHeaders(defaultHeaders: any) {
        this._defaultHeaders = defaultHeaders;
    }

    get defaultHeaders() {
        return this._defaultHeaders;
    }

    get basePath() {
        return this._basePath;
    }

    combineHeaders(reqOptions?:RequestOptions){
        return reqOptions ? {...this._defaultHeaders, ...reqOptions.headers} : this._defaultHeaders;
    }

    /**
     * Returns the current network type.
     * @summary Get the current network type of the chain
     */
    public async getNetworkType (reqOptions?:RequestOptions) : Promise<NetworkTypeResponse> {
        const localVarPath = '/network';
        let localVarQueryParameters: any = {};
        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<NetworkTypeResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "NetworkTypeDTO");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                            reject(response);
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }
}
