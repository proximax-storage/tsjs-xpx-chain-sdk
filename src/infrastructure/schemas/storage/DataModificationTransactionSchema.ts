// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { array, Schema, table, tableArray, TypeSize, ubyte, uint, ushort, short } from '../Schema';

/**
 * @module schema/DataModificationTransactionSchema
 */

/**
 * Data modification transaction schema
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
	array('driveKey'),
	array('downloadDataCdi'),
	array('uploadSize', TypeSize.INT),
	array('feedbackFeeAmount', TypeSize.INT)
]);
export default schema;
