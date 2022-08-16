// Copyright 2022 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { HarvesterInfoDTO } from "./harvesterInfoDTO";

export class InlineHarvesterInfoDTO {
    "harvester": HarvesterInfoDTO;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "harvester",
            "baseName": "harvester",
            "type": "HarvesterInfoDTO"
        }
    ];

    static getAttributeTypeMap() {
        return InlineHarvesterInfoDTO.attributeTypeMap;
    }
}

