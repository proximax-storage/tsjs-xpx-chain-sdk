import { CatapultUpgradeDTO } from '../model/catapultUpgradeDTO';
import { Authentication } from '../model/models';
export declare enum UpgradeRoutesApiApiKeys {
}
export declare class UpgradeRoutesApi {
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
    setApiKey(key: UpgradeRoutesApiApiKeys, value: string): void;
    /**
     * Get software info of network at height.
     * @summary Get software info of network
     * @param height The height of the blockchain to get software info.
     */
    getUpgrade(height: number, options?: {
        headers: {
            [name: string]: string;
        };
    }): Promise<CatapultUpgradeDTO>;
}
