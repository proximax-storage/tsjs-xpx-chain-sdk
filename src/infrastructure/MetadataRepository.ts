// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {Observable} from 'rxjs';
import { MetadataEntry } from '../model/metadata/MetadataEntry';
import { MetadataQueryParams } from './MetadataQueryParams';
import { MetadataSearch } from '../model/metadata/MetadataSearch';
import { RequestOptions } from './RequestOptions';

/**
 * Metadata interface repository.
 *
 * @since 0.1.0
 */
export interface MetadataRepository {
    /**
     * Gets the Metadata for a given accountId
     * @param accountId - Account address/public key
     * @returns Observable<AddressMetadata>
     */
    getMetadata(compositeHash: string, requestOptions?: RequestOptions): Observable<MetadataEntry>;

    /**
     * Gets the Metadata for a given namespaceId
     * @param namespaceId - the id of the namespace
     * @returns Observable<NamespaceMetadata>
     */
    getMetadatas(compositeHashes: string[], requestOptions?: RequestOptions): Observable<MetadataEntry[]>;
    /**
     * Get the Metadatas for given filter
     * @param metadataQueryParams - filter for metadata search
     * @returns Observable<MosaicMetadata>
     */
    searchMetadata(queryParams: MetadataQueryParams, requestOptions?: RequestOptions): Observable<MetadataSearch>;
    
}
