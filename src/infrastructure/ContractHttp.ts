// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
import { from as observableFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PublicAccount } from '../model/account/PublicAccount';
import { Address, Contract } from '../model/model';
import { ContractRoutesApi } from './api/contractRoutesApi';
import { ContractRepository } from './ContractRepository';
import { Http } from './Http';
import { ContractInfoDTO } from './model/contractInfoDTO';
import { Authentication } from './model/models';
import { NetworkHttp } from './NetworkHttp';


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
        return observableFrom(
            this.contractRoutesApi.getAccountContract(publicAccount.publicKey)).pipe(map((contractInfoDTOs: ContractInfoDTO[]) => {
                return contractInfoDTOs.map(contractInfoDTO => Contract.createFromDTO(contractInfoDTO.contract));
        }));
    }

    public getAccountsContracts(publicAccounts?: PublicAccount[]): Observable<Contract[]> {
        return observableFrom(
            this.contractRoutesApi.getAccountContracts(
                publicAccounts ? { "publicKeys" : publicAccounts.map(publicAccount => publicAccount.publicKey) } : undefined
            )).pipe(map((contractInfoDTOs: ContractInfoDTO[]) => {
            return contractInfoDTOs.map(contractInfoDTO => Contract.createFromDTO(contractInfoDTO.contract));
        }));
    }

    public getContract(address: Address): Observable<Contract> {
        return observableFrom(
            this.contractRoutesApi.getContract(address.plain())).pipe(map((contractInfoDTO: ContractInfoDTO) => {
                return Contract.createFromDTO(contractInfoDTO.contract);
        }));
    }

    public getContracts(addresses: Address[]): Observable<Contract[]> {
        return observableFrom(
            this.contractRoutesApi.getContracts(
                { "addresses": addresses.map(address => address.plain()) }
            )).pipe(map((contractInfoDTOs: ContractInfoDTO[]) => {
                return contractInfoDTOs.map(contractInfoDTO => Contract.createFromDTO(contractInfoDTO.contract))
        }));
    }
}
