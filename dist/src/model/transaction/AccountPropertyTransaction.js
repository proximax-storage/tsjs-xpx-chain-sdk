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
const PropertyType_1 = require("../account/PropertyType");
const UInt64_1 = require("../UInt64");
const ModifyAccountPropertyAddressTransaction_1 = require("./ModifyAccountPropertyAddressTransaction");
const ModifyAccountPropertyEntityTypeTransaction_1 = require("./ModifyAccountPropertyEntityTypeTransaction");
const ModifyAccountPropertyMosaicTransaction_1 = require("./ModifyAccountPropertyMosaicTransaction");
class AccountPropertyTransaction {
    /**
     * Create an address modification transaction object
     * @param deadline - The deadline to include the transaction.
     * @param propertyType - Type of account property transaction
     * @param modification - array of address modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyAccountPropertyAddressTransaction}
     */
    static createAddressPropertyModificationTransaction(deadline, propertyType, modifications, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        if (![PropertyType_1.PropertyType.AllowAddress, PropertyType_1.PropertyType.BlockAddress].includes(propertyType)) {
            throw new Error('Property type is not allowed.');
        }
        return ModifyAccountPropertyAddressTransaction_1.ModifyAccountPropertyAddressTransaction.create(deadline, propertyType, modifications, networkType, maxFee);
    }
    /**
     * Create an mosaic modification transaction object
     * @param deadline - The deadline to include the transaction.
     * @param propertyType - Type of account property transaction
     * @param modification - array of mosaic modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyAccountPropertyMosaicTransaction}
     */
    static createMosaicPropertyModificationTransaction(deadline, propertyType, modifications, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        if (![PropertyType_1.PropertyType.AllowMosaic, PropertyType_1.PropertyType.BlockMosaic].includes(propertyType)) {
            throw new Error('Property type is not allowed.');
        }
        return ModifyAccountPropertyMosaicTransaction_1.ModifyAccountPropertyMosaicTransaction.create(deadline, propertyType, modifications, networkType, maxFee);
    }
    /**
     * Create an entity type modification transaction object
     * @param deadline - The deadline to include the transaction.
     * @param propertyType - Type of account property transaction
     * @param modification - array of entity type modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyAccountPropertyEntityTypeTransaction}
     */
    static createEntityTypePropertyModificationTransaction(deadline, propertyType, modifications, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        if (![PropertyType_1.PropertyType.AllowTransaction, PropertyType_1.PropertyType.BlockTransaction].includes(propertyType)) {
            throw new Error('Property type is not allowed.');
        }
        return ModifyAccountPropertyEntityTypeTransaction_1.ModifyAccountPropertyEntityTypeTransaction.create(deadline, propertyType, modifications, networkType, maxFee);
    }
}
exports.AccountPropertyTransaction = AccountPropertyTransaction;
//# sourceMappingURL=AccountPropertyTransaction.js.map