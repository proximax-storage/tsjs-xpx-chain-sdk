// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { Metadata } from "./Metadata";
import { MetadataType } from "./oldMetadataType";
import { NamespaceId } from "../namespace/NamespaceId";
import { Field } from "./Field";

/**
 * Metadata specialization for namespace
 */
export class NamespaceMetadata extends Metadata {
    /**
     * Constructor
     * @param metadataId
     * @param metadataType 
     * @param fields 
     */
    constructor(
        /* id of namespace this metadata is associated with */
        public metadataId: NamespaceId,

        /* metadata type */
        public readonly metadataType: MetadataType,

        /* metadata key/value array */
        public readonly fields: Field[]
    ) {
        super(metadataType, fields);
    }
}
