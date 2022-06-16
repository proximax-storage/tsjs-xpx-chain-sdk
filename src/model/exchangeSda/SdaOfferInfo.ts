// Copyright 2020 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { SdaOfferInfoDTO } from "../../infrastructure/api";
import { UInt64 } from "../UInt64";
import { MosaicId } from "../mosaic/MosaicId";

export class SdaOfferInfo {
    constructor(
        readonly mosaicIdGive: MosaicId,
        readonly mosaicIdGet: MosaicId,
        readonly currentMosaicGiveAmount: UInt64,
        readonly currentMosaicGetAmount: UInt64,
        readonly initialMosaicGiveAmount: UInt64,
        readonly initialMosaicGetAmount: UInt64,
        readonly deadline: UInt64,
    ) {

    }

    static createFromDTO(offerInfoDTO: SdaOfferInfoDTO) {
        return new SdaOfferInfo(
            new MosaicId(offerInfoDTO.mosaicIdGive),
            new MosaicId(offerInfoDTO.mosaicIdGet),
            new UInt64(offerInfoDTO.currentMosaicGiveAmount),
            new UInt64(offerInfoDTO.currentMosaicGetAmount),
            new UInt64(offerInfoDTO.initialMosaicGiveAmount),
            new UInt64(offerInfoDTO.initialMosaicGetAmount),
            new UInt64(offerInfoDTO.deadline)
        );
    }
}
