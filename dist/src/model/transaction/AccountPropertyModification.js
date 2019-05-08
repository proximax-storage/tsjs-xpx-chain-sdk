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
class AccountPropertyModification {
    /**
     * Constructor
     * @param modificationType
     * @param value
     */
    constructor(
    /**
     * Modification type.
     */
    modificationType, 
    /**
     * Modification value (Address, Mosaic or Transaction Type).
     */
    value) {
        this.modificationType = modificationType;
        this.value = value;
    }
    /**
     * Create an address filter for account property modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param address - modification value (Address)
     * @returns {AccountPropertyModification}
     */
    static createForAddress(modificationType, address) {
        return new AccountPropertyModification(modificationType, address.plain());
    }
    /**
     * Create an mosaic filter for account property modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param mosaicId - modification value (Mosaic)
     * @returns {AccountPropertyModification}
     */
    static createForMosaic(modificationType, mosaicId) {
        return new AccountPropertyModification(modificationType, mosaicId.id.toDTO());
    }
    /**
     * Create an entity type filter for account property modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param entityType - modification value (Transaction Type)
     * @returns {AccountPropertyModification}
     */
    static createForEntityType(modificationType, entityType) {
        return new AccountPropertyModification(modificationType, entityType);
    }
    /**
     * @internal
     */
    toDTO() {
        return {
            value: this.value,
            modificationType: this.modificationType,
        };
    }
}
exports.AccountPropertyModification = AccountPropertyModification;
//# sourceMappingURL=AccountPropertyModification.js.map