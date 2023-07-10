// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { CumulativePaymentsDTO } from "../../../model/storage/DownloadChannel";

export class DownloadChannelInfoDTO {
    id: string;
    consumer: string;
    drive: string;
    downloadSize: Array<number>;
    downloadApprovalCountLeft: number;
    listOfPublicKeys: Array<string>;
    shardReplicators: Array<string>;
    cumulativePayments: CumulativePaymentsDTO;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "consumer",
            "baseName": "consumer",
            "type": "string"
        },
        {
            "name": "drive",
            "baseName": "drive",
            "type": "string"
        },
        {
            "name": "downloadSize",
            "baseName": "downloadSize",
            "type": "Array<number>"
        },
        {
            "name": "downloadApprovalCountLeft",
            "baseName": "downloadApprovalCountLeft",
            "type": "number"
        },
        {
            "name": "listOfPublicKeys",
            "baseName": "listOfPublicKeys",
            "type": "Array<string>"
        },
        {
            "name": "shardReplicators",
            "baseName": "shardReplicators",
            "type": "Array<string>"
        },
        {
            "name": "cumulativePayments",
            "baseName": "cumulativePayments",
            "type": "CumulativePaymentsDTO"
        }
    ];

    static getAttributeTypeMap() {
        return DownloadChannelInfoDTO.attributeTypeMap;
    }
}

