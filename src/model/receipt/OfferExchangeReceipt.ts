/*
 * Copyright 2023 ProximaX
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { PublicAccount, Address } from '../model';
import { MosaicId } from '../mosaic/MosaicId';
import { UInt64 } from '../UInt64';
import { Receipt } from './Receipt';
import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';

export interface ExchangeDetails{
    recipient: Address;
    mosaicIdGive: MosaicId;
    mosaicIdGet: MosaicId;
    mosaicAmountGive: UInt64;
    mosaicAmountGet: UInt64;
}

/**
 * Offer exchange: Sda Exchange offer exchanged.
 */
export class OfferExchangeReceipt extends Receipt {

    /**
     * Offer exchange receipt
     * @param sender - public key.
     * @param mosaicIdGive - The amount of mosaic.
     * @param mosaicIdGet - The receipt version
     * @param exchangeDetails - The exchange details
     */
    constructor(
            public readonly sender: PublicAccount,
            public readonly mosaicIdGive: MosaicId,
            public readonly mosaicIdGet: MosaicId,
            public readonly exchangeDetails: ExchangeDetails[],
            version: ReceiptVersion,
            type: ReceiptType) {
        super(version, type);
    }
}
