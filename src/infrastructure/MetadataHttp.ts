// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {from as observableFrom, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MosaicId} from '../model/mosaic/MosaicId';
import {NamespaceId} from '../model/namespace/NamespaceId';
import {Http} from './Http';
import {NetworkHttp} from './NetworkHttp';
import { MetadataRepository } from './MetadataRepository';
import { Field } from '../model/metadata/Field';
import { AddressMetadata } from '../model/metadata/AddressMetadata';
import { Address } from '../model/model';
import { NamespaceMetadata } from '../model/metadata/NamespaceMetadata';
import { MosaicMetadata } from '../model/metadata/MosaicMetadata';
import { MetadataRoutesApi } from './api/metadataRoutesApi';

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
     * Gets the Metadata for a given accountId
     * @param accountId - Account address/public key
     * @returns Observable<AddressMetadata>
     */
    public getAccountMetadata(accountId: string): Observable<AddressMetadata> {
        return observableFrom(
            this.metadataRoutesApi.getAccountMetadata(accountId)).pipe(map(response => {
                const addressMetadataInfoDTO = response.body;
                return new AddressMetadata(
                    Address.createFromEncoded(addressMetadataInfoDTO.metadata.metadataId),
                    addressMetadataInfoDTO.metadata.metadataType,
                    addressMetadataInfoDTO.metadata.fields.map(fieldDTO => new Field(fieldDTO.key, fieldDTO.value)));
            }));
    }

    /**
     * Gets the Metadata for a given namespaceId
     * @param namespaceId - the id of the namespace
     * @returns Observable<NamespaceMetadata>
     */
    public getNamespaceMetadata(namespaceId: NamespaceId): Observable<NamespaceMetadata> {
        return observableFrom(
            this.metadataRoutesApi.getNamespaceMetadata(namespaceId.id.toHex())).pipe(map(response => {
                const namespaceMetadataInfoDTO = response.body;
                return new NamespaceMetadata(
                    new NamespaceId(namespaceMetadataInfoDTO.metadata.metadataId),
                    namespaceMetadataInfoDTO.metadata.metadataType,
                    namespaceMetadataInfoDTO.metadata.fields.map(fieldDTO => new Field(fieldDTO.key, fieldDTO.value)));
            }));
    }

    /**
     * Gets the Metadata for a given mosaicId
     * @param mosaicId - the id of the mosaic
     * @returns Observable<MosaicMetadata>
     */
    public getMosaicMetadata(mosaicId: MosaicId): Observable<MosaicMetadata> {
        return observableFrom(
            this.metadataRoutesApi.getMosaicMetadata(mosaicId.id.toHex())).pipe(map(response => {
                const mosaicMetadataInfoDTO = response.body;
                return new MosaicMetadata(
                    new MosaicId(mosaicMetadataInfoDTO.metadata.metadataId),
                    mosaicMetadataInfoDTO.metadata.metadataType,
                    mosaicMetadataInfoDTO.metadata.fields.map(fieldDTO => new Field(fieldDTO.key, fieldDTO.value)));
            }));
    }
}
