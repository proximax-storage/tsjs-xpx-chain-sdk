// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { TurnoverDTO } from "./turnoverDTO";

export class LiquidityProviderDTO {
    'mosaicId': Array<number>;
    'providerKey': string;
    'owner': string;
    'additionallyMinted': Array<number>;
    'slashingAccount': string;
    'slashingPeriod': number;
    'windowSize': number;
    'creationHeight': Array<number>;
    'alpha': number;
    'beta': number;
    'turnoverHistory': Array<TurnoverDTO>;
    'recentTurnover': TurnoverDTO;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "mosaicId",
            "baseName": "mosaicId",
            "type": "Array<number>"
        },
        {
            "name": "providerKey",
            "baseName": "providerKey",
            "type": "string"
        },
        {
            "name": "owner",
            "baseName": "owner",
            "type": "string"
        },
        {
            "name": "additionallyMinted",
            "baseName": "additionallyMinted",
            "type": "Array<number>"
        },
        {
            "name": "slashingAccount",
            "baseName": "slashingAccount",
            "type": "string"
        },
        {
            "name": "slashingPeriod",
            "baseName": "slashingPeriod",
            "type": "number"
        },
        {
            "name": "windowSize",
            "baseName": "windowSize",
            "type": "number"
        },
        {
            "name": "creationHeight",
            "baseName": "creationHeight",
            "type": "Array<number>"
        },
        {
            "name": "alpha",
            "baseName": "alpha",
            "type": "number"
        },
        {
            "name": "beta",
            "baseName": "beta",
            "type": "number"
        },
        {
            "name": "turnoverHistory",
            "baseName": "turnoverHistory",
            "type": "Array<TurnoverDTO>"
        },
        {
            "name": "recentTurnover",
            "baseName": "recentTurnover",
            "type": "TurnoverDTO"
        }
    ];

    static getAttributeTypeMap() {
        return LiquidityProviderDTO.attributeTypeMap;
    }
}

