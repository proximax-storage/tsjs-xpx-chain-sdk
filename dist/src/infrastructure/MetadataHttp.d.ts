import { Observable } from 'rxjs';
import { MosaicId } from '../model/mosaic/MosaicId';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { Http } from './Http';
import { NetworkHttp } from './NetworkHttp';
import { MetadataRepository } from './MetadataRepository';
import { AddressMetadata } from '../model/metadata/AddressMetadata';
import { NamespaceMetadata } from '../model/metadata/NamespaceMetadata';
import { MosaicMetadata } from '../model/metadata/MosaicMetadata';
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
export declare class MetadataHttp extends Http implements MetadataRepository {
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp);
    /**
     * Gets the Metadata for a given accountId
     * @param accountId - Account address/public key
     * @returns Observable<MosaicInfo>
     */
    getAccountMetadata(accountId: string): Observable<AddressMetadata>;
    getNamespaceMetadata(namespaceId: NamespaceId): Observable<NamespaceMetadata>;
    getMosaicMetadata(mosaicId: MosaicId): Observable<MosaicMetadata>;
}
