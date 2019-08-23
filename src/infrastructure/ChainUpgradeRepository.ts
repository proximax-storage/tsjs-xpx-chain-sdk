// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {Observable} from 'rxjs';
import { ChainUpgrade } from '../model/model';

/**
 * Chain interface repository.
 *
 * @since 1.0
 */
export interface ChainUpgradeRepository {
    /**
     * Gets required version at given height
     * @returns Observable<ChainUpgrade>
     */
    getChainUpgrade(height: number): Observable<ChainUpgrade>;

}
