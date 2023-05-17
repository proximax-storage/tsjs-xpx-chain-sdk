// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { MosaicId } from '../mosaic/MosaicId';

export class RemoveSdaExchangeOffer {

    /**
     * Constructor
     * @param mosaicIdGive
     * @param mosaicIdGet
     */
    constructor(
                /**
                 * Id of the mosaic give for which the offer pair should be removed.
                 */
                public readonly mosaicIdGive: MosaicId,

                /**
                 * Id of the mosaic get for which the offer pair should be removed.
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
