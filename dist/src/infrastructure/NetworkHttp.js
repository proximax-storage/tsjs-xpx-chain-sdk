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
const NetworkType_1 = require("../model/blockchain/NetworkType");
const api_1 = require("./api");
const Http_1 = require("./Http");
/**
 * Network http repository.
 *
 * @since 1.0
 */
class NetworkHttp extends Http_1.Http {
    /**
     * Constructor
     * @param url
     */
    constructor(url) {
        super();
        this.networkRoutesApi = new api_1.NetworkRoutesApi(url);
    }
    /**
     * Get current network type.
     *
     * @return network type enum.
     */
    getNetworkType() {
        return rxjs_1.from(this.networkRoutesApi.getNetworkType()).pipe(operators_1.map((networkTypeDTO) => {
            if (networkTypeDTO.name === 'mijinTest') {
                return NetworkType_1.NetworkType.MIJIN_TEST;
            }
            else if (networkTypeDTO.name === 'mijin') {
                return NetworkType_1.NetworkType.MIJIN;
            }
            else if (networkTypeDTO.name === 'testnet' || networkTypeDTO.name === 'publicTest') {
                return NetworkType_1.NetworkType.TEST_NET;
            }
            else if (networkTypeDTO.name === 'mainnet' || networkTypeDTO.name === 'public') {
                return NetworkType_1.NetworkType.MAIN_NET;
            }
            else if (networkTypeDTO.name === 'privateTest') {
                return NetworkType_1.NetworkType.PRIVATE_TEST;
            }
            else if (networkTypeDTO.name === 'private') {
                return NetworkType_1.NetworkType.PRIVATE;
            }
            else {
                throw new Error('network ' + networkTypeDTO.name + ' is not supported yet by the sdk');
            }
        }));
    }
}
exports.NetworkHttp = NetworkHttp;
//# sourceMappingURL=NetworkHttp.js.map