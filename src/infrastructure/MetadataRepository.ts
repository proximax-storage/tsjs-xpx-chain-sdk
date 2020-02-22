// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {Observable} from 'rxjs';
import { AddressMetadata, NamespaceMetadata, MosaicMetadata, MosaicId, NamespaceId } from '../model/model';

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
    getAccountMetadata(accountId: string): Observable<AddressMetadata>;

    /**
     * Gets the Metadata for a given namespaceId
     * @param namespaceId - the id of the namespace
     * @returns Observable<NamespaceMetadata>
     */
    getNamespaceMetadata(namespaceId: NamespaceId): Observable<NamespaceMetadata>;
    /**
     * Gets the Metadata for a given mosaicId
     * @param mosaicId - the id of the mosaic
     * @returns Observable<MosaicMetadata>
     */
    getMosaicMetadata(mosaicId: MosaicId): Observable<MosaicMetadata>;
}
