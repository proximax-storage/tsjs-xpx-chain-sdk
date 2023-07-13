// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { from as observableFrom, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { StorageRoutesApi } from './api/apis';
import { NetworkHttp } from './NetworkHttp';
import { Http } from './Http';
import { StorageRepository } from './StorageRepository';
import { 
    DownloadChannel, DownloadChannelSearch, 
    DriveInfo, DriveInfoSearch, 
    Replicator, ReplicatorSearch,
    PublicAccount, Address
} from '../model/model';
import { RequestOptions } from './RequestOptions';
import { DriveQueryParams } from './DriveQueryParams';
import { DownloadChannelQueryParams } from './DownloadChannelQueryParams';
import { ReplicatorQueryParams } from './ReplicatorQueryParams';
import { Pagination } from '../model/Pagination';

/**
 * Storage http repository.
 *
 * @since 0.9.0
 */
export class StorageHttp extends Http implements StorageRepository {
    /**
     * @internal
     * xpx chain Library Storage routes api
     */
    private storageRoutesApi: StorageRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.storageRoutesApi = new StorageRoutesApi(url);
    }


    /**
     * Get the drive for a given accountId
     * @param accountId - public key
     * @returns Observable<DriveInfo | undefined>
     */
    public getBcDrive(accountId: string | PublicAccount | Address, requestOptions?: RequestOptions): Observable<DriveInfo | undefined> {
        let accountIdArg: string = ""; 
        
        if(accountId instanceof PublicAccount){
            accountIdArg = accountId.publicKey;
        }else if(accountId instanceof Address){
            accountIdArg = accountId.plain();
        }else{
            accountIdArg = accountId;
        }

        return observableFrom(this.storageRoutesApi.getBcDrive(accountIdArg, requestOptions))
                    .pipe(map(response =>
                        DriveInfo.createFromDriveDTO(response.body.drive)
                        )
                    );
    }

    /**
     * Get Drives info with query params.
     * @param driveQueryParams - conditions of the drive info search 
     * @returns Observable<DriveInfoSearch>
     */
    public searchBcDrives(queryParams?: DriveQueryParams, requestOptions?: RequestOptions): Observable<DriveInfoSearch> {
        return observableFrom(this.storageRoutesApi.searchBcDrives(queryParams, requestOptions)).pipe(
            map((response) => {
                let driveInfos = response.body.data.map((driveInfoInlineDTO) => {
                    return DriveInfo.createFromDriveDTO(driveInfoInlineDTO.drive, driveInfoInlineDTO.meta.id);
                });
                let paginationData = new Pagination(
                    response.body.pagination.totalEntries, 
                    response.body.pagination.pageNumber,
                    response.body.pagination.pageSize,
                    response.body.pagination.totalPages
                );
                return new DriveInfoSearch(driveInfos, paginationData)
            })
        )
    }

    /**
     * Get the download channel
     * @param channelId - Download channel public key or address
     * @returns Observable<DownloadChannel | undefined>
     */
    public getDownloadChannel(channelId: string | PublicAccount, requestOptions?: RequestOptions): Observable<DownloadChannel | undefined> {
        const accountIdArg = (channelId instanceof PublicAccount) ? channelId.publicKey : channelId;
        return observableFrom(this.storageRoutesApi.getDownloadChannel(accountIdArg, requestOptions))
                    .pipe(map(response =>
                        DownloadChannel.createFromDownloadChannelInfoDTO(response.body.downloadChannelInfo)
                        )
                    );
    }

    /**
     * Get Download Channels info with query params.
     * @param downloadChannelQueryParams - conditions of the Download Channel info search 
     * @returns Observable<DownloadChannelSearch>
     */
    public searchDownloadChannels(queryParams?: DownloadChannelQueryParams, requestOptions?: RequestOptions): Observable<DownloadChannelSearch> {
        return observableFrom(this.storageRoutesApi.searchDownloadChannel(queryParams, requestOptions)).pipe(
            map((response) => {
                let downloadChannels = response.body.data.map((downloadChannelInlineDTO) => {
                    return DownloadChannel.createFromDownloadChannelInfoDTO(
                        downloadChannelInlineDTO.downloadChannelInfo,
                        downloadChannelInlineDTO.meta.id    
                    );
                });
                let paginationData = new Pagination(
                    response.body.pagination.totalEntries, 
                    response.body.pagination.pageNumber,
                    response.body.pagination.pageSize,
                    response.body.pagination.totalPages
                );
                return new DownloadChannelSearch(downloadChannels, paginationData)
            })
        )
    }

    /**
     * Gets the exchanges for a given accountId
     * @param accountId - Account public key or address
     * @returns Observable<Replicator | undefined>
     */
    public getReplicator(accountId: string | PublicAccount, requestOptions?: RequestOptions): Observable<Replicator | undefined> {
        const accountIdArg: string = accountId instanceof PublicAccount ? accountId.publicKey : accountId; 

        return observableFrom(this.storageRoutesApi.getReplicator(accountIdArg, requestOptions))
                    .pipe(map(response =>
                        Replicator.createFromReplicatorDTO(response.body.replicator)
                        )
                    );
    }

    /**
     * Get replicator info with query params.
     * @param replicatorQueryParams - conditions of the replicator info search 
     * @returns Observable<ReplicatorSearch>
     */
    public searchReplicators(queryParams?: ReplicatorQueryParams, requestOptions?: RequestOptions): Observable<ReplicatorSearch> {
        return observableFrom(this.storageRoutesApi.searchReplicators(queryParams, requestOptions)).pipe(
            map((response) => {
                let replicators = response.body.data.map((replicatorInlineDTO) => {
                    return Replicator.createFromReplicatorDTO(replicatorInlineDTO.replicator, replicatorInlineDTO.meta.id);
                });
                let paginationData = new Pagination(
                    response.body.pagination.totalEntries, 
                    response.body.pagination.pageNumber,
                    response.body.pagination.pageSize,
                    response.body.pagination.totalPages
                );
                return new ReplicatorSearch(replicators, paginationData)
            })
        )
    }
}
