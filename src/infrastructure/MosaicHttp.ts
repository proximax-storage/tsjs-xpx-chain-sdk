/*
 * Copyright 2023 ProximaX
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {from as observableFrom, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {PublicAccount} from '../model/account/PublicAccount';
import {MosaicId} from '../model/mosaic/MosaicId';
import {MosaicInfo} from '../model/mosaic/MosaicInfo';
import { MosaicNames } from '../model/mosaic/MosaicNames';
import {MosaicProperties} from '../model/mosaic/MosaicProperties';
import { MosaicPropertyType } from '../model/mosaic/MosaicPropertyType';
import {NamespaceId} from '../model/namespace/NamespaceId';
import { NamespaceName } from '../model/namespace/NamespaceName';
import {UInt64} from '../model/UInt64';
import { 
    MosaicInfoResponse, MosaicsInfoResponse,
    MosaicLevyInfoResponse, MosaicRichListResponse, 
    MosaicRoutesApi, MosaicSearchResponse, MosaicsNamesResponse 
} from './api';
import {Http} from './Http';
import {MosaicRepository} from './MosaicRepository';
import {NetworkHttp} from './NetworkHttp';
import { RichlistEntry, Address, MosaicSearch, NetworkType } from '../model/model';
import { PageQueryParams } from './PageQueryParams';
import { MosaicQueryParams } from './MosaicQueryParams';
import { MosaicLevy } from "../model/mosaic/MosaicLevy";
import { RequestOptions } from './RequestOptions';
import { Pagination } from '../model/Pagination';

/**
 * Mosaic http repository.
 *
 * @since 1.0
 */
export class MosaicHttp extends Http implements MosaicRepository {
    /**
     * @internal
     * xpx chain Library mosaic routes api
     */
    private mosaicRoutesApi: MosaicRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.mosaicRoutesApi = new MosaicRoutesApi(url);
    }

    /**
     * Gets the MosaicInfo for a given mosaicId
     * @param mosaicId - Mosaic id
     * @returns Observable<MosaicInfo>
     */
    public getMosaic(mosaicId: MosaicId, requestOptions?: RequestOptions): Observable<MosaicInfo> {
        return this.getNetworkTypeObservable(requestOptions).pipe(
            mergeMap((networkType: NetworkType) => observableFrom(
                this.mosaicRoutesApi.getMosaic(mosaicId.toHex(), requestOptions))
                .pipe(
                    map((response: MosaicInfoResponse) => {
                        const mosaicInfoDTO = response.body;
                        let mosaicFlag;
                        let divisibility;
                        let duration;
                        if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType.MosaicFlags].value) {
                            mosaicFlag = mosaicInfoDTO.mosaic.properties[MosaicPropertyType.MosaicFlags].value;
                        }
                        if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Divisibility].value) {
                            divisibility = mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Divisibility].value;
                        }
                        if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Duration].value) {
                            duration = mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Duration].value;
                        }
                        return new MosaicInfo(
                            mosaicInfoDTO.meta.id,
                            new MosaicId(mosaicInfoDTO.mosaic.mosaicId),
                            new UInt64(mosaicInfoDTO.mosaic.supply),
                            new UInt64(mosaicInfoDTO.mosaic.height),
                            PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType),
                            mosaicInfoDTO.mosaic.revision,
                            new MosaicProperties(
                                mosaicFlag ? new UInt64(mosaicFlag) : UInt64.fromUint(0),
                                (divisibility ? new UInt64(divisibility) : UInt64.fromUint(0)).compact(),
                                duration ? new UInt64(duration) : undefined,
                            ),
                        );
                    })
                )
            )
        );
    }

    /**
     * Gets MosaicInfo for different mosaicIds.
     * @param mosaicIds - Array of mosaic ids
     * @returns Observable<MosaicInfo[]>
     */
    public getMosaics(mosaicIds: MosaicId[], requestOptions?: RequestOptions): Observable<MosaicInfo[]> {
        const mosaicIdsBody = {
            mosaicIds: mosaicIds.map((id) => id.toHex()),
        };
        return this.getNetworkTypeObservable(requestOptions).pipe(
            mergeMap((networkType: NetworkType) => observableFrom(
                this.mosaicRoutesApi.getMosaics(mosaicIdsBody, requestOptions))
                .pipe(
                    map((response: MosaicsInfoResponse) => {
                        return response.body.map((mosaicInfoDTO) => {
                            let mosaicFlag;
                            let divisibility;
                            let duration;
                            if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType.MosaicFlags].value) {
                                mosaicFlag = mosaicInfoDTO.mosaic.properties[MosaicPropertyType.MosaicFlags].value;
                            }
                            if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Divisibility].value) {
                                divisibility = mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Divisibility].value;
                            }
                            if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Duration].value) {
                                duration = mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Duration].value;
                            }
                            return new MosaicInfo(
                                mosaicInfoDTO.meta.id,
                                new MosaicId(mosaicInfoDTO.mosaic.mosaicId),
                                new UInt64(mosaicInfoDTO.mosaic.supply),
                                new UInt64(mosaicInfoDTO.mosaic.height),
                                PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType),
                                mosaicInfoDTO.mosaic.revision,
                                new MosaicProperties(
                                    mosaicFlag ? new UInt64(mosaicFlag) : UInt64.fromUint(0),
                                    (divisibility ? new UInt64(divisibility) : UInt64.fromUint(0)).compact(),
                                    duration ? new UInt64(duration) : undefined,
                                ),
                            );
                        });
                    })
                )
            )
        );
    }

    /**
     * Get readable names for a set of mosaics
     * Returns friendly names for mosaics.
     * @param mosaicIds - Array of mosaic ids
     * @return Observable<MosaicNames[]>
     */
    public getMosaicsNames(mosaicIds: MosaicId[], requestOptions?: RequestOptions): Observable<MosaicNames[]> {
        const mosaicIdsBody = {
            mosaicIds: mosaicIds.map((id) => id.toHex()),
        };
        return observableFrom(
            this.mosaicRoutesApi.getMosaicsNames(mosaicIdsBody, requestOptions))
            .pipe(
                map((response: MosaicsNamesResponse) => {
                    return response.body.map((mosaic) => {
                        return new MosaicNames(
                            new MosaicId(mosaic.mosaicId),
                            mosaic.names.map((name) => {
                            return new NamespaceName(new NamespaceId(name), name);
                            }),
                        );
                    });
                })
            );
    }

    /**
     * Gets mosaic richlist
     * @param mosaicId - Mosaic id
     * @param queryParams - (Optional) Page query params
     * @returns Observable<RichlistEntry[]>
     */
    getMosaicRichlist(mosaicId: MosaicId, queryParams?: PageQueryParams, requestOptions?: RequestOptions): Observable<RichlistEntry[]> {
        return observableFrom(
            this.mosaicRoutesApi.getMosaicRichList(
                mosaicId.toHex(),
                this.pageQueryParams(queryParams).page,
                this.pageQueryParams(queryParams).pageSize,
                requestOptions
            )).pipe(
                map((response: MosaicRichListResponse) => {
                    return response.body.map((richlistEntryDTO) => {
                        return RichlistEntry.create(
                            Address.createFromEncoded(richlistEntryDTO.address),
                            // TODO: check if route response actually have publicKey, FIXME in the .yaml then
                            (richlistEntryDTO as any).publicKey ? (richlistEntryDTO as any).publicKey : '0'.repeat(64),
                            new UInt64(richlistEntryDTO.amount));
                    });
                })
            );
    }

    /**
     * Gets mosaic levy
     * @param mosaicId - Mosaic id
     * @returns Observable<MosaicLevy>
     */
     getMosaicLevy(mosaicId: MosaicId, requestOptions?: RequestOptions): Observable<MosaicLevy> {
        return observableFrom(
            this.mosaicRoutesApi.getMosaicLevy(
                mosaicId.toHex(),
                requestOptions
            )).pipe(
                map((mosaicLevyDTO: MosaicLevyInfoResponse) => {
                    return new MosaicLevy(
                        mosaicLevyDTO.body.type, 
                        Address.createFromEncoded(mosaicLevyDTO.body.recipient), 
                        new MosaicId(mosaicLevyDTO.body.mosaicId), 
                        new UInt64(mosaicLevyDTO.body.fee)
                    );
                })
            )            
    }

    /**
     * Gets MosaicInfo for different mosaicIds.
     * @param mosaicQueryParams - conditions of the mosaic search 
     * @returns Observable<MosaicInfo[]>
     */
     public searchMosaics(mosaicQueryParams: MosaicQueryParams, requestOptions?: RequestOptions): Observable<MosaicSearch> {
        return this.getNetworkTypeObservable(requestOptions).pipe(
            mergeMap((networkType: NetworkType) => observableFrom(
                this.mosaicRoutesApi.searchMosaics(mosaicQueryParams, requestOptions))
                .pipe(
                    map((response: MosaicSearchResponse) => {
                        let mosaicsInfo = response.body.data.map((mosaicInfoDTO) => {
                            let mosaicFlag;
                            let divisibility;
                            let duration;
                            if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType.MosaicFlags].value) {
                                mosaicFlag = mosaicInfoDTO.mosaic.properties[MosaicPropertyType.MosaicFlags].value;
                            }
                            if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Divisibility].value) {
                                divisibility = mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Divisibility].value;
                            }
                            if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Duration].value) {
                                duration = mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Duration].value;
                            }
                            return new MosaicInfo(
                                mosaicInfoDTO.meta.id,
                                new MosaicId(mosaicInfoDTO.mosaic.mosaicId),
                                new UInt64(mosaicInfoDTO.mosaic.supply),
                                new UInt64(mosaicInfoDTO.mosaic.height),
                                PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType),
                                mosaicInfoDTO.mosaic.revision,
                                new MosaicProperties(
                                    mosaicFlag ? new UInt64(mosaicFlag) : UInt64.fromUint(0),
                                    (divisibility ? new UInt64(divisibility) : UInt64.fromUint(0)).compact(),
                                    duration ? new UInt64(duration) : undefined,
                                ),
                            );
                        });
                        let paginationData = new Pagination(
                            response.body.pagination.totalEntries, 
                            response.body.pagination.pageNumber,
                            response.body.pagination.pageSize,
                            response.body.pagination.totalPages
                        );
                        return new MosaicSearch(mosaicsInfo, paginationData);
                    })
                )
            )
        );
    }
}
