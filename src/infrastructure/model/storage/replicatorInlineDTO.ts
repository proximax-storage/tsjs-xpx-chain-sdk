// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { ReplicatorDTO } from "./replicatorDTO";

export class ReplicatorInlineDTO {
    replicator: ReplicatorDTO;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "replicator",
            "baseName": "replicator",
            "type": "ReplicatorDTO"
        }
    ];

    static getAttributeTypeMap() {
        return ReplicatorInlineDTO.attributeTypeMap;
    }
}

