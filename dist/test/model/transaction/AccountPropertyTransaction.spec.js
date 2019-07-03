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
const PropertyModificationType_1 = require("../../../src/model/account/PropertyModificationType");
const PropertyType_1 = require("../../../src/model/account/PropertyType");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const MosaicId_1 = require("../../../src/model/mosaic/MosaicId");
const AccountPropertyModification_1 = require("../../../src/model/transaction/AccountPropertyModification");
const AccountPropertyTransaction_1 = require("../../../src/model/transaction/AccountPropertyTransaction");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const TransactionType_1 = require("../../../src/model/transaction/TransactionType");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
describe('AccountPropertyTransaction', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should create address property filter', () => {
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountPropertyModification_1.AccountPropertyModification.createForAddress(PropertyModificationType_1.PropertyModificationType.Add, address);
        chai_1.expect(addressPropertyFilter.modificationType).to.be.equal(PropertyModificationType_1.PropertyModificationType.Add);
        chai_1.expect(addressPropertyFilter.value).to.be.equal(address.plain());
    });
    it('should create mosaic property filter', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicPropertyFilter = AccountPropertyModification_1.AccountPropertyModification.createForMosaic(PropertyModificationType_1.PropertyModificationType.Add, mosaicId);
        chai_1.expect(mosaicPropertyFilter.modificationType).to.be.equal(PropertyModificationType_1.PropertyModificationType.Add);
        chai_1.expect(mosaicPropertyFilter.value[0]).to.be.equal(mosaicId.id.lower);
        chai_1.expect(mosaicPropertyFilter.value[1]).to.be.equal(mosaicId.id.higher);
    });
    it('should create entity type property filter', () => {
        const entityType = TransactionType_1.TransactionType.ADDRESS_ALIAS;
        const entityTypePropertyFilter = AccountPropertyModification_1.AccountPropertyModification.createForEntityType(PropertyModificationType_1.PropertyModificationType.Add, entityType);
        chai_1.expect(entityTypePropertyFilter.modificationType).to.be.equal(PropertyModificationType_1.PropertyModificationType.Add);
        chai_1.expect(entityTypePropertyFilter.value).to.be.equal(entityType);
    });
    describe('size', () => {
        it('should return 148 for ModifyAccountPropertyAddressTransaction transaction byte size with 1 modification', () => {
            const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
            const addressPropertyFilter = AccountPropertyModification_1.AccountPropertyModification.createForAddress(PropertyModificationType_1.PropertyModificationType.Add, address);
            const addressPropertyTransaction = AccountPropertyTransaction_1.AccountPropertyTransaction.createAddressPropertyModificationTransaction(Deadline_1.Deadline.create(), PropertyType_1.PropertyType.AllowAddress, [addressPropertyFilter], NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(addressPropertyTransaction.size).to.be.equal(148);
        });
        it('should return 131 for ModifyAccountPropertyMosaicTransaction transaction byte size with 1 modification', () => {
            const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
            const mosaicPropertyFilter = AccountPropertyModification_1.AccountPropertyModification.createForMosaic(PropertyModificationType_1.PropertyModificationType.Add, mosaicId);
            const mosaicPropertyTransaction = AccountPropertyTransaction_1.AccountPropertyTransaction.createMosaicPropertyModificationTransaction(Deadline_1.Deadline.create(), PropertyType_1.PropertyType.AllowMosaic, [mosaicPropertyFilter], NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(mosaicPropertyTransaction.size).to.be.equal(131);
        });
        it('should return 125 for ModifyAccountPropertyEntityTypeTransaction transaction byte size with 1 modification', () => {
            const entityType = TransactionType_1.TransactionType.ADDRESS_ALIAS;
            const entityTypePropertyFilter = AccountPropertyModification_1.AccountPropertyModification.createForEntityType(PropertyModificationType_1.PropertyModificationType.Add, entityType);
            const entityTypePropertyTransaction = AccountPropertyTransaction_1.AccountPropertyTransaction.createEntityTypePropertyModificationTransaction(Deadline_1.Deadline.create(), PropertyType_1.PropertyType.AllowTransaction, [entityTypePropertyFilter], NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(entityTypePropertyTransaction.size).to.be.equal(125);
        });
    });
    it('should default maxFee field be set to 0', () => {
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountPropertyModification_1.AccountPropertyModification.createForAddress(PropertyModificationType_1.PropertyModificationType.Add, address);
        const addressPropertyTransaction = AccountPropertyTransaction_1.AccountPropertyTransaction.createAddressPropertyModificationTransaction(Deadline_1.Deadline.create(), PropertyType_1.PropertyType.AllowAddress, [addressPropertyFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(addressPropertyTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(addressPropertyTransaction.maxFee.lower).to.be.equal(0);
    });
    it('should filled maxFee override transaction maxFee', () => {
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountPropertyModification_1.AccountPropertyModification.createForAddress(PropertyModificationType_1.PropertyModificationType.Add, address);
        const addressPropertyTransaction = AccountPropertyTransaction_1.AccountPropertyTransaction.createAddressPropertyModificationTransaction(Deadline_1.Deadline.create(), PropertyType_1.PropertyType.AllowAddress, [addressPropertyFilter], NetworkType_1.NetworkType.MIJIN_TEST, new UInt64_1.UInt64([1, 0]));
        chai_1.expect(addressPropertyTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(addressPropertyTransaction.maxFee.lower).to.be.equal(1);
    });
    it('should create address property transaction', () => {
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountPropertyModification_1.AccountPropertyModification.createForAddress(PropertyModificationType_1.PropertyModificationType.Add, address);
        const addressPropertyTransaction = AccountPropertyTransaction_1.AccountPropertyTransaction.createAddressPropertyModificationTransaction(Deadline_1.Deadline.create(), PropertyType_1.PropertyType.AllowAddress, [addressPropertyFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = addressPropertyTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(240, signedTransaction.payload.length)).to.be.equal('0101009050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');
    });
    it('should throw exception when create address property transaction with wrong type', () => {
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountPropertyModification_1.AccountPropertyModification.createForAddress(PropertyModificationType_1.PropertyModificationType.Add, address);
        chai_1.expect(() => {
            AccountPropertyTransaction_1.AccountPropertyTransaction.createAddressPropertyModificationTransaction(Deadline_1.Deadline.create(), PropertyType_1.PropertyType.Sentinel, [addressPropertyFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        }).to.throw(Error, 'Property type is not allowed.');
    });
    it('should create mosaic property transaction', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicPropertyFilter = AccountPropertyModification_1.AccountPropertyModification.createForMosaic(PropertyModificationType_1.PropertyModificationType.Add, mosaicId);
        const mosaicPropertyTransaction = AccountPropertyTransaction_1.AccountPropertyTransaction.createMosaicPropertyModificationTransaction(Deadline_1.Deadline.create(), PropertyType_1.PropertyType.AllowMosaic, [mosaicPropertyFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = mosaicPropertyTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(240, signedTransaction.payload.length)).to.be.equal('0201004CCCD78612DDF5CA');
    });
    it('should throw exception when create mosaic property transaction with wrong type', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicPropertyFilter = AccountPropertyModification_1.AccountPropertyModification.createForMosaic(PropertyModificationType_1.PropertyModificationType.Add, mosaicId);
        chai_1.expect(() => {
            AccountPropertyTransaction_1.AccountPropertyTransaction.createMosaicPropertyModificationTransaction(Deadline_1.Deadline.create(), PropertyType_1.PropertyType.Sentinel, [mosaicPropertyFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        }).to.throw(Error, 'Property type is not allowed.');
    });
    it('should create entity type property transaction', () => {
        const entityType = TransactionType_1.TransactionType.ADDRESS_ALIAS;
        const entityTypePropertyFilter = AccountPropertyModification_1.AccountPropertyModification.createForEntityType(PropertyModificationType_1.PropertyModificationType.Add, entityType);
        const entityTypePropertyTransaction = AccountPropertyTransaction_1.AccountPropertyTransaction.createEntityTypePropertyModificationTransaction(Deadline_1.Deadline.create(), PropertyType_1.PropertyType.AllowTransaction, [entityTypePropertyFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = entityTypePropertyTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(240, signedTransaction.payload.length)).to.be.equal('0401004E42');
    });
});
//# sourceMappingURL=AccountPropertyTransaction.spec.js.map