// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {from as observableFrom, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Http} from './Http';
import {NetworkHttp} from './NetworkHttp';
import { Address, UInt64 } from '../model/model';
import { MetadataEntry } from '../model/metadata/MetadataEntry';
import { MetadataRoutesApi } from './api/metadataRoutesApi';
import { MetadataQueryParams } from './MetadataQueryParams';
import { MetadataRepository } from './MetadataRepository';
import { MetadataSearch } from '../model/metadata/MetadataSearch';
import { CompositeHashes } from './model/compositeHashes';
import { RequestOptions } from './RequestOptions';
import { Pagination } from '../model/Pagination';
import { MetadataEntriesResponse, MetadataEntryResponse, MetadataSearchResponse } from './api';

/**
 * Metadata http repository.
 *
 * @since 0.1.0
 */
export class MetadataHttp extends Http implements MetadataRepository {
    /**
     * @internal
     * xpx chain Library mosaic routes api
     */
    private metadataRoutesApi: MetadataRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.metadataRoutesApi = new MetadataRoutesApi(url);
    }

    /**
     * Get the Metadata for a compositeHash
     * @param compositeHash
     * @returns Observable<MetadataEntry>
     */
    public getMetadata(compositeHash: string, requestOptions?: RequestOptions): Observable<MetadataEntry> {
        return observableFrom(this.metadataRoutesApi.getMetadata(compositeHash, requestOptions))
            .pipe(
                map((response: MetadataEntryResponse) => {
                    const metadataInlineDTO = response.body;
                    return new MetadataEntry(
                        metadataInlineDTO.metadataEntry.version,
                        metadataInlineDTO.metadataEntry.compositeHash,
                        Address.createFromEncoded(metadataInlineDTO.metadataEntry.sourceAddress),
                        metadataInlineDTO.metadataEntry.targetKey,
                        new UInt64(metadataInlineDTO.metadataEntry.scopedMetadataKey),
                        new UInt64(metadataInlineDTO.metadataEntry.targetId),
                        metadataInlineDTO.metadataEntry.metadataType,
                        metadataInlineDTO.metadataEntry.valueSize,
                        metadataInlineDTO.metadataEntry.value,
                        metadataInlineDTO.id
                    );
                })
            );
    }

    /**
     * Get the Metadatas for a set of compositeHashes
     * @param compositeHashes
     * @returns Observable<MetadataEntry[]>
     */
     public getMetadatas(compositeHashes: string[], requestOptions?: RequestOptions): Observable<MetadataEntry[]> {

        let hashes: CompositeHashes = {
            compositeHashes : compositeHashes
        }

        return observableFrom(this.metadataRoutesApi.getMetadatas(hashes, requestOptions))
            .pipe(
                map((response: MetadataEntriesResponse) => {
                    const metadataInlineDTOs = response.body;

                    return metadataInlineDTOs.map(metadataDTO =>{
                        return new MetadataEntry(
                            metadataDTO.metadataEntry.version,
                            metadataDTO.metadataEntry.compositeHash,
                            Address.createFromEncoded(metadataDTO.metadataEntry.sourceAddress),
                            metadataDTO.metadataEntry.targetKey,
                            new UInt64(metadataDTO.metadataEntry.scopedMetadataKey),
                            new UInt64(metadataDTO.metadataEntry.targetId),
                            metadataDTO.metadataEntry.metadataType,
                            metadataDTO.metadataEntry.valueSize,
                            metadataDTO.metadataEntry.value,
                            metadataDTO.id
                        );
                    })
                })
            );
    }

    /**
     * Get the Metadatas for a set of compositeHashes
     * @param metadataQueryParams
     * @returns Observable<MetadataEntry[]>
     */
     public searchMetadata(metadataQueryParams?: MetadataQueryParams, requestOptions?: RequestOptions): Observable<MetadataSearch> {
        return observableFrom(this.metadataRoutesApi.searchMetadata(metadataQueryParams, requestOptions))
            .pipe(
                map((response: MetadataSearchResponse) => {
                    let metadataEntries: MetadataEntry[] = response.body.data.map(metadataDTO =>{
                        return new MetadataEntry(
                            metadataDTO.metadataEntry.version,
                            metadataDTO.metadataEntry.compositeHash,
                            Address.createFromEncoded(metadataDTO.metadataEntry.sourceAddress),
                            metadataDTO.metadataEntry.targetKey,
                            new UInt64(metadataDTO.metadataEntry.scopedMetadataKey),
                            new UInt64(metadataDTO.metadataEntry.targetId),
                            metadataDTO.metadataEntry.metadataType,
                            metadataDTO.metadataEntry.valueSize,
                            metadataDTO.metadataEntry.value,
                            metadataDTO.meta.id
                        );
                    })
                    
                    let paginationData = new Pagination(
                        response.body.pagination.totalEntries, 
                        response.body.pagination.pageNumber,
                        response.body.pagination.pageSize,
                        response.body.pagination.totalPages
                    );
                    return new MetadataSearch(metadataEntries, paginationData);
                })
            );
    }
}
