// Copyright 2020 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { from as observableFrom, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ExchangeSdaRoutesApi } from './api/apis';
import { NetworkHttp } from './NetworkHttp';
import { Http } from './Http';
import { ExchangeSdaRepository } from './ExchangeSdaRepository';
import { PublicAccount, NetworkType, ExchangeOfferType, MosaicId, UInt64, Deadline, Address, SdaExchangeOfferType } from '../model/model';
import { AccountSdaExchanges } from '../model/exchangeSda/AccountSdaExchanges';
import { SdaOfferInfoWithOwner } from '../model/exchangeSda/SdaOfferInfoWithOwner';
import { RequestOptions } from './RequestOptions';

/**
 * Exchange http repository.
 *
 * @since 0.8.0
 */
export class ExchangeSdaHttp extends Http implements ExchangeSdaRepository {
    /**
     * @internal
     * xpx chain Library SDA Exchange routes api
     */
    private exchangeSdaRoutesApi: ExchangeSdaRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.exchangeSdaRoutesApi = new ExchangeSdaRoutesApi(url);
    }


    /**
     * Gets the exchanges for a given accountId
     * @param accountId - Account public key or address
     * @returns Observable<AccountExchanges | undefined>
     */
    public getAccountSdaExchangeOffers(accountId: Address | PublicAccount, requestOptions?: RequestOptions): Observable<AccountSdaExchanges | undefined> {
        const accountIdArg = (accountId instanceof PublicAccount) ? accountId.publicKey : accountId.plain();
        return this.getNetworkTypeObservable(requestOptions).pipe(
            mergeMap(networkType => observableFrom(
                this.exchangeSdaRoutesApi.getAccountSdaExchangeOffers(accountIdArg, requestOptions)).pipe(map(response =>
                    AccountSdaExchanges.createFromDTO(response.body.exchangesda, networkType))
                ))
        );
    }

    /**
     * Get SDA exchanges for a given mosaic id
     * @param offerType
     * @param mosaicId
     * @returns Observable<MosaicExchanges[]>
     */
    public getExchangeSdaOffers(offerType: SdaExchangeOfferType, mosaicId: MosaicId, requestOptions?: RequestOptions): Observable<SdaOfferInfoWithOwner[]> {
        const mosaicIdArg = mosaicId.toHex();
        return this.getNetworkTypeObservable(requestOptions).pipe(
            mergeMap(networkType => observableFrom(
                this.exchangeSdaRoutesApi.getExchangeSdaOffers(offerType, mosaicIdArg, requestOptions)).pipe(map(response =>
                    response.body.map(sdaOfferWithOwnerDTO => SdaOfferInfoWithOwner.createFromDTO(sdaOfferWithOwnerDTO, networkType))
                )))
        );
    }
}
