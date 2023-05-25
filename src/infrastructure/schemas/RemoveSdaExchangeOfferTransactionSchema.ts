// Copyright 2022 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {
    array,
    Schema,
    TypeSize,
    ubyte,
    uint,
    ushort,
    tableArray
} from './Schema';

/**
 * @module schema/RemoveSdaExchangeOfferTransactionSchema
 */

/**
 * RemoveSdaExchangeOffer transaction schema
 * @const {module:schema/Schema}
 */
export default new Schema([
    uint('size'),
    array('signature'),
    array('signer'),
    uint('version'),
    ushort('type'),
    array('fee', TypeSize.INT),
    array('deadline', TypeSize.INT),
    ubyte('sdaOfferCount'),
    tableArray('sdaOffers', [
        array('mosaicIdGive', TypeSize.INT),
        array('mosaicIdGet', TypeSize.INT),
    ])
]);
