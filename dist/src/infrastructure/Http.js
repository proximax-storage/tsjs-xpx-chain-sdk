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
/**
 * Http extended by all http services
 */
class Http {
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url, networkHttp, authentications, defaultHeaders) {
        this.apiClient = new js_xpx_catapult_library_1.ApiClient();
        if (url) {
            this.apiClient.basePath = url;
        }
        if (networkHttp) {
            this.networkHttp = networkHttp;
        }
        if (authentications) {
            this.apiClient.authentications = authentications;
        }
        if (defaultHeaders) {
            this.apiClient.defaultHeaders = defaultHeaders;
        }
    }
    getNetworkTypeObservable() {
        let networkTypeResolve;
        if (this.networkType == null) {
            networkTypeResolve = this.networkHttp.getNetworkType().pipe(operators_1.map((networkType) => {
                this.networkType = networkType;
                return networkType;
            }));
        }
        else {
            networkTypeResolve = rxjs_1.of(this.networkType);
        }
        return networkTypeResolve;
    }
}
exports.Http = Http;
//# sourceMappingURL=Http.js.map