"use strict";
/*
 * Copyright 2019 NEM
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
const BlockchainScore_1 = require("../model/blockchain/BlockchainScore");
const UInt64_1 = require("../model/UInt64");
const api_1 = require("./api");
const Http_1 = require("./Http");
/**
<<<<<<< HEAD
 * Chain http repository.
=======
 * Chian http repository.
>>>>>>> jwt
 *
 * @since 1.0
 */
class ChainHttp extends Http_1.Http {
    /**
     * Constructor
     * @param url
     */
<<<<<<< HEAD
    constructor(url) {
        super();
        this.chainRoutesApi = new api_1.ChainRoutesApi(url);
=======
    constructor(url, auth, headers) {
        super();
        this.chainRoutesApi = new api_1.ChainRoutesApi(url);
        if (auth) {
            this.chainRoutesApi.setDefaultAuthentication(auth);
        }
        if (headers) {
            this.chainRoutesApi.setHeaders(headers);
        }
>>>>>>> jwt
    }
    /**
     * Gets current blockchain height
     * @returns Observable<UInt64>
     */
    getBlockchainHeight() {
        return rxjs_1.from(this.chainRoutesApi.getBlockchainHeight()).pipe(operators_1.map((heightDTO) => {
            return new UInt64_1.UInt64(heightDTO.height);
        }));
    }
    /**
     * Gets current blockchain score
     * @returns Observable<BlockchainScore>
     */
    getBlockchainScore() {
        return rxjs_1.from(this.chainRoutesApi.getBlockchainScore()).pipe(operators_1.map((blockchainScoreDTO) => {
            return new BlockchainScore_1.BlockchainScore(new UInt64_1.UInt64(blockchainScoreDTO.scoreLow), new UInt64_1.UInt64(blockchainScoreDTO.scoreHigh));
        }));
    }
}
exports.ChainHttp = ChainHttp;
//# sourceMappingURL=ChainHttp.js.map