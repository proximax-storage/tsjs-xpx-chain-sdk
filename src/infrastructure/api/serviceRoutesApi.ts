import http = require('http');
import axios from 'axios';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
import { DriveInlineResponse2001 } from '../model/driveInlineResponse2001';
import { DriveDTO } from '../model/driveDTO';
import { RolesTypeEnum } from '../model/rolesTypeEnum';
import { RequestOptions } from '../RequestOptions';

import { ObjectSerializer } from '../model/models';

import { HttpError, RequestFile } from './apis';

export interface AccountDrivesResponse{
    response: AxiosResponse;
    body: DriveInlineResponse2001;
}

export interface DriveInfoResponse{
    response: AxiosResponse;
    body: DriveDTO;
}

export interface DrivesInfoResponse{
    response: AxiosResponse;
    body: DriveDTO[];
}

let defaultBasePath = 'http://localhost:3000';

export enum ServiceRoutesApiApiKeys {
}

export class ServiceRoutesApi {
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
     * Get drive by accountId.
     * @summary Get drive by accountId
     * @param driveId ID of a drive.
     */
    public async getDrive (driveId: string, reqOptions?:RequestOptions) : Promise<DriveInfoResponse> {
        const localVarPath = '/drive/{driveId}'
            .replace('{' + 'driveId' + '}', encodeURIComponent(String(driveId)));
        let localVarQueryParameters: any = {};

        // verify required parameter 'accountId' is not null or undefined
        if (driveId === null || driveId === undefined) {
            throw new Error('Required parameter driveId was null or undefined when calling getDrive.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<DriveInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<DriveDTO>");
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
     * Get drive by id.
     * @summary Get drive by id
     * @param accountId ID of a drive.
     */
    public async getAccountDrives (accountId: string, reqOptions?:RequestOptions) : Promise<AccountDrivesResponse> {
        const localVarPath = '/account/{accountId}/drive'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)));
        let localVarQueryParameters: any = {};

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getDrive.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<AccountDrivesResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "DriveInlineResponse2001");
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
     * Get drive by id and role.
     * @summary Get drive by id and role
     * @param accountId ID of a drive.
     * @param role Role in drive (owner or replicator).
     */
    public async getDriveByRole (accountId: string, role: RolesTypeEnum, reqOptions?:RequestOptions) : Promise<DrivesInfoResponse> {
        const localVarPath = '/account/{accountId}/drive/{role}'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)))
            .replace('{' + 'role' + '}', encodeURIComponent(String(role)));
        let localVarQueryParameters: any = {};

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getDriveByRole.');
        }

        // verify required parameter 'role' is not null or undefined
        if (role === null || role === undefined) {
            throw new Error('Required parameter role was null or undefined when calling getDriveByRole.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<DrivesInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<DriveDTO>");
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
