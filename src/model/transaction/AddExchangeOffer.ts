// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { UInt64 } from '../UInt64';
import { ExchangeOfferType } from './ExchangeOfferType';
import { MosaicId } from '../mosaic/MosaicId';

export class AddExchangeOffer {

    /**
     * Constructor
     * @param type
     */
    constructor(

                /**
                 * Id of the mosaic for which the offer should be added
                 */
                public readonly mosaicId: MosaicId,

                /**
                 * Amount
                 */
                public readonly mosaicAmount: UInt64,

                /**
                 * Cost per mosaicAmount.
                 */
                public readonly cost: UInt64,

                /**
                 * Exchange offer type (buy/sell).
                 */
                public readonly type: ExchangeOfferType,

                /**
                 * Number of blocks - how long is this offer valid.
                 */
                public readonly duration: UInt64
    ) {

    }

    /**
     * @internal
     */
    toDTO() {
        return {
            mosaicId: this.mosaicId.id.toDTO(),
            mosaicAmount: this.mosaicAmount.toDTO(),
            cost: this.cost.toDTO(),
            type: this.type,
            duration: this.duration.toDTO()
        };
    }
}
