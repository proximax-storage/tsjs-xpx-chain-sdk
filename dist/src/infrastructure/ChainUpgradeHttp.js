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
class ChainUpgradeHttp extends Http_1.Http {
    /**
     * Constructor
     * @param url
     */
    constructor(url) {
        super();
        this.upgradeRoutesApi = new api_1.UpgradeRoutesApi(url);
    }
    /**
     * Gets blockchain configuration at given height
     * @param height
     * @returns Observable<ChainConfig>
     */
    getChainUpgrade(height) {
        return rxjs_1.from(this.upgradeRoutesApi.getUpgrade(height)).pipe(operators_1.map((catapultUpgradeDTO) => {
            return model_1.ChainUpgrade.createFromDTO(catapultUpgradeDTO.catapultUpgrade);
        }));
    }
}
exports.ChainUpgradeHttp = ChainUpgradeHttp;
//# sourceMappingURL=ChainUpgradeHttp.js.map