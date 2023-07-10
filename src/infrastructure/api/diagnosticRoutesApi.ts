/**
 * Sirius REST API Reference
 * No description provided (https://bcdocs.xpxsirius.io/endpoints/v0.9.0/#tag/Diagnostic-routes) * 
 */

import axios from 'axios';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
import { ServerDTO } from '../model/serverDTO';
import { StorageInfoDTO } from '../model/storageInfoDTO';

import { RequestOptions } from '../RequestOptions';
import { ObjectSerializer } from '../model/models';

import { HttpError, RequestFile } from './apis';

export interface StorageInfoResponse{ 
    response: AxiosResponse; 
    body: StorageInfoDTO;  
}

export interface ServerInfoResponse{ 
    response: AxiosResponse; 
    body: ServerDTO;  
}

let defaultBasePath = 'http://localhost:3000';

export enum DiagnosticRoutesApiApiKeys {
}

export class DiagnosticRoutesApi {
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
     * Returns diagnostic information about the node storage.
     * @summary Get the storage information of the node
     */
    public async getDiagnosticStorage (reqOptions?:RequestOptions) : Promise<StorageInfoResponse> {
        const localVarPath = '/diagnostic/storage';
        let requestHeaders = this.combineHeaders(reqOptions);
        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<StorageInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "StorageInfoDTO");
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
     * Returns the version of the running rest component.
     * @summary Get the version of the running rest component
     */
    public async getServerInfo (reqOptions?:RequestOptions) : Promise<ServerInfoResponse> {
        const localVarPath = '/diagnostic/server';
        let requestHeaders = this.combineHeaders(reqOptions);
        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<ServerInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "ServerDTO");
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
