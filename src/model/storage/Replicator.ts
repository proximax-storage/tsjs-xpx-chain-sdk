// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {UInt64} from '../UInt64';
import {ReplicatorDTO} from '../../infrastructure/model/storage/replicatorDTO';

export type DriveWork = {
    drive: string,
    lastApprovedDataModificationId: string,
    initialDownloadWork: UInt64,
    lastCompletedCumulativeDownloadWork: UInt64
}

export type DriveWorkDTO = {
    drive: string,
    lastApprovedDataModificationId: string,
    initialDownloadWork: number[],
    lastCompletedCumulativeDownloadWork: number[]
}

export class Replicator {

    constructor(
        public readonly key: string,
        public readonly version: number,
        public readonly drives: DriveWork[],
        public readonly downloadChannels: string[], // need verify
        public readonly metaId?: string
    ){

    }

    static createFromReplicatorDTO(dto: ReplicatorDTO, metaId?: string){

        return Replicator.createFromDTO(
            dto.key,
            dto.version,
            dto.drives,
            dto.downloadChannels,
            metaId
        );
    }

    static createFromDTO(
        key: string,
        version: number,
        drives: DriveWorkDTO[],
        downloadChannels: string[], // need verify
        metaId?: string
    ){

        let driveWorks: DriveWork[] = drives.map((data: DriveWorkDTO)=> {

            return {
                drive: data.drive,
                lastApprovedDataModificationId: data.lastApprovedDataModificationId,
                initialDownloadWork: new UInt64(data.initialDownloadWork),
                lastCompletedCumulativeDownloadWork: new UInt64(data.lastCompletedCumulativeDownloadWork)
            };
        });

        return new Replicator(
            key, 
            version, 
            driveWorks,
            downloadChannels,
            metaId
        );
    }
}