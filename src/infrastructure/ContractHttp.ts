
import {from as observableFrom, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {PublicAccount} from '../model/account/PublicAccount';
import {Http} from './Http';
import { Authentication } from './model/models';
import {NetworkHttp} from './NetworkHttp';
import { AddressMetadata } from '../model/metadata/AddressMetadata';
import { Address, Contract } from '../model/model';
import { ContractRoutesApi } from './api/contractRoutesApi';
import { ContractInfoDTO } from './model/contractInfoDTO';
import { ContractRepository } from './ContractRepository';

/**
 * Contract http repository.
 *
 * @since 0.1.0
 */
export class ContractHttp extends Http implements ContractRepository {
    /**
     * @internal
     * XPX Chain SDK contract routes api
     */
    private contractRoutesApi: ContractRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp, auth?: Authentication, headers?: {}) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.contractRoutesApi = new ContractRoutesApi(url);
        if (auth) {
            this.contractRoutesApi.setDefaultAuthentication(auth);
        }
        if (headers) {
            this.contractRoutesApi.setHeaders(headers);
        }
    }

    public getAccountContract(publicAccount: PublicAccount): Observable<Contract[]> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.contractRoutesApi.getAccountContract(publicAccount.publicKey)).pipe(map((contractInfoDTOs: ContractInfoDTO[]) => {
                    return contractInfoDTOs.map(contractInfoDTO => Contract.createFromDTO(contractInfoDTO.contract));
            }))));
    }

    public getAccountsContracts(publicAccounts?: PublicAccount[]): Observable<Contract[]> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.contractRoutesApi.getAccountContracts(
                    publicAccounts ? { "publicKeys" : publicAccounts.map(publicAccount => publicAccount.publicKey) } : undefined
                )).pipe(map((contractInfoDTOs: ContractInfoDTO[]) => {
                return contractInfoDTOs.map(contractInfoDTO => Contract.createFromDTO(contractInfoDTO.contract));
            }))));
    }

    public getContract(address: Address): Observable<Contract> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.contractRoutesApi.getContract(address.plain())).pipe(map((contractInfoDTO: ContractInfoDTO) => {
                return Contract.createFromDTO(contractInfoDTO.contract);
            }))));
    }

    public getContracts(addresses: Address[]): Observable<Contract[]> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.contractRoutesApi.getContracts(
                    { "addresses": addresses.map(address => address.plain()) }
                )).pipe(map((contractInfoDTOs: ContractInfoDTO[]) => {
                return contractInfoDTOs.map(contractInfoDTO => Contract.createFromDTO(contractInfoDTO.contract))
            }))));
    }
}
