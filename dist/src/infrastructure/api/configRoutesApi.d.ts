import { CatapultConfigDTO } from '../model/catapultConfigDTO';
import { Authentication } from '../model/models';
export declare enum ConfigRoutesApiApiKeys {
}
export declare class ConfigRoutesApi {
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
    setApiKey(key: ConfigRoutesApiApiKeys, value: string): void;
    /**
     * Gets config of network at height.
     * @summary Get config of network
     * @param height The height of the blockchain to get config.
     */
    getConfig(height: number, options?: {
        headers: {
            [name: string]: string;
        };
    }): Promise<CatapultConfigDTO>;
}
