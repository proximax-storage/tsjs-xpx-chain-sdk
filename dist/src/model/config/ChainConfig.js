"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const UInt64_1 = require("../UInt64");
/**
 * The config structure stores a chain configuration as returned from http configRoutesApi.
 * The contract can be created on blockachain using ModifyContractTransaction
 */
class ChainConfig {
    constructor(height, blockChainConfig, supportedEntityVersions) {
        this.height = height;
        this.blockChainConfig = blockChainConfig;
        this.supportedEntityVersions = supportedEntityVersions;
    }
    static createFromDTO(configDTO) {
        return new ChainConfig(new UInt64_1.UInt64(configDTO.height), configDTO.blockChainConfig, configDTO.supportedEntityVersions);
    }
}
exports.ChainConfig = ChainConfig;
//# sourceMappingURL=ChainConfig.js.map