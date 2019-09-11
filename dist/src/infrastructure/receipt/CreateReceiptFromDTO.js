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
const Address_1 = require("../../model/account/Address");
const PublicAccount_1 = require("../../model/account/PublicAccount");
const MosaicId_1 = require("../../model/mosaic/MosaicId");
const AddressAlias_1 = require("../../model/namespace/AddressAlias");
const AliasType_1 = require("../../model/namespace/AliasType");
const MosaicAlias_1 = require("../../model/namespace/MosaicAlias");
const NamespaceId_1 = require("../../model/namespace/NamespaceId");
const ArtifactExpiryReceipt_1 = require("../../model/receipt/ArtifactExpiryReceipt");
const BalanceChangeReceipt_1 = require("../../model/receipt/BalanceChangeReceipt");
const BalanceTransferReceipt_1 = require("../../model/receipt/BalanceTransferReceipt");
const InflationReceipt_1 = require("../../model/receipt/InflationReceipt");
const ReceiptSource_1 = require("../../model/receipt/ReceiptSource");
const ReceiptType_1 = require("../../model/receipt/ReceiptType");
const ResolutionEntry_1 = require("../../model/receipt/ResolutionEntry");
const ResolutionStatement_1 = require("../../model/receipt/ResolutionStatement");
const ResolutionType_1 = require("../../model/receipt/ResolutionType");
const Statement_1 = require("../../model/receipt/Statement");
const TransactionStatement_1 = require("../../model/receipt/TransactionStatement");
const UInt64_1 = require("../../model/UInt64");
/**
 * @param receiptDTO
 * @param networkType
 * @returns {Statement}
 * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/ReceiptType.h
 * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/ReceiptType.cpp
 * @constructor
 */
exports.CreateStatementFromDTO = (receiptDTO, networkType) => {
    return new Statement_1.Statement(receiptDTO.transactionStatements.map((statement) => createTransactionStatement(statement, networkType)), receiptDTO.addressResolutionStatements.map((statement) => createResolutionStatement(statement, ResolutionType_1.ResolutionType.Address)), receiptDTO.mosaicResolutionStatements.map((statement) => createResolutionStatement(statement, ResolutionType_1.ResolutionType.Mosaic)));
};
/**
 * @param receiptDTO
 * @param networkType
 * @returns {Receipt}
 * @constructor
 */
exports.CreateReceiptFromDTO = (receiptDTO, networkType) => {
    switch (receiptDTO.type) {
        case ReceiptType_1.ReceiptType.Harvest_Fee:
        case ReceiptType_1.ReceiptType.LockHash_Created:
        case ReceiptType_1.ReceiptType.LockHash_Completed:
        case ReceiptType_1.ReceiptType.LockHash_Expired:
        case ReceiptType_1.ReceiptType.LockSecret_Created:
        case ReceiptType_1.ReceiptType.LockSecret_Completed:
        case ReceiptType_1.ReceiptType.LockSecret_Expired:
            return createBalanceChangeReceipt(receiptDTO, networkType);
        case ReceiptType_1.ReceiptType.Mosaic_Levy:
        case ReceiptType_1.ReceiptType.Mosaic_Rental_Fee:
        case ReceiptType_1.ReceiptType.Namespace_Rental_Fee:
            return createBalanceTransferReceipt(receiptDTO, networkType);
        case ReceiptType_1.ReceiptType.Mosaic_Expired:
        case ReceiptType_1.ReceiptType.Namespace_Expired:
            return createArtifactExpiryReceipt(receiptDTO);
        case ReceiptType_1.ReceiptType.Inflation:
            return createInflationReceipt(receiptDTO);
        default:
            throw new Error(`Receipt type: ${receiptDTO.type} not recognized.`);
    }
};
/**
 * @internal
 * @param statementDTO
 * @param resolutionType
 * @returns {ResolutionStatement}
 * @constructor
 */
