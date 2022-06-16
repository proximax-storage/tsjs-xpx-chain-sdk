// Copyright 2020 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {Observable} from 'rxjs';
import { MosaicExchange, AccountSdaExchanges, MosaicId, Address, PublicAccount, ExchangeSdaOfferType } from '../model/model';
import { RequestOptions } from './RequestOptions';
/**
 * ExchangeRepository interface repository.
 *
 * @since 0.8.0
 */
export interface ExchangeSdaRepository {

    /**
     * Gets the exchange SDA offers for a given accountId
     * @param accountId - Account public key or address
     * @returns Observable<AccountExchanges | undefined>
     */
     getAccountSdaExchangeOffers(accountId: Address | PublicAccount, requestOptions?: RequestOptions): Observable<AccountSdaExchanges | undefined>;

    /**
     * Gets exchange SDA offers for a given asset id
     * @param offerType
     * @param mosaicId
     * @returns Observable<MosaicExchanges[]>
     */
     getExchangeSdaOffers(offerType: ExchangeSdaOfferType, mosaicId: MosaicId, requestOptions?: RequestOptions): Observable<MosaicExchange[]>;

}
