// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {Observable} from 'rxjs';
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
/**
 * StorageRepository interface repository.
 *
 * @since 0.9.0
 */
export interface StorageRepository {

    /**
     * Get the bc drive for a given public key
     * @param driveKey - public key
     * @returns Observable<DriveInfo | undefined>
     */
     getBcDrive(accountId: string | PublicAccount, requestOptions?: RequestOptions): Observable<DriveInfo | undefined>;

    /**
    * Search BC Drives
    * @param queryParams - Drive Query Params
    * @returns Observable<DriveInfoSearch>
    */
    searchBcDrives(queryParams?: DriveQueryParams, requestOptions?: RequestOptions): Observable<DriveInfoSearch>;

    /**
     * Get the replicator for a given account id
     * @param accountId - address | PublicAccount
     * @returns Observable<Replicator | undefined>
     */
    getReplicator(accountId: string | Address | PublicAccount, requestOptions?: RequestOptions): Observable<Replicator | undefined>;

    /**
    * Search Replicators
    * @param queryParams - Replicator Query Params
    * @returns Observable<ReplicatorSearch>
    */
    searchReplicators(queryParams?: ReplicatorQueryParams, requestOptions?: RequestOptions): Observable<ReplicatorSearch>;

    /**
     * Get the Download Channel for a given public key
     * @param channelId - publickey string | PublicAccount
     * @returns Observable<DownloadChannel | undefined>
     */
    getDownloadChannel(channelId: string | PublicAccount, requestOptions?: RequestOptions): Observable<DownloadChannel | undefined>;

    /**
    * Search Download Channels
    * @param queryParams - Download Channel Query Params
    * @returns Observable<DownloadChannelSearch>
    */
    searchDownloadChannels(queryParams?: DownloadChannelQueryParams, requestOptions?: RequestOptions): Observable<DownloadChannelSearch>;

}
