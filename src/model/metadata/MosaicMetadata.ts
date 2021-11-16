// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { Metadata } from "./Metadata";
import { MosaicId } from "../mosaic/MosaicId";
import { MetadataType } from "./oldMetadataType";
import { Field } from "./Field";

/**
 * Specialization of Metadata for Mosaics
 */
export class MosaicMetadata extends Metadata {
    /**
     * Constructor
     * @param metadataId
     * @param metadataType 
     * @param fields 
     */
    constructor(
        /* id of mosaic this metadata is associated with */
        public readonly metadataId: MosaicId,

        /* metadata type */
        public readonly metadataType: MetadataType,

        /* metadata key/value array */
        public readonly fields: Field[]
    ) {
        super(metadataType, fields);
    }
}
