"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Metadata is an array of key/value pairs which can be associated with an address/namespace/mosaic
 */
class Metadata {
    /**
     * Constructor
     * @param metadataType
     * @param fields
     */
    constructor(
    /* type of metadata */
    metadataType, 
    /* array of key/value pairs */
    fields) {
        this.metadataType = metadataType;
        this.fields = fields;
    }
}
exports.Metadata = Metadata;
//# sourceMappingURL=Metadata.js.map