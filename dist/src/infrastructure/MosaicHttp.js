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
const js_xpx_catapult_library_1 = require("js-xpx-catapult-library");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const PublicAccount_1 = require("../model/account/PublicAccount");
const MosaicId_1 = require("../model/mosaic/MosaicId");
const MosaicInfo_1 = require("../model/mosaic/MosaicInfo");
const MosaicProperties_1 = require("../model/mosaic/MosaicProperties");
const UInt64_1 = require("../model/UInt64");
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
    constructor(url, networkHttp, authentications, defaultHeaders) {
        networkHttp = networkHttp == null ? new NetworkHttp_1.NetworkHttp(url) : networkHttp;
        super(url, networkHttp, authentications, defaultHeaders);
        this.mosaicRoutesApi = new js_xpx_catapult_library_1.MosaicRoutesApi(this.apiClient);
    }
    /**
     * Gets the MosaicInfo for a given mosaicId
     * @param mosaicId - Mosaic id
     * @returns Observable<MosaicInfo>
     */
    getMosaic(mosaicId) {
        return this.getNetworkTypeObservable().pipe(operators_1.mergeMap((networkType) => rxjs_1.from(this.mosaicRoutesApi.getMosaic(mosaicId.toHex())).pipe(operators_1.map((mosaicInfoDTO) => {
            return new MosaicInfo_1.MosaicInfo(mosaicInfoDTO.meta.id, new MosaicId_1.MosaicId(mosaicInfoDTO.mosaic.mosaicId), new UInt64_1.UInt64(mosaicInfoDTO.mosaic.supply), new UInt64_1.UInt64(mosaicInfoDTO.mosaic.height), PublicAccount_1.PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType), mosaicInfoDTO.mosaic.revision, new MosaicProperties_1.MosaicProperties(new UInt64_1.UInt64(mosaicInfoDTO.mosaic.properties[0]), (new UInt64_1.UInt64(mosaicInfoDTO.mosaic.properties[1])).compact(), new UInt64_1.UInt64(mosaicInfoDTO.mosaic.properties[2])), mosaicInfoDTO.mosaic.levy);
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
                return new MosaicInfo_1.MosaicInfo(mosaicInfoDTO.meta.id, new MosaicId_1.MosaicId(mosaicInfoDTO.mosaic.mosaicId), new UInt64_1.UInt64(mosaicInfoDTO.mosaic.supply), new UInt64_1.UInt64(mosaicInfoDTO.mosaic.height), PublicAccount_1.PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType), mosaicInfoDTO.mosaic.revision, new MosaicProperties_1.MosaicProperties(new UInt64_1.UInt64(mosaicInfoDTO.mosaic.properties[0]), (new UInt64_1.UInt64(mosaicInfoDTO.mosaic.properties[1])).compact(), new UInt64_1.UInt64(mosaicInfoDTO.mosaic.properties[2])), mosaicInfoDTO.mosaic.levy);
            });
        }))));
    }
}
exports.MosaicHttp = MosaicHttp;
//# sourceMappingURL=MosaicHttp.js.map