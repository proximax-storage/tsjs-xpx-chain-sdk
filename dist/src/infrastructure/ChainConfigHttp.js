"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const api_1 = require("./api");
const Http_1 = require("./Http");
const model_1 = require("../model/model");
/**
 * Chian http repository.
 *
 * @since 1.0
 */
class ChainConfigHttp extends Http_1.Http {
    /**
     * Constructor
     * @param url
     */
    constructor(url) {
        super();
        this.configRoutesApi = new api_1.ConfigRoutesApi(url);
    }
    /**
     * Gets blockchain configuration at given height
     * @param height
     * @returns Observable<ChainConfig>
     */
    getChainConfig(height) {
        return rxjs_1.from(this.configRoutesApi.getConfig(height)).pipe(operators_1.map((catapultConfigDTO) => {
            return model_1.ChainConfig.createFromDTO(catapultConfigDTO.catapultConfig);
        }));
    }
}
exports.ChainConfigHttp = ChainConfigHttp;
//# sourceMappingURL=ChainConfigHttp.js.map