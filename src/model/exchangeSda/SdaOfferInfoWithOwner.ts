// Copyright 2020 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { SdaOfferInfoWithOwnerDTO } from "../../infrastructure/api";
import { MosaicId } from "../mosaic/MosaicId";
import { PublicAccount } from "../account/PublicAccount";
import { UInt64 } from "../UInt64";
import { NetworkType } from "../blockchain/NetworkType";

export class SdaOfferInfoWithOwner{
    constructor(
        readonly mosaicIdGive: MosaicId,
        readonly mosaicIdGet: MosaicId,
        readonly currentMosaicGiveAmount: UInt64,
        readonly currentMosaicGetAmount: UInt64,
        readonly initialMosaicGiveAmount: UInt64,
        readonly initialMosaicGetAmount: UInt64,
        readonly deadline: UInt64,
        readonly owner: PublicAccount
    ) {
    }

    static createFromDTO(offerInfoDTO: SdaOfferInfoWithOwnerDTO, networkType: NetworkType) {
        return new SdaOfferInfoWithOwner(
            new MosaicId(offerInfoDTO.mosaicIdGive),
            new MosaicId(offerInfoDTO.mosaicIdGet),
            new UInt64(offerInfoDTO.currentMosaicGiveAmount),
            new UInt64(offerInfoDTO.currentMosaicGetAmount),
            new UInt64(offerInfoDTO.initialMosaicGiveAmount),
            new UInt64(offerInfoDTO.initialMosaicGetAmount),
            new UInt64(offerInfoDTO.deadline), 
            PublicAccount.createFromPublicKey(offerInfoDTO.owner, networkType)
        );
    }
}
