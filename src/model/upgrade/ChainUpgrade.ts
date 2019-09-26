// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { UpgradeDTO } from "../../infrastructure/model/upgradeDTO";
import { UInt64 } from "../UInt64";

/**
 * The upgrade structure stores a required chain version at given height as returned from http upgradeRoutesApi.
 */
export class ChainUpgrade {
    constructor(
        public readonly height: UInt64,
        public readonly catapultVersion: UInt64
    ) {

    }

    public static createFromDTO(upgradeDTO: UpgradeDTO | undefined) {
        if (upgradeDTO) {
            return new ChainUpgrade(
                new UInt64(upgradeDTO.height),
                new UInt64(upgradeDTO.blockChainVersion)
            );
        }
        throw new Error("upgradeDTO not specified");
    }
}
