// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { MetadataType } from "./oldMetadataType";
import { Field } from "./Field";

/**
 * Metadata is an array of key/value pairs which can be associated with an address/namespace/mosaic
 */
export class Metadata {

    /**
     * Constructor
     * @param metadataType 
     * @param fields 
     */
    constructor(
        /* type of metadata */
        public readonly metadataType: MetadataType,

        /* array of key/value pairs */
        public readonly fields: Field[]
    ) {

    }
}
