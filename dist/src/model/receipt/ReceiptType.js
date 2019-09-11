"use strict";
/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, type 2.0 (the "License"),
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
/**
 * Receipt type enums.
 *
 * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/ReceiptType.h
 * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/ReceiptType.cpp
 */
var ReceiptType;
(function (ReceiptType) {
    /**
     * The recipient, account and amount of fees received for harvesting a block. It is recorded when a block is harvested.
     */
    ReceiptType[ReceiptType["Harvest_Fee"] = 8515] = "Harvest_Fee";
    /**
     * The unresolved and resolved alias. It is recorded when a transaction indicates a valid address alias instead of an address.
     */
    ReceiptType[ReceiptType["Address_Alias_Resolution"] = 61763] = "Address_Alias_Resolution";
    /**
     * The unresolved and resolved alias. It is recorded when a transaction indicates a valid mosaic alias instead of a mosaicId.
     */
    ReceiptType[ReceiptType["Mosaic_Alias_Resolution"] = 62019] = "Mosaic_Alias_Resolution";
    /**
     * A collection of state changes for a given source. It is recorded when a state change receipt is issued.
     */
    ReceiptType[ReceiptType["Transaction_Group"] = 57667] = "Transaction_Group";
    /**
     * The mosaicId expiring in this block. It is recorded when a mosaic expires.
     */
    ReceiptType[ReceiptType["Mosaic_Expired"] = 16717] = "Mosaic_Expired";
    /**
     * The sender and recipient of the levied mosaic, the mosaicId and amount. It is recorded when a transaction has a levied mosaic.
     */
    ReceiptType[ReceiptType["Mosaic_Levy"] = 4685] = "Mosaic_Levy";
    /**
     * The sender and recipient of the mosaicId and amount representing the cost of registering the mosaic.
     * It is recorded when a mosaic is registered.
     */
    ReceiptType[ReceiptType["Mosaic_Rental_Fee"] = 4941] = "Mosaic_Rental_Fee";
    /**
     * The namespaceId expiring in this block. It is recorded when a namespace expires.
     */
    ReceiptType[ReceiptType["Namespace_Expired"] = 16718] = "Namespace_Expired";
    /**
     * The sender and recipient of the mosaicId and amount representing the cost of extending the namespace.
     * It is recorded when a namespace is registered or its duration is extended.
     */
    ReceiptType[ReceiptType["Namespace_Rental_Fee"] = 4686] = "Namespace_Rental_Fee";
    /**
     * The lockhash sender, mosaicId and amount locked. It is recorded when a valid HashLockTransaction is announced.
     */
    ReceiptType[ReceiptType["LockHash_Created"] = 12616] = "LockHash_Created";
    /**
     * The haslock sender, mosaicId and amount locked that is returned.
     * It is recorded when an aggregate bonded transaction linked to the hash completes.
     */
    ReceiptType[ReceiptType["LockHash_Completed"] = 8776] = "LockHash_Completed";
    /**
     * The account receiving the locked mosaic, the mosaicId and the amount. It is recorded when a lock hash expires.
     */
    ReceiptType[ReceiptType["LockHash_Expired"] = 9032] = "LockHash_Expired";
    /**
     * The secretlock sender, mosaicId and amount locked. It is recorded when a valid SecretLockTransaction is announced.
     */
    ReceiptType[ReceiptType["LockSecret_Created"] = 12626] = "LockSecret_Created";
    /**
     * The secretlock sender, mosaicId and amount locked. It is recorded when a secretlock is proved.
     */
    ReceiptType[ReceiptType["LockSecret_Completed"] = 8786] = "LockSecret_Completed";
    /**
     * The account receiving the locked mosaic, the mosaicId and the amount. It is recorded when a secretlock expires
     */
    ReceiptType[ReceiptType["LockSecret_Expired"] = 9042] = "LockSecret_Expired";
    /**
     * The amount of native currency mosaics created. The receipt is recorded when the network has inflation configured,
     * and a new block triggers the creation of currency mosaics.
     */
    ReceiptType[ReceiptType["Inflation"] = 20803] = "Inflation";
})(ReceiptType = exports.ReceiptType || (exports.ReceiptType = {}));
//# sourceMappingURL=ReceiptType.js.map