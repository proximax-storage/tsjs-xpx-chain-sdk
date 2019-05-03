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
const TransactionType_1 = require("../../model/transaction/TransactionType");
/**
 * @internal
 * @param transaction - The transaction class object
 * @returns JSON object
 * @constructor
 */
exports.SerializeTransactionToJSON = (transaction) => {
    switch (transaction.type) {
        case TransactionType_1.TransactionType.LINK_ACCOUNT:
            return {
                remoteAccountKey: transaction.remoteAccountKey,
                linkAction: transaction.linkAction,
            };
        case TransactionType_1.TransactionType.ADDRESS_ALIAS:
            return {
                aliasAction: transaction.actionType,
                namespaceId: transaction.namespaceId.toDTO(),
                address: transaction.address.toDTO(),
            };
        case TransactionType_1.TransactionType.AGGREGATE_BONDED:
        case TransactionType_1.TransactionType.AGGREGATE_COMPLETE:
            return {
                transactions: transaction.innerTransactions.map((innerTransaction) => {
                    return innerTransaction.toJSON();
                }),
                cosignatures: transaction.cosignatures.map((cosignature) => {
                    return cosignature.toDTO();
                }),
            };
        case TransactionType_1.TransactionType.LOCK:
            return {
                mosaicId: transaction.mosaic.id.id,
                amount: transaction.mosaic.amount.toDTO(),
                duration: transaction.duration.toDTO(),
                hash: transaction.hash,
            };
        case TransactionType_1.TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS:
            return {
                propertyType: transaction.propertyType,
                modifications: transaction.
                    modifications.map((modification) => {
                    return modification.toDTO();
                }),
            };
        case TransactionType_1.TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE:
            return {
                propertyType: transaction.propertyType,
                modifications: transaction.
                    modifications.map((modification) => {
                    return modification.toDTO();
                }),
            };
        case TransactionType_1.TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC:
            return {
                propertyType: transaction.propertyType,
                modifications: transaction.modifications.map((modification) => {
                    return modification.toDTO();
                }),
            };
        case TransactionType_1.TransactionType.MODIFY_MULTISIG_ACCOUNT:
            return {
                minApprovalDelta: transaction.minApprovalDelta,
                minRemovalDelta: transaction.minRemovalDelta,
                modifications: transaction.modifications.map((modification) => {
                    return modification.toDTO();
                }),
            };
        case TransactionType_1.TransactionType.MOSAIC_ALIAS:
            return {
                aliasAction: transaction.actionType,
                namespaceId: transaction.namespaceId.toDTO(),
                mosaicId: transaction.mosaicId.toDTO(),
            };
        case TransactionType_1.TransactionType.MOSAIC_DEFINITION:
            return {
                nonce: transaction.nonce,
                mosaicId: transaction.mosaicId.toDTO(),
                properties: transaction.mosaicProperties.toDTO(),
            };
        case TransactionType_1.TransactionType.MOSAIC_SUPPLY_CHANGE:
            return {
                mosaicId: transaction.mosaicId.toDTO(),
                direction: transaction.direction,
                delta: transaction.delta.toDTO(),
            };
        case TransactionType_1.TransactionType.REGISTER_NAMESPACE:
            const registerNamespaceDuration = transaction.duration;
            const registerNamespaceParentId = transaction.parentId;
            const jsonObject = {
                namespaceType: transaction.namespaceType,
                namespaceName: transaction.namespaceName,
                namespaceId: transaction.namespaceId.toDTO(),
            };
            if (registerNamespaceDuration) {
                Object.assign(jsonObject, { duration: registerNamespaceDuration.toDTO() });
            }
            if (registerNamespaceParentId) {
                Object.assign(jsonObject, { parentId: registerNamespaceParentId.toDTO() });
            }
            return jsonObject;
        case TransactionType_1.TransactionType.SECRET_LOCK:
            return {
                mosaicId: transaction.mosaic.id.id,
                amount: transaction.mosaic.amount.toDTO(),
                duration: transaction.duration.toDTO(),
                hashAlgorithm: transaction.hashType,
                secret: transaction.secret,
                recipient: transaction.recipient.toDTO(),
            };
        case TransactionType_1.TransactionType.SECRET_PROOF:
            return {
                hashAlgorithm: transaction.hashType,
                secret: transaction.secret,
                proof: transaction.proof,
            };
        case TransactionType_1.TransactionType.TRANSFER:
            return {
                recipient: transaction.recipient.toDTO(),
                mosaics: transaction.mosaics.map((mosaic) => {
                    return mosaic.toDTO();
                }),
                message: transaction.message.toDTO(),
            };
        default:
            throw new Error('Transaction type not implemented yet.');
    }
};
//# sourceMappingURL=SerializeTransactionToJSON.js.map