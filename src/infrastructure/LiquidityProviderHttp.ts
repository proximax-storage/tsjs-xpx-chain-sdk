/*
 * Copyright 2023 ProximaX
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {from as observableFrom, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { LiquidityProvider } from '../model/liquidity/LiquidityProvider';
import {MosaicId} from '../model/mosaic/MosaicId';
import {Turnover} from '../model/liquidity/Turnover';
import {Rate} from '../model/liquidity/Rate';
import {UInt64} from '../model/UInt64';
import {LiquidityProviderRepository} from './LiquidityProviderRepository';
import { LiquidityProviderRoutesApi,
        LiquidityProviderResponse,
         LiquidityProviderSearchResponse
        } from './api';
import {Http} from './Http';
import {NetworkHttp} from './NetworkHttp';
import { RequestOptions } from './RequestOptions';
import { LiquidityProviderSearch } from '../model/liquidity/LiquidityProviderSearch';
import { Pagination } from "../model/Pagination"

/**
 * LiquidityProvider http repository.
 *
 */
export class LiquidityProviderHttp extends Http implements LiquidityProviderRepository {
    /**
     * @internal
     * xpx chain Library LiquidityProvider routes api
     */
    private liquidityProviderRoutesApi: LiquidityProviderRoutesApi;
    private url: string;
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.url = url;
        this.liquidityProviderRoutesApi = new LiquidityProviderRoutesApi(url);
    }

    /**
     * Get a LiquidityProvider info
     * @param providerKey provider key
     * @returns Observable<LiquidityProvider>
     */
    public getLiquidityProvider(providerKey: string, requestOptions?: RequestOptions): Observable<LiquidityProvider> {
        return observableFrom(this.liquidityProviderRoutesApi.getLiquidityProvider(providerKey, requestOptions)).pipe(
            map((response: LiquidityProviderResponse) => {
                const liquidityProviderInfoDTO = response.body;
                const liquidityProviderDTO = liquidityProviderInfoDTO.liquidityProvider;
                return new LiquidityProvider(
                    new MosaicId(liquidityProviderDTO.mosaicId),
                    liquidityProviderDTO.providerKey,
                    liquidityProviderDTO.owner,
                    new UInt64(liquidityProviderDTO.additionallyMinted),
                    liquidityProviderDTO.slashingAccount,
                    liquidityProviderDTO.slashingPeriod,
                    liquidityProviderDTO.windowSize,
                    new UInt64(liquidityProviderDTO.creationHeight),
                    liquidityProviderDTO.alpha,
                    liquidityProviderDTO.beta,
                    liquidityProviderDTO.turnoverHistory.map((turnoverDTO) => new Turnover(
                        new Rate(
                            new UInt64(turnoverDTO.rate.currencyAmount),
                            new UInt64(turnoverDTO.rate.mosaicAmount),
                        ),
                        new UInt64(turnoverDTO.turnover)
                    )),
                    new Turnover(
                        new Rate(
                            new UInt64(liquidityProviderDTO.recentTurnover.rate.currencyAmount),
                            new UInt64(liquidityProviderDTO.recentTurnover.rate.mosaicAmount),
                        ),
                        new UInt64(liquidityProviderDTO.recentTurnover.turnover)
                    )
                );
            })
        );
    }

    /**
     * Search LiquidityProviders info.
     * @returns Observable<LiquidityProviderSearchResponse>
     */
    public searchLiquidityProviders(requestOptions?: RequestOptions): Observable<LiquidityProviderSearch> {
        return observableFrom(this.liquidityProviderRoutesApi.searchLiquidityProviders(requestOptions))
            .pipe(map((response: LiquidityProviderSearchResponse) => {

                const liquidityProviders = response.body.data.map((inlineLPInfo)=> new LiquidityProvider(
                    new MosaicId(inlineLPInfo.liquidityProvider.mosaicId),
                    inlineLPInfo.liquidityProvider.providerKey,
                    inlineLPInfo.liquidityProvider.owner,
                    new UInt64(inlineLPInfo.liquidityProvider.additionallyMinted),
                    inlineLPInfo.liquidityProvider.slashingAccount,
                    inlineLPInfo.liquidityProvider.slashingPeriod,
                    inlineLPInfo.liquidityProvider.windowSize,
                    new UInt64(inlineLPInfo.liquidityProvider.creationHeight),
                    inlineLPInfo.liquidityProvider.alpha,
                    inlineLPInfo.liquidityProvider.beta,
                    inlineLPInfo.liquidityProvider.turnoverHistory.map((turnoverDTO) => new Turnover(
                        new Rate(
                            new UInt64(turnoverDTO.rate.currencyAmount),
                            new UInt64(turnoverDTO.rate.mosaicAmount),
                        ),
                        new UInt64(turnoverDTO.turnover)
                    )),
                    new Turnover(
                        new Rate(
                            new UInt64(inlineLPInfo.liquidityProvider.recentTurnover.rate.currencyAmount),
                            new UInt64(inlineLPInfo.liquidityProvider.recentTurnover.rate.mosaicAmount),
                        ),
                        new UInt64(inlineLPInfo.liquidityProvider.recentTurnover.turnover)
                    )
                ));

                let paginationData = new Pagination(
                    response.body.pagination.totalEntries, 
                    response.body.pagination.pageNumber,
                    response.body.pagination.pageSize,
                    response.body.pagination.totalPages
                );

                return new LiquidityProviderSearch(
                    liquidityProviders,
                    paginationData
                )
        }));
    }
}