// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { UInt64 } from '../UInt64';
import { PublicAccount } from '../account/PublicAccount';
import { MosaicId } from '../mosaic/MosaicId';

export class SdaExchangeOffer {

    /**
     * Constructor
     * @param type
     */
    constructor(
                /**
                 * Id of the mosaic for which the offer should be given
                 */
                public readonly mosaicIdGive: MosaicId,

                /**
                 * Amount of mosaic that should be given
                 */
                public readonly mosaicAmountGive: UInt64,

                /**
                 * Id of the mosaic for which the offer should be received
                 */
                 public readonly mosaicIdGet: MosaicId,

                 /**
                  *  Amount of mosaic should be received
                  */
                 public readonly mosaicAmountGet: UInt64,

                /**
                 * duration of block the offer valid 
                 */
                public readonly duration: UInt64,
    ) {

    }

    /**
     * @internal
     */
    toDTO() {
        return {
            mosaicIdGive: this.mosaicIdGive.id.toDTO(),
            mosaicIdGiveAmount: this.mosaicAmountGive.toDTO(),
            mosaicIdGet: this.mosaicIdGet.id.toDTO(),
            mosaicIdGetAmount: this.mosaicAmountGet.toDTO(),
            duration: this.duration.toDTO()
        };
    }
}
