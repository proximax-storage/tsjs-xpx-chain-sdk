// Copyright 2020 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {Observable} from 'rxjs';
import { HarvesterSearch, HarvesterInfo, Address, PublicAccount } from '../model/model';
import { PaginationQueryParams } from './PaginationQueryParams';
import { RequestOptions } from './RequestOptions';

/**
 * HarvesterRepository interface repository.
 *
 * @since 0.8.0
 */
export interface HarvesterRepository {

    /**
     * Gets the exchanges for a given accountId
     * @param accountId - Account public key or address
     * @returns Observable<HarvesterInfo[]>
     */
     getAccountHarvestingHarvesterInfo(accountId: Address | PublicAccount, requestOptions?: RequestOptions): Observable<HarvesterInfo[]>;

    /**
     * Search harvesters.
     * @summary Search harvester based on query params
     * @param paginationQueryParams search filter
     */
     searchHarvesters(paginationQueryParams: PaginationQueryParams, requestOptions?: RequestOptions): Observable<HarvesterSearch>;

}
