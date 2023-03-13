// Copyright 2022 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { from as observableFrom, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { HarvesterInfoResponse, HarvesterRoutesApi, HarvesterSearchResponse } from './api/apis';
import { NetworkHttp } from './NetworkHttp';
import { Http } from './Http';
import { HarvesterRepository } from './HarvesterRepository';
import { HarvesterSearch, HarvesterInfo, Address, PublicAccount, HarvesterMetaInfo, NetworkType } from '../model/model';
import { PaginationQueryParams } from './PaginationQueryParams';
import { RequestOptions } from './RequestOptions';
import { Pagination } from '../model/Pagination';

/**
 * Harvester http repository.
 *
 * @since 0.8.0
 */
export class HarvesterHttp extends Http implements HarvesterRepository {
    /**
     * @internal
     * xpx chain Library exchange routes api
     */
    private harvesterRoutesApi: HarvesterRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.harvesterRoutesApi = new HarvesterRoutesApi(url);
    }


    /**
     * Gets the exchanges for a given accountId
     * @param accountId - Account public key or address
     * @returns Observable<HarvesterInfo[]>
     */
    public getAccountHarvestingHarvesterInfo(accountId: Address | PublicAccount, requestOptions?: RequestOptions): Observable<HarvesterInfo[]> {
        const accountIdArg = (accountId instanceof PublicAccount) ? accountId.publicKey : accountId.plain();
        return this.getNetworkTypeObservable(requestOptions).pipe(
            mergeMap((networkType: NetworkType) => observableFrom(
                this.harvesterRoutesApi.getAccountHarvestingHarvesterInfo(accountIdArg, requestOptions))
                .pipe(map((response: HarvesterInfoResponse) =>{
                    return response.body.map((inlineHarvesterInfoDTO)=>{
                        return HarvesterInfo.createFromDTO(inlineHarvesterInfoDTO.harvester, networkType)
                    })
                }))
        ))
    }

    /**
     * Search harvesters based on query params
     * @param paginationQueryParams
     * @returns Observable<HarvesterSearch>
     */
    public searchHarvesters(paginationQueryParams?: PaginationQueryParams, requestOptions?: RequestOptions): Observable<HarvesterSearch> {
        return this.getNetworkTypeObservable(requestOptions).pipe(
            mergeMap((networkType: NetworkType) => observableFrom(
                this.harvesterRoutesApi.searchHarvesters(paginationQueryParams, requestOptions))
                .pipe(
                    map((response: HarvesterSearchResponse) =>{

                        let harvesterMetaInfo = response.body.data.map((harvestorWithMetaDTO) => {
                            
                            return HarvesterMetaInfo.createFromDTO(harvestorWithMetaDTO, networkType);
                        });

                        let paginationData = new Pagination(
                            response.body.pagination.totalEntries, 
                            response.body.pagination.pageNumber,
                            response.body.pagination.pageSize,
                            response.body.pagination.totalPages
                        );
                        return new HarvesterSearch(harvesterMetaInfo, paginationData);
                    })
                )
            )
        );
    }
}
