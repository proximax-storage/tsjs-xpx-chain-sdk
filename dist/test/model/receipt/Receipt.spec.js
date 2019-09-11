"use strict";
/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const CreateReceiptFromDTO_1 = require("../../../src/infrastructure/receipt/CreateReceiptFromDTO");
const Account_1 = require("../../../src/model/account/Account");
const Address_1 = require("../../../src/model/account/Address");
const PublicAccount_1 = require("../../../src/model/account/PublicAccount");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const MosaicId_1 = require("../../../src/model/mosaic/MosaicId");
const AddressAlias_1 = require("../../../src/model/namespace/AddressAlias");
const AliasType_1 = require("../../../src/model/namespace/AliasType");
const MosaicAlias_1 = require("../../../src/model/namespace/MosaicAlias");
const NamespaceId_1 = require("../../../src/model/namespace/NamespaceId");
const ArtifactExpiryReceipt_1 = require("../../../src/model/receipt/ArtifactExpiryReceipt");
const BalanceChangeReceipt_1 = require("../../../src/model/receipt/BalanceChangeReceipt");
const BalanceTransferReceipt_1 = require("../../../src/model/receipt/BalanceTransferReceipt");
const InflationReceipt_1 = require("../../../src/model/receipt/InflationReceipt");
const ReceiptSource_1 = require("../../../src/model/receipt/ReceiptSource");
const ReceiptType_1 = require("../../../src/model/receipt/ReceiptType");
const ReceiptVersion_1 = require("../../../src/model/receipt/ReceiptVersion");
const ResolutionEntry_1 = require("../../../src/model/receipt/ResolutionEntry");
const ResolutionStatement_1 = require("../../../src/model/receipt/ResolutionStatement");
const TransactionStatement_1 = require("../../../src/model/receipt/TransactionStatement");
const UInt64_1 = require("../../../src/model/UInt64");
describe('Receipt', () => {
    let account;
    let account2;
    let transactionStatementsDTO;
    let addressResolutionStatementsDTO;
    let mosaicResolutionStatementsDTO;
    const netWorkType = NetworkType_1.NetworkType.MIJIN_TEST;
    before(() => {
        account = Account_1.Account.createFromPrivateKey('D242FB34C2C4DD36E995B9C865F93940065E326661BA5A4A247331D211FE3A3D', NetworkType_1.NetworkType.MIJIN_TEST);
        account2 = Account_1.Account.createFromPrivateKey('E5DCCEBDB01A8B03A7DB7BA5888E2E33FD4617B5F6FED48C4C09C0780F422713', NetworkType_1.NetworkType.MIJIN_TEST);
        transactionStatementsDTO = [
            {
                height: [52, 0],
                source: {
                    primaryId: 0,
                    secondaryId: 0,
                },
                receipts: [
                    {
                        version: 1,
                        type: 8515,
                        account: account.publicKey,
                        mosaicId: [3646934825, 3576016193],
                        amount: [1000, 0],
                    },
                ],
            },
        ];
        addressResolutionStatementsDTO = [
            {
                height: [1488, 0],
                unresolved: '9103B60AAF2762688300000000000000000000000000000000',
                resolutionEntries: [
                    {
                        source: {
                            primaryId: 4,
                            secondaryId: 0,
                        },
                        resolved: '917E7E29A01014C2F300000000000000000000000000000000',
                    },
                ],
            },
            {
                height: [1488, 0],
                unresolved: '917E7E29A01014C2F300000000000000000000000000000000',
                resolutionEntries: [
                    {
                        source: {
                            primaryId: 2,
                            secondaryId: 0,
                        },
                        resolved: '9103B60AAF2762688300000000000000000000000000000000',
                    },
                ],
            },
        ];
        mosaicResolutionStatementsDTO = [
            {
                height: [
                    1506,
                    0,
                ],
                unresolved: [
                    4014740460,
                    2448037180,
                ],
                resolutionEntries: [
                    {
                        source: {
                            primaryId: 1,
                            secondaryId: 0,
                        },
                        resolved: [2553890912, 2234768168],
                    },
                ],
            },
            {
                height: [
                    1506,
                    0,
                ],
                unresolved: [
                    2234768168,
                    2553890912,
                ],
                resolutionEntries: [
                    {
                        source: {
                            primaryId: 5,
                            secondaryId: 0,
                        },
                        resolved: [2553890912, 2234768168],
                    },
                ],
            },
        ];
    });
    it('should createComplete a balance transfer receipt', () => {
        const receiptDTO = {
            version: 1,
            type: 4685,
            sender: account.publicKey,
            recipient: '9103B60AAF2762688300000000000000000000000000000000',
            mosaicId: [481110499, 231112638],
            amount: [1000, 0],
        };
        const receipt = new BalanceTransferReceipt_1.BalanceTransferReceipt(PublicAccount_1.PublicAccount.createFromPublicKey(receiptDTO.sender, netWorkType), Address_1.Address.createFromEncoded(receiptDTO.recipient), new MosaicId_1.MosaicId(receiptDTO.mosaicId), new UInt64_1.UInt64(receiptDTO.amount), receiptDTO.version, receiptDTO.type);
        assert_1.deepEqual(receipt.amount.toDTO(), receiptDTO.amount);
        assert_1.deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        assert_1.deepEqual(receipt.type, ReceiptType_1.ReceiptType.Mosaic_Levy);
        assert_1.deepEqual(receipt.version, ReceiptVersion_1.ReceiptVersion.BALANCE_TRANSFER);
        assert_1.deepEqual(receipt.recipient, Address_1.Address.createFromEncoded('9103B60AAF2762688300000000000000000000000000000000'));
    });
    it('should createComplete a balance transfer receipt - Mosaic Rental Fee', () => {
        const receiptDTO = {
            version: 1,
            type: 4941,
            sender: account.publicKey,
            recipient: '9103B60AAF2762688300000000000000000000000000000000',
            mosaicId: [3646934825, 3576016193],
            amount: [1000, 0],
        };
        const receipt = new BalanceTransferReceipt_1.BalanceTransferReceipt(PublicAccount_1.PublicAccount.createFromPublicKey(receiptDTO.sender, netWorkType), Address_1.Address.createFromEncoded(receiptDTO.recipient), new MosaicId_1.MosaicId(receiptDTO.mosaicId), new UInt64_1.UInt64(receiptDTO.amount), receiptDTO.version, receiptDTO.type);
        assert_1.deepEqual(receipt.amount.toDTO(), receiptDTO.amount);
        assert_1.deepEqual(receipt.recipient, Address_1.Address.createFromEncoded('9103B60AAF2762688300000000000000000000000000000000'));
        assert_1.deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        assert_1.deepEqual(receipt.type, ReceiptType_1.ReceiptType.Mosaic_Rental_Fee);
        assert_1.deepEqual(receipt.version, ReceiptVersion_1.ReceiptVersion.BALANCE_TRANSFER);
    });
    it('should createComplete a balance change receipt - Harvest Fee', () => {
        const receiptDTO = {
            version: 1,
            type: 8515,
            account: account.publicKey,
            mosaicId: [3646934825, 3576016193],
            amount: [1000, 0],
        };
        const receipt = new BalanceChangeReceipt_1.BalanceChangeReceipt(PublicAccount_1.PublicAccount.createFromPublicKey(receiptDTO.account, netWorkType), new MosaicId_1.MosaicId(receiptDTO.mosaicId), new UInt64_1.UInt64(receiptDTO.amount), receiptDTO.version, receiptDTO.type);
        assert_1.deepEqual(receipt.account.publicKey, receiptDTO.account);
        assert_1.deepEqual(receipt.amount.toDTO(), receiptDTO.amount);
        assert_1.deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        assert_1.deepEqual(receipt.type, ReceiptType_1.ReceiptType.Harvest_Fee);
        assert_1.deepEqual(receipt.version, ReceiptVersion_1.ReceiptVersion.BALANCE_CHANGE);
    });
    it('should createComplete a balance change receipt - LockHash', () => {
        const receiptDTO = {
            version: 1,
            type: 12616,
            account: account.publicKey,
            mosaicId: [3646934825, 3576016193],
            amount: [1000, 0],
        };
        const receipt = new BalanceChangeReceipt_1.BalanceChangeReceipt(PublicAccount_1.PublicAccount.createFromPublicKey(receiptDTO.account, netWorkType), new MosaicId_1.MosaicId(receiptDTO.mosaicId), new UInt64_1.UInt64(receiptDTO.amount), receiptDTO.version, receiptDTO.type);
        assert_1.deepEqual(receipt.account.publicKey, receiptDTO.account);
        assert_1.deepEqual(receipt.amount.toDTO(), receiptDTO.amount);
        assert_1.deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        assert_1.deepEqual(receipt.type, ReceiptType_1.ReceiptType.LockHash_Created);
        assert_1.deepEqual(receipt.version, ReceiptVersion_1.ReceiptVersion.BALANCE_CHANGE);
    });
    it('should createComplete an artifact expiry receipt - address', () => {
        const receiptDTO = {
            version: 1,
            type: 16718,
            artifactId: [3646934825, 3576016193],
        };
        const receipt = new ArtifactExpiryReceipt_1.ArtifactExpiryReceipt(new NamespaceId_1.NamespaceId([3646934825, 3576016193]), receiptDTO.version, receiptDTO.type);
        assert_1.deepEqual(receipt.artifactId.toDTO().id, receiptDTO.artifactId);
        assert_1.deepEqual(receipt.type, ReceiptType_1.ReceiptType.Namespace_Expired);
        assert_1.deepEqual(receipt.version, ReceiptVersion_1.ReceiptVersion.ARTIFACT_EXPIRY);
    });
    it('should createComplete an artifact expiry receipt - mosaic', () => {
        const receiptDTO = {
            version: 1,
            type: 16717,
            artifactId: [3646934825, 3576016193],
        };
        const receipt = new ArtifactExpiryReceipt_1.ArtifactExpiryReceipt(new MosaicId_1.MosaicId(receiptDTO.artifactId), receiptDTO.version, receiptDTO.type);
        assert_1.deepEqual(receipt.artifactId.toDTO().id, receiptDTO.artifactId);
        assert_1.deepEqual(receipt.type, ReceiptType_1.ReceiptType.Mosaic_Expired);
        assert_1.deepEqual(receipt.version, ReceiptVersion_1.ReceiptVersion.ARTIFACT_EXPIRY);
    });
    it('should createComplete a transaction statement', () => {
        const statementDto = transactionStatementsDTO[0];
        const statement = new TransactionStatement_1.TransactionStatement(statementDto.height, new ReceiptSource_1.ReceiptSource(statementDto.source.primaryId, statementDto.source.secondaryId), statementDto.receipts.map((receipt) => CreateReceiptFromDTO_1.CreateReceiptFromDTO(receipt, netWorkType)));
        assert_1.deepEqual(statement.source.primaryId, statementDto.source.primaryId);
        assert_1.deepEqual(statement.source.secondaryId, statementDto.source.secondaryId);
        assert_1.deepEqual(statement.receipts[0].account.publicKey, account.publicKey);
    });
    it('should createComplete resolution statement - mosaic', () => {
        const statementDto = mosaicResolutionStatementsDTO[0];
        const statement = new ResolutionStatement_1.ResolutionStatement(statementDto.height, new MosaicId_1.MosaicId(statementDto.unresolved), statementDto.resolutionEntries.map((resolved) => {
            return new ResolutionEntry_1.ResolutionEntry(new MosaicAlias_1.MosaicAlias(AliasType_1.AliasType.Mosaic, new MosaicId_1.MosaicId(resolved.resolved)), new ReceiptSource_1.ReceiptSource(resolved.source.primaryId, resolved.source.secondaryId));
        }));
        assert_1.deepEqual(statement.unresolved.toDTO().id, statementDto.unresolved);
        assert_1.deepEqual(statement.resolutionEntries[0].resolved.mosaicId.id.toDTO(), [2553890912, 2234768168]);
    });
    it('should createComplete resolution statement - address', () => {
        const statementDto = addressResolutionStatementsDTO[0];
        const statement = new ResolutionStatement_1.ResolutionStatement(statementDto.height, Address_1.Address.createFromEncoded(statementDto.unresolved), statementDto.resolutionEntries.map((resolved) => {
            return new ResolutionEntry_1.ResolutionEntry(new AddressAlias_1.AddressAlias(AliasType_1.AliasType.Address, Address_1.Address.createFromEncoded(resolved.resolved)), new ReceiptSource_1.ReceiptSource(resolved.source.primaryId, resolved.source.secondaryId));
        }));
        assert_1.deepEqual(statement.unresolved.plain(), Address_1.Address.createFromEncoded('9103B60AAF2762688300000000000000000000000000000000').plain());
        assert_1.deepEqual(statement.resolutionEntries[0].resolved.address.plain(), Address_1.Address.createFromEncoded('917E7E29A01014C2F300000000000000000000000000000000').plain());
    });
    it('should createComplete a inflation receipt', () => {
        const receiptDTO = {
            version: 1,
            type: 20803,
            mosaicId: [3646934825, 3576016193],
            amount: 1000,
        };
        const receipt = new InflationReceipt_1.InflationReceipt(new MosaicId_1.MosaicId(receiptDTO.mosaicId), UInt64_1.UInt64.fromUint(receiptDTO.amount), receiptDTO.version, receiptDTO.type);
        assert_1.deepEqual(receipt.amount.compact(), receiptDTO.amount);
        assert_1.deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        assert_1.deepEqual(receipt.type, ReceiptType_1.ReceiptType.Inflation);
        assert_1.deepEqual(receipt.version, ReceiptVersion_1.ReceiptVersion.INFLATION_RECEIPT);
    });
});
//# sourceMappingURL=Receipt.spec.js.map