// Copyright 2024 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { array, Schema, table, tableArray, TypeSize, ubyte, uint, ushort, short } from './Schema';

/**
 * @module schema/AccountAddressRestrictionTransactionSchema
 */

/**
 * Account Address Restriction transaction schema
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
	ushort('restrictionFlags'),
	ubyte('restrictionAdditionsCount'),
	ubyte('restrictionDeletionsCount'),
	uint('accountRestrictionTransactionBody_Reserved1'),
	tableArray('restrictionAdditions', [
        array('address')
    ]),
	tableArray('restrictionDeletions', [
        array('address')
    ])
]);
export default schema;