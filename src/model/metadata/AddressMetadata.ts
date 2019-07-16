// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { Metadata } from "./Metadata";
import { Address } from "../account/Address";
import { MetadataType } from "./MetadataType";
import { Field } from "./Field";

/* Metadata specialization for address/account */
export class AddressMetadata extends Metadata {
    /**
     * Constructor
     * @param metadataId
     * @param metadataType 
     * @param fields 
     */
    constructor(
        /* id of the address/account this metadata is associated with */
        public readonly metadataId: Address,

        /* metadata type */
        public readonly metadataType: MetadataType,

        /* metadata key/value array */
        public readonly fields: Field[]
    ) {
        super(metadataType, fields);
    }
}
