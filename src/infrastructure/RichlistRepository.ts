// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {Observable} from 'rxjs';
import {MosaicId} from '../model/model';
import {RichlistEntry} from '../model/richlist/RichlistEntry';
import {PageQueryParams} from './PageQueryParams';

/**
 * Richlist interface repository.
 *
 * @since 1.0
 */
export interface RichlistRepository {
    /**
     * Get mosaic richlist
     * @returns Observable<RichlistEntry[]>
     */
    getMosaicRichlist(mosaicId: MosaicId, queryParams?: PageQueryParams): Observable<RichlistEntry[]>;

}
