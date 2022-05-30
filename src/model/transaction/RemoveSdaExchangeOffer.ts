// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { MosaicId } from '../mosaic/MosaicId';

export class RemoveSdaExchangeOffer {

    /**
     * Constructor
     * @param mosaicId
     * @param offerType
     */
    constructor(
                /**
                 * Id of the mosaic for which the offer should be removed.
                 */
                public readonly mosaicIdGive: MosaicId,

                /**
                 * Exchange offer type (buy/sell).
                 */
                public readonly mosaicIdGet: MosaicId,
    ) {

    }

    /**
     * @internal
     */
    toDTO() {
        return {
            mosaicIdGive: this.mosaicIdGive.id.toDTO(),
            mosaicIdGet: this.mosaicIdGet.id.toDTO()
        };
    }
}
