"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = require("./Schema");
/**
 * @module schema/ModifyMetadataTransactionSchema
 */
/**
 * Modify metadata transaction schema
 * @const {module:schema/Schema}
 */
const schema = new Schema_1.Schema([
    Schema_1.uint('size'),
    Schema_1.array('signature'),
    Schema_1.array('signer'),
    Schema_1.uint('version'),
    Schema_1.ushort('type'),
    Schema_1.array('fee', Schema_1.TypeSize.INT),
    Schema_1.array('deadline', Schema_1.TypeSize.INT),
    Schema_1.ubyte('metadataType'),
    Schema_1.array('metadataId'),
    Schema_1.tableArray('modifications', [
        Schema_1.uint('size'),
        Schema_1.ubyte('modificationType'),
        Schema_1.ubyte('keySize'),
        Schema_1.array('valueSize'),
        Schema_1.array('key'),
        Schema_1.array('value')
    ])
]);
exports.default = schema;
//# sourceMappingURL=ModifyMetadataTransactionSchema.js.map