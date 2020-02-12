// Copyright 2020 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { PublicAccount } from "../account/PublicAccount";
import { OfferInfo } from "./OfferInfo";
import { ExchangeDTO } from "../../infrastructure/api";
import { NetworkType } from "../blockchain/NetworkType";

export class AccountExchanges {
    constructor(
        readonly owner: PublicAccount,
        readonly buyOffers: OfferInfo[],
        readonly sellOffers: OfferInfo[]
    ) {

    }

    static createFromDTO(exchangeDTO: ExchangeDTO, networkType: NetworkType): AccountExchanges {
        return new AccountExchanges(
            PublicAccount.createFromPublicKey(exchangeDTO.owner, networkType),
            exchangeDTO.buyOffers.map(buyOffer => OfferInfo.createFromDTO(buyOffer)),
            exchangeDTO.sellOffers.map(sellOffer => OfferInfo.createFromDTO(sellOffer))
        );
    }
}
