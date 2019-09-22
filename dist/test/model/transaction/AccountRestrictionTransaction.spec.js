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
const RestrictionModificationType_1 = require("../../../src/model/account/RestrictionModificationType");
const RestrictionType_1 = require("../../../src/model/account/RestrictionType");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const MosaicId_1 = require("../../../src/model/mosaic/MosaicId");
const AccountRestrictionModification_1 = require("../../../src/model/transaction/AccountRestrictionModification");
const AccountRestrictionTransaction_1 = require("../../../src/model/transaction/AccountRestrictionTransaction");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const TransactionType_1 = require("../../../src/model/transaction/TransactionType");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
const FeeCalculationStrategy_1 = require("../../../src/model/transaction/FeeCalculationStrategy");
describe('AccountRestrictionTransaction', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should create address restriction filter', () => {
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForAddress(RestrictionModificationType_1.RestrictionModificationType.Add, address);
        chai_1.expect(addressRestrictionFilter.modificationType).to.be.equal(RestrictionModificationType_1.RestrictionModificationType.Add);
        chai_1.expect(addressRestrictionFilter.value).to.be.equal(address.plain());
    });
    it('should create mosaic restriction filter', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForMosaic(RestrictionModificationType_1.RestrictionModificationType.Add, mosaicId);
        chai_1.expect(mosaicRestrictionFilter.modificationType).to.be.equal(RestrictionModificationType_1.RestrictionModificationType.Add);
        chai_1.expect(mosaicRestrictionFilter.value[0]).to.be.equal(mosaicId.id.lower);
        chai_1.expect(mosaicRestrictionFilter.value[1]).to.be.equal(mosaicId.id.higher);
    });
    it('should create operation restriction filter', () => {
        const operation = TransactionType_1.TransactionType.ADDRESS_ALIAS;
        const operationRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForOperation(RestrictionModificationType_1.RestrictionModificationType.Add, operation);
        chai_1.expect(operationRestrictionFilter.modificationType).to.be.equal(RestrictionModificationType_1.RestrictionModificationType.Add);
        chai_1.expect(operationRestrictionFilter.value).to.be.equal(operation);
    });
    describe('size', () => {
        it('should return 150 for AccountAddressRestrictionModificationTransaction transaction byte size with 1 modification', () => {
            const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
            const addressRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForAddress(RestrictionModificationType_1.RestrictionModificationType.Add, address);
            const addressRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowAddress, [addressRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(addressRestrictionTransaction.size).to.be.equal(150);
        });
        it('should return 133 for AccountMosaicRestrictionModificationTransaction transaction byte size with 1 modification', () => {
            const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
            const mosaicRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForMosaic(RestrictionModificationType_1.RestrictionModificationType.Add, mosaicId);
            const mosaicRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowMosaic, [mosaicRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(mosaicRestrictionTransaction.size).to.be.equal(133);
        });
        it('should return 127 for AccountOperationRestrictionModificationTransaction transaction byte size with 1 modification', () => {
            const operation = TransactionType_1.TransactionType.ADDRESS_ALIAS;
            const operationRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForOperation(RestrictionModificationType_1.RestrictionModificationType.Add, operation);
            const operationRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowTransaction, [operationRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(operationRestrictionTransaction.size).to.be.equal(127);
        });
    });
    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForAddress(RestrictionModificationType_1.RestrictionModificationType.Add, address);
        const addressRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowAddress, [addressRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(addressRestrictionTransaction.maxFee.compact()).to.be.equal(addressRestrictionTransaction.size * FeeCalculationStrategy_1.DefaultFeeCalculationStrategy);
    });
    it('should filled maxFee override transaction maxFee', () => {
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForAddress(RestrictionModificationType_1.RestrictionModificationType.Add, address);
        const addressRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowAddress, [addressRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST, new UInt64_1.UInt64([1, 0]));
        chai_1.expect(addressRestrictionTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(addressRestrictionTransaction.maxFee.lower).to.be.equal(1);
    });
    it('should create address restriction transaction', () => {
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForAddress(RestrictionModificationType_1.RestrictionModificationType.Add, address);
        const addressRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowAddress, [addressRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = addressRestrictionTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('0101009050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');
    });
    it('should throw exception when create address restriction transaction with wrong type', () => {
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForAddress(RestrictionModificationType_1.RestrictionModificationType.Add, address);
        chai_1.expect(() => {
            AccountRestrictionTransaction_1.AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.Sentinel, [addressRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        }).to.throw(Error, 'Restriction type is not allowed.');
    });
    it('should create mosaic restriction transaction', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForMosaic(RestrictionModificationType_1.RestrictionModificationType.Add, mosaicId);
        const mosaicRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowMosaic, [mosaicRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = mosaicRestrictionTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('0201004CCCD78612DDF5CA');
    });
    it('should throw exception when create mosaic restriction transaction with wrong type', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForMosaic(RestrictionModificationType_1.RestrictionModificationType.Add, mosaicId);
        chai_1.expect(() => {
            AccountRestrictionTransaction_1.AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.Sentinel, [mosaicRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        }).to.throw(Error, 'Restriction type is not allowed.');
    });
    it('should create operation restriction transaction', () => {
        const operation = TransactionType_1.TransactionType.ADDRESS_ALIAS;
        const operationRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForOperation(RestrictionModificationType_1.RestrictionModificationType.Add, operation);
        const operationRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowTransaction, [operationRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = operationRestrictionTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('0401004E42');
    });
});
//# sourceMappingURL=AccountRestrictionTransaction.spec.js.map