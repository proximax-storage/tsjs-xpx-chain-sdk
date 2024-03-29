/**
 * Sirius REST API Reference
 * No description provided (https://bcdocs.xpxsirius.io/endpoints/v0.9.0/#tag/Mosaic-routes) * 
 */

import axios from 'axios';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
import { MosaicIds } from '../model/mosaicIds';
import { MosaicInfoDTO } from '../model/mosaicInfoDTO';
import { MosaicSearchDTO } from '../model/mosaicSearchDTO';
import { MosaicNamesDTO } from '../model/mosaicNamesDTO';
import { MosaicRichListDTO } from '../model/mosaicRichListDTO';
import { MosaicLevyDTO } from '../model/mosaicLevyDTO';
import { RequestOptions } from '../RequestOptions';
import { MosaicQueryParams } from '../MosaicQueryParams';

import { ObjectSerializer } from '../model/models';

import { HttpError, RequestFile } from './apis';

export interface MosaicInfoResponse{
    response: AxiosResponse;
    body: MosaicInfoDTO;
}

export interface MosaicsInfoResponse{
    response: AxiosResponse;
    body: MosaicInfoDTO[];
}

export interface MosaicRichListResponse{
    response: AxiosResponse;
    body: MosaicRichListDTO[];
}

export interface MosaicsNamesResponse{
    response: AxiosResponse;
    body: MosaicNamesDTO[];
}

export interface MosaicLevyInfoResponse{
    response: AxiosResponse;
    body: MosaicLevyDTO;
}

export interface MosaicSearchResponse{
    response: AxiosResponse;
    body: MosaicSearchDTO;
}


let defaultBasePath = 'http://localhost:3000';

export enum MosaicRoutesApiApiKeys {
}

export class MosaicRoutesApi {
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
     * Gets the mosaic definition for a given mosaicId.
     * @summary Get mosaic information
     * @param mosaicId The mosaic identifier.
     */
    public async getMosaic (mosaicId: string, reqOptions?:RequestOptions) : Promise<MosaicInfoResponse> {
        const localVarPath = '/mosaic/{mosaicId}'
            .replace('{' + 'mosaicId' + '}', encodeURIComponent(String(mosaicId)));

        // verify required parameter 'mosaicId' is not null or undefined
        if (mosaicId === null || mosaicId === undefined) {
            throw new Error('Required parameter mosaicId was null or undefined when calling getMosaic.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<MosaicInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "MosaicInfoDTO");
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
     * Retrieve owners of a given mosaic sorted on descending order based on amount. (REST only)
     * @summary Get mosaic information
     * @param mosaicId The mosaic identifier.
     * @param page The page of list (starts at 0).
     * @param pageSize The count of items on a page (max 100, default 25).
     */
    public async getMosaicRichList (mosaicId: string, page?: number, pageSize?: number, reqOptions?:RequestOptions) : Promise<MosaicRichListResponse> {
        const localVarPath = '/mosaic/{mosaicId}/richlist'
            .replace('{' + 'mosaicId' + '}', encodeURIComponent(String(mosaicId)));
        let localVarQueryParameters: any = {};

        // verify required parameter 'mosaicId' is not null or undefined
        if (mosaicId === null || mosaicId === undefined) {
            throw new Error('Required parameter mosaicId was null or undefined when calling getMosaicRichList.');
        }

        if (page !== undefined) {
            localVarQueryParameters['page'] = ObjectSerializer.serialize(page, "number");
        }

        if (pageSize !== undefined) {
            localVarQueryParameters['pageSize'] = ObjectSerializer.serialize(pageSize, "number");
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            params: localVarQueryParameters
        };

        return new Promise<MosaicRichListResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<MosaicRichListDTO>");
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
     * Gets an array of mosaic definition.
     * @summary Get mosaics information for an array of mosaics
     * @param mosaicIds 
     */
    public async getMosaics (mosaicIds: MosaicIds, reqOptions?:RequestOptions) : Promise<MosaicsInfoResponse> {
        const localVarPath = '/mosaic';

        // verify required parameter 'mosaicIds' is not null or undefined
        if (mosaicIds === null || mosaicIds === undefined) {
            throw new Error('Required parameter mosaicIds was null or undefined when calling getMosaics.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'POST',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            data: ObjectSerializer.serialize(mosaicIds, "MosaicIds")
        };

        return new Promise<MosaicsInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<MosaicInfoDTO>");
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
     * Returns friendly names for mosaics.
     * @summary Get readable names for a set of mosaics
     * @param mosaicIds 
     */
    public async getMosaicsNames (mosaicIds: MosaicIds, reqOptions?:RequestOptions) : Promise<MosaicsNamesResponse> {
        const localVarPath = '/mosaic/names';
        let localVarQueryParameters: any = {};

        // verify required parameter 'mosaicIds' is not null or undefined
        if (mosaicIds === null || mosaicIds === undefined) {
            throw new Error('Required parameter mosaicIds was null or undefined when calling getMosaicsNames.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'POST',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            data: ObjectSerializer.serialize(mosaicIds, "MosaicIds")
        };

        return new Promise<MosaicsNamesResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<MosaicNamesDTO>");
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
     * Get mosaic levy of mosaic.
     * @summary Get mosaic levy information for a mosaic
     * @param mosaicId 
     */
     public async getMosaicLevy (mosaicId: string, reqOptions?:RequestOptions) : Promise<MosaicLevyInfoResponse> {
        const localVarPath = '/mosaic/{mosaicId}/levy'
            .replace('{' + 'mosaicId' + '}', encodeURIComponent(String(mosaicId)));;

        // verify required parameter 'mosaicId' is not null or undefined
        if (mosaicId === null || mosaicId === undefined) {
            throw new Error('Required parameter mosaicId was null or undefined when calling getMosaicLevy.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<MosaicLevyInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "MosaicLevyDTO");
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
     * Search mosaics
     * @summary Get mosaics information
     * @param mosaicIds 
     */
     public async searchMosaics (queryParams?: MosaicQueryParams, reqOptions?:RequestOptions) : Promise<MosaicSearchResponse> {
        const localVarPath = '/mosaics';

        let localVarQueryParameters: any = {};

        if(queryParams){
            localVarQueryParameters = queryParams.buildQueryParams();
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            params: localVarQueryParameters
        };

        return new Promise<MosaicSearchResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "MosaicSearchDTO");
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
