/**
 * Sirius REST API Reference
 * No description provided (https://bcdocs.xpxsirius.io/endpoints/v0.9.0/#tag/Liquidity-Provider-routes) * 
 */

import axios from 'axios';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
import { LiquidityProviderInlineDTO } from '../model/liquidityProvider/liquidityProviderInlineDTO';
import { LiquidityProviderSearchDTO } from '../model/liquidityProvider/liquidityProviderSearchDTO';

import { ObjectSerializer} from '../model/models';
import { RequestOptions } from '../RequestOptions';
import { HttpError, RequestFile, TransactionSearchResponse } from './apis';

export interface LiquidityProviderResponse{
    response: AxiosResponse;
    body: LiquidityProviderInlineDTO;
}

export interface LiquidityProviderSearchResponse{
    response: AxiosResponse;
    body: LiquidityProviderSearchDTO;
}

let defaultBasePath = 'http://localhost:3000';

export class LiquidityProviderRoutesApi {
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
     * Return the liquidity provider information.
     * @summary Get  liquidity provider information
     * @param providerKey The provider key.
     */
    public async getLiquidityProvider (providerKey: string, reqOptions?:RequestOptions) : Promise<LiquidityProviderResponse> {
        const localVarPath = '/liquidity_providers/{providerKey}'
            .replace('{' + 'providerKey' + '}', encodeURIComponent(String(providerKey)));

        // verify required parameter 'providerKey' is not null or undefined
        if (providerKey === null || providerKey === undefined) {
            throw new Error('Required parameter providerKey was null or undefined when calling getLiquidityProvider.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<LiquidityProviderResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "LiquidityProviderInlineDTO");
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
    /**
     * Return the liquidity providers information.
     * @summary Get  liquidity providers information
     */
    public async searchLiquidityProviders (reqOptions?:RequestOptions) : Promise<LiquidityProviderSearchResponse> {
        const localVarPath = '/liquidity_providers';

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<LiquidityProviderSearchResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "LiquidityProviderSearchDTO");
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
