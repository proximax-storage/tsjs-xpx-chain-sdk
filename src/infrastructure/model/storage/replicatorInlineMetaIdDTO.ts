// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { MetaIdDTO } from "../metaIdDTO";
import { ReplicatorDTO } from "./replicatorDTO";

export class ReplicatorInlineMetaIdDTO {
    replicator: ReplicatorDTO;
    meta: MetaIdDTO;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "replicator",
            "baseName": "replicator",
            "type": "ReplicatorDTO"
        },
        {
            "name": "meta",
            "baseName": "meta",
            "type": "MetaIdDTO"
        }
    ];

    static getAttributeTypeMap() {
        return ReplicatorInlineMetaIdDTO.attributeTypeMap;
    }
}

