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
const RestrictionType_1 = require("../account/RestrictionType");
const UInt64_1 = require("../UInt64");
const AccountAddressRestrictionModificationTransaction_1 = require("./AccountAddressRestrictionModificationTransaction");
const AccountMosaicRestrictionModificationTransaction_1 = require("./AccountMosaicRestrictionModificationTransaction");
const AccountOperationRestrictionModificationTransaction_1 = require("./AccountOperationRestrictionModificationTransaction");
class AccountRestrictionTransaction {
    /**
     * Create an account address restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - Type of account restriction transaction
     * @param modification - array of address modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountAddressRestrictionModificationTransaction}
     */
    static createAddressRestrictionModificationTransaction(deadline, restrictionType, modifications, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        if (![RestrictionType_1.RestrictionType.AllowAddress, RestrictionType_1.RestrictionType.BlockAddress].includes(restrictionType)) {
            throw new Error('Restriction type is not allowed.');
        }
        return AccountAddressRestrictionModificationTransaction_1.AccountAddressRestrictionModificationTransaction.create(deadline, restrictionType, modifications, networkType, maxFee);
    }
    /**
     * Create an account mosaic restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - Type of account restriction transaction
     * @param modification - array of mosaic modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountMosaicRestrictionModificationTransaction}
     */
    static createMosaicRestrictionModificationTransaction(deadline, restrictionType, modifications, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        if (![RestrictionType_1.RestrictionType.AllowMosaic, RestrictionType_1.RestrictionType.BlockMosaic].includes(restrictionType)) {
            throw new Error('Restriction type is not allowed.');
        }
        return AccountMosaicRestrictionModificationTransaction_1.AccountMosaicRestrictionModificationTransaction.create(deadline, restrictionType, modifications, networkType, maxFee);
    }
    /**
     * Create an account operation restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - Type of account restriction transaction
     * @param modification - array of operation modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {createOperationRestrictionModificationTransaction}
     */
    static createOperationRestrictionModificationTransaction(deadline, restrictionType, modifications, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        if (![RestrictionType_1.RestrictionType.AllowTransaction, RestrictionType_1.RestrictionType.BlockTransaction].includes(restrictionType)) {
            throw new Error('Restriction type is not allowed.');
        }
        return AccountOperationRestrictionModificationTransaction_1.AccountOperationRestrictionModificationTransaction.create(deadline, restrictionType, modifications, networkType, maxFee);
    }
}
exports.AccountRestrictionTransaction = AccountRestrictionTransaction;
//# sourceMappingURL=AccountRestrictionTransaction.js.map