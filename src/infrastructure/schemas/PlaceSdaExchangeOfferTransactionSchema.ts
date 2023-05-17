// Copyright 2022 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {
    array,
    Schema,
    TypeSize,
    uint,
    ushort,
    tableArray,
    ubyte
} from './Schema';

/**
 * @module schema/PlaceSdaExchangeOfferTransactionSchema
 */

/**
 * PlaceSdaExchangeOffer transaction schema
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
        array('mosaicIdGiveAmount', TypeSize.INT),
        array('mosaicIdGet', TypeSize.INT),
        array('mosaicIdGetAmount', TypeSize.INT),
        array('duration', TypeSize.INT)
    ])
]);
