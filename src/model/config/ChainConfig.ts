// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { ConfigDTO } from "../../infrastructure/model/configDTO";
import { UInt64 } from "../UInt64";

/**
 * The config structure stores a chain configuration as returned from http configRoutesApi.
 */
export class ChainConfig {
    constructor(
        public readonly height: UInt64,
        public readonly networkConfig: string,
        public readonly supportedEntityVersions: string
    ) {

    }

    public static createFromDTO(configDTO: ConfigDTO) {
        return new ChainConfig(
            new UInt64(configDTO.height),
            configDTO.networkConfig,
            configDTO.supportedEntityVersions
        );
    }
}
