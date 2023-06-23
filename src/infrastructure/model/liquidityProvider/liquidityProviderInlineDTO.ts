// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { LiquidityProviderDTO } from "./liquidityProviderDTO";

export class LiquidityProviderInlineDTO {
    'liquidityProvider': LiquidityProviderDTO;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "liquidityProvider",
            "baseName": "liquidityProvider",
            "type": "LiquidityProviderDTO"
        }
    ];

    static getAttributeTypeMap() {
        return LiquidityProviderInlineDTO.attributeTypeMap;
    }
}

