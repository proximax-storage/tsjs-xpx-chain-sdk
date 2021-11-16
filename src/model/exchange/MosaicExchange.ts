// Copyright 2020 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { MosaicId } from "../mosaic/MosaicId";
import { PublicAccount } from "../account/PublicAccount";
import { UInt64 } from "../UInt64";
import { ExchangesDTO } from "../../infrastructure/api";
import { NetworkType } from "../blockchain/NetworkType";

export class MosaicExchange {
    constructor(
        readonly mosaicId: MosaicId,
        readonly owner: PublicAccount,
        readonly amount: UInt64,
        readonly price: number,
        readonly initialAmount: UInt64,
        readonly initialCost: UInt64,
        readonly deadline: UInt64,
    ) {

    }

    static createFromDTO(exchangesDTO: ExchangesDTO, networkType: NetworkType) {
        const owner = PublicAccount.createFromPublicKey(exchangesDTO.owner, networkType);
        return new MosaicExchange(
            new MosaicId(exchangesDTO.mosaicId),
            owner,
            new UInt64(exchangesDTO.amount),
            exchangesDTO.price,
            new UInt64(exchangesDTO.initialAmount),
            new UInt64(exchangesDTO.initialCost),
            new UInt64(exchangesDTO.deadline)
        );
    }
}
