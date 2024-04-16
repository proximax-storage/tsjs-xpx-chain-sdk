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

import { expect } from 'chai';
import { sha3_256 } from 'js-sha3';
import {Convert as convert} from '../../src/core/format';
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import { RestrictionModificationType } from '../../src/model/account/RestrictionModificationType';
import { RestrictionType } from '../../src/model/account/RestrictionType';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { MosaicProperties } from '../../src/model/mosaic/MosaicProperties';
import { MosaicSupplyType } from '../../src/model/mosaic/MosaicSupplyType';
import { NetworkCurrencyMosaic } from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { AliasActionType } from '../../src/model/namespace/AliasActionType';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { AccountLinkTransaction } from '../../src/model/transaction/AccountLinkTransaction';
import { AccountRestrictionModification } from '../../src/model/transaction/AccountRestrictionModification';
import { AccountRestrictionTransaction } from '../../src/model/transaction/AccountRestrictionTransaction';
import { AddressAliasTransaction } from '../../src/model/transaction/AddressAliasTransaction';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { HashType } from '../../src/model/transaction/HashType';
import { LinkAction } from '../../src/model/transaction/LinkAction';
import { HashLockTransaction } from '../../src/model/transaction/HashLockTransaction';
import { ModifyMultisigAccountTransaction } from '../../src/model/transaction/ModifyMultisigAccountTransaction';
import { MosaicAliasTransaction } from '../../src/model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicSupplyChangeTransaction } from '../../src/model/transaction/MosaicSupplyChangeTransaction';
import { MultisigCosignatoryModification } from '../../src/model/transaction/MultisigCosignatoryModification';
import { MultisigCosignatoryModificationType } from '../../src/model/transaction/MultisigCosignatoryModificationType';
import { PlainMessage } from '../../src/model/transaction/PlainMessage';
import { RegisterNamespaceTransaction } from '../../src/model/transaction/RegisterNamespaceTransaction';
import { SecretLockTransaction } from '../../src/model/transaction/SecretLockTransaction';
import { SecretProofTransaction } from '../../src/model/transaction/SecretProofTransaction';
import { TransactionType } from '../../src/model/transaction/TransactionType' ;
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { TestingAccount } from '../conf/conf.spec';
import { deepStrictEqual } from 'assert';
import { KeyGenerator } from '../../src/core/format/KeyGenerator'
import { NamespaceType, MosaicMetadataTransaction, NamespaceMetadataTransaction, AccountMetadataTransaction, 
    ChainUpgradeTransaction, NetworkConfigTransaction, MosaicLevy, MosaicLevyType, MosaicModifyLevyTransaction } from '../../src/model/model';

