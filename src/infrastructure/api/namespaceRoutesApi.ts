/**
 * Sirius REST API Reference
 * No description provided (https://bcdocs.xpxsirius.io/endpoints/v0.9.0/#tag/Namespace-routes) * 
 */

import axios from 'axios';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
import { AccountIds } from '../model/accountIds';
import { NamespaceIds } from '../model/namespaceIds';
import { NamespaceInfoDTO } from '../model/namespaceInfoDTO';
import { NamespaceNameDTO } from '../model/namespaceNameDTO';

import { ObjectSerializer } from '../model/models';
import { RequestOptions } from '../RequestOptions';

import { HttpError, RequestFile } from './apis';

export interface NamespaceInfoResponse{
    response: AxiosResponse;
    body: NamespaceInfoDTO;
}

export interface NamespacesInfoResponse{
    response: AxiosResponse;
    body: NamespaceInfoDTO[];
}

export interface NamespacesNameResponse{
    response: AxiosResponse;
    body: NamespaceNameDTO[];
}

let defaultBasePath = 'http://localhost:3000';

export enum NamespaceRoutesApiApiKeys {
}

export class NamespaceRoutesApi {
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
     * Gets the namespace for a given namespaceId.
     * @summary Get namespace information
     * @param namespaceId The namespace identifier.
     */
    public async getNamespace (namespaceId: string, reqOptions?:RequestOptions) : Promise<NamespaceInfoResponse> {
        const localVarPath = '/namespace/{namespaceId}'
            .replace('{' + 'namespaceId' + '}', encodeURIComponent(String(namespaceId)));
        let localVarQueryParameters: any = {};

        // verify required parameter 'namespaceId' is not null or undefined
        if (namespaceId === null || namespaceId === undefined) {
            throw new Error('Required parameter namespaceId was null or undefined when calling getNamespace.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<NamespaceInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "NamespaceInfoDTO");
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
     * Gets an array of namespaces for a given account address.
     * @summary Get namespaces owned by an account
     * @param accountId The address or public key of the account.
     * @param pageSize The number of namespaces to return.
     * @param id The namespace id up to which namespace objects are returned.
     */
    public async getNamespacesFromAccount (accountId: string, pageSize?: number, id?: string, reqOptions?:RequestOptions) : Promise<NamespacesInfoResponse> {
        const localVarPath = '/account/{accountId}/namespaces'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)));
        let localVarQueryParameters: any = {};

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getNamespacesFromAccount.');
        }

        if (pageSize !== undefined) {
            localVarQueryParameters['pageSize'] = ObjectSerializer.serialize(pageSize, "number");
        }

        if (id !== undefined) {
            localVarQueryParameters['id'] = ObjectSerializer.serialize(id, "string");
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            params: localVarQueryParameters,
        };

        return new Promise<NamespacesInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<NamespaceInfoDTO>");
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
     * Gets namespaces for a given array of addresses.
     * @summary Get namespaces for given array of addresses
     * @param accountIds 
     * @param pageSize The number of namespaces to return.
     * @param id The namespace id up to which namespace objects are returned.
     */
    public async getNamespacesFromAccounts (accountIds: AccountIds, pageSize?: number, id?: string, reqOptions?:RequestOptions) : Promise<NamespacesInfoResponse> {
        const localVarPath = '/account/namespaces';
        let localVarQueryParameters: any = {};

        // verify required parameter 'accountIds' is not null or undefined
        if (accountIds === null || accountIds === undefined) {
            throw new Error('Required parameter accountIds was null or undefined when calling getNamespacesFromAccounts.');
        }

        if (pageSize !== undefined) {
            localVarQueryParameters['pageSize'] = ObjectSerializer.serialize(pageSize, "number");
        }

        if (id !== undefined) {
            localVarQueryParameters['id'] = ObjectSerializer.serialize(id, "string");
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'POST',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            params: localVarQueryParameters,
            data: ObjectSerializer.serialize(accountIds, "AccountIds")
        };

        return new Promise<NamespacesInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<NamespaceInfoDTO>");
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
     * Returns friendly names for namespaces.
     * @summary Get readable names for a set of namespaces
     * @param namespaceIds 
     */
    public async getNamespacesNames (namespaceIds: NamespaceIds, reqOptions?:RequestOptions) : Promise<NamespacesNameResponse> {
        const localVarPath = '/namespace/names';
        let localVarQueryParameters: any = {};

        // verify required parameter 'namespaceIds' is not null or undefined
        if (namespaceIds === null || namespaceIds === undefined) {
            throw new Error('Required parameter namespaceIds was null or undefined when calling getNamespacesNames.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'POST',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            data: ObjectSerializer.serialize(namespaceIds, "NamespaceIds")
        };

        return new Promise<NamespacesNameResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<NamespaceNameDTO>");
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
