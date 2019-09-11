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
const assert_1 = require("assert");
const chai_1 = require("chai");
const CreateReceiptFromDTO_1 = require("../../../src/infrastructure/receipt/CreateReceiptFromDTO");
const Account_1 = require("../../../src/model/account/Account");
const Address_1 = require("../../../src/model/account/Address");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const ReceiptType_1 = require("../../../src/model/receipt/ReceiptType");
describe('Receipt - CreateStatementFromDTO', () => {
    let account;
    let account2;
    let statementDto;
    const netWorkType = NetworkType_1.NetworkType.MIJIN_TEST;
    before(() => {
        account = Account_1.Account.createFromPrivateKey('D242FB34C2C4DD36E995B9C865F93940065E326661BA5A4A247331D211FE3A3D', NetworkType_1.NetworkType.MIJIN_TEST);
        account2 = Account_1.Account.createFromPrivateKey('E5DCCEBDB01A8B03A7DB7BA5888E2E33FD4617B5F6FED48C4C09C0780F422713', NetworkType_1.NetworkType.MIJIN_TEST);
        statementDto = { transactionStatements: [
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
            ],
            addressResolutionStatements: [
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
            ],
            mosaicResolutionStatements: [
                {
                    height: [
                        1506,
                        0,
                    ],
                    unresolved: [4014740460, 2448037180],
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
            ] };
    });
    it('should create Statement', () => {
        const statement = CreateReceiptFromDTO_1.CreateStatementFromDTO(statementDto, netWorkType);
        const unresolvedAddress = statement.addressResolutionStatements[0].unresolved;
        const unresolvedMosaicId = statement.mosaicResolutionStatements[0].unresolved;
        chai_1.expect(statement.transactionStatements.length).to.be.equal(1);
        chai_1.expect(statement.addressResolutionStatements.length).to.be.equal(2);
        chai_1.expect(statement.mosaicResolutionStatements.length).to.be.equal(2);
        chai_1.expect(statement.transactionStatements[0].receipts.length).to.be.equal(1);
        assert_1.deepEqual(statement.transactionStatements[0].height, [52, 0]);
        chai_1.expect(statement.transactionStatements[0].source.primaryId).to.be.equal(0);
        chai_1.expect(statement.transactionStatements[0].source.secondaryId).to.be.equal(0);
        chai_1.expect(statement.transactionStatements[0].receipts[0].type).to.be.equal(ReceiptType_1.ReceiptType.Harvest_Fee);
        assert_1.deepEqual(statement.addressResolutionStatements[0].height, [1488, 0]);
        assert_1.deepEqual(unresolvedAddress.plain(), Address_1.Address.createFromEncoded('9103B60AAF2762688300000000000000000000000000000000').plain());
        chai_1.expect(statement.addressResolutionStatements[0].resolutionEntries.length).to.be.equal(1);
        chai_1.expect(statement.addressResolutionStatements[0].resolutionEntries[0].resolved
            .address.plain()).to.be.equal(Address_1.Address.createFromEncoded('917E7E29A01014C2F300000000000000000000000000000000').plain());
        assert_1.deepEqual(statement.mosaicResolutionStatements[0].height, [1506, 0]);
        assert_1.deepEqual(unresolvedMosaicId.toDTO().id, [4014740460, 2448037180]);
        chai_1.expect(statement.mosaicResolutionStatements[0].resolutionEntries.length).to.be.equal(1);
        assert_1.deepEqual(statement.mosaicResolutionStatements[0].resolutionEntries[0].resolved
            .mosaicId.id.toDTO(), [2553890912, 2234768168]);
    });
});
//# sourceMappingURL=CreateReceiptFromDTO.spec.js.map