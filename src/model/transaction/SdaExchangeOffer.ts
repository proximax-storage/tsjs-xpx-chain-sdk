// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { UInt64 } from '../UInt64';
import { PublicAccount } from '../account/PublicAccount';
import { MosaicId } from '../mosaic/MosaicId';

export class SdaExchangeOffer {

    constructor(
                /**
                 * Id of the mosaic for which the offer should give
                 */
                public readonly mosaicIdGive: MosaicId,

                /**
                 * Amount of mosaic that should be given, in smallest unit
                 */
                public readonly mosaicAmountGive: UInt64,

                /**
                 * Id of the mosaic for which the offer should receive
                 */
                 public readonly mosaicIdGet: MosaicId,

                 /**
                  *  Amount of mosaic should be receive, in smallest unit
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
