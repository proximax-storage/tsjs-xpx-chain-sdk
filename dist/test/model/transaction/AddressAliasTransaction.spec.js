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
const chai_1 = require("chai");
const Address_1 = require("../../../src/model/account/Address");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const AliasActionType_1 = require("../../../src/model/namespace/AliasActionType");
const NamespaceId_1 = require("../../../src/model/namespace/NamespaceId");
const AddressAliasTransaction_1 = require("../../../src/model/transaction/AddressAliasTransaction");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
const FeeCalculationStrategy_1 = require("../../../src/model/transaction/FeeCalculationStrategy");
describe('AddressAliasTransaction', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should default maxFee field be set to calculated fee according to default fee calculation strategy', () => {
        const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction_1.AddressAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, address, NetworkType_1.NetworkType.MIJIN_TEST);
        const expectedMaxFee = addressAliasTransaction.size * FeeCalculationStrategy_1.DefaultFeeCalculationStrategy;
        chai_1.expect(addressAliasTransaction.maxFee.compact()).to.be.equal(expectedMaxFee);
    });
    it('should filled maxFee override transaction maxFee', () => {
        const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction_1.AddressAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, address, NetworkType_1.NetworkType.MIJIN_TEST, new UInt64_1.UInt64([1, 0]));
        chai_1.expect(addressAliasTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(addressAliasTransaction.maxFee.lower).to.be.equal(1);
    });
    it('should createComplete an AddressAliasTransaction object and sign it', () => {
        const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction_1.AddressAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, address, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(addressAliasTransaction.actionType).to.be.equal(AliasActionType_1.AliasActionType.Link);
        chai_1.expect(addressAliasTransaction.namespaceId.id.lower).to.be.equal(33347626);
        chai_1.expect(addressAliasTransaction.namespaceId.id.higher).to.be.equal(3779697293);
        chai_1.expect(addressAliasTransaction.address.plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const signedTransaction = addressAliasTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('002AD8FC018D9A49E19050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');
    });
    describe('size', () => {
        it('should return 156 for AggregateTransaction byte size with TransferTransaction with 1 mosaic and message NEM', () => {
            const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
            const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
            const addressAliasTransaction = AddressAliasTransaction_1.AddressAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, address, NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(addressAliasTransaction.size).to.be.equal(156);
        });
    });
});
//# sourceMappingURL=AddressAliasTransaction.spec.js.map