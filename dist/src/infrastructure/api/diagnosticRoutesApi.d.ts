/**
 * Catapult REST Endpoints
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.7.16
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ServerDTO } from '../model/serverDTO';
import { StorageInfoDTO } from '../model/storageInfoDTO';
import { Authentication } from '../model/models';
export declare enum DiagnosticRoutesApiApiKeys {
}
export declare class DiagnosticRoutesApi {
    protected _basePath: string;
    protected defaultHeaders: any;
    protected _useQuerystring: boolean;
    protected authentications: {
        'default': Authentication;
    };
    constructor(basePath?: string);
    useQuerystring: boolean;
    basePath: string;
    setDefaultAuthentication(auth: Authentication): void;
    setApiKey(key: DiagnosticRoutesApiApiKeys, value: string): void;
    /**
     * Returns diagnostic information about the node storage.
     * @summary Get the storage information of the node
     */
    getDiagnosticStorage(options?: {
        headers: {
            [name: string]: string;
        };
    }): Promise<StorageInfoDTO>;
    /**
     * Returns the version of the running rest component.
     * @summary Get the version of the running rest component
     */
    getServerInfo(options?: {
        headers: {
            [name: string]: string;
        };
    }): Promise<ServerDTO>;
}