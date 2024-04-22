// Copyright 2024 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { array, Schema, table, tableArray, TypeSize, ubyte, uint, ushort, short } from './Schema';

/**
 * @module schema/MosaicAddressRestrictionTransactionSchema
 */

/**
 * Mosaic Address Restriction transaction schema
 * @const {module:schema/Schema}
 */
const schema = new Schema([
	uint('size'),
	array('signature'),
	array('signer'),
	uint('version'),
	ushort('type'),
	array('fee', TypeSize.INT),
	array('deadline', TypeSize.INT),
	array('mosaicId', TypeSize.INT),
	array('restrictionKey', TypeSize.INT),
	array('previousRestrictionValue', TypeSize.INT),
	array('newRestrictionValue', TypeSize.INT),
	array('targetAddress'),
]);
export default schema;