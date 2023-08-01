/**
 * Sirius REST API Reference
 * No description provided (https://bcdocs.xpxsirius.io/endpoints/v0.9.0/#tag/Upgrade-routes) * 
 */

import axios from 'axios';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
import { BlockchainUpgradeDTO } from '../model/blockchainUpgradeDTO';

import { ObjectSerializer } from '../model/models';
import { RequestOptions } from '../RequestOptions';

import { HttpError, RequestFile } from './apis';

export interface BlockchainUpgradeResponse{
    response: AxiosResponse;
    body: BlockchainUpgradeDTO;
}

let defaultBasePath = 'http://localhost:3000';

export enum UpgradeRoutesApiApiKeys {
}

export class UpgradeRoutesApi {
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
     * Get software info of network at height.
     * @summary Get software info of network
     * @param height The height of the blockchain to get software info.
     */
    public async getUpgrade (height: number, reqOptions?:RequestOptions) : Promise<BlockchainUpgradeResponse> {
        const localVarPath = this.basePath + '/upgrade/{height}'
            .replace('{' + 'height' + '}', encodeURIComponent(String(height)));

        // verify required parameter 'height' is not null or undefined
        if (height === null || height === undefined) {
            throw new Error('Required parameter height was null or undefined when calling getUpgrade.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<BlockchainUpgradeResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "BlockchainUpgradeDTO");
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
