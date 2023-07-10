/**
 * Sirius REST API Reference
 * No description provided (https://bcdocs.xpxsirius.io/endpoints/v0.9.0/#tag/Metadata-V2-routes) * 
 */

import axios from 'axios';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
// import { AddressMetadataInfoDTO } from '../model/addressMetadataInfoDTO';
// import { MetadataIds } from '../model/metadataIds';
import { MetadataEntryGetInlineResponse } from '../model/metadataEntryGetInlineResponse'
import { MetadataSearchDTO } from '../model/metadataSearchDTO';
import { MetadataQueryParams } from '../MetadataQueryParams';
import { CompositeHashes } from '../model/compositeHashes';
import { RequestOptions } from '../RequestOptions';

import { ObjectSerializer } from '../model/models';

export interface MetadataEntryResponse{ 
    response: AxiosResponse; 
    body: MetadataEntryGetInlineResponse;  
}

export interface MetadataEntriesResponse{ 
    response: AxiosResponse; 
    body: MetadataEntryGetInlineResponse[];  
}

export interface MetadataSearchResponse{ 
    response: AxiosResponse; 
    body: MetadataSearchDTO;  
}

let defaultBasePath = 'http://localhost:3000';

export class MetadataRoutesApi {
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
     * Get the metadata from a compositeHash.
     * @summary Get metadata of namespace/mosaic/account
     * @param compositeHash The metadata compositeHash identifier.
     */
    public async getMetadata (compositeHash: string, reqOptions?:RequestOptions) : Promise<MetadataEntryResponse> {
        const localVarPath = '/metadata_v2/{compositeHash}'
            .replace('{' + 'compositeHash' + '}', encodeURIComponent(String(compositeHash)));

        // verify required parameter 'compositeHash' is not null or undefined
        if (compositeHash === null || compositeHash === undefined) {
            throw new Error('Required parameter compositeHash was null or undefined when calling getMetadata.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<MetadataEntryResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "MetadataEntryGetInlineResponse");
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
     * Gets an array of metadata.
     * @summary Get metadatas(namespace/mosaic/account) for an array of compositeHashes
     * @param compositeHashes of metadata
     */
    public async getMetadatas (compositeHashes: CompositeHashes, reqOptions?:RequestOptions) : Promise<MetadataEntriesResponse> {
        const localVarPath = '/metadata_v2';

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'POST',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            data: ObjectSerializer.serialize(compositeHashes, "compositeHashes")
        };

        return new Promise<MetadataEntriesResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<MetadataEntryGetInlineResponse>");
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
     * Search metadatas based on the metadata query params
     * @summary Search metadata
     * @param metadataQueryParams search filter
     */
    public async searchMetadata (metadataQueryParams?: MetadataQueryParams, reqOptions?:RequestOptions) : Promise<MetadataSearchResponse> {
        const localVarPath = '/metadata_v2';

        let localVarQueryParameters: any = {};

        if(metadataQueryParams){
            localVarQueryParameters = metadataQueryParams.buildQueryParams();
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

        return new Promise<MetadataSearchResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "MetadataSearchDTO");
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
