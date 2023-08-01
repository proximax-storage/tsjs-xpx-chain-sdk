// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {Address} from '../account/Address';
import {UInt64} from '../UInt64';
import {DriveInfoDTO} from '../../infrastructure/model/storage/driveInfoDTO';

export type UsedSize = {
    replicator: string,
    size: UInt64
}

export type UsedSizeDTO = {
    replicator: string,
    size: number[]
}

export type DataModification = {
    id: string,
    owner: string,
    downloadDataCdi: string,
    expectedUploadSize: UInt64,
    actualUploadSize: UInt64,
    folderName: string,
    readyForApproval: boolean,
    isStream: boolean,
    state: number,
    success: number
}

export type DataModificationDTO = {
    id: string,
    owner: string,
    downloadDataCdi: string,
    expectedUploadSize: number[],
    actualUploadSize: number[],
    folderName: string,
    readyForApproval: boolean,
    isStream: boolean,
    state: number,
    success: number
}

export type ShardReplicator = {
    key: string,
    uploadSize: UInt64
}


export type DataModificationShard = {
    replicator: string,
    actualShardReplicators: ShardReplicator[],
    formerShardReplicators: ShardReplicator[],
    ownerUpload: UInt64
}

export type ShardReplicatorDTO = {
    key: string,
    uploadSize: number[]
}

export type DataModificationShardDTO = {
    replicator: string,
    actualShardReplicators: ShardReplicatorDTO[],
    formerShardReplicators: ShardReplicatorDTO[],
    ownerUpload: number[]
}

export class DriveInfo {

    constructor(
        public readonly multisig: string,
        public readonly multisigAddress: Address,
        public readonly owner: string,
        public readonly rootHash: string,
        public readonly lastModificationId: string,
        public readonly size: UInt64,
        public readonly usedSizeBytes: UInt64,
        public readonly metaFilesSizeBytes: UInt64,
        public readonly replicatorCount: number,
        public readonly ownerManagement: number,
        public readonly activeDataModifications: DataModification[], // need verify
        public readonly completedDataModifications: DataModification[],
        public readonly confirmedUsedSizes: UsedSize[],
        public readonly replicators: string[],
        public readonly offboardingReplicators: string[], // need verify
        public readonly downloadShards: string[], // need verify
        public readonly dataModificationShards: DataModificationShard[],
        public readonly metaId?: string
    ){

    }

    static createFromDriveDTO(driveDTO: DriveInfoDTO, metaId?: string){
        
        return DriveInfo.createFromDTO(
            driveDTO.multisig,
            driveDTO.multisigAddress,
            driveDTO.owner,
            driveDTO.rootHash,
            driveDTO.lastModificationId,
            driveDTO.size,
            driveDTO.usedSizeBytes,
            driveDTO.metaFilesSizeBytes,
            driveDTO.replicatorCount,
            driveDTO.ownerManagement,
            driveDTO.activeDataModifications,
            driveDTO.completedDataModifications,
            driveDTO.confirmedUsedSizes,
            driveDTO.replicators,
            driveDTO.offboardingReplicators,
            driveDTO.downloadShards,
            driveDTO.dataModificationShards,
            metaId
        );
    }

    static createFromDTO(
        multisig: string,
        multisigAddress: string,
        owner: string,
        rootHash: string,
        lastModificationId: string,
        size: number[],
        usedSizeBytes: number[],
        metaFilesSizeBytes: number[],
        replicatorCount: number,
        ownerManagement: number,
        activeDataModifications: DataModificationDTO[], // need verify
        completedDataModifications: DataModificationDTO[],
        confirmedUsedSizes: UsedSizeDTO[],
        replicators: string[],
        offboardingReplicators: string[], // need verify
        downloadShards: string[], // need verify
        dataModificationShards: DataModificationShardDTO[],
        metaId?: string
    ){

        let activeDataMod: DataModification[] = activeDataModifications.map((data: DataModificationDTO)=> {

            return {
                id: data.id,
                owner: data.owner,
                downloadDataCdi: data.downloadDataCdi,
                expectedUploadSize: new UInt64(data.expectedUploadSize),
                actualUploadSize: new UInt64(data.actualUploadSize),
                folderName: data.folderName,
                readyForApproval: data.readyForApproval,
                isStream: data.isStream,
                state: data.state,
                success: data.success
            };
        });

        let completedDataMod: DataModification[] = completedDataModifications.map((data: DataModificationDTO)=> {

            return {
                id: data.id,
                owner: data.owner,
                downloadDataCdi: data.downloadDataCdi,
                expectedUploadSize: new UInt64(data.expectedUploadSize),
                actualUploadSize: new UInt64(data.actualUploadSize),
                folderName: data.folderName,
                readyForApproval: data.readyForApproval,
                isStream: data.isStream,
                state: data.state,
                success: data.success
            };
        });

        let confirmedUsedSizeData: UsedSize[] = confirmedUsedSizes.map((data: UsedSizeDTO)=> {

            return {
                replicator: data.replicator,
                size: new UInt64(data.size)
            };
        });

        let dataModificationShardData: DataModificationShard[] = dataModificationShards.map((data: DataModificationShardDTO)=> {

            let actualSRs: ShardReplicator[] = data.actualShardReplicators.map((shardData)=> {
                return {
                    key: shardData.key,
                    uploadSize: new UInt64(shardData.uploadSize)
                }
            })

            let formerSRs: ShardReplicator[] = data.formerShardReplicators.map((shardData)=> {
                return {
                    key: shardData.key,
                    uploadSize: new UInt64(shardData.uploadSize)
                }
            })

            return {
                replicator: data.replicator,
                actualShardReplicators: actualSRs,
                formerShardReplicators: formerSRs,
                ownerUpload: new UInt64(data.ownerUpload)
            };
        });

        return new DriveInfo(
            multisig,
            Address.createFromEncoded(multisigAddress),
            owner,
            rootHash,
            lastModificationId,
            new UInt64(size),
            new UInt64(usedSizeBytes),
            new UInt64(metaFilesSizeBytes),
            replicatorCount,
            ownerManagement,
            activeDataMod,
            completedDataMod,
            confirmedUsedSizeData,
            replicators,
            offboardingReplicators,
            downloadShards,
            dataModificationShardData,
            metaId
        );
    }
}