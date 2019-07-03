"use strict";
/*
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
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const PublicAccount_1 = require("../model/account/PublicAccount");
const MosaicId_1 = require("../model/mosaic/MosaicId");
const MosaicInfo_1 = require("../model/mosaic/MosaicInfo");
const MosaicNames_1 = require("../model/mosaic/MosaicNames");
const MosaicProperties_1 = require("../model/mosaic/MosaicProperties");
const MosaicPropertyType_1 = require("../model/mosaic/MosaicPropertyType");
const NamespaceId_1 = require("../model/namespace/NamespaceId");
const NamespaceName_1 = require("../model/namespace/NamespaceName");
const UInt64_1 = require("../model/UInt64");
const api_1 = require("./api");
const Http_1 = require("./Http");
const NetworkHttp_1 = require("./NetworkHttp");
/**
 * Mosaic http repository.
 *
 * @since 1.0
 */
class MosaicHttp extends Http_1.Http {
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url, networkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp_1.NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.mosaicRoutesApi = new api_1.MosaicRoutesApi(url);
    }
    /**
     * Gets the MosaicInfo for a given mosaicId
     * @param mosaicId - Mosaic id
     * @returns Observable<MosaicInfo>
     */
    getMosaic(mosaicId) {
        return this.getNetworkTypeObservable().pipe(operators_1.mergeMap((networkType) => rxjs_1.from(this.mosaicRoutesApi.getMosaic(mosaicId.toHex())).pipe(operators_1.map((mosaicInfoDTO) => {
            let mosaicFlag;
            let divisibility;
            let duration;
            if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType_1.MosaicPropertyType.MosaicFlags].value) {
                mosaicFlag = mosaicInfoDTO.mosaic.properties[MosaicPropertyType_1.MosaicPropertyType.MosaicFlags].value;
            }
            if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType_1.MosaicPropertyType.Divisibility].value) {
                divisibility = mosaicInfoDTO.mosaic.properties[MosaicPropertyType_1.MosaicPropertyType.Divisibility].value;
            }
            if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType_1.MosaicPropertyType.Duration].value) {
                duration = mosaicInfoDTO.mosaic.properties[MosaicPropertyType_1.MosaicPropertyType.Divisibility].value;
            }
            return new MosaicInfo_1.MosaicInfo(mosaicInfoDTO.meta.id, new MosaicId_1.MosaicId(mosaicInfoDTO.mosaic.mosaicId), new UInt64_1.UInt64(mosaicInfoDTO.mosaic.supply), new UInt64_1.UInt64(mosaicInfoDTO.mosaic.height), PublicAccount_1.PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType), mosaicInfoDTO.mosaic.revision, new MosaicProperties_1.MosaicProperties(mosaicFlag ? new UInt64_1.UInt64(mosaicFlag) : UInt64_1.UInt64.fromUint(0), (divisibility ? new UInt64_1.UInt64(divisibility) : UInt64_1.UInt64.fromUint(0)).compact(), duration ? new UInt64_1.UInt64(duration) : undefined));
        }))));
    }
    /**
     * Gets MosaicInfo for different mosaicIds.
     * @param mosaicIds - Array of mosaic ids
     * @returns Observable<MosaicInfo[]>
     */
    getMosaics(mosaicIds) {
        const mosaicIdsBody = {
            mosaicIds: mosaicIds.map((id) => id.toHex()),
        };
        return this.getNetworkTypeObservable().pipe(operators_1.mergeMap((networkType) => rxjs_1.from(this.mosaicRoutesApi.getMosaics(mosaicIdsBody)).pipe(operators_1.map((mosaicInfosDTO) => {
            return mosaicInfosDTO.map((mosaicInfoDTO) => {
                let mosaicFlag;
                let divisibility;
                let duration;
                if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType_1.MosaicPropertyType.MosaicFlags].value) {
                    mosaicFlag = mosaicInfoDTO.mosaic.properties[MosaicPropertyType_1.MosaicPropertyType.MosaicFlags].value;
                }
                if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType_1.MosaicPropertyType.Divisibility].value) {
                    divisibility = mosaicInfoDTO.mosaic.properties[MosaicPropertyType_1.MosaicPropertyType.Divisibility].value;
                }
                if (mosaicInfoDTO.mosaic.properties[MosaicPropertyType_1.MosaicPropertyType.Duration].value) {
                    duration = mosaicInfoDTO.mosaic.properties[MosaicPropertyType_1.MosaicPropertyType.Duration].value;
                }
                return new MosaicInfo_1.MosaicInfo(mosaicInfoDTO.meta.id, new MosaicId_1.MosaicId(mosaicInfoDTO.mosaic.mosaicId), new UInt64_1.UInt64(mosaicInfoDTO.mosaic.supply), new UInt64_1.UInt64(mosaicInfoDTO.mosaic.height), PublicAccount_1.PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType), mosaicInfoDTO.mosaic.revision, new MosaicProperties_1.MosaicProperties(mosaicFlag ? new UInt64_1.UInt64(mosaicFlag) : UInt64_1.UInt64.fromUint(0), (divisibility ? new UInt64_1.UInt64(divisibility) : UInt64_1.UInt64.fromUint(0)).compact(), duration ? new UInt64_1.UInt64(duration) : undefined));
            });
        }))));
    }
    /**
     * Get readable names for a set of mosaics
     * Returns friendly names for mosaics.
     * @param mosaicIds - Array of mosaic ids
     * @return Observable<MosaicNames[]>
     */
    getMosaicsNames(mosaicIds) {
        const mosaicIdsBody = {
            mosaicIds: mosaicIds.map((id) => id.toHex()),
        };
        return rxjs_1.from(this.mosaicRoutesApi.getMosaicsNames(mosaicIdsBody)).pipe(operators_1.map((mosaics) => {
            return mosaics.map((mosaic) => {
                return new MosaicNames_1.MosaicNames(new MosaicId_1.MosaicId(mosaic.mosaicId), mosaic.names.map((name) => {
                    return new NamespaceName_1.NamespaceName(new NamespaceId_1.NamespaceId(name), name);
                }));
            });
        }));
    }
}
exports.MosaicHttp = MosaicHttp;
//# sourceMappingURL=MosaicHttp.js.map