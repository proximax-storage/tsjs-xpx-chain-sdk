// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { ExchangeOfferType } from './ExchangeOfferType';
import { MosaicId } from '../mosaic/MosaicId';

export class RemoveExchangeOffer {

    /**
     * Constructor
     * @param mosaicId
     * @param offerType
     */
    constructor(
                /**
                 * Id of the mosaic for which the offer should be removed.
                 */
                public readonly mosaicId: MosaicId,

                /**
                 * Exchange offer type (buy/sell).
                 */
                public readonly offerType: ExchangeOfferType,
    ) {

    }

    /**
     * @internal
     */
    toDTO() {
        return {
            mosaicId: this.mosaicId.id.toDTO(),
            offerType: this.offerType,
        };
    }
}
