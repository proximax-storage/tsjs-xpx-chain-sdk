
import {MetadataRoutesApi} from 'js-xpx-catapult-library';
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
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(url, networkHttp);
        this.metadataRoutesApi = new MetadataRoutesApi(this.apiClient);
    }

    /**
     * Gets the Metadata for a given accountId
     * @param accountId - Account address/public key
     * @returns Observable<MosaicInfo>
     */
    public getAccountMetadata(accountId: string): Observable<any> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.metadataRoutesApi.getAccountMetadata(accountId)).pipe(map((metadataInfoDTO) => {
                return metadataInfoDTO; // TODO: create strongly typed Info class/object here
            }))));
    }

    public getNamespaceMetadata(namespaceId: NamespaceId): Observable<any> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.metadataRoutesApi.getNamespaceMetadata(namespaceId.id.toHex())).pipe(map((metadataInfoDTO) => {
                return metadataInfoDTO; // TODO: create strongly typed Info class/object here
            }))));
    }

    public getMosaicMetadata(mosaicId: MosaicId): Observable<any> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.metadataRoutesApi.getMosaicMetadata(mosaicId.id.toHex())).pipe(map((metadataInfoDTO) => {
                return metadataInfoDTO; // TODO: create strongly typed Info class/object here
            }))));
    }

    /**
     * Gets the MosaicInfo for a given mosaicId
     * @param mosaicId - Mosaic id
     * @returns Observable<MosaicInfo>
     */ /*
    public getMosaic(mosaicId: MosaicId): Observable<MosaicInfo> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.mosaicRoutesApi.getMosaic(mosaicId.toHex())).pipe(map((mosaicInfoDTO) => {
                return new MosaicInfo(
                    mosaicInfoDTO.meta.id,
                    new MosaicId(mosaicInfoDTO.mosaic.mosaicId),
                    new UInt64(mosaicInfoDTO.mosaic.supply),
                    new UInt64(mosaicInfoDTO.mosaic.height),
                    PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType),
                    mosaicInfoDTO.mosaic.revision,
                    new MosaicProperties(
                        new UInt64(mosaicInfoDTO.mosaic.properties[0]),
                        (new UInt64(mosaicInfoDTO.mosaic.properties[1])).compact(),
                        new UInt64(mosaicInfoDTO.mosaic.properties[2]),
                    ),
                    mosaicInfoDTO.mosaic.levy,
                );
            }))));
    }

    /**
     * Gets MosaicInfo for different mosaicIds.
     * @param mosaicIds - Array of mosaic ids
     * @returns Observable<MosaicInfo[]>
     */ /*
    public getMosaics(mosaicIds: MosaicId[]): Observable<MosaicInfo[]> {
        const mosaicIdsBody = {
            mosaicIds: mosaicIds.map((id) => id.toHex()),
        };
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.mosaicRoutesApi.getMosaics(mosaicIdsBody)).pipe(map((mosaicInfosDTO) => {
                return mosaicInfosDTO.map((mosaicInfoDTO) => {
                    return new MosaicInfo(
                        mosaicInfoDTO.meta.id,
                        new MosaicId(mosaicInfoDTO.mosaic.mosaicId),
                        new UInt64(mosaicInfoDTO.mosaic.supply),
                        new UInt64(mosaicInfoDTO.mosaic.height),
                        PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType),
                        mosaicInfoDTO.mosaic.revision,
                        new MosaicProperties(
                            new UInt64(mosaicInfoDTO.mosaic.properties[0]),
                            (new UInt64(mosaicInfoDTO.mosaic.properties[1])).compact(),
                            new UInt64(mosaicInfoDTO.mosaic.properties[2]),
                        ),
                        mosaicInfoDTO.mosaic.levy,
                    );
                });
            }))));
    } //*/
}
