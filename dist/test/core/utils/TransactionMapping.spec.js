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
const js_sha3_1 = require("js-sha3");
const format_1 = require("../../../src/core/format");
const TransactionMapping_1 = require("../../../src/core/utils/TransactionMapping");
const Address_1 = require("../../../src/model/account/Address");
const PublicAccount_1 = require("../../../src/model/account/PublicAccount");
const RestrictionModificationType_1 = require("../../../src/model/account/RestrictionModificationType");
const RestrictionType_1 = require("../../../src/model/account/RestrictionType");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const model_1 = require("../../../src/model/model");
const MosaicId_1 = require("../../../src/model/mosaic/MosaicId");
const MosaicNonce_1 = require("../../../src/model/mosaic/MosaicNonce");
const MosaicProperties_1 = require("../../../src/model/mosaic/MosaicProperties");
const MosaicSupplyType_1 = require("../../../src/model/mosaic/MosaicSupplyType");
const NetworkCurrencyMosaic_1 = require("../../../src/model/mosaic/NetworkCurrencyMosaic");
const AliasActionType_1 = require("../../../src/model/namespace/AliasActionType");
const NamespaceId_1 = require("../../../src/model/namespace/NamespaceId");
const NamespaceType_1 = require("../../../src/model/namespace/NamespaceType");
const AccountLinkTransaction_1 = require("../../../src/model/transaction/AccountLinkTransaction");
const AccountRestrictionModification_1 = require("../../../src/model/transaction/AccountRestrictionModification");
const AccountRestrictionTransaction_1 = require("../../../src/model/transaction/AccountRestrictionTransaction");
const AddressAliasTransaction_1 = require("../../../src/model/transaction/AddressAliasTransaction");
const AggregateTransaction_1 = require("../../../src/model/transaction/AggregateTransaction");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const HashType_1 = require("../../../src/model/transaction/HashType");
const LinkAction_1 = require("../../../src/model/transaction/LinkAction");
const LockFundsTransaction_1 = require("../../../src/model/transaction/LockFundsTransaction");
const MessageType_1 = require("../../../src/model/transaction/MessageType");
const ModifyMultisigAccountTransaction_1 = require("../../../src/model/transaction/ModifyMultisigAccountTransaction");
const MosaicAliasTransaction_1 = require("../../../src/model/transaction/MosaicAliasTransaction");
const MosaicDefinitionTransaction_1 = require("../../../src/model/transaction/MosaicDefinitionTransaction");
const MosaicSupplyChangeTransaction_1 = require("../../../src/model/transaction/MosaicSupplyChangeTransaction");
const MultisigCosignatoryModification_1 = require("../../../src/model/transaction/MultisigCosignatoryModification");
const MultisigCosignatoryModificationType_1 = require("../../../src/model/transaction/MultisigCosignatoryModificationType");
const PlainMessage_1 = require("../../../src/model/transaction/PlainMessage");
const RegisterNamespaceTransaction_1 = require("../../../src/model/transaction/RegisterNamespaceTransaction");
const SecretLockTransaction_1 = require("../../../src/model/transaction/SecretLockTransaction");
const SecretProofTransaction_1 = require("../../../src/model/transaction/SecretProofTransaction");
const TransactionType_1 = require("../../../src/model/transaction/TransactionType");
const TransferTransaction_1 = require("../../../src/model/transaction/TransferTransaction");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
describe('TransactionMapping - createFromPayload', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should create AccountRestrictionAddressTransaction', () => {
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForAddress(RestrictionModificationType_1.RestrictionModificationType.Add, address);
        const addressRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowAddress, [addressRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = addressRestrictionTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.restrictionType).to.be.equal(RestrictionType_1.RestrictionType.AllowAddress);
        chai_1.expect(transaction.modifications[0].modificationType).to.be.equal(RestrictionModificationType_1.RestrictionModificationType.Add);
        chai_1.expect(transaction.modifications[0].value).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
    });
    it('should create AccountRestrictionMosaicTransaction', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForMosaic(RestrictionModificationType_1.RestrictionModificationType.Add, mosaicId);
        const mosaicRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowMosaic, [mosaicRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = mosaicRestrictionTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.restrictionType).to.be.equal(RestrictionType_1.RestrictionType.AllowMosaic);
        chai_1.expect(transaction.modifications[0].value[0]).to.be.equal(2262289484);
        chai_1.expect(transaction.modifications[0].value[1]).to.be.equal(3405110546);
        chai_1.expect(transaction.modifications[0].modificationType).to.be.equal(RestrictionModificationType_1.RestrictionModificationType.Add);
    });
    it('should create AccountRestrictionOperationTransaction', () => {
        const operation = TransactionType_1.TransactionType.ADDRESS_ALIAS;
        const operationRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForOperation(RestrictionModificationType_1.RestrictionModificationType.Add, operation);
        const operationRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowTransaction, [operationRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = operationRestrictionTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.restrictionType).to.be.equal(RestrictionType_1.RestrictionType.AllowTransaction);
        chai_1.expect(transaction.modifications[0].value).to.be.equal(operation);
        chai_1.expect(transaction.modifications[0].modificationType).to.be.equal(RestrictionModificationType_1.RestrictionModificationType.Add);
    });
    it('should create AddressAliasTransaction', () => {
        const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction_1.AddressAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, address, NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = addressAliasTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.actionType).to.be.equal(AliasActionType_1.AliasActionType.Link);
        chai_1.expect(transaction.namespaceId.id.lower).to.be.equal(33347626);
        chai_1.expect(transaction.namespaceId.id.higher).to.be.equal(3779697293);
        chai_1.expect(transaction.address.plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
    });
    it('should create MosaicAliasTransaction', () => {
        const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction_1.MosaicAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, mosaicId, NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(mosaicAliasTransaction.actionType).to.be.equal(AliasActionType_1.AliasActionType.Link);
        chai_1.expect(mosaicAliasTransaction.namespaceId.id.lower).to.be.equal(33347626);
        chai_1.expect(mosaicAliasTransaction.namespaceId.id.higher).to.be.equal(3779697293);
        chai_1.expect(mosaicAliasTransaction.mosaicId.id.lower).to.be.equal(2262289484);
        chai_1.expect(mosaicAliasTransaction.mosaicId.id.higher).to.be.equal(3405110546);
    });
    it('should create MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            divisibility: 3,
            duration: UInt64_1.UInt64.fromUint(1000),
        }), NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.mosaicProperties.duration.lower).to.be.equal(1000);
        chai_1.expect(transaction.mosaicProperties.duration.higher).to.be.equal(0);
        chai_1.expect(transaction.mosaicProperties.divisibility).to.be.equal(3);
        chai_1.expect(transaction.mosaicProperties.supplyMutable).to.be.equal(false);
        chai_1.expect(transaction.mosaicProperties.transferable).to.be.equal(false);
    });
    it('should create MosaicDefinitionTransaction - without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            divisibility: 3,
        }), NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.mosaicProperties.divisibility).to.be.equal(3);
        chai_1.expect(transaction.mosaicProperties.supplyMutable).to.be.equal(false);
        chai_1.expect(transaction.mosaicProperties.transferable).to.be.equal(false);
    });
    it('should create MosaicDefinitionTransaction - without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            divisibility: 3,
        }), NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.mosaicProperties.divisibility).to.be.equal(3);
        chai_1.expect(transaction.mosaicProperties.supplyMutable).to.be.equal(false);
        chai_1.expect(transaction.mosaicProperties.transferable).to.be.equal(false);
    });
    it('should create MosaicDefinitionTransaction - without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            divisibility: 3,
        }), NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.mosaicProperties.divisibility).to.be.equal(3);
        chai_1.expect(transaction.mosaicProperties.supplyMutable).to.be.equal(false);
        chai_1.expect(transaction.mosaicProperties.transferable).to.be.equal(false);
    });
    it('should create MosaicDefinitionTransaction - without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            divisibility: 3,
        }), NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.mosaicProperties.divisibility).to.be.equal(3);
        chai_1.expect(transaction.mosaicProperties.supplyMutable).to.be.equal(false);
        chai_1.expect(transaction.mosaicProperties.transferable).to.be.equal(false);
    });
    it('should create MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction_1.MosaicSupplyChangeTransaction.create(Deadline_1.Deadline.create(), mosaicId, MosaicSupplyType_1.MosaicSupplyType.Increase, UInt64_1.UInt64.fromUint(10), NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = mosaicSupplyChangeTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.direction).to.be.equal(MosaicSupplyType_1.MosaicSupplyType.Increase);
        chai_1.expect(transaction.delta.lower).to.be.equal(10);
        chai_1.expect(transaction.delta.higher).to.be.equal(0);
        chai_1.expect(transaction.mosaicId.id.lower).to.be.equal(2262289484);
        chai_1.expect(transaction.mosaicId.id.higher).to.be.equal(3405110546);
    });
    it('should create TransferTransaction', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [
            NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(100),
        ], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = transferTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.message.payload).to.be.equal('test-message');
        chai_1.expect(transaction.mosaics.length).to.be.equal(1);
        chai_1.expect(transaction.recipientToString()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
    });
    it('should create SecretLockTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipient = Address_1.Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Sha3_256, js_sha3_1.sha3_256.create().update(format_1.Convert.hexToUint8(proof)).hex(), recipient, NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = secretLockTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.mosaic.amount.equals(UInt64_1.UInt64.fromUint(10))).to.be.equal(true);
        chai_1.expect(transaction.duration.equals(UInt64_1.UInt64.fromUint(100))).to.be.equal(true);
        chai_1.expect(transaction.hashType).to.be.equal(0);
        chai_1.expect(transaction.secret).to.be.equal('9B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E');
        chai_1.expect(transaction.recipient.plain()).to.be.equal(recipient.plain());
    });
    it('should create SecretProofTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Sha3_256, js_sha3_1.sha3_256.create().update(format_1.Convert.hexToUint8(proof)).hex(), account.address, proof, NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = secretProofTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(secretProofTransaction.hashType).to.be.equal(0);
        chai_1.expect(secretProofTransaction.secret).to.be.equal('9b3155b37159da50aa52d5967c509b410f5a36a3b1e31ecb5ac76675d79b4a5e');
        chai_1.expect(secretProofTransaction.proof).to.be.equal(proof);
        chai_1.expect(secretProofTransaction.recipient.plain()).to.be.equal(account.address.plain());
    });
    it('should create ModifyMultiSigTransaction', () => {
        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction_1.ModifyMultisigAccountTransaction.create(Deadline_1.Deadline.create(), 2, 1, [new MultisigCosignatoryModification_1.MultisigCosignatoryModification(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Add, PublicAccount_1.PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24', NetworkType_1.NetworkType.MIJIN_TEST))], NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = modifyMultisigAccountTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.minApprovalDelta)
            .to.be.equal(2);
        chai_1.expect(transaction.minRemovalDelta)
            .to.be.equal(1);
        chai_1.expect(transaction.modifications[0].type)
            .to.be.equal(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Add);
        chai_1.expect(transaction.modifications[0].cosignatoryPublicAccount.publicKey)
            .to.be.equal('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24');
    });
    it('should create AggregatedTransaction - Complete', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [transferTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const signedTransaction = aggregateTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.innerTransactions[0].type).to.be.equal(TransactionType_1.TransactionType.TRANSFER);
    });
    it('should create AggregatedTransaction - Bonded', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(), [transferTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const signedTransaction = aggregateTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.innerTransactions[0].type).to.be.equal(TransactionType_1.TransactionType.TRANSFER);
    });
    it('should create LockFundTransaction', () => {
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(), [], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockTransaction = LockFundsTransaction_1.LockFundsTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10), UInt64_1.UInt64.fromUint(10), signedTransaction, NetworkType_1.NetworkType.MIJIN_TEST);
        const signedLockFundTransaction = lockTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedLockFundTransaction.payload);
        assert_1.deepEqual(transaction.mosaic.id.id, NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.NAMESPACE_ID.id);
        chai_1.expect(transaction.mosaic.amount.compact()).to.be.equal(10000000);
        chai_1.expect(transaction.hash).to.be.equal(signedTransaction.hash);
    });
    it('should create an AccountLinkTransaction object with link action', () => {
        const accountLinkTransaction = AccountLinkTransaction_1.AccountLinkTransaction.create(Deadline_1.Deadline.create(), account.publicKey, LinkAction_1.LinkAction.Link, NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = accountLinkTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.linkAction).to.be.equal(0);
        chai_1.expect(transaction.remoteAccountKey).to.be.equal(account.publicKey);
    });
    it('should create RegisterNamespaceTransaction - Root', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createRootNamespace(Deadline_1.Deadline.create(), 'root-test-namespace', UInt64_1.UInt64.fromUint(1000), NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.namespaceType).to.be.equal(NamespaceType_1.NamespaceType.RootNamespace);
        chai_1.expect(transaction.namespaceName).to.be.equal('root-test-namespace');
    });
    it('should create RegisterNamespaceTransaction - Sub', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createSubNamespace(Deadline_1.Deadline.create(), 'root-test-namespace', 'parent-test-namespace', NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        chai_1.expect(transaction.namespaceType).to.be.equal(NamespaceType_1.NamespaceType.SubNamespace);
        chai_1.expect(transaction.namespaceName).to.be.equal('root-test-namespace');
    });
});
describe('TransactionMapping - createFromDTO (Transaction.toJSON() feed)', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should create TransferTransaction - Address', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [
            NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(100),
        ], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(transferTransaction.toJSON());
        chai_1.expect(transaction.recipient.plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        chai_1.expect(transaction.message.payload).to.be.equal('test-message');
    });
    it('should create TransferTransaction - NamespaceId', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), new NamespaceId_1.NamespaceId([33347626, 3779697293]), [
            NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(100),
        ], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(transferTransaction.toJSON());
        chai_1.expect(transaction.recipient.id.toHex().toUpperCase()).to.be.equal(new UInt64_1.UInt64([33347626, 3779697293]).toHex());
        chai_1.expect(transaction.message.payload).to.be.equal('test-message');
    });
    it('should create TransferTransaction - Encrypted Message', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [
            NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(100),
        ], new model_1.EncryptedMessage('12324556'), NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(transferTransaction.toJSON());
        chai_1.expect(transaction.recipient.plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        chai_1.expect(transaction.message.type).to.be.equal(MessageType_1.MessageType.EncryptedMessage);
    });
    it('should create AccountLinkTransaction', () => {
        const accountLinkTransaction = AccountLinkTransaction_1.AccountLinkTransaction.create(Deadline_1.Deadline.create(), account.publicKey, LinkAction_1.LinkAction.Link, NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(accountLinkTransaction.toJSON());
        chai_1.expect(transaction.remoteAccountKey).to.be.equal(account.publicKey);
        chai_1.expect(transaction.linkAction).to.be.equal(LinkAction_1.LinkAction.Link);
    });
    it('should create AccountRestrictionAddressTransaction', () => {
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForAddress(RestrictionModificationType_1.RestrictionModificationType.Add, address);
        const addressRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowAddress, [addressRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(addressRestrictionTransaction.toJSON());
        chai_1.expect(transaction.modifications[0].value).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        chai_1.expect(transaction.restrictionType).to.be.equal(RestrictionType_1.RestrictionType.AllowAddress);
        chai_1.expect(transaction.modifications[0].modificationType).to.be.equal(RestrictionModificationType_1.RestrictionModificationType.Add);
    });
    it('should create AccountRestrictionMosaicTransaction', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForMosaic(RestrictionModificationType_1.RestrictionModificationType.Add, mosaicId);
        const mosaicRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowMosaic, [mosaicRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(mosaicRestrictionTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC);
        chai_1.expect(transaction.restrictionType).to.be.equal(RestrictionType_1.RestrictionType.AllowMosaic);
        chai_1.expect(transaction.modifications.length).to.be.equal(1);
    });
    it('should create AccountRestrictionMosaicTransaction', () => {
        const operation = TransactionType_1.TransactionType.ADDRESS_ALIAS;
        const operationRestrictionFilter = AccountRestrictionModification_1.AccountRestrictionModification.createForOperation(RestrictionModificationType_1.RestrictionModificationType.Add, operation);
        const operationRestrictionTransaction = AccountRestrictionTransaction_1.AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(Deadline_1.Deadline.create(), RestrictionType_1.RestrictionType.AllowTransaction, [operationRestrictionFilter], NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(operationRestrictionTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION);
        chai_1.expect(transaction.restrictionType).to.be.equal(RestrictionType_1.RestrictionType.AllowTransaction);
        chai_1.expect(transaction.modifications.length).to.be.equal(1);
    });
    it('should create AddressAliasTransaction', () => {
        const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
        const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction_1.AddressAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, address, NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(addressAliasTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.ADDRESS_ALIAS);
        chai_1.expect(transaction.actionType).to.be.equal(AliasActionType_1.AliasActionType.Link);
    });
    it('should create MosaicAliasTransaction', () => {
        const namespaceId = new NamespaceId_1.NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction_1.MosaicAliasTransaction.create(Deadline_1.Deadline.create(), AliasActionType_1.AliasActionType.Link, namespaceId, mosaicId, NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(mosaicAliasTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.MOSAIC_ALIAS);
        chai_1.expect(transaction.actionType).to.be.equal(AliasActionType_1.AliasActionType.Link);
    });
    it('should create MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
        new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
        MosaicProperties_1.MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            divisibility: 3,
            duration: UInt64_1.UInt64.fromUint(1000),
        }), NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(mosaicDefinitionTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.MOSAIC_DEFINITION);
        chai_1.expect(transaction.mosaicProperties.supplyMutable).to.be.equal(false);
        chai_1.expect(transaction.mosaicProperties.transferable).to.be.equal(false);
        chai_1.expect(transaction.mosaicProperties.divisibility).to.be.equal(3);
    });
    it('should create MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction_1.MosaicSupplyChangeTransaction.create(Deadline_1.Deadline.create(), mosaicId, MosaicSupplyType_1.MosaicSupplyType.Increase, UInt64_1.UInt64.fromUint(10), NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(mosaicSupplyChangeTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.MOSAIC_SUPPLY_CHANGE);
        chai_1.expect(transaction.direction).to.be.equal(MosaicSupplyType_1.MosaicSupplyType.Increase);
    });
    it('should create SecretLockTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipient = Address_1.Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Sha3_256, js_sha3_1.sha3_256.create().update(format_1.Convert.hexToUint8(proof)).hex(), recipient, NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(secretLockTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.SECRET_LOCK);
        chai_1.expect(transaction.hashType).to.be.equal(HashType_1.HashType.Op_Sha3_256);
    });
    it('should create SecretProofTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Sha3_256, js_sha3_1.sha3_256.create().update(format_1.Convert.hexToUint8(proof)).hex(), account.address, proof, NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(secretProofTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.SECRET_PROOF);
        chai_1.expect(transaction.hashType).to.be.equal(HashType_1.HashType.Op_Sha3_256);
        chai_1.expect(transaction.secret).to.be.equal(js_sha3_1.sha3_256.create().update(format_1.Convert.hexToUint8(proof)).hex());
        assert_1.deepEqual(transaction.recipient, account.address);
        chai_1.expect(transaction.proof).to.be.equal(proof);
    });
    it('should create ModifyMultiSigTransaction', () => {
        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction_1.ModifyMultisigAccountTransaction.create(Deadline_1.Deadline.create(), 2, 1, [new MultisigCosignatoryModification_1.MultisigCosignatoryModification(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Add, PublicAccount_1.PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24', NetworkType_1.NetworkType.MIJIN_TEST))], NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(modifyMultisigAccountTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.MODIFY_MULTISIG_ACCOUNT);
        chai_1.expect(transaction.minApprovalDelta).to.be.equal(2);
        chai_1.expect(transaction.minRemovalDelta).to.be.equal(1);
    });
    it('should create AggregatedTransaction - Complete', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [transferTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(aggregateTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.AGGREGATE_COMPLETE);
        chai_1.expect(transaction.innerTransactions.length).to.be.equal(1);
    });
    it('should create AggregatedTransaction - Bonded', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(), [transferTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(aggregateTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.AGGREGATE_BONDED);
        chai_1.expect(transaction.innerTransactions.length).to.be.equal(1);
    });
    it('should create LockFundTransaction', () => {
        const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(), [], NetworkType_1.NetworkType.MIJIN_TEST, []);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockTransaction = LockFundsTransaction_1.LockFundsTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10), UInt64_1.UInt64.fromUint(10), signedTransaction, NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(lockTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.LOCK);
        chai_1.expect(transaction.hash).to.be.equal(signedTransaction.hash);
    });
    it('should create RegisterNamespaceTransaction - Root', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createRootNamespace(Deadline_1.Deadline.create(), 'root-test-namespace', UInt64_1.UInt64.fromUint(1000), NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(registerNamespaceTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.REGISTER_NAMESPACE);
    });
    it('should create RegisterNamespaceTransaction - Sub', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createSubNamespace(Deadline_1.Deadline.create(), 'root-test-namespace', 'parent-test-namespace', NetworkType_1.NetworkType.MIJIN_TEST);
        const transaction = TransactionMapping_1.TransactionMapping.createFromDTO(registerNamespaceTransaction.toJSON());
        chai_1.expect(transaction.type).to.be.equal(TransactionType_1.TransactionType.REGISTER_NAMESPACE);
    });
});
//# sourceMappingURL=TransactionMapping.spec.js.map