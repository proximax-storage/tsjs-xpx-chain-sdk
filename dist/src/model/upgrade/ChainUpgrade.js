"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const UInt64_1 = require("../UInt64");
/**
 * The upgrade structure stores a required chain version at given height as returned from http upgradeRoutesApi.
 */
class ChainUpgrade {
    constructor(height, catapultVersion) {
        this.height = height;
        this.catapultVersion = catapultVersion;
    }
    static createFromDTO(upgradeDTO) {
        if (upgradeDTO) {
            return new ChainUpgrade(new UInt64_1.UInt64(upgradeDTO.height), new UInt64_1.UInt64(upgradeDTO.catapultVersion));
        }
        throw new Error("upgradeDTO not specified");
    }
}
exports.ChainUpgrade = ChainUpgrade;
//# sourceMappingURL=ChainUpgrade.js.map