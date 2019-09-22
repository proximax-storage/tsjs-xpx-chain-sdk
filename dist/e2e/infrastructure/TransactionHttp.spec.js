"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the \"License\");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an \"AS IS\" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const chai_1 = require("chai");
const CryptoJS = require("crypto-js");
const js_sha3_1 = require("js-sha3");
const format_1 = require("../../src/core/format");
const conf_spec_1 = require("../conf/conf.spec");
const model_1 = require("../../src/model/model");
const assert_1 = require("assert");
const crypto_1 = require("crypto");
const utils_1 = require("../utils");
const infrastructure_1 = require("../../src/infrastructure/infrastructure");
const utility_1 = require("../../src/core/utils/utility");
let transactionHttp;
let accountHttp;
let mosaicHttp;
let namespaceName;
let mosaicId;
let listener;
let factory;
before(() => {
    transactionHttp = conf_spec_1.ConfTransactionHttp;
    accountHttp = conf_spec_1.ConfAccountHttp;
    mosaicHttp = conf_spec_1.ConfMosaicHttp;
    listener = new infrastructure_1.Listener(conf_spec_1.APIUrl);
    return listener.open().then(() => {
        return conf_spec_1.Configuration.getTransactionBuilderFactory().then(f => {
            factory = f;
        });
    });
});
after(() => {
    listener.close();
});
describe('TransactionHttp', () => {
    describe('announce', () => {
        describe('TransferTransaction', () => {
            it('standalone', (done) => {
                const transferTransaction = factory.transfer()
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .mosaics([new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10))])
                    .message(model_1.PlainMessage.create('test-message'))
                    .build();
                const signedTransaction = transferTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const transferTransaction = factory.transfer()
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .mosaics([new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10))])
                    .message(model_1.PlainMessage.create('test-message'))
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([transferTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
    });
    describe('Multisig', () => {
        it('should send transfer tx as aggregate bonded', (done) => {
            const transferTransaction = factory.transfer()
                .recipient(conf_spec_1.TestingRecipient.address)
                .mosaics([new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10))])
                .message(model_1.PlainMessage.create('test-message from multisig account as aggregate bonded'))
                .build();
            const aggregateBondedTransaction = factory.aggregateBonded()
                .innerTransactions([transferTransaction.toAggregate(conf_spec_1.MultisigAccount.publicAccount)])
                .build();
            const signedAggregateBondedTransaction = aggregateBondedTransaction.signWith(conf_spec_1.CosignatoryAccount, factory.generationHash);
            const hashLockTransaction = factory.hashLock()
                .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10000000)))
                .duration(model_1.UInt64.fromUint(1000))
                .signedTransaction(signedAggregateBondedTransaction)
                .build();
            const signedHashLockTransaction = hashLockTransaction.signWith(conf_spec_1.CosignatoryAccount, factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.CosignatoryAccount.address, signedHashLockTransaction.hash)
                .then(() => {
                utils_1.validatePartialTransactionAnnouncedCorrectly(listener, conf_spec_1.MultisigAccount.address, signedAggregateBondedTransaction.hash, (addedAggregateBondedTransaction) => {
                    const cosignatureTransaction = model_1.CosignatureTransaction.create(addedAggregateBondedTransaction);
                    const signedCosignatureTransaction = cosignatureTransaction.signWith(conf_spec_1.Cosignatory2Account);
                    utils_1.validatePartialTransactionNotPartialAnyMore(listener, conf_spec_1.MultisigAccount.address, signedAggregateBondedTransaction.hash, () => {
                        done();
                    });
                    transactionHttp.announceAggregateBondedCosignature(signedCosignatureTransaction);
                });
                transactionHttp.announceAggregateBonded(signedAggregateBondedTransaction);
            }).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedHashLockTransaction);
        });
        it('should send transfer tx as aggregate complete', (done) => {
            const transferTransaction = factory.transfer()
                .recipient(conf_spec_1.TestingRecipient.address)
                .mosaics([new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10))])
                .message(model_1.PlainMessage.create('test-message from multisig account as aggregate complete'))
                .build();
            const aggregateCompleteTransaction = factory.aggregateComplete()
                .innerTransactions([transferTransaction.toAggregate(conf_spec_1.MultisigAccount.publicAccount)])
                .build();
            const signedAggregateCompleteTransaction = conf_spec_1.CosignatoryAccount.signTransactionWithCosignatories(aggregateCompleteTransaction, [conf_spec_1.Cosignatory2Account], factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.CosignatoryAccount.address, signedAggregateCompleteTransaction.hash)
                .then(() => done()).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedAggregateCompleteTransaction);
        });
    });
    describe('Multilevel Multisig', () => {
        it('should send transfer tx as aggregate bonded', (done) => {
            const transferTransaction = factory.transfer()
                .recipient(conf_spec_1.TestingRecipient.address)
                .mosaics([new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10))])
                .message(model_1.PlainMessage.create('test-message from multilevel multisig account as aggregate bonded'))
                .build();
            const aggregateBondedTransaction = factory.aggregateBonded()
                .innerTransactions([transferTransaction.toAggregate(conf_spec_1.MultilevelMultisigAccount.publicAccount)])
                .build();
            const signedAggregateBondedTransaction = aggregateBondedTransaction.signWith(conf_spec_1.Cosignatory4Account, factory.generationHash);
            const hashLockTransaction = factory.hashLock()
                .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10000000)))
                .duration(model_1.UInt64.fromUint(1000))
                .signedTransaction(signedAggregateBondedTransaction)
                .build();
            const signedHashLockTransaction = hashLockTransaction.signWith(conf_spec_1.Cosignatory4Account, factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.Cosignatory4Account.address, signedHashLockTransaction.hash)
                .then(() => {
                utils_1.validatePartialTransactionAnnouncedCorrectly(listener, conf_spec_1.MultilevelMultisigAccount.address, signedAggregateBondedTransaction.hash, (addedAggregateBondedTransaction) => {
                    const cosignatureTransaction = model_1.CosignatureTransaction.create(addedAggregateBondedTransaction);
                    const signedCosignatureTransaction1 = cosignatureTransaction.signWith(conf_spec_1.Cosignatory2Account);
                    const signedCosignatureTransaction2 = cosignatureTransaction.signWith(conf_spec_1.Cosignatory3Account);
                    utils_1.validatePartialTransactionNotPartialAnyMore(listener, conf_spec_1.MultilevelMultisigAccount.address, signedAggregateBondedTransaction.hash, () => {
                        done();
                    });
                    transactionHttp.announceAggregateBondedCosignature(signedCosignatureTransaction1);
                    transactionHttp.announceAggregateBondedCosignature(signedCosignatureTransaction2);
                });
                transactionHttp.announceAggregateBonded(signedAggregateBondedTransaction);
            }).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedHashLockTransaction);
        });
        it('should send transfer tx as aggregate complete signed at once', (done) => {
            const transferTransaction = factory.transfer()
                .recipient(conf_spec_1.TestingRecipient.address)
                .mosaics([new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10))])
                .message(model_1.PlainMessage.create('test-message from multilevel multisig account as aggregate complete'))
                .build();
            const aggregateCompleteTransaction = factory.aggregateComplete()
                .innerTransactions([transferTransaction.toAggregate(conf_spec_1.MultilevelMultisigAccount.publicAccount)])
                .build();
            const signedAggregateCompleteTransaction = conf_spec_1.Cosignatory4Account.signTransactionWithCosignatories(aggregateCompleteTransaction, [conf_spec_1.Cosignatory2Account, conf_spec_1.Cosignatory3Account], factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.Cosignatory4Account.address, signedAggregateCompleteTransaction.hash)
                .then(() => done()).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedAggregateCompleteTransaction);
        });
        it('should send transfer tx as aggregate complete not signed at once (offline)', (done) => {
            const transferTransaction = factory.transfer()
                .recipient(conf_spec_1.TestingRecipient.address)
                .mosaics([new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10))])
                .message(model_1.PlainMessage.create('test-message from multilevel multisig account as aggregate complete'))
                .build();
            // initiator, delivers this to other cosigners
            const aggregateCompleteTransaction = factory.aggregateComplete()
                .innerTransactions([transferTransaction.toAggregate(conf_spec_1.MultilevelMultisigAccount.publicAccount)])
                .build();
            const signedAggregateCompleteTransaction = aggregateCompleteTransaction.signWith(conf_spec_1.Cosignatory4Account, factory.generationHash);
            // second cosigner, cosign and send back to the initiator
            const cosignedTwo = model_1.CosignatureTransaction.signTransactionPayload(conf_spec_1.Cosignatory2Account, signedAggregateCompleteTransaction.payload, factory.generationHash);
            // third cosigner, cosign and send back to the initiator
            const cosignedThree = model_1.CosignatureTransaction.signTransactionPayload(conf_spec_1.Cosignatory3Account, signedAggregateCompleteTransaction.payload, factory.generationHash);
            // initiator combines all the signatures and the transaction into single signed transaction and announces
            const cosignatureSignedTransactions = [
                new model_1.CosignatureSignedTransaction(cosignedTwo.parentHash, cosignedTwo.signature, cosignedTwo.signer),
                new model_1.CosignatureSignedTransaction(cosignedThree.parentHash, cosignedThree.signature, cosignedThree.signer)
            ];
            const deserializedAggregateCompleteTransaction = utility_1.TransactionMapping.createFromPayload(signedAggregateCompleteTransaction.payload);
            const signedDeserializedAggregateCompleteTransaction = deserializedAggregateCompleteTransaction.signTransactionGivenSignatures(conf_spec_1.Cosignatory4Account, cosignatureSignedTransactions, factory.generationHash);
            { // check that all the signatures are the same as if used the signTransactionWithCosignatories only
                const differentlySignedAggregateCompleteTransaction = conf_spec_1.Cosignatory4Account.signTransactionWithCosignatories(aggregateCompleteTransaction, [conf_spec_1.Cosignatory2Account, conf_spec_1.Cosignatory3Account], factory.generationHash);
                chai_1.expect(differentlySignedAggregateCompleteTransaction.payload).to.be.equal(signedDeserializedAggregateCompleteTransaction.payload);
                chai_1.expect(differentlySignedAggregateCompleteTransaction.hash).to.be.equal(signedDeserializedAggregateCompleteTransaction.hash);
            }
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.Cosignatory4Account.address, signedDeserializedAggregateCompleteTransaction.hash)
                .then(() => done()).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedDeserializedAggregateCompleteTransaction);
        });
    });
    describe('AccountLinkTransaction', () => {
        describe('RegisterNamespaceTransaction', () => {
            it('standalone', (done) => {
                namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
                const registerNamespaceTransaction = factory.registerRootNamespace()
                    .namespaceName(namespaceName)
                    .duration(model_1.UInt64.fromUint(1000))
                    .build();
                const signedTransaction = registerNamespaceTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const registerNamespaceTransaction = factory.registerRootNamespace()
                    .namespaceName('root-test-namespace-' + Math.floor(Math.random() * 10000))
                    .duration(model_1.UInt64.fromUint(1000))
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([registerNamespaceTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('MosaicDefinitionTransaction', () => {
            it('standalone', (done) => {
                const nonce = model_1.MosaicNonce.createRandom();
                const mosaicId = model_1.MosaicId.createFromNonce(nonce, conf_spec_1.TestingAccount.publicAccount);
                const mosaicDefinitionTransaction = factory.mosaicDefinition()
                    .mosaicNonce(nonce)
                    .mosaicId(mosaicId)
                    .mosaicProperties(model_1.MosaicProperties.create({
                    supplyMutable: true,
                    transferable: true,
                    divisibility: 3,
                    duration: model_1.UInt64.fromUint(1000),
                }))
                    .build();
                const signedTransaction = mosaicDefinitionTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                console.log(mosaicId.toHex());
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash).then(() => {
                    const modifyMetadataTransaction = factory.mosaicMetadata()
                        .mosaicId(mosaicId)
                        .modifications([new model_1.MetadataModification(model_1.MetadataModificationType.ADD, 'key2', 'some other value')])
                        .build();
                    const signedTransaction = modifyMetadataTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                    utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => assert_1.fail(reason));
                    transactionHttp.announce(signedTransaction);
                }).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const nonce = model_1.MosaicNonce.createRandom();
                mosaicId = model_1.MosaicId.createFromNonce(nonce, conf_spec_1.TestingAccount.publicAccount);
                const mosaicDefinitionTransaction = factory.mosaicDefinition()
                    .mosaicNonce(nonce)
                    .mosaicId(mosaicId)
                    .mosaicProperties(model_1.MosaicProperties.create({
                    supplyMutable: true,
                    transferable: true,
                    divisibility: 3,
                    duration: model_1.UInt64.fromUint(1000),
                }))
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([mosaicDefinitionTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('MosaicDefinitionTransaction with zero nonce', () => {
            it('standalone', (done) => {
                const nonce = model_1.MosaicNonce.createFromHex('00000000');
                const mosaicId = model_1.MosaicId.createFromNonce(nonce, conf_spec_1.TestingAccount.publicAccount);
                const mosaicDefinitionTransaction = factory.mosaicDefinition()
                    .mosaicNonce(nonce)
                    .mosaicId(mosaicId)
                    .mosaicProperties(model_1.MosaicProperties.create({
                    supplyMutable: true,
                    transferable: true,
                    divisibility: 3,
                    duration: model_1.UInt64.fromUint(60000),
                }))
                    .build();
                const signedTransaction = mosaicDefinitionTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const nonce = model_1.MosaicNonce.createFromHex('00000000');
                const mosaicId = model_1.MosaicId.createFromNonce(nonce, conf_spec_1.TestingAccount.publicAccount);
                const mosaicDefinitionTransaction = factory.mosaicDefinition()
                    .mosaicNonce(nonce)
                    .mosaicId(mosaicId)
                    .mosaicProperties(model_1.MosaicProperties.create({
                    supplyMutable: true,
                    transferable: true,
                    divisibility: 3,
                    duration: model_1.UInt64.fromUint(1000),
                }))
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([mosaicDefinitionTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('AccountAndMosaicAliasTransactions', () => {
            it('should create an alias to an account', (done) => {
                const addressAliasTransaction = factory.addressAlias()
                    .actionType(model_1.AliasActionType.Link)
                    .namespaceId(conf_spec_1.ConfTestingNamespaceId)
                    .address(conf_spec_1.TestingAccount.address)
                    .build();
                const signedTransaction = addressAliasTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('should remove the alias from an account', (done) => {
                const addressAliasTransaction = factory.addressAlias()
                    .actionType(model_1.AliasActionType.Unlink)
                    .namespaceId(conf_spec_1.ConfTestingNamespaceId)
                    .address(conf_spec_1.TestingAccount.address)
                    .build();
                const signedTransaction = addressAliasTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('should create an alias to a mosaic', (done) => {
                const mosaicAliasTransaction = factory.mosaicAlias()
                    .actionType(model_1.AliasActionType.Link)
                    .namespaceId(conf_spec_1.ConfTestingNamespaceId)
                    .mosaicId(conf_spec_1.ConfTestingMosaicId)
                    .build();
                console.log(mosaicAliasTransaction);
                const signedTransaction = mosaicAliasTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('should remove an alias from a mosaic', (done) => {
                const mosaicAliasTransaction = factory.mosaicAlias()
                    .actionType(model_1.AliasActionType.Unlink)
                    .namespaceId(conf_spec_1.ConfTestingNamespaceId)
                    .mosaicId(conf_spec_1.ConfTestingMosaicId)
                    .build();
                const signedTransaction = mosaicAliasTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('MosaicSupplyChangeTransaction', () => {
            it('standalone', (done) => {
                const mosaicSupplyChangeTransaction = factory.mosaicSupplyChange()
                    .mosaicId(mosaicId) // depends on mosaicId created randomly in the previous test
                    .direction(model_1.MosaicSupplyType.Increase)
                    .delta(model_1.UInt64.fromUint(10))
                    .build();
                const signedTransaction = mosaicSupplyChangeTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const mosaicSupplyChangeTransaction = factory.mosaicSupplyChange()
                    .mosaicId(mosaicId) // depends on mosaicId created randomly in the previous test
                    .direction(model_1.MosaicSupplyType.Increase)
                    .delta(model_1.UInt64.fromUint(10))
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([mosaicSupplyChangeTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
    });
    describe('AccountRestrictionTransaction - Address', () => {
        it('standalone', (done) => {
            const addressRestrictionFilter = model_1.AccountRestrictionModification.createForAddress(model_1.RestrictionModificationType.Add, conf_spec_1.Customer1Account.address);
            const addressModification = factory.accountRestrictionAddress()
                .restrictionType(model_1.RestrictionType.BlockAddress)
                .modifications([addressRestrictionFilter])
                .build();
            const signedTransaction = addressModification.signWith(conf_spec_1.TestingAccount, factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                .then(() => done()).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedTransaction);
        });
        it('aggregate', (done) => {
            const addressRestrictionFilter = model_1.AccountRestrictionModification.createForAddress(model_1.RestrictionModificationType.Remove, conf_spec_1.Customer1Account.address);
            const addressModification = factory.accountRestrictionAddress()
                .restrictionType(model_1.RestrictionType.BlockAddress)
                .modifications([addressRestrictionFilter])
                .build();
            const aggregateTransaction = factory.aggregateComplete()
                .innerTransactions([addressModification.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                .build();
            const signedTransaction = aggregateTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                .then(() => done()).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('AccountRestrictionTransaction - Mosaic', () => {
        it('standalone', (done) => {
            const mosaicRestrictionFilter = model_1.AccountRestrictionModification.createForMosaic(model_1.RestrictionModificationType.Add, mosaicId);
            const addressModification = factory.accountRestrictionMosaic()
                .restrictionType(model_1.RestrictionType.BlockMosaic)
                .modifications([mosaicRestrictionFilter])
                .build();
            const signedTransaction = addressModification.signWith(conf_spec_1.TestingAccount, factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                .then(() => done()).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedTransaction);
        });
        it('aggregate', (done) => {
            const mosaicRestrictionFilter = model_1.AccountRestrictionModification.createForMosaic(model_1.RestrictionModificationType.Remove, mosaicId);
            const addressModification = factory.accountRestrictionMosaic()
                .restrictionType(model_1.RestrictionType.BlockMosaic)
                .modifications([mosaicRestrictionFilter])
                .build();
            const aggregateTransaction = factory.aggregateComplete()
                .innerTransactions([addressModification.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                .build();
            const signedTransaction = aggregateTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                .then(() => done()).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('AccountRestrictionTransaction - Operation', () => {
        it('standalone', (done) => {
            const operationRestrictionFilter = model_1.AccountRestrictionModification.createForOperation(model_1.RestrictionModificationType.Add, model_1.TransactionType.LINK_ACCOUNT);
            const addressModification = factory.accountRestrictionOperation()
                .restrictionType(model_1.RestrictionType.BlockTransaction)
                .modifications([operationRestrictionFilter])
                .build();
            const signedTransaction = addressModification.signWith(conf_spec_1.Cosignatory2Account, factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.Cosignatory2Account.address, signedTransaction.hash)
                .then(() => done()).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedTransaction);
        });
        it('aggregate', (done) => {
            const operationRestrictionFilter = model_1.AccountRestrictionModification.createForOperation(model_1.RestrictionModificationType.Remove, model_1.TransactionType.LINK_ACCOUNT);
            const addressModification = factory.accountRestrictionOperation()
                .restrictionType(model_1.RestrictionType.BlockTransaction)
                .modifications([operationRestrictionFilter])
                .build();
            const aggregateTransaction = factory.aggregateComplete()
                .innerTransactions([addressModification.toAggregate(conf_spec_1.Cosignatory2Account.publicAccount)])
                .build();
            const signedTransaction = aggregateTransaction.signWith(conf_spec_1.Cosignatory2Account, factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.Cosignatory2Account.address, signedTransaction.hash)
                .then(() => done()).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedTransaction);
        });
    });
    /*
    describe('HashLockTransaction - MosaicAlias', () => {
        it('standalone', (done) => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [],
                ConfNetworkType,
                [],
            );
            const signedTransaction = TestingAccount.sign(aggregateTransaction, factory.generationHash);
            const hashLockTransaction = HashLockTransaction.create(Deadline.create(),
                new Mosaic(new NamespaceId('cat.currency'), UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY))),
                UInt64.fromUint(10000),
                signedTransaction,
                ConfNetworkType);

            const signedHashLockTransaction = hashLockTransaction.signWith(TestingAccount, factory.generationHash);
            validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedHashLockTransaction.hash);
            transactionHttp.announce(signedHashLockTransaction);
        });
    });

    describe('MosaicAliasTransaction', () => {
        it('aggregate', (done) => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(),
                AliasActionType.Unlink,
                namespaceId,
                mosaicId,
                ConfNetworkType,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicAliasTransaction.toAggregate(TestingAccount.publicAccount)],
                ConfNetworkType,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
            validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
            transactionHttp.announce(signedTransaction);
        });
    });
*/
    describe('LockFundsTransaction', () => {
        it('standalone', (done) => {
            const aggregateTransaction = factory.aggregateBonded()
                .build();
            const signedTransaction = conf_spec_1.TestingAccount.sign(aggregateTransaction, factory.generationHash);
            const lockFundsTransaction = factory.lockFunds()
                .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * Math.pow(10, conf_spec_1.ConfNetworkMosaicDivisibility))))
                .duration(model_1.UInt64.fromUint(10000))
                .signedTransaction(signedTransaction)
                .build();
            const signedLockFundsTransaction = lockFundsTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedLockFundsTransaction.hash)
                .then(() => done()).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedLockFundsTransaction);
        });
        it('aggregate', (done) => {
            const aggregateTransaction = factory.aggregateBonded()
                .build();
            const signedTransaction = conf_spec_1.TestingAccount.sign(aggregateTransaction, factory.generationHash);
            const lockFundsTransaction = factory.lockFunds()
                .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * Math.pow(10, conf_spec_1.ConfNetworkMosaicDivisibility))))
                .duration(model_1.UInt64.fromUint(10))
                .signedTransaction(signedTransaction)
                .build();
            const aggregateLockFundsTransaction = factory.aggregateComplete()
                .innerTransactions([lockFundsTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                .build();
            const signedAggregateLockFundsTransaction = aggregateLockFundsTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedAggregateLockFundsTransaction.hash)
                .then(() => done()).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedAggregateLockFundsTransaction);
        });
    });
    describe('Aggregate Complete Transaction', () => {
        it('should announce aggregated complete transaction', (done) => {
            const transaction = factory.transfer()
                .recipient(conf_spec_1.TestingRecipient.address)
                .message(model_1.PlainMessage.create('Hi'))
                .build();
            const aggregateTransaction = factory.aggregateComplete()
                .innerTransactions([
                transaction.toAggregate(conf_spec_1.TestingAccount.publicAccount),
            ])
                .build();
            const signedTransaction = conf_spec_1.TestingAccount.sign(aggregateTransaction, factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                .then(() => done()).catch((reason) => assert_1.fail(reason));
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('SecretLockTransaction', () => {
        describe('HashType: Op_Sha3_256', () => {
            it('standalone', (done) => {
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Sha3_256)
                    .secret(js_sha3_1.sha3_256.create().update(crypto_1.randomBytes(20)).hex())
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const signedTransaction = secretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Sha3_256)
                    .secret(js_sha3_1.sha3_256.create().update(crypto_1.randomBytes(20)).hex())
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const aggregateSecretLockTransaction = factory.aggregateComplete()
                    .innerTransactions([secretLockTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateSecretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('HashType: Keccak_256', () => {
            it('standalone', (done) => {
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Keccak_256)
                    .secret(js_sha3_1.sha3_256.create().update(crypto_1.randomBytes(20)).hex())
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const signedTransaction = secretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Keccak_256)
                    .secret(js_sha3_1.sha3_256.create().update(crypto_1.randomBytes(20)).hex())
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const aggregateSecretLockTransaction = factory.aggregateComplete()
                    .innerTransactions([secretLockTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateSecretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('HashType: Op_Hash_160', () => {
            it('standalone', (done) => {
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Hash_160)
                    .secret(js_sha3_1.sha3_256.create().update(crypto_1.randomBytes(20)).hex().substr(0, 40))
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const signedTransaction = secretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Hash_160)
                    .secret(js_sha3_1.sha3_256.create().update(crypto_1.randomBytes(20)).hex().substr(0, 40))
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const aggregateSecretLockTransaction = factory.aggregateComplete()
                    .innerTransactions([secretLockTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateSecretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('HashType: Op_Hash_256', () => {
            it('standalone', (done) => {
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Hash_256)
                    .secret(js_sha3_1.sha3_256.create().update(crypto_1.randomBytes(20)).hex())
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const signedTransaction = secretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Hash_256)
                    .secret(js_sha3_1.sha3_256.create().update(crypto_1.randomBytes(20)).hex())
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const aggregateSecretLockTransaction = factory.aggregateComplete()
                    .innerTransactions([secretLockTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateSecretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
    });
    describe('SecretProofTransaction', () => {
        describe('HashType: Op_Sha3_256', () => {
            it('standalone', (done) => {
                const secretSeed = crypto_1.randomBytes(20);
                const secret = js_sha3_1.sha3_256.create().update(secretSeed).hex();
                const proof = format_1.Convert.uint8ToHex(secretSeed);
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Sha3_256)
                    .secret(secret)
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const signedSecretLockTransaction = secretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                    const secretProofTransaction = factory.secretProof()
                        .hashType(model_1.HashType.Op_Sha3_256)
                        .secret(secret)
                        .recipient(conf_spec_1.TestingRecipient.address)
                        .proof(proof)
                        .build();
                    const signedSecretProofTransaction = secretProofTransaction.signWith(conf_spec_1.TestingRecipient, factory.generationHash);
                    utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingRecipient.address, signedSecretProofTransaction.hash)
                        .then(() => {
                        done();
                    }, (reason) => {
                        assert_1.fail(reason);
                    });
                    transactionHttp.announce(signedSecretProofTransaction);
                }, (reason) => {
                    assert_1.fail(reason);
                });
                transactionHttp.announce(signedSecretLockTransaction);
            });
            it('aggregate', (done) => {
                const secretSeed = crypto_1.randomBytes(20);
                const secret = js_sha3_1.sha3_256.create().update(secretSeed).hex();
                const proof = format_1.Convert.uint8ToHex(secretSeed);
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Sha3_256)
                    .secret(secret)
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const signedSecretLockTransaction = secretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                    const secretProofTransaction = factory.secretProof()
                        .hashType(model_1.HashType.Op_Sha3_256)
                        .secret(secret)
                        .recipient(conf_spec_1.TestingRecipient.address)
                        .proof(proof)
                        .build();
                    const aggregateSecretProofTransaction = factory.aggregateComplete()
                        .innerTransactions([secretProofTransaction.toAggregate(conf_spec_1.TestingRecipient.publicAccount)])
                        .build();
                    const signedAggregateSecretProofTransaction = aggregateSecretProofTransaction.signWith(conf_spec_1.TestingRecipient, factory.generationHash);
                    utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingRecipient.address, signedAggregateSecretProofTransaction.hash)
                        .then(() => {
                        done();
                    }, (reason) => {
                        assert_1.fail(reason);
                    });
                    transactionHttp.announce(signedAggregateSecretProofTransaction);
                }, (reason) => {
                    assert_1.fail(reason);
                });
                transactionHttp.announce(signedSecretLockTransaction);
            });
        });
        describe('HashType: Op_Keccak_256', () => {
            it('standalone', (done) => {
                const secretSeed = crypto_1.randomBytes(20);
                const secret = js_sha3_1.keccak_256.create().update(secretSeed).hex();
                const proof = format_1.Convert.uint8ToHex(secretSeed);
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Keccak_256)
                    .secret(secret)
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const signedSecretLockTransaction = secretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                    const secretProofTransaction = factory.secretProof()
                        .hashType(model_1.HashType.Op_Keccak_256)
                        .secret(secret)
                        .recipient(conf_spec_1.TestingRecipient.address)
                        .proof(proof)
                        .build();
                    const signedSecretProofTransaction = secretProofTransaction.signWith(conf_spec_1.TestingRecipient, factory.generationHash);
                    utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingRecipient.address, signedSecretProofTransaction.hash)
                        .then(() => {
                        done();
                    }, (reason) => {
                        assert_1.fail(reason);
                    });
                    transactionHttp.announce(signedSecretProofTransaction);
                }, (reason) => {
                    assert_1.fail(reason);
                });
                transactionHttp.announce(signedSecretLockTransaction);
            });
            it('aggregate', (done) => {
                const secretSeed = crypto_1.randomBytes(20);
                const secret = js_sha3_1.keccak_256.create().update(secretSeed).hex();
                const proof = format_1.Convert.uint8ToHex(secretSeed);
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Keccak_256)
                    .secret(secret)
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const signedSecretLockTransaction = secretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                    const secretProofTransaction = factory.secretProof()
                        .hashType(model_1.HashType.Op_Keccak_256)
                        .secret(secret)
                        .recipient(conf_spec_1.TestingRecipient.address)
                        .proof(proof)
                        .build();
                    const aggregateSecretProofTransaction = factory.aggregateComplete()
                        .innerTransactions([secretProofTransaction.toAggregate(conf_spec_1.TestingRecipient.publicAccount)])
                        .build();
                    const signedAggregateSecretProofTransaction = aggregateSecretProofTransaction.signWith(conf_spec_1.TestingRecipient, factory.generationHash);
                    utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingRecipient.address, signedAggregateSecretProofTransaction.hash)
                        .then(() => {
                        done();
                    }, (reason) => {
                        assert_1.fail(reason);
                    });
                    transactionHttp.announce(signedAggregateSecretProofTransaction);
                }, (reason) => {
                    assert_1.fail(reason);
                });
                transactionHttp.announce(signedSecretLockTransaction);
            });
        });
        describe('HashType: Op_Hash_160', () => {
            it('standalone', (done) => {
                const secretSeed = crypto_1.randomBytes(20);
                const proof = format_1.Convert.uint8ToHex(secretSeed);
                const secret = CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(proof)).toString(CryptoJS.enc.Hex))).toString(CryptoJS.enc.Hex);
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Hash_160)
                    .secret(secret)
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const signedSecretLockTransaction = secretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                    const secretProofTransaction = factory.secretProof()
                        .hashType(model_1.HashType.Op_Hash_160)
                        .secret(secret)
                        .recipient(conf_spec_1.TestingRecipient.address)
                        .proof(proof)
                        .build();
                    const signedSecretProofTransaction = secretProofTransaction.signWith(conf_spec_1.TestingRecipient, factory.generationHash);
                    utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingRecipient.address, signedSecretProofTransaction.hash)
                        .then(() => {
                        done();
                    }, (reason) => {
                        assert_1.fail(reason);
                    });
                    transactionHttp.announce(signedSecretProofTransaction);
                }, (reason) => {
                    assert_1.fail(reason);
                });
                transactionHttp.announce(signedSecretLockTransaction);
            });
            it('aggregate', (done) => {
                const secretSeed = crypto_1.randomBytes(20);
                const proof = format_1.Convert.uint8ToHex(secretSeed);
                const secret = CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(proof)).toString(CryptoJS.enc.Hex))).toString(CryptoJS.enc.Hex);
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Hash_160)
                    .secret(secret)
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const signedSecretLockTransaction = secretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                    const secretProofTransaction = factory.secretProof()
                        .hashType(model_1.HashType.Op_Hash_160)
                        .secret(secret)
                        .recipient(conf_spec_1.TestingRecipient.address)
                        .proof(proof)
                        .build();
                    const aggregateSecretProofTransaction = factory.aggregateComplete()
                        .innerTransactions([secretProofTransaction.toAggregate(conf_spec_1.TestingRecipient.publicAccount)])
                        .build();
                    const signedAggregateSecretProofTransaction = aggregateSecretProofTransaction.signWith(conf_spec_1.TestingRecipient, factory.generationHash);
                    utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingRecipient.address, signedAggregateSecretProofTransaction.hash)
                        .then(() => {
                        done();
                    }, (reason) => {
                        assert_1.fail(reason);
                    });
                    transactionHttp.announce(signedAggregateSecretProofTransaction);
                }, (reason) => {
                    assert_1.fail(reason);
                });
                transactionHttp.announce(signedSecretLockTransaction);
            });
        });
        describe('HashType: Op_Hash_256', () => {
            it('standalone', (done) => {
                const secretSeed = crypto_1.randomBytes(20);
                const proof = format_1.Convert.uint8ToHex(secretSeed);
                const secret = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(proof)).toString(CryptoJS.enc.Hex))).toString(CryptoJS.enc.Hex);
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Hash_256)
                    .secret(secret)
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const signedSecretLockTransaction = secretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                    const secretProofTransaction = factory.secretProof()
                        .hashType(model_1.HashType.Op_Hash_256)
                        .secret(secret)
                        .recipient(conf_spec_1.TestingRecipient.address)
                        .proof(proof)
                        .build();
                    const signedSecretProofTransaction = secretProofTransaction.signWith(conf_spec_1.TestingRecipient, factory.generationHash);
                    utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingRecipient.address, signedSecretProofTransaction.hash)
                        .then(() => {
                        done();
                    }, (reason) => {
                        assert_1.fail(reason);
                    });
                    transactionHttp.announce(signedSecretProofTransaction);
                }, (reason) => {
                    assert_1.fail(reason);
                });
                transactionHttp.announce(signedSecretLockTransaction);
            });
            it('aggregate', (done) => {
                const secretSeed = crypto_1.randomBytes(20);
                const proof = format_1.Convert.uint8ToHex(secretSeed);
                const secret = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(proof)).toString(CryptoJS.enc.Hex))).toString(CryptoJS.enc.Hex);
                const secretLockTransaction = factory.secretLock()
                    .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(10 * 1000000)))
                    .duration(model_1.UInt64.fromUint(100))
                    .hashType(model_1.HashType.Op_Hash_256)
                    .secret(secret)
                    .recipient(conf_spec_1.TestingRecipient.address)
                    .build();
                const signedSecretLockTransaction = secretLockTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                    const secretProofTransaction = factory.secretProof()
                        .hashType(model_1.HashType.Op_Hash_256)
                        .secret(secret)
                        .recipient(conf_spec_1.TestingRecipient.address)
                        .proof(proof)
                        .build();
                    const aggregateSecretProofTransaction = factory.aggregateComplete()
                        .innerTransactions([secretProofTransaction.toAggregate(conf_spec_1.TestingRecipient.publicAccount)])
                        .build();
                    const signedAggregateSecretProofTransaction = aggregateSecretProofTransaction.signWith(conf_spec_1.TestingRecipient, factory.generationHash);
                    utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingRecipient.address, signedAggregateSecretProofTransaction.hash)
                        .then(() => {
                        done();
                    }, (reason) => {
                        assert_1.fail(reason);
                    });
                    transactionHttp.announce(signedAggregateSecretProofTransaction);
                }, (reason) => {
                    assert_1.fail(reason);
                });
                transactionHttp.announce(signedSecretLockTransaction);
            });
        });
    });
    describe('announce', () => {
        describe('ChainConfigTransaction', () => {
            ((conf_spec_1.NemesisAccount.privateKey !== "0".repeat(64)) ? it : it.skip)('standalone', (done) => {
                conf_spec_1.GetNemesisBlockDataPromise().then(nemesisBlockInfo => {
                    const chainConfigTransaction = factory.chainConfig()
                        .applyHeightDelta(model_1.UInt64.fromUint(10))
                        .blockChainConfig(nemesisBlockInfo.config.blockChainConfig)
                        .supportedEntityVersions(nemesisBlockInfo.config.supportedEntityVersions)
                        .build();
                    const signedTransaction = chainConfigTransaction.signWith(conf_spec_1.NemesisAccount, factory.generationHash);
                    utils_1.validateTransactionConfirmed(listener, conf_spec_1.NemesisAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => assert_1.fail(reason));
                    transactionHttp.announce(signedTransaction);
                });
            });
        });
        describe('ChainUpgradeTransaction', () => {
            ((conf_spec_1.NemesisAccount.privateKey !== "0".repeat(64)) ? it : it.skip)('standalone', (done) => {
                const chainUpgradeTransaction = factory.chainUpgrade()
                    .upgradePeriod(model_1.UInt64.fromUint(100000))
                    .newCatapultVersion(model_1.UInt64.fromHex('0001000200030004'))
                    .build();
                const signedTransaction = chainUpgradeTransaction.signWith(conf_spec_1.NemesisAccount, factory.generationHash);
                utils_1.validateTransactionConfirmed(listener, conf_spec_1.NemesisAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => assert_1.fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
    });
    describe('getTransaction', () => {
        it('should return transaction info given transactionHash', (done) => {
            conf_spec_1.GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransaction(data.testTxHash)
                    .subscribe((transaction) => {
                    chai_1.expect(transaction.transactionInfo.hash).to.be.equal(data.testTxHash);
                    chai_1.expect(transaction.transactionInfo.id).to.be.equal(data.testTxId);
                    done();
                });
            });
        });
        it('should return transaction info given transactionId', (done) => {
            conf_spec_1.GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransaction(data.testTxId)
                    .subscribe((transaction) => {
                    chai_1.expect(transaction.transactionInfo.hash).to.be.equal(data.testTxHash);
                    chai_1.expect(transaction.transactionInfo.id).to.be.equal(data.testTxId);
                    done();
                });
            });
        });
    });
    describe('getTransactions', () => {
        it('should return transaction info given array of transactionHash', (done) => {
            conf_spec_1.GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactions([data.testTxHash])
                    .subscribe((transactions) => {
                    chai_1.expect(transactions[0].transactionInfo.hash).to.be.equal(data.testTxHash);
                    chai_1.expect(transactions[0].transactionInfo.id).to.be.equal(data.testTxId);
                    done();
                });
            });
        });
        it('should return transaction info given array of transactionId', (done) => {
            conf_spec_1.GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactions([data.testTxId])
                    .subscribe((transactions) => {
                    chai_1.expect(transactions[0].transactionInfo.hash).to.be.equal(data.testTxHash);
                    chai_1.expect(transactions[0].transactionInfo.id).to.be.equal(data.testTxId);
                    done();
                });
            });
        });
    });
    describe('getTransactionStatus', () => {
        it('should return transaction status given array transactionHash', (done) => {
            conf_spec_1.GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactionStatus(data.testTxHash)
                    .subscribe((transactionStatus) => {
                    chai_1.expect(transactionStatus.group).to.be.equal('confirmed');
                    chai_1.expect(transactionStatus.height.lower).to.be.greaterThan(0);
                    chai_1.expect(transactionStatus.height.higher).to.be.equal(0);
                    done();
                });
            });
        });
    });
    describe('getTransactionsStatuses', () => {
        it('should return transaction status given array of transactionHash', (done) => {
            conf_spec_1.GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactionsStatuses([data.testTxHash])
                    .subscribe((transactionStatuses) => {
                    chai_1.expect(transactionStatuses[0].group).to.be.equal('confirmed');
                    chai_1.expect(transactionStatuses[0].height.lower).to.be.greaterThan(0);
                    chai_1.expect(transactionStatuses[0].height.higher).to.be.equal(0);
                    done();
                });
            });
        });
    });
    describe('announce', () => {
        it('should return success when announce', (done) => {
            const payload = new model_1.SignedTransaction('', '0'.repeat(64), '', model_1.TransactionType.TRANSFER, factory.networkType);
            transactionHttp.announce(payload)
                .subscribe((transactionAnnounceResponse) => {
                chai_1.expect(transactionAnnounceResponse.message)
                    .to.be.equal('packet 9 was pushed to the network via /transaction');
                done();
            });
        });
    });
    describe('announceAggregateBonded', () => {
        it('should return success when announceAggregateBonded', (done) => {
            const payload = new model_1.SignedTransaction('', '0'.repeat(64), '', model_1.TransactionType.AGGREGATE_BONDED, factory.networkType);
            transactionHttp.announceAggregateBonded(payload)
                .subscribe((transactionAnnounceResponse) => {
                chai_1.expect(transactionAnnounceResponse.message)
                    .to.be.equal('packet 500 was pushed to the network via /transaction/partial');
                done();
            });
        });
        it('should return an error when a non aggregate transaction bonded is announced via announceAggregateBonded method', () => {
            const tx = factory.transfer()
                .recipient(conf_spec_1.TestingAccount.address)
                .message(model_1.PlainMessage.create('Hi'))
                .build();
            const aggTx = factory.aggregateComplete()
                .innerTransactions([
                tx.toAggregate(conf_spec_1.TestingAccount.publicAccount),
            ])
                .build();
            const signedTx = conf_spec_1.TestingAccount.sign(aggTx, factory.generationHash);
            return transactionHttp.announceAggregateBonded(signedTx).subscribe(resp => {
                throw new Error('Shouldn\'t be called');
            }, error => {
                chai_1.expect(error).to.be.equal('Only Transaction Type 0x4241 is allowed for announce aggregate bonded');
            });
        });
    });
    describe('announceAggregateBondedCosignature', () => {
        it('should return success when announceAggregateBondedCosignature', (done) => {
            const payload = new model_1.CosignatureSignedTransaction('', '', '');
            transactionHttp.announceAggregateBondedCosignature(payload)
                .subscribe((transactionAnnounceResponse) => {
                chai_1.expect(transactionAnnounceResponse.message)
                    .to.be.equal('packet 501 was pushed to the network via /transaction/cosignature');
                done();
            });
        });
    });
    describe('announceSync', () => {
        it('should return insufficient balance error', (done) => {
            const signerAccount = conf_spec_1.TestingAccount;
            const tx = factory.transfer()
                .recipient(conf_spec_1.TestingRecipient.address)
                .mosaics([new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(1000000 * 1000000))])
                .build();
            const signedTx = signerAccount.sign(tx, factory.generationHash);
            const trnsHttp = new infrastructure_1.TransactionHttp(conf_spec_1.APIUrl);
            trnsHttp
                .announceSync(signedTx)
                .subscribe((shouldNotBeCalled) => {
                throw new Error('should not be called');
            }, (err) => {
                chai_1.expect(err).to.satisfy((err) => {
                    return (err === 'non sync server' || err.status === 'Failure_Core_Insufficient_Balance');
                });
                done();
            });
        });
    });
    describe('getTransactionEffectiveFee', () => {
        it('should return effective paid fee given transactionHash', (done) => {
            conf_spec_1.GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactionEffectiveFee(data.testTxHash)
                    .subscribe((effectiveFee) => {
                    chai_1.expect(effectiveFee).to.not.be.undefined;
                    chai_1.expect(effectiveFee).to.be.equal(0);
                    done();
                });
            });
        });
    });
    describe('announceSync', () => {
        it('should return insufficient balance error', (done) => {
            const aggregateTransaction = factory.aggregateBonded()
                .build();
            const signedTransaction = conf_spec_1.TestingAccount.sign(aggregateTransaction, factory.generationHash);
            const lockFundsTransaction = factory.lockFunds()
                .mosaic(new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(0)))
                .duration(model_1.UInt64.fromUint(10000))
                .signedTransaction(signedTransaction)
                .build();
            const signedLockFundsTransactions = lockFundsTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
            utils_1.validateTransactionConfirmed(listener, conf_spec_1.TestingAccount.address, signedLockFundsTransactions.hash)
                .then(() => {
                assert_1.fail('should not be called');
            }).catch((reason) => {
                chai_1.expect(reason.status).to.be.equal('Failure_LockHash_Invalid_Mosaic_Amount');
                done();
            });
            transactionHttp.announce(signedLockFundsTransactions);
        });
    });
});
//# sourceMappingURL=TransactionHttp.spec.js.map