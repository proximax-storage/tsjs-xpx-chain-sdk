import { AccountIds } from '../model/accountIds';
import { ContractInfoDTO } from '../model/contractInfoDTO';
import { PublicKeys } from '../model/publicKeys';
import { Authentication } from '../model/models';
export declare enum ContractRoutesApiApiKeys {
}
export declare class ContractRoutesApi {
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
    setApiKey(key: ContractRoutesApiApiKeys, value: string): void;
    /**
     * Gets all contracts where this account is involved.
     * @summary Get contracts of account
     * @param publicKey The public key of the account.
     */
    getAccountContract(publicKey: string, options?: {
        headers: {
            [name: string]: string;
        };
    }): Promise<Array<ContractInfoDTO>>;
    /**
     * Gets an array of contracts.
     * @summary Get contracts for an array of contract\'s publicKeys
     * @param publicKeys
     */
    getAccountContracts(publicKeys?: PublicKeys, options?: {
        headers: {
            [name: string]: string;
        };
    }): Promise<Array<ContractInfoDTO>>;
    /**
     * Gets the contract for a given contractId.
     * @summary Get contract by contractId
     * @param contractId The account identifier.
     */
    getContract(contractId: string, options?: {
        headers: {
            [name: string]: string;
        };
    }): Promise<ContractInfoDTO>;
    /**
     * Gets an array of contracts.
     * @summary Get contracts for an array of publicKeys or addresses
     * @param accountIds
     */
    getContracts(accountIds: AccountIds, options?: {
        headers: {
            [name: string]: string;
        };
    }): Promise<Array<ContractInfoDTO>>;
}
