/**
 * Sirius REST API Reference
 * No description provided (https://bcdocs.xpxsirius.io/endpoints/v0.9.0/#tag/Node-routes) * 
 */

import axios from 'axios';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
import { NodeInfoDTO } from '../model/nodeInfoDTO';
import { NodeTimeDTO } from '../model/nodeTimeDTO';
import { NodePeerInfoDTO } from '../model/nodePeerInfoDTO';
import { NodeUnlockedAccountDTO } from '../model/nodeUnlockedAccountDTO';
import { RequestOptions } from '../RequestOptions';

import { ObjectSerializer } from '../model/models';

import { HttpError, RequestFile } from './apis';

export interface NodeInfoResponse{
    response: AxiosResponse;
    body: NodeInfoDTO;
}

export interface NodeTimeResponse{
    response: AxiosResponse;
    body: NodeTimeDTO;
}

export interface NodePeersResponse{
    response: AxiosResponse;
    body: Array<NodePeerInfoDTO>;
}

export interface NodeUnlockedAccountResponse{
    response: AxiosResponse;
    body: Array<NodeUnlockedAccountDTO>;
}

let defaultBasePath = 'http://localhost:3000';

export enum NodeRoutesApiApiKeys {
}

export class NodeRoutesApi {
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
     * Supplies additional information about the application running on a node. 
     * @summary Get the node information
     */
    public async getNodeInfo (reqOptions?:RequestOptions) : Promise<NodeInfoResponse> {
        const localVarPath = '/node/info';

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<NodeInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "NodeInfoDTO");
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
     * Gets the node time at the moment the reply was sent and received.
     * @summary Get the node time
     */
    public async getNodeTime (reqOptions?:RequestOptions) : Promise<NodeTimeResponse> {
        const localVarPath = '/node/time';
        let localVarQueryParameters: any = {};
        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<NodeTimeResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "NodeTimeDTO");
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
     * Get the unlocked accouns from the node
     * @summary Get unlocked accouns from the node
     */
    public async getNodeUnlockedAccounts (reqOptions?:RequestOptions) : Promise<NodeUnlockedAccountResponse> {
        const localVarPath = '/node/unlockedaccount';
        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<NodeUnlockedAccountResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<NodeUnlockedAccountDTO>");
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
     * Get peer from the node
     * @summary Get peer from the node
     */
    public async getNodePeers (reqOptions?:RequestOptions) : Promise<NodePeersResponse> {
        const localVarPath = '/node/peers';
        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<NodePeersResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<NodePeerInfoDTO>");
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
