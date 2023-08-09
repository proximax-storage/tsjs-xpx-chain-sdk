/*
 * Copyright 2023 ProximaX
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

import {NamespaceId} from '../namespace/NamespaceId';
import {UInt64} from '../UInt64';
import {Mosaic} from './Mosaic';
import { MosaicId } from './MosaicId';
import { MosaicProperties } from './MosaicProperties';

export class KnownMosaicProperties {
    constructor(
        public readonly ID: NamespaceId | MosaicId,
        public readonly INITIAL_SUPPLY: UInt64,
        public readonly MOSAIC_PROPERTIES: MosaicProperties
    ) {

    }
}

export const XpxMosaicProperties = new KnownMosaicProperties(
    new NamespaceId('prx.xpx'),
    UInt64.fromUint(9000000000), // initial supply
    MosaicProperties.create({
        supplyMutable: false,
        transferable: true,
        restrictable: false,
        supplyForceImmutable: false,
        disableLocking: false,
        divisibility: 6
    })
);

/**
 * NetworkMosaic mosaic
 *
 * This represents the per-network mosaic. This mosaicId is aliased
 * with namespace name `prx.xpx` by default.
 *
 */
export class NetworkMosaic extends Mosaic {
    private _networkMosaicProperties: KnownMosaicProperties;

    protected constructor(amount: UInt64, networkMosaicProperties: KnownMosaicProperties) {
        super(networkMosaicProperties.ID, amount);
        this._networkMosaicProperties = networkMosaicProperties;
    }

    public get ID() {
        return this.id;
    }

    public get DIVISIBILITY() {
        return this._networkMosaicProperties.MOSAIC_PROPERTIES.divisibility;
    }

    public get INITIAL_SUPPLY() {
        return this._networkMosaicProperties.INITIAL_SUPPLY;
    }

    public get TRANSFERABLE() {
        return this._networkMosaicProperties.MOSAIC_PROPERTIES.transferable;
    }

    public get SUPPLY_MUTABLE() {
        return this._networkMosaicProperties.MOSAIC_PROPERTIES.supplyMutable;
    }

    public static createRelativeAmount(amount: UInt64 | number, divisibility: number) {
        if (typeof amount === 'number') {
            return UInt64.fromUint(amount * Math.pow(10, divisibility));
        }
        return UInt64.fromUint((amount as UInt64).compact() * Math.pow(10, divisibility));
    }

    public static createAbsoluteAmount(amount: UInt64 | number) {
        if (typeof amount === 'number') {
            return UInt64.fromUint(amount);
        }
        return amount as UInt64;
    }
}
