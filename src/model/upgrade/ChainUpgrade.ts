// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { UpgradeDTO } from "../../infrastructure/model/upgradeDTO";
import { UInt64 } from "../UInt64";
import { BlockChainVersion } from "../blockchain/BlockChainVersion"

/**
 * The upgrade structure stores a required chain version at given height as returned from http upgradeRoutesApi.
 */
export class ChainUpgrade {
    constructor(
        public readonly height: UInt64,
        public readonly catapultVersion: BlockChainVersion
    ) {

    }

    public static createFromDTO(upgradeDTO: UpgradeDTO | undefined) {
        if (upgradeDTO) {
            let blockChainVersionHex = new UInt64(upgradeDTO.blockChainVersion).toHex();
            return new ChainUpgrade(
                new UInt64(upgradeDTO.height),
                new BlockChainVersion(
                    parseInt(blockChainVersionHex.substring(12, 16), 16),
                    parseInt(blockChainVersionHex.substring(8, 12), 16),
                    parseInt(blockChainVersionHex.substring(4, 8), 16),
                    parseInt(blockChainVersionHex.substring(0, 4), 16)
                )
            );
        }else{
            throw new Error("upgradeDTO not specified");
        }
    }
}
