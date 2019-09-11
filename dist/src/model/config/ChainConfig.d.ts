import { ConfigDTO } from "../../infrastructure/model/configDTO";
import { UInt64 } from "../UInt64";
/**
 * The config structure stores a chain configuration as returned from http configRoutesApi.
 * The contract can be created on blockachain using ModifyContractTransaction
 */
export declare class ChainConfig {
    readonly height: UInt64;
    readonly blockChainConfig: string;
    readonly supportedEntityVersions: string;
    constructor(height: UInt64, blockChainConfig: string, supportedEntityVersions: string);
    static createFromDTO(configDTO: ConfigDTO): ChainConfig;
}
