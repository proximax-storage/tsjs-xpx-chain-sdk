"use strict";
/*
 * Copyright 2019 NEM
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
Object.defineProperty(exports, "__esModule", { value: true });
const UInt64_1 = require("../UInt64");
const AddressAliasTransaction_1 = require("./AddressAliasTransaction");
const MosaicAliasTransaction_1 = require("./MosaicAliasTransaction");
const Transaction_1 = require("./Transaction");
class AliasTransaction extends Transaction_1.Transaction {
    /**
     * Create an address alias transaction object
     * @param deadline - The deadline to include the transaction.
     * @param aliasAction - The namespace id.
     * @param namespaceId - The namespace id.
     * @param address - The address.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AddressAliasTransaction}
     */
    static createForAddress(deadline, aliasAction, namespaceId, address, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        return AddressAliasTransaction_1.AddressAliasTransaction.create(deadline, aliasAction, namespaceId, address, networkType, maxFee);
    }
    /**
     * Create a mosaic alias transaction object
     * @param deadline - The deadline to include the transaction.
     * @param aliasAction - The namespace id.
     * @param namespaceId - The namespace id.
     * @param mosaicId - The mosaic id.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {MosaicAliasTransaction}
     */
    static createForMosaic(deadline, aliasAction, namespaceId, mosaicId, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        return MosaicAliasTransaction_1.MosaicAliasTransaction.create(deadline, aliasAction, namespaceId, mosaicId, networkType, maxFee);
    }
}
exports.AliasTransaction = AliasTransaction;
//# sourceMappingURL=AliasTransaction.js.map