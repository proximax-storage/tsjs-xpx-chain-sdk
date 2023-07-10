/**
 * Sirius REST API Reference
 * No description provided (https://bcdocs.xpxsirius.io/endpoints/v0.9.0/#tag/Storage-routes) * 
 */

import axios from 'axios';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
import { DownloadChannelInlineInfoDTO } from '../model/storage/downloadChannelInlineInfoDTO';
import { DriveInfoInlineDTO } from '../model/storage/driveInfoInlineDTO';
import { ReplicatorInlineDTO } from '../model/storage/replicatorInlineDTO';

import { RequestOptions } from '../RequestOptions';
import { ObjectSerializer } from '../model/models';
import { DriveQueryParams } from "../DriveQueryParams";
import { DownloadChannelQueryParams } from "../DownloadChannelQueryParams";
import { ReplicatorQueryParams } from "../ReplicatorQueryParams";
import { BcDriveSearchDTO } from "../model/BcDriveSearchDTO";
import { ReplicatorSearchDTO } from "../model/ReplicatorSearchDTO";
import { DownloadChannelSearchDTO } from "../model/DownloadChannelSearchDTO";

import { HttpError, RequestFile } from './apis';

let defaultBasePath = 'http://localhost:3000';

export interface BcDriveSearchResponse{
    response: AxiosResponse;
    body: BcDriveSearchDTO;
}

export interface ReplicatorSearchResponse{
    response: AxiosResponse;
    body: ReplicatorSearchDTO;
}

export interface DownloadChannelSearchResponse{
    response: AxiosResponse;
    body: DownloadChannelSearchDTO;
}

export class StorageRoutesApi {
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
     * Return bc drive info by account id/ drive key.
     * @summary Return bc drive info by account id/ drive key.
     * @param driveKey The public key of the drive.
     */
    public async getBcDrive (accountId: string, reqOptions?:RequestOptions) : Promise<{ response: AxiosResponse; body: DriveInfoInlineDTO;  }> {
        const localVarPath = '/bcdrives/{accountId}'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)));

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined || accountId === "") {
            throw new Error('Required parameter accountId was null or undefined when calling getBcDrive.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<{ response: AxiosResponse; body: DriveInfoInlineDTO;  }>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "DriveInlineDTO");
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
     * Search bc drives info
     * @summary Search bc drives info with query params
     */
    public async searchBcDrives (queryParams?: DriveQueryParams, reqOptions?:RequestOptions) : Promise<BcDriveSearchResponse> {
        const localVarPath = '/bcdrives';

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

        return new Promise<{ response: AxiosResponse; body: BcDriveSearchDTO  }>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "BcDriveSearchDTO");
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
     * Return replicator info by account id/ address key.
     * @summary Return replicator info by account id/ address key.
     * @param accountId The public key or address of an account.
     */
    public async getReplicator (accountId: string, reqOptions?:RequestOptions) : Promise<{ response: AxiosResponse; body: ReplicatorInlineDTO;  }> {
        const localVarPath = '/replicators/{accountId}'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)));

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined || accountId === "") {
            throw new Error('Required parameter accountId was null or undefined when calling getReplicator.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<{ response: AxiosResponse; body: ReplicatorInlineDTO;  }>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "ReplicatorInlineDTO");
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
     * Search replicators info
     * @summary Search replicators info with query params
     */
    public async searchReplicators (queryParams?: ReplicatorQueryParams, reqOptions?:RequestOptions) : Promise<ReplicatorSearchResponse> {
        const localVarPath = '/replicators';

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

        return new Promise<{ response: AxiosResponse; body: ReplicatorSearchDTO  }>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "ReplicatorSearchDTO");
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
     * Return download channel info by public key.
     * @summary Return download chanel info by public key.
     * @param accountId The public key download channel.
     */
    public async getDownloadChannel (channelId: string, reqOptions?:RequestOptions) : Promise<{ response: AxiosResponse; body: DownloadChannelInlineInfoDTO;  }> {
        const localVarPath = '/download_channels/{channelId}'
            .replace('{' + 'channelId' + '}', encodeURIComponent(String(channelId)));

        // verify required parameter 'channelId' is not null or undefined
        if (channelId === null || channelId === undefined || channelId === "") {
            throw new Error('Required parameter channelId was null or undefined when calling getDownloadChannel.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<{ response: AxiosResponse; body: DownloadChannelInlineInfoDTO;  }>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "DownloadChannelInlineInfoDTO");
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
     * Search download channel info
     * @summary Search download channel info with query params
     */
    public async searchDownloadChannel (queryParams?: DownloadChannelQueryParams, reqOptions?:RequestOptions) : Promise<DownloadChannelSearchResponse> {
        const localVarPath = '/download_channels';

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

        return new Promise<{ response: AxiosResponse; body: DownloadChannelSearchDTO  }>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "DownloadChannelSearchDTO");
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