describe('SerializeTransactionToJSON', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should create AccountLinkTransaction', () => {
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            account.publicKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
        );

        const json = accountLinkTransaction.toJSON();

        expect(json.transaction.remoteAccountKey).to.be.equal(account.publicKey);
        expect(json.transaction.action).to.be.equal(LinkAction.Link);
    });

    it('should create AccountRestrictionAddressTransaction', () => {
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
            RestrictionModificationType.Add,
            address,
        );
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            RestrictionType.AllowAddress,
            [addressRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        const json = addressRestrictionTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS);
        expect(json.transaction.propertyType).to.be.equal(RestrictionType.AllowAddress);
        expect(json.transaction.modifications.length).to.be.equal(1);
        expect(json.transaction.modifications[0].type).to.be.equal(RestrictionModificationType.Add);
        expect(json.transaction.modifications[0].value).to.be.equal(address.plain());
    });

    it('should create AccountRestrictionMosaicTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionFilter = AccountRestrictionModification.createForMosaic(
            RestrictionModificationType.Add,
            mosaicId,
        );
        const mosaicRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
            Deadline.create(),
            RestrictionType.AllowMosaic,
            [mosaicRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        const json = mosaicRestrictionTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC);
        expect(json.transaction.propertyType).to.be.equal(RestrictionType.AllowMosaic);
        expect(json.transaction.modifications.length).to.be.equal(1);
        expect(json.transaction.modifications[0].type).to.be.equal(RestrictionModificationType.Add);
        deepStrictEqual(json.transaction.modifications[0].value, mosaicId.id.toDTO());
    });

    it('should create AccountRestrictionOperationTransaction', () => {
        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
            RestrictionModificationType.Add,
            operation,
        );
        const operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(),
            RestrictionType.AllowTransaction,
            [operationRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        const json = operationRestrictionTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION);
        expect(json.transaction.propertyType).to.be.equal(RestrictionType.AllowTransaction);
        expect(json.transaction.modifications.length).to.be.equal(1);
        expect(json.transaction.modifications[0].type).to.be.equal(RestrictionModificationType.Add);
        expect(json.transaction.modifications[0].value).to.be.equal(operation);
    });

    it('should create AddressAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(),
            AliasActionType.Link,
            namespaceId,
            address,
            NetworkType.MIJIN_TEST,
        );

        const json = addressAliasTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.ADDRESS_ALIAS);
        expect(json.transaction.aliasAction).to.be.equal(AliasActionType.Link);
        deepStrictEqual(json.transaction.namespaceId.id, namespaceId.id.toDTO());
        expect(json.transaction.address.address).to.be.equal(address.plain());
    });

    it('should create MosaicAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            AliasActionType.Link,
            namespaceId,
            mosaicId,
            NetworkType.MIJIN_TEST,
        );
        const json = mosaicAliasTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MOSAIC_ALIAS);
        expect(json.transaction.aliasAction).to.be.equal(AliasActionType.Link);
        deepStrictEqual(json.transaction.namespaceId.id, namespaceId.id.toDTO());
        deepStrictEqual(json.transaction.mosaicId.id, mosaicId.id.toDTO());
    });

    it('should create MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                divisibility: 3,
                disableLocking: false,
                restrictable: false,
                supplyForceImmutable: false,
                duration: UInt64.fromUint(1000),
            }),
            NetworkType.MIJIN_TEST,
        );

        const json = mosaicDefinitionTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MOSAIC_DEFINITION);
        expect(json.transaction.properties.length).to.be.equal(3);
        deepStrictEqual(json.transaction.properties[0].value, UInt64.fromUint(0).toDTO());
        deepStrictEqual(json.transaction.properties[1].value, UInt64.fromUint(3).toDTO());
        deepStrictEqual(json.transaction.properties[2].value, UInt64.fromUint(1000).toDTO());

    });

    it('should create MosaicDefinitionTransaction without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                divisibility: 3,
                disableLocking: false,
                restrictable: false,
                supplyForceImmutable: false,
            }),
            NetworkType.MIJIN_TEST,
        );

        const json = mosaicDefinitionTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MOSAIC_DEFINITION);
        expect(json.transaction.properties.length).to.be.equal(2);

    });

    it('should create MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicId,
            MosaicSupplyType.Increase,
            UInt64.fromUint(10),
            NetworkType.MIJIN_TEST,
        );

        const json = mosaicSupplyChangeTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MOSAIC_SUPPLY_CHANGE);
        expect(json.transaction.direction).to.be.equal(MosaicSupplyType.Increase);
        deepStrictEqual(json.transaction.delta, UInt64.fromUint(10).toDTO());
    });

    it('should create MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicLevy = MosaicLevy.createWithAbsoluteFee(TestingAccount.address, mosaicId, 50);
        const mosaicModifyLevyTransaction = MosaicModifyLevyTransaction.create(
            Deadline.create(),
            mosaicId,
            mosaicLevy,
            NetworkType.MIJIN_TEST,
        );

        const json = mosaicModifyLevyTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MODIFY_MOSAIC_LEVY);
        expect(json.transaction.mosaicLevy.type).to.be.equal(MosaicLevyType.LevyAbsoluteFee);
        deepStrictEqual(json.transaction.mosaicLevy.mosaicId, mosaicId.toDTO());
        expect(json.transaction.mosaicLevy.recipient.address).to.be.equal(TestingAccount.address.toDTO().address);
        deepStrictEqual(json.transaction.mosaicLevy.fee, UInt64.fromUint(50).toDTO());
    });

    it('should create TransferTransaction with an address', () => {
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const mosaic = NetworkCurrencyMosaic.createRelative(100);
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            address,
            [
                mosaic,
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const json = transferTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.TRANSFER);
        expect((json.transaction.recipient as any).address).to.be.equal(address.plain());
        expect(json.transaction.message.payload).to.be.equal('746573742D6D657373616765');
        expect(json.transaction.message.type).to.be.equal(0);
        expect(json.transaction.mosaics.length).to.be.equal(1);
        deepStrictEqual(json.transaction.mosaics[0].id, mosaic.id.id.toDTO());
        deepStrictEqual(json.transaction.mosaics[0].amount, mosaic.amount.toDTO());
    });

    it('should create TransferTransaction with a namespace', () => {
        const namespaceId = new NamespaceId('some-namespace');
        const mosaic = NetworkCurrencyMosaic.createRelative(100);
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            namespaceId,
            [
                mosaic,
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const json = transferTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.TRANSFER);
        expect((json.transaction.recipient as any).fullName).to.be.equal('some-namespace');
        deepStrictEqual((json.transaction.recipient as any).id, namespaceId.id.toDTO());
        expect(json.transaction.message.payload).to.be.equal('746573742D6D657373616765');
        expect(json.transaction.message.type).to.be.equal(0);
        expect(json.transaction.mosaics.length).to.be.equal(1);
        deepStrictEqual(json.transaction.mosaics[0].id, mosaic.id.id.toDTO());
        deepStrictEqual(json.transaction.mosaics[0].amount, mosaic.amount.toDTO());
    });

    it('should create SecretLockTransaction', () => {
        const mosaic = NetworkCurrencyMosaic.createAbsolute(10);
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secret = sha3_256.create().update(convert.hexToUint8(proof)).hex();
        const recipient = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            mosaic,
            UInt64.fromUint(100),
            HashType.Op_Sha3_256,
            secret,
            recipient,
            NetworkType.MIJIN_TEST,
        );

        const json = secretLockTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.SECRET_LOCK);
        deepStrictEqual(json.transaction.mosaicId, mosaic.id.id.toDTO());
        deepStrictEqual(json.transaction.amount, UInt64.fromUint(10).toDTO());
        deepStrictEqual(json.transaction.duration, UInt64.fromUint(100).toDTO());
        expect(json.transaction.hashAlgorithm).to.be.equal(HashType.Op_Sha3_256);
        expect(json.transaction.secret).to.be.equal(secret);
        expect(json.transaction.recipient.address).to.be.equal(recipient.plain());
    });

    it('should create SecretProofTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            account.address,
            proof,
            NetworkType.MIJIN_TEST,
        );

        const json = secretProofTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.SECRET_PROOF);
        expect(json.transaction.hashAlgorithm).to.be.equal(HashType.Op_Sha3_256);
        expect(json.transaction.secret).to.be.equal(sha3_256.create().update(convert.hexToUint8(proof)).hex());
        expect(json.transaction.proof).to.be.equal(proof);
        expect(json.transaction.recipient.address).to.be.equal(account.address.plain());

    });

    it('should create ModifyMultiSigTransaction', () => {
        const publicKey = 'B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24';
        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            2,
            1,
            [new MultisigCosignatoryModification(
                MultisigCosignatoryModificationType.Add,
                PublicAccount.createFromPublicKey(publicKey,
                    NetworkType.MIJIN_TEST),
            )],
            NetworkType.MIJIN_TEST,
        );

        const json = modifyMultisigAccountTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MODIFY_MULTISIG_ACCOUNT);
        expect(json.transaction.minApprovalDelta).to.be.equal(2);
        expect(json.transaction.minRemovalDelta).to.be.equal(1);
        expect(json.transaction.modifications.length).to.be.equal(1);
        expect(json.transaction.modifications[0].type).to.be.equal(MultisigCosignatoryModificationType.Add);
        expect(json.transaction.modifications[0].cosignatoryPublicKey).to.be.equal(publicKey);
    });

    it('should create AggregatedTransaction - Complete', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createCompleteV1(
            Deadline.create(),
            [transferTransaction.toAggregateV1(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const json = aggregateTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE_V1);
        expect(json.transaction.transactions.length).to.be.equal(1);
        expect(json.transaction.transactions[0].transaction.type).to.be.equal(TransactionType.TRANSFER);
    });

    it('should create AggregatedTransaction - Bonded', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createBondedV1(
            Deadline.create(),
            [transferTransaction.toAggregateV1(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const json = aggregateTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.AGGREGATE_BONDED_V1);
        expect(json.transaction.transactions.length).to.be.equal(1);
        expect(json.transaction.transactions[0].transaction.type).to.be.equal(TransactionType.TRANSFER);
    });

    it('should create HashLockTransaction', () => {
        const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
        const mosaic = NetworkCurrencyMosaic.createRelative(10);
        const aggregateTransaction = AggregateTransaction.createBondedV1(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.preV2Sign(aggregateTransaction, generationHash);
        const lockTransaction = HashLockTransaction.create(Deadline.create(),
            mosaic,
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST);

        const json = lockTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.HASH_LOCK);
        expect(json.transaction.hash).to.be.equal(signedTransaction.hash);
        deepStrictEqual(json.transaction.mosaicId, mosaic.id.id.toDTO());
        deepStrictEqual(json.transaction.amount, mosaic.amount.toDTO());
        deepStrictEqual(json.transaction.duration, UInt64.fromUint(10).toDTO());
    });

    it('should create RegisterNamespaceTransaction - Root', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
            Deadline.create(),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.MIJIN_TEST,
        );

        const json = registerNamespaceTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.REGISTER_NAMESPACE);
        expect(json.transaction.namespaceType).to.be.equal(NamespaceType.RootNamespace);
        expect(json.transaction.namespaceName).to.be.equal('root-test-namespace');
    });

    it('should create RegisterNamespaceTransaction - Sub', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(
            Deadline.create(),
            'sub-test-namespace',
            'parent-test-namespace',
            NetworkType.MIJIN_TEST,
        );

        const json = registerNamespaceTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.REGISTER_NAMESPACE);
        expect(json.transaction.namespaceType).to.be.equal(NamespaceType.SubNamespace);
        expect(json.transaction.namespaceName).to.be.equal('sub-test-namespace');
    });

    it('should create AccountMetadataTransaction', () => {
        const newValue = 'hello';
        const oldvalue = 'hello1';
        const accountMetadataTransaction = AccountMetadataTransaction.create(   
            Deadline.create(),
            account.publicAccount,
            "name",
            newValue,
            oldvalue,
            NetworkType.MIJIN_TEST,
        );

        const json = accountMetadataTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.ACCOUNT_METADATA_V2);
        expect(json.transaction.targetPublicKey.publicKey).to.be.equal(account.publicKey);
        deepStrictEqual(json.transaction.scopedMetadataKey, KeyGenerator.generateUInt64Key("name").toDTO());
        expect(json.transaction.oldValue).to.be.equal(oldvalue);
        expect(json.transaction.value).to.be.equal(newValue);
        expect(json.transaction.valueSize).to.be.equal(6);
        expect(json.transaction.valueSizeDelta).to.be.equal(-1);
        expect(json.transaction.valueDifferences).to.be.equal("000000000031");
    });

    it('should create MosaicMetadataTransaction', () => {
        const newValue = 'hello';
        const oldvalue = 'hello1';
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(   
            Deadline.create(),
            account.publicAccount,
            mosaicId,
            "name",
            newValue,
            oldvalue,
            NetworkType.MIJIN_TEST,
        );

        const json = mosaicMetadataTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MOSAIC_METADATA_V2);
        expect(json.transaction.targetPublicKey).to.be.equal(account.publicKey);
        deepStrictEqual(json.transaction.scopedMetadataKey, KeyGenerator.generateUInt64Key("name").toDTO());
        deepStrictEqual(json.transaction.targetMosaicId, mosaicId.toDTO());
        expect(json.transaction.oldValue).to.be.equal(oldvalue);
        expect(json.transaction.value).to.be.equal(newValue);
        expect(json.transaction.valueSize).to.be.equal(6);
        expect(json.transaction.valueSizeDelta).to.be.equal(-1);
        expect(json.transaction.valueDifferences).to.be.equal("000000000031");
    });

    it('should create NamespaceMetadataTransaction', () => {
        const newValue = 'hello';
        const oldvalue = 'hello1';
        const namespaceId = new NamespaceId("testing");
        const mosaicMetadataTransaction = NamespaceMetadataTransaction.create(   
            Deadline.create(),
            account.publicAccount,
            namespaceId,
            "name",
            newValue,
            oldvalue,
            NetworkType.MIJIN_TEST,
        );

        const json = mosaicMetadataTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.NAMESPACE_METADATA_V2);
        expect(json.transaction.targetPublicKey).to.be.equal(account.publicKey);
        deepStrictEqual(json.transaction.scopedMetadataKey, KeyGenerator.generateUInt64Key("name").toDTO());
        deepStrictEqual(json.transaction.targetNamespaceId, namespaceId.toDTO());
        expect(json.transaction.oldValue).to.be.equal(oldvalue);
        expect(json.transaction.value).to.be.equal(newValue);
        expect(json.transaction.valueSize).to.be.equal(6);
        expect(json.transaction.valueSizeDelta).to.be.equal(-1);
        expect(json.transaction.valueDifferences).to.be.equal("000000000031");

    });

    it('should create NetworkConfigTransaction', () => {
        const NetworkConfigureTransaction = NetworkConfigTransaction.create(
            Deadline.create(),
            UInt64.fromUint(12345678901234567890),
            'some-network-config',
            'some-supported-entity-versions',
            NetworkType.MIJIN_TEST
        );

        const json = NetworkConfigureTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.CHAIN_CONFIGURE);
        deepStrictEqual(json.transaction.applyHeightDelta, UInt64.fromUint(12345678901234567890).toDTO());
        expect(json.transaction.networkConfig).to.be.equal('some-network-config');
        expect(json.transaction.supportedEntityVersions).to.be.equal('some-supported-entity-versions');
    });

    it('should create ChainUpgradeTransaction', () => {
        const chainUpgradeTransaction = ChainUpgradeTransaction.create(
            Deadline.create(),
            UInt64.fromUint(1234),
            UInt64.fromUint(12345678901234567890),
            NetworkType.MIJIN_TEST
        );

        const json = chainUpgradeTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.CHAIN_UPGRADE);
        deepStrictEqual(json.transaction.upgradePeriod, UInt64.fromUint(1234).toDTO());
        deepStrictEqual(json.transaction.newBlockchainVersion, UInt64.fromUint(12345678901234567890).toDTO());
    });
});
