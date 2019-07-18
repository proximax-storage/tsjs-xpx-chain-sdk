
import {from as observableFrom, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {PublicAccount} from '../model/account/PublicAccount';
import {MosaicId} from '../model/mosaic/MosaicId';
import {MosaicInfo} from '../model/mosaic/MosaicInfo';
import {MosaicProperties} from '../model/mosaic/MosaicProperties';
import {NamespaceId} from '../model/namespace/NamespaceId';
import {UInt64} from '../model/UInt64';
import {Http} from './Http';
import {MosaicRepository} from './MosaicRepository';
import {NetworkHttp} from './NetworkHttp';
import {QueryParams} from './QueryParams';
import { MetadataRepository } from './MetadataRepository';
import { MetadataInfo } from '../model/metadata/MetadataInfo';
import { Metadata } from '../model/metadata/Metadata';
import { Field } from '../model/metadata/Field';
import { AddressMetadata } from '../model/metadata/AddressMetadata';
import { Address } from '../model/model';
import { NamespaceMetadata } from '../model/metadata/NamespaceMetadata';
import { MosaicMetadata } from '../model/metadata/MosaicMetadata';
import { MetadataRoutesApi } from './api/metadataRoutesApi';
import { Authentication } from './model/models';

/**
 export declare class MetadataRoutesApi {
  constructor(apiClient: any);

  getAccountMetadata(accountId: any): Promise<any>;

  getAccountMetadataWithHttpInfo(accountId: any): Promise<any>;

  getMetadata(metadataId: any): Promise<any>;

  getMetadataWithHttpInfo(metadataId: any): Promise<any>;

  getMetadatas(metadataIds: any): Promise<any>;

  getMetadatasWithHttpInfo(metadataIds: any): Promise<any>;

  getMosaicMetadata(mosaicId: any): Promise<any>;

  getMosaicMetadataWithHttpInfo(mosaicId: any): Promise<any>;

  getNamespaceMetadata(namespaceId: any): Promise<any>;

  getNamespaceMetadataWithHttpInfo(namespaceId: any): Promise<any>;

}*/

/**
 * Metadata http repository.
 *
 * @since 0.1.0
 */
export class MetadataHttp extends Http implements MetadataRepository {
    /**
     * @internal
     * Nem2 Library mosaic routes api
     */
    private metadataRoutesApi: MetadataRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp, auth?: Authentication, headers?: {}) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.metadataRoutesApi = new MetadataRoutesApi(url);
        if (auth) {
            this.metadataRoutesApi.setDefaultAuthentication(auth);
        }
        if (headers) {
            this.metadataRoutesApi.setHeaders(headers);
        }
    }

    /**
     * Gets the Metadata for a given accountId
     * @param accountId - Account address/public key
     * @returns Observable<MosaicInfo>
     */
    public getAccountMetadata(accountId: string): Observable<AddressMetadata> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.metadataRoutesApi.getAccountMetadata(accountId)).pipe(map((addressMetadataInfoDTO: any) => {
                return new AddressMetadata(
                    Address.createFromEncoded(addressMetadataInfoDTO.metadata.metadataId),
                    addressMetadataInfoDTO.metadata.metadataType,
                    addressMetadataInfoDTO.metadata.fields.map(fieldDTO => new Field(fieldDTO.key, fieldDTO.value)));
            }))));
    }

    public getNamespaceMetadata(namespaceId: NamespaceId): Observable<NamespaceMetadata> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.metadataRoutesApi.getNamespaceMetadata(namespaceId.id.toHex())).pipe(map((namespaceMetadataInfoDTO: any) => {
                    return new NamespaceMetadata(
                        new NamespaceId(namespaceMetadataInfoDTO.metadata.metadataId),
                        namespaceMetadataInfoDTO.metadata.metadataType,
                        namespaceMetadataInfoDTO.metadata.fields.map(fieldDTO => new Field(fieldDTO.key, fieldDTO.value)));
                }))));
    }

    public getMosaicMetadata(mosaicId: MosaicId): Observable<MosaicMetadata> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.metadataRoutesApi.getMosaicMetadata(mosaicId.id.toHex())).pipe(map((mosaicMetadataInfoDTO: any) => {
                    return new MosaicMetadata(
                        new MosaicId(mosaicMetadataInfoDTO.metadata.metadataId),
                        mosaicMetadataInfoDTO.metadata.metadataType,
                        mosaicMetadataInfoDTO.metadata.fields.map(fieldDTO => new Field(fieldDTO.key, fieldDTO.value)));
                }))));
    }
}
