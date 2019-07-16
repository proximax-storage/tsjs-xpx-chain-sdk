// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { array, Schema, table, tableArray, TypeSize, ubyte, uint, ushort } from './Schema';

/**
 * @module schema/ModifyContractTransactionSchema
 */

/**
 * Modify contract transaction schema
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
	array('durationDelta', TypeSize.INT),
	array('hash'),
	ubyte('numCustomers'),
	ubyte('numExecutors'),
	ubyte('numVerifiers'),
	tableArray('customers', [
		ubyte('type'),
		array('cosignatoryPublicKey')
	]),
	tableArray('executors', [
		ubyte('type'),
		array('cosignatoryPublicKey')
	]),
	tableArray('verifiers', [
		ubyte('type'),
		array('cosignatoryPublicKey')
	])
]);

export default schema;
