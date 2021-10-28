// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { MetadataType } from "./MetadataType";
import { UInt64 } from "../UInt64";
import { Address } from "../account/Address";
import { Convert } from "../../core/format/Convert";
/**
 * MetadataEntry can be associated with an account/namespace/mosaic
 */
export class MetadataEntry {

    /**
     * Constructor
     * @param version 
     * @param compositeHash 
     * @param sourceAddress 
     * @param targetKey 
     * @param scopedMetadataKey 
     * @param targetId 
     * @param metadataType 
     * @param valueSize 
     * @param value
     * @param id
     */
    constructor(
        public readonly version: number,
        public readonly compositeHash: string,
        public readonly sourceAddress: Address,
        public readonly targetKey: string,
        public readonly scopedMetadataKey: UInt64,
        public readonly targetId: UInt64,
        public readonly metadataType: MetadataType,
        public readonly valueSize: number,
        public readonly value: string,
        public readonly id: string,
    ) {
        try {
            this.value = Convert.decodeHexToUtf8(value);
        } catch (error) {
            this.value = value;
        }
    }

    isAccountMetadata(): boolean{
        return this.metadataType === MetadataType.ACCOUNT;
    }

    isMosaicMetadata(): boolean{
        return this.metadataType === MetadataType.MOSAIC;
    }

    isNamespaceMetadata(): boolean{
        return this.metadataType === MetadataType.NAMESPACE;
    }
}
