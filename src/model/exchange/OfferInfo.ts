// Copyright 2020 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { OfferInfoDTO } from "../../infrastructure/api";
import { UInt64 } from "../UInt64";
import { MosaicId } from "../mosaic/MosaicId";
import { Deadline } from "../transaction/Deadline";

export class OfferInfo {
    constructor(
        readonly mosaicId: MosaicId,
        readonly amount: UInt64,
        readonly price: number,
        readonly initialAmount: UInt64,
        readonly initialCost: UInt64,
        readonly deadline: Deadline,
    ) {

    }

    static createFromDTO(offerInfoDTO: OfferInfoDTO) {
        return new OfferInfo(
            new MosaicId(offerInfoDTO.mosaicId),
            new UInt64(offerInfoDTO.amount),
            offerInfoDTO.price,
            new UInt64(offerInfoDTO.initialAmount),
            new UInt64(offerInfoDTO.initialCost),
            Deadline.createFromDTO(offerInfoDTO.deadline)
        );
    }
}