const createResolutionStatement = (statementDTO, resolutionType) => {
    switch (resolutionType) {
        case ResolutionType_1.ResolutionType.Address:
            return new ResolutionStatement_1.ResolutionStatement(statementDTO.height, Address_1.Address.createFromEncoded(statementDTO.unresolved), statementDTO.resolutionEntries.map((entry) => {
                return new ResolutionEntry_1.ResolutionEntry(new AddressAlias_1.AddressAlias(AliasType_1.AliasType.Address, Address_1.Address.createFromEncoded(entry.resolved)), new ReceiptSource_1.ReceiptSource(entry.source.primaryId, entry.source.secondaryId));
            }));
        case ResolutionType_1.ResolutionType.Mosaic:
            return new ResolutionStatement_1.ResolutionStatement(statementDTO.height, new MosaicId_1.MosaicId(statementDTO.unresolved), statementDTO.resolutionEntries.map((entry) => {
                return new ResolutionEntry_1.ResolutionEntry(new MosaicAlias_1.MosaicAlias(AliasType_1.AliasType.Mosaic, new MosaicId_1.MosaicId(entry.resolved)), new ReceiptSource_1.ReceiptSource(entry.source.primaryId, entry.source.secondaryId));
            }));
        default:
            throw new Error('Resolution type invalid');
    }
};
/**
 * @internal
 * @param statementDTO
 * @param networkType
 * @returns {TransactionStatement}
 * @constructor
 */
const createTransactionStatement = (statementDTO, networkType) => {
    return new TransactionStatement_1.TransactionStatement(statementDTO.height, new ReceiptSource_1.ReceiptSource(statementDTO.source.primaryId, statementDTO.source.secondaryId), statementDTO.receipts.map((receipt) => {
        return exports.CreateReceiptFromDTO(receipt, networkType);
    }));
};
/**
 * @internal
 * @param receiptDTO
 * @param networkType
 * @returns {BalanceChangeReceipt}
 * @constructor
 */
const createBalanceChangeReceipt = (receiptDTO, networkType) => {
    return new BalanceChangeReceipt_1.BalanceChangeReceipt(PublicAccount_1.PublicAccount.createFromPublicKey(receiptDTO.account, networkType), new MosaicId_1.MosaicId(receiptDTO.mosaicId), new UInt64_1.UInt64(receiptDTO.amount), receiptDTO.version, receiptDTO.type);
};
/**
 * @internal
 * @param receiptDTO
 * @param networkType
 * @returns {BalanceTransferReceipt}
 * @constructor
 */
const createBalanceTransferReceipt = (receiptDTO, networkType) => {
    return new BalanceTransferReceipt_1.BalanceTransferReceipt(PublicAccount_1.PublicAccount.createFromPublicKey(receiptDTO.sender, networkType), Address_1.Address.createFromEncoded(receiptDTO.recipient), new MosaicId_1.MosaicId(receiptDTO.mosaicId), new UInt64_1.UInt64(receiptDTO.amount), receiptDTO.version, receiptDTO.type);
};
/**
 * @internal
 * @param receiptDTO
 * @returns {ArtifactExpiryReceipt}
 * @constructor
 */
const createArtifactExpiryReceipt = (receiptDTO) => {
    return new ArtifactExpiryReceipt_1.ArtifactExpiryReceipt(extractArtifactId(receiptDTO.type, receiptDTO.artifactId), receiptDTO.version, receiptDTO.type);
};
/**
 * @internal
 * @param receiptDTO
 * @returns {InflationReceipt}
 * @constructor
 */
const createInflationReceipt = (receiptDTO) => {
    return new InflationReceipt_1.InflationReceipt(new MosaicId_1.MosaicId(receiptDTO.mosaicId), new UInt64_1.UInt64(receiptDTO.amount), receiptDTO.version, receiptDTO.type);
};
const extractArtifactId = (receiptType, id) => {
    switch (receiptType) {
        case ReceiptType_1.ReceiptType.Mosaic_Expired:
            return new MosaicId_1.MosaicId(id);
        case ReceiptType_1.ReceiptType.Namespace_Expired:
            return new NamespaceId_1.NamespaceId(id);
        default:
            throw new Error('Receipt type is not supported.');
    }
};
//# sourceMappingURL=CreateReceiptFromDTO.js.map