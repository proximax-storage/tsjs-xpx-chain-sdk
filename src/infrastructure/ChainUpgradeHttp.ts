// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {from as observableFrom, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { UpgradeRoutesApi } from './api';
import { ChainUpgradeRepository } from './ChainUpgradeRepository';
import {Http} from './Http';
import { ChainUpgrade } from '../model/model';

/**
 * Chian http repository.
 *
 * @since 1.0
 */
export class ChainUpgradeHttp extends Http implements ChainUpgradeRepository {
    /**
     * @internal
     * xpx chain Library chain config routes api
     */
    private upgradeRoutesApi: UpgradeRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super();
        this.upgradeRoutesApi = new UpgradeRoutesApi(url);
    }

    /**
     * Gets blockchain configuration at given height
     * @param height
     * @returns Observable<ChainConfig>
     */
    public getChainUpgrade(height: number): Observable<ChainUpgrade> {
        return observableFrom(
            this.upgradeRoutesApi.getUpgrade(height)).pipe(map(response => {
                return ChainUpgrade.createFromDTO(response.body.blockchainUpgrade);
        }));
    }
}
