// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {UInt64} from '../UInt64';
import {DownloadChannelInfoDTO} from '../../infrastructure/model/storage/downloadChannelInfoDTO';

export type CumulativePayments = {
    replicator: string,
    payment: UInt64
}

export type CumulativePaymentsDTO = {
    replicator: string,
    payment: number[]
}

export class DownloadChannel {

    constructor(
        public readonly id: string,
        public readonly consumer: string,
        public readonly drive: string,
        public readonly downloadSize: UInt64,
        public readonly downloadApprovalCountLeft: number,
        public readonly listOfPublicKeys: string[],
        public readonly shardReplicators: string[], // need verify
        public readonly cumulativePayments: CumulativePayments,
        public readonly metaId?: string
    ){

    }

    static createFromDownloadChannelInfoDTO(dto :DownloadChannelInfoDTO, metaId?: string){

        return DownloadChannel.createFromDTO(
            dto.id,
            dto.consumer,
            dto.drive,
            dto.downloadSize,
            dto.downloadApprovalCountLeft,
            dto.listOfPublicKeys,
            dto.shardReplicators,
            dto.cumulativePayments,
            metaId
        )
    }

    static createFromDTO(
        id: string,
        consumer: string,
        drive: string,
        downloadSize: number[],
        downloadApprovalCountLeft: number,
        listOfPublicKeys: string[],
        shardReplicators: string[], // need verify
        cumulativePayments: CumulativePaymentsDTO,
        metaId?: string
    ){
        return new DownloadChannel(
            id, consumer, drive,
            new UInt64(downloadSize),
            downloadApprovalCountLeft,
            listOfPublicKeys,
            shardReplicators,
            {
                replicator: cumulativePayments.replicator,
                payment: new UInt64(cumulativePayments.payment)
            },
            metaId
        );
    }
}