// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { array, Schema, table, tableArray, TypeSize, ubyte, uint, ushort } from './Schema';

/**
 * @module schema/ModifyMetadataTransactionSchema
 */

/**
 * Modify metadata transaction schema
 * @const {module:schema/Schema}
 */
const schema = new Schema([
	uint('size'),
	array('signature'),
	array('signer'),
	ushort('version'),
	ushort('type'),
	array('fee', TypeSize.INT),
	array('deadline', TypeSize.INT),
	ubyte('metadataType'),
	array('metadataId'),
	tableArray('modifications', [
		uint('size'),
		ubyte('modificationType'),
		ubyte('keySize'),
		array('valueSize'),
		array('key'),
		array('value')
	])
]);
export default schema;
