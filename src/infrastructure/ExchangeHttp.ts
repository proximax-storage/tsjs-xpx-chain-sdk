// Copyright 2020 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { from as observableFrom, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ExchangeMosaicsResponse, ExchangeResponse, ExchangeRoutesApi, ExchangesResponse } from './api/apis';
import { NetworkHttp } from './NetworkHttp';
import { Http } from './Http';
import { ExchangeRepository } from './ExchangeRepository';
import { PublicAccount, NetworkType, ExchangeOfferType, MosaicId, UInt64, Deadline, Address } from '../model/model';
import { AccountExchanges } from '../model/exchange/AccountExchanges';
import { MosaicExchange } from '../model/exchange/MosaicExchange';
import { RequestOptions } from './RequestOptions';

/**
 * Exchange http repository.
 *
 * @since 0.8.0
 */
export class ExchangeHttp extends Http implements ExchangeRepository {
    /**
     * @internal
     * xpx chain Library exchange routes api
     */
    private exchangeRoutesApi: ExchangeRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.exchangeRoutesApi = new ExchangeRoutesApi(url);
    }


    /**
     * Gets the exchanges for a given accountId
     * @param accountId - Account public key or address
     * @returns Observable<AccountExchanges | undefined>
     */
    public getAccountExchanges(accountId: Address | PublicAccount, requestOptions?: RequestOptions): Observable<AccountExchanges | undefined> {
        const accountIdArg = (accountId instanceof PublicAccount) ? accountId.publicKey : accountId.plain();
        return this.getNetworkTypeObservable(requestOptions).pipe(
            mergeMap((networkType: NetworkType) => observableFrom(
                this.exchangeRoutesApi.getAccountExchangeOffers(accountIdArg, requestOptions))
                .pipe(
                    map((response: ExchangeResponse) =>
                        AccountExchanges.createFromDTO(response.body.exchange, networkType))
                )
            )
        );
    }

    /**
     * Gets exchanges for a given mosaic id
     * @param offerType
     * @param mosaicId
     * @returns Observable<MosaicExchanges[]>
     */
    public getExchangeOffers(offerType: ExchangeOfferType, mosaicId: MosaicId, requestOptions?: RequestOptions): Observable<MosaicExchange[]> {
        const offerTypeArg = offerType === ExchangeOfferType.BUY_OFFER ? "buy" : "sell";
        const mosaicIdArg = mosaicId.toHex();
        return this.getNetworkTypeObservable(requestOptions).pipe(
            mergeMap((networkType: NetworkType) => observableFrom(
                this.exchangeRoutesApi.getExchangeOffers(offerTypeArg, mosaicIdArg, requestOptions))
                .pipe(
                    map((response: ExchangesResponse) =>
                        response.body.map(exchangesDTO => MosaicExchange.createFromDTO(exchangesDTO, networkType))
                    )
                )
            )
        );
    }

    /**
     * Get offering mosaic id list
     * @returns Observable<MosaicId[]>
     */
     public getOfferList(requestOptions?: RequestOptions): Observable<MosaicId[]> {
        return observableFrom(this.exchangeRoutesApi.getOfferList(requestOptions)).pipe(
                map((response: ExchangeMosaicsResponse) =>{
                    return response.body.map(exchangeMosaicDTO => new MosaicId(exchangeMosaicDTO.mosaicId));
                })
            );
    }
}
