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

import {Observable} from 'rxjs';
import { LiquidityProvider } from '../model/liquidity/LiquidityProvider';
import { LiquidityProviderSearch } from '../model/liquidity/LiquidityProviderSearch';
import { RequestOptions } from './RequestOptions';

/**
 * Liquidity Provider interface repository.
 */
export interface LiquidityProviderRepository {

    /**
     * Get a liquidity provider info.
     * @param providerKey provider key string
     * @returns Observable<LiquidityProvider>
     */
    getLiquidityProvider(providerKey: string, requestOptions?: RequestOptions): Observable<LiquidityProvider>;

    /**
     * Get liquidity providers info.
     * @returns Observable<LiquidityProviderSearch>
     */
    searchLiquidityProviders(requestOptions?: RequestOptions): Observable<LiquidityProviderSearch>;
}
