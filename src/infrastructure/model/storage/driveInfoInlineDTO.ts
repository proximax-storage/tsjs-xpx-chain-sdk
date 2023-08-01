// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { DriveInfoDTO  } from "./driveInfoDTO";

export class DriveInfoInlineDTO {
    drive: DriveInfoDTO;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "drive",
            "baseName": "drive",
            "type": "DriveDTO"
        }
    ];

    static getAttributeTypeMap() {
        return DriveInfoInlineDTO.attributeTypeMap;
    }
}

