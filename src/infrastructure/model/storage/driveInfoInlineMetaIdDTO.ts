// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { MetaIdDTO } from "../metaIdDTO";
import { DriveInfoDTO  } from "./driveInfoDTO";

export class DriveInfoInlineMetaIdDTO {
    drive: DriveInfoDTO;
    meta: MetaIdDTO;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "drive",
            "baseName": "drive",
            "type": "DriveDTO"
        },
        {
            "name": "meta",
            "baseName": "meta",
            "type": "MetaIdDTO"
        }
    ];

    static getAttributeTypeMap() {
        return DriveInfoInlineMetaIdDTO.attributeTypeMap;
    }
}

