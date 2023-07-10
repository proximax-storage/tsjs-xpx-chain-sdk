// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { DriveWorkDTO } from "../../../model/storage/Replicator";

export class ReplicatorDTO {
    key: string;
    version: number;
    drives: Array<DriveWorkDTO>;
    downloadChannels: Array<string>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "key",
            "baseName": "key",
            "type": "string"
        },
        {
            "name": "version",
            "baseName": "version",
            "type": "number"
        },
        {
            "name": "drives",
            "baseName": "drives",
            "type": "Array<DriveWorkDTO>"
        },
        {
            "name": "downloadChannels",
            "baseName": "downloadChannels",
            "type": "Array<string>"
        }
    ];

    static getAttributeTypeMap() {
        return ReplicatorDTO.attributeTypeMap;
    }
}

