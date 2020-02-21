// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {from as observableFrom, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AccountInfo} from '../model/account/AccountInfo';
import {Address} from '../model/account/Address';
import {MosaicId} from '../model/mosaic/MosaicId';
import {RichlistEntry} from '../model/richlist/RichlistEntry';
import {UInt64} from '../model/UInt64';
import {RichlistRoutesApi} from './api/richlistRoutesApi';
import {Http} from './Http';
import {NetworkHttp} from './NetworkHttp';
import {PageQueryParams} from './PageQueryParams';
import {RichlistRepository} from './RichlistRepository';

/**
 * Richlist http repository.
 *
 * @since 1.0
 */
export class RichlistHttp extends Http implements RichlistRepository {
    /**
     * @internal
     * xpx chain Library richlist routes api
     */
    private richlistRoutesApi: RichlistRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.richlistRoutesApi = new RichlistRoutesApi(url);
    }

    /**
     * Gets mosaic richlist
     * @param mosaicId - Mosaic id
     * @param queryParams - (Optional) Page query params
     * @returns Observable<AccountInfo>
     */
    getMosaicRichlist(mosaicId: MosaicId, queryParams?: PageQueryParams): Observable<RichlistEntry[]> {
        return observableFrom(
            this.richlistRoutesApi.getMosaicRichlist(
                mosaicId.toHex(),
                this.pageQueryParams(queryParams).page,
                this.pageQueryParams(queryParams).pageSize,
            )).pipe(map(response => {
            return response.body.map((richlistEntryDTO) => {
                return RichlistEntry.create(
                    Address.createFromEncoded(richlistEntryDTO.address),
                    richlistEntryDTO.publicKey,
                    new UInt64(richlistEntryDTO.amount));
            });
        }));
    }
}
