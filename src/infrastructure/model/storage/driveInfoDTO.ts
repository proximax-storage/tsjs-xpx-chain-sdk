// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { DataModificationDTO, UsedSizeDTO, DataModificationShardDTO } from "../../../model/storage/DriveInfo";

export class DriveInfoDTO {
    multisig: string;
    multisigAddress: string;
    owner: string;
    rootHash: string;
    lastModificationId: string;
    size: Array<number>;
    usedSizeBytes: Array<number>;
    metaFilesSizeBytes: Array<number>;
    replicatorCount: number;
    ownerManagement: number;
    activeDataModifications: Array<DataModificationDTO>;
    completedDataModifications: Array<DataModificationDTO>;
    confirmedUsedSizes: Array<UsedSizeDTO>;
    replicators: Array<string>;
    offboardingReplicators: Array<string>;
    downloadShards: Array<string>;
    dataModificationShards: Array<DataModificationShardDTO>

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "multisig",
            "baseName": "multisig",
            "type": "string"
        },
        {
            "name": "multisigAddress",
            "baseName": "multisigAddress",
            "type": "string"
        },
        {
            "name": "owner",
            "baseName": "owner",
            "type": "string"
        },
        {
            "name": "rootHash",
            "baseName": "rootHash",
            "type": "string"
        },
        {
            "name": "lastModificationId",
            "baseName": "lastModificationId",
            "type": "string"
        },
        {
            "name": "size",
            "baseName": "size",
            "type": "Array<number>"
        },
        {
            "name": "usedSizeBytes",
            "baseName": "usedSizeBytes",
            "type": "Array<number>"
        },
        {
            "name": "metaFilesSizeBytes",
            "baseName": "metaFilesSizeBytes",
            "type": "Array<number>"
        },
        {
            "name": "replicatorCount",
            "baseName": "replicatorCount",
            "type": "number"
        },
        {
            "name": "ownerManagement",
            "baseName": "ownerManagement",
            "type": "number"
        },
        {
            "name": "activeDataModifications",
            "baseName": "activeDataModifications",
            "type": "Array<DataModificationDTO>"
        },
        {
            "name": "completedDataModifications",
            "baseName": "completedDataModifications",
            "type": "Array<DataModificationDTO>"
        },
        {
            "name": "confirmedUsedSizes",
            "baseName": "confirmedUsedSizes",
            "type": "Array<UsedSizeDTO>"
        },
        {
            "name": "replicators",
            "baseName": "replicators",
            "type": "Array<string>"
        },
        {
            "name": "offboardingReplicators",
            "baseName": "offboardingReplicators",
            "type": "Array<string>"
        },
        {
            "name": "downloadShards",
            "baseName": "downloadShards",
            "type": "Array<string>"
        },
        {
            "name": "dataModificationShards",
            "baseName": "dataModificationShards",
            "type": "Array<DataModificationShardDTO>"
        }
    ];

    static getAttributeTypeMap() {
        return DriveInfoDTO.attributeTypeMap;
    }
}

