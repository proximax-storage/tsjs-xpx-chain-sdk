// Copyright 2020 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { PublicAccount } from "../account/PublicAccount";
import { SdaOfferInfo } from "./SdaOfferInfo";
import { AccountSdaExchangeDTO } from "../../infrastructure/api";
import { NetworkType } from "../blockchain/NetworkType";

export class AccountSdaExchanges {
    constructor(
        readonly owner: PublicAccount,
        readonly version: number,
        readonly sdaOfferBalances: SdaOfferInfo[],
        readonly expiredSdaOfferBalances: SdaOfferInfo[]
    ) {

    }

    static createFromDTO(accountSdaExchangeDTO: AccountSdaExchangeDTO | undefined, networkType: NetworkType): AccountSdaExchanges | undefined {
        return accountSdaExchangeDTO ? new AccountSdaExchanges(
            PublicAccount.createFromPublicKey(accountSdaExchangeDTO.owner, networkType),
            accountSdaExchangeDTO.version,
            accountSdaExchangeDTO.sdaOfferBalances.map(sdaOfferBalance => SdaOfferInfo.createFromDTO(sdaOfferBalance)),
            accountSdaExchangeDTO.expiredSdaOfferBalances.map(expiredSdaOfferBalance => SdaOfferInfo.createFromDTO(expiredSdaOfferBalance))
        ) : undefined;
    }
}
