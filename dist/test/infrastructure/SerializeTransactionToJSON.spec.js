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
const js_sha3_1 = require("js-sha3");
const js_xpx_catapult_library_1 = require("js-xpx-catapult-library");
const Address_1 = require("../../src/model/account/Address");
const PropertyModificationType_1 = require("../../src/model/account/PropertyModificationType");
const PropertyType_1 = require("../../src/model/account/PropertyType");
const PublicAccount_1 = require("../../src/model/account/PublicAccount");
const NetworkType_1 = require("../../src/model/blockchain/NetworkType");
const MosaicId_1 = require("../../src/model/mosaic/MosaicId");
const MosaicNonce_1 = require("../../src/model/mosaic/MosaicNonce");
const MosaicProperties_1 = require("../../src/model/mosaic/MosaicProperties");
const MosaicSupplyType_1 = require("../../src/model/mosaic/MosaicSupplyType");
const NetworkCurrencyMosaic_1 = require("../../src/model/mosaic/NetworkCurrencyMosaic");
const AliasActionType_1 = require("../../src/model/namespace/AliasActionType");
const NamespaceId_1 = require("../../src/model/namespace/NamespaceId");
const AccountLinkTransaction_1 = require("../../src/model/transaction/AccountLinkTransaction");
const AccountPropertyTransaction_1 = require("../../src/model/transaction/AccountPropertyTransaction");
const AddressAliasTransaction_1 = require("../../src/model/transaction/AddressAliasTransaction");
const AggregateTransaction_1 = require("../../src/model/transaction/AggregateTransaction");
const Deadline_1 = require("../../src/model/transaction/Deadline");
const HashType_1 = require("../../src/model/transaction/HashType");
const LinkAction_1 = require("../../src/model/transaction/LinkAction");
const LockFundsTransaction_1 = require("../../src/model/transaction/LockFundsTransaction");
const ModifyMultisigAccountTransaction_1 = require("../../src/model/transaction/ModifyMultisigAccountTransaction");
const MosaicAliasTransaction_1 = require("../../src/model/transaction/MosaicAliasTransaction");
const MosaicDefinitionTransaction_1 = require("../../src/model/transaction/MosaicDefinitionTransaction");
const MosaicSupplyChangeTransaction_1 = require("../../src/model/transaction/MosaicSupplyChangeTransaction");
const MultisigCosignatoryModification_1 = require("../../src/model/transaction/MultisigCosignatoryModification");
const MultisigCosignatoryModificationType_1 = require("../../src/model/transaction/MultisigCosignatoryModificationType");
const PlainMessage_1 = require("../../src/model/transaction/PlainMessage");
const RegisterNamespaceTransaction_1 = require("../../src/model/transaction/RegisterNamespaceTransaction");
const SecretLockTransaction_1 = require("../../src/model/transaction/SecretLockTransaction");
const SecretProofTransaction_1 = require("../../src/model/transaction/SecretProofTransaction");
const TransactionType_1 = require("../../src/model/transaction/TransactionType");
const TransferTransaction_1 = require("../../src/model/transaction/TransferTransaction");
const UInt64_1 = require("../../src/model/UInt64");
const conf_spec_1 = require("../conf/conf.spec");
describe('SerializeTransactionToJSON', () => {
    let account;
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should create AccountLinkTransaction', () => {
        const accountLinkTransaction = AccountLinkTransaction_1.AccountLinkTransaction.create(Deadline_1.Deadline.create(), account.publicKey, LinkAction_1.LinkAction.Link, NetworkType_1.NetworkType.MIJIN_TEST);
        const json = accountLinkTransaction.toJSON();
        chai_1.expect(json.transaction.remoteAccountKey).to.be.equal(account.publicKey);
        chai_1.expect(json.transaction.linkAction).to.be.equal(LinkAction_1.LinkAction.Link);
    });
    it('should create AccountPropertyAddressTransaction', () => {
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountPropertyTransaction_1.AccountPropertyTransaction.createAddressFilter(PropertyModificationType_1.PropertyModificationType.Add, address);
        const addressPropertyTransaction = AccountPropertyTransaction_1.AccountPropertyTransaction.createAddressPropertyModificationTransaction(Deadline_1.Deadline.create(), PropertyType_1.PropertyType.AllowAddress, [addressPropertyFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const json = addressPropertyTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS);
        chai_1.expect(json.transaction.propertyType).to.be.equal(PropertyType_1.PropertyType.AllowAddress);
        chai_1.expect(json.transaction.modifications.length).to.be.equal(1);
    });
    it('should create AccountPropertyMosaicTransaction', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicPropertyFilter = AccountPropertyTransaction_1.AccountPropertyTransaction.createMosaicFilter(PropertyModificationType_1.PropertyModificationType.Add, mosaicId);
        const mosaicPropertyTransaction = AccountPropertyTransaction_1.AccountPropertyTransaction.createMosaicPropertyModificationTransaction(Deadline_1.Deadline.create(), PropertyType_1.PropertyType.AllowMosaic, [mosaicPropertyFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const json = mosaicPropertyTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC);
        chai_1.expect(json.transaction.propertyType).to.be.equal(PropertyType_1.PropertyType.AllowMosaic);
        chai_1.expect(json.transaction.modifications.length).to.be.equal(1);
    });
    it('should create AccountPropertyMosaicTransaction', () => {
        const entityType = TransactionType_1.TransactionType.ADDRESS_ALIAS;
        const entityTypePropertyFilter = AccountPropertyTransaction_1.AccountPropertyTransaction.createEntityTypeFilter(PropertyModificationType_1.PropertyModificationType.Add, entityType);
        const entityTypePropertyTransaction = AccountPropertyTransaction_1.AccountPropertyTransaction.createEntityTypePropertyModificationTransaction(Deadline_1.Deadline.create(), PropertyType_1.PropertyType.AllowTransaction, [entityTypePropertyFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const json = entityTypePropertyTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE);
        chai_1.expect(json.transaction.propertyType).to.be.equal(PropertyType_1.PropertyType.AllowTransaction);
        chai_1.expect(json.transaction.modifications.length).to.be.equal(1);
    });
    it('should create AddressAliasTransaction', () => {
        const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction_1.AddressAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, address, NetworkType_1.NetworkType.MIJIN_TEST);
        const json = addressAliasTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.ADDRESS_ALIAS);
        chai_1.expect(json.transaction.aliasAction).to.be.equal(AliasActionType_1.AliasActionType.Link);
    });
    it('should create MosaicAliasTransaction', () => {
        const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction_1.MosaicAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, mosaicId, NetworkType_1.NetworkType.MIJIN_TEST);
        const json = mosaicAliasTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.MOSAIC_ALIAS);
        chai_1.expect(json.transaction.aliasAction).to.be.equal(AliasActionType_1.AliasActionType.Link);
    });
    it('should create MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            levyMutable: false,
            divisibility: 3,
            duration: UInt64_1.UInt64.fromUint(1000),
        }), NetworkType_1.NetworkType.MIJIN_TEST);
        const json = mosaicDefinitionTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.MOSAIC_DEFINITION);
        chai_1.expect(json.transaction.properties.length).to.be.equal(3);
        chai_1.expect(new UInt64_1.UInt64(json.transaction.properties[1].value).compact()).to.be.equal(UInt64_1.UInt64.fromUint(3).compact());
        chai_1.expect(new UInt64_1.UInt64(json.transaction.properties[2].value).compact()).to.be.equal(UInt64_1.UInt64.fromUint(1000).compact());
        chai_1.expect(new UInt64_1.UInt64(json.transaction.properties[2].value).lower).to.be.equal(UInt64_1.UInt64.fromUint(1000).lower);
    });
    it('should create MosaicDefinitionTransaction without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            levyMutable: false,
            divisibility: 3,
        }), NetworkType_1.NetworkType.MIJIN_TEST);
        const json = mosaicDefinitionTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.MOSAIC_DEFINITION);
        chai_1.expect(json.transaction.properties.length).to.be.equal(2);
    });
    it('should create MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction_1.MosaicSupplyChangeTransaction.create(Deadline_1.Deadline.create(), mosaicId, MosaicSupplyType_1.MosaicSupplyType.Increase, UInt64_1.UInt64.fromUint(10), NetworkType_1.NetworkType.MIJIN_TEST);
        const json = mosaicSupplyChangeTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.MOSAIC_SUPPLY_CHANGE);
        chai_1.expect(json.transaction.direction).to.be.equal(MosaicSupplyType_1.MosaicSupplyType.Increase);
    });
    it('should create TransferTransaction', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [
            NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(100),
        ], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        const json = transferTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.TRANSFER);
        chai_1.expect(json.transaction.message.payload).to.be.equal('test-message');
        chai_1.expect(json.transaction.message.type).to.be.equal(0);
    });
    it('should create SecretLockTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipient = Address_1.Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Sha3_256, js_sha3_1.sha3_256.create().update(js_xpx_catapult_library_1.convert.hexToUint8(proof)).hex(), recipient, NetworkType_1.NetworkType.MIJIN_TEST);
        const json = secretLockTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.SECRET_LOCK);
        chai_1.expect(json.transaction.hashAlgorithm).to.be.equal(HashType_1.HashType.Op_Sha3_256);
    });
    it('should create SecretProofTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Sha3_256, js_sha3_1.sha3_256.create().update(js_xpx_catapult_library_1.convert.hexToUint8(proof)).hex(), proof, NetworkType_1.NetworkType.MIJIN_TEST);
        const json = secretProofTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.SECRET_PROOF);
        chai_1.expect(json.transaction.hashAlgorithm).to.be.equal(HashType_1.HashType.Op_Sha3_256);
        chai_1.expect(json.transaction.secret).to.be.equal(js_sha3_1.sha3_256.create().update(js_xpx_catapult_library_1.convert.hexToUint8(proof)).hex());
        chai_1.expect(json.transaction.proof).to.be.equal(proof);
    });
    it('should create ModifyMultiSigTransaction', () => {
        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction_1.ModifyMultisigAccountTransaction.create(Deadline_1.Deadline.create(), 2, 1, [new MultisigCosignatoryModification_1.MultisigCosignatoryModification(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Add, PublicAccount_1.PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24', NetworkType_1.NetworkType.MIJIN_TEST))], NetworkType_1.NetworkType.MIJIN_TEST);
        const json = modifyMultisigAccountTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.MODIFY_MULTISIG_ACCOUNT);
        chai_1.expect(json.transaction.minApprovalDelta).to.be.equal(2);
        chai_1.expect(json.transaction.minRemovalDelta).to.be.equal(1);
    });
    it('should create AggregatedTransaction - Complete', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [transferTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const json = aggregateTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.AGGREGATE_COMPLETE);
        chai_1.expect(json.transaction.transactions.length).to.be.equal(1);
    });
    it('should create AggregatedTransaction - Bonded', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(), [transferTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const json = aggregateTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.AGGREGATE_BONDED);
        chai_1.expect(json.transaction.transactions.length).to.be.equal(1);
    });
    it('should create LockFundTransaction', () => {
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(), [], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const signedTransaction = account.sign(aggregateTransaction);
        const lockTransaction = LockFundsTransaction_1.LockFundsTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10), UInt64_1.UInt64.fromUint(10), signedTransaction, NetworkType_1.NetworkType.MIJIN_TEST);
        const json = lockTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.LOCK);
        chai_1.expect(json.transaction.hash).to.be.equal(signedTransaction.hash);
    });
    it('should create RegisterNamespaceTransaction - Root', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createRootNamespace(Deadline_1.Deadline.create(), 'root-test-namespace', UInt64_1.UInt64.fromUint(1000), NetworkType_1.NetworkType.MIJIN_TEST);
        const json = registerNamespaceTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.REGISTER_NAMESPACE);
    });
    it('should create RegisterNamespaceTransaction - Sub', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createSubNamespace(Deadline_1.Deadline.create(), 'root-test-namespace', 'parent-test-namespace', NetworkType_1.NetworkType.MIJIN_TEST);
        const json = registerNamespaceTransaction.toJSON();
        chai_1.expect(json.transaction.type).to.be.equal(TransactionType_1.TransactionType.REGISTER_NAMESPACE);
    });
});
//# sourceMappingURL=SerializeTransactionToJSON.spec.js.map