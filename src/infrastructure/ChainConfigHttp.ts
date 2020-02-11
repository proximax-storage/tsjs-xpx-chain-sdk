// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {from as observableFrom, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { ConfigRoutesApi } from './api';
import { ChainConfigRepository } from './ChainConfigRepository';
import {Http} from './Http';
import { ChainConfig } from '../model/model';

/**
 * Chian http repository.
 *
 * @since 1.0
 */
export class ChainConfigHttp extends Http implements ChainConfigRepository {
    /**
     * @internal
     * xpx chain Library chain config routes api
     */
    private configRoutesApi: ConfigRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super();
        this.configRoutesApi = new ConfigRoutesApi(url);
    }

    /**
     * Gets blockchain configuration at given height
     * @param height
     * @returns Observable<ChainConfig>
     */
    public getChainConfig(height: number): Observable<ChainConfig> {
        return observableFrom(
            this.configRoutesApi.getConfig(height)).pipe(map(response => {
                return ChainConfig.createFromDTO(response.body.networkConfig);
        }));
    }
}
