/*
 * Copyright 2019 NEM
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
import {UInt64} from '../UInt64';
import { NetworkMosaic, KnownMosaicProperties, XpxMosaicProperties } from './NetworkMosaic';

/**
 * NetworkHarvestMosaic mosaic
 *
 * This represents the per-network harvest mosaic. This mosaicId is aliased
 * with namespace name `prx.xpx` from XpxMosaicProperties definition by default.
 *
 * @since 0.10.2
 */
export class NetworkHarvestMosaic extends NetworkMosaic {
    /**
     * constructor
     * @param owner
     * @param amount
     */
    private constructor(amount: UInt64, networkMosaicProperties: KnownMosaicProperties) {
        super(amount, networkMosaicProperties);
    }

    /**
     * Create NetworkHarvestMosaic with using NetworkHarvestMosaic as unit.
     *
     * @param amount
     * @returns {NetworkHarvestMosaic}
     */
    public static createRelative(amount: UInt64 | number, networkMosaicProperties = XpxMosaicProperties) {
        return new NetworkHarvestMosaic(NetworkMosaic.createRelativeAmount(amount, networkMosaicProperties.MOSAIC_PROPERTIES.divisibility), networkMosaicProperties);
    }

    /**
     * Create NetworkHarvestMosaic with using micro NetworkHarvestMosaic as unit,
     * 1 NetworkHarvestMosaic = 1000000 micro NetworkHarvestMosaic.
     *
     * @param amount
     * @returns {NetworkHarvestMosaic}
     */
    public static createAbsolute(amount: UInt64 | number, networkMosaicProperties = XpxMosaicProperties) {
        return new NetworkHarvestMosaic(NetworkMosaic.createAbsoluteAmount(amount), networkMosaicProperties);
    }
}
