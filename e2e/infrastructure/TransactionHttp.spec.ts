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
import { assert, expect } from 'chai';
import * as CryptoJS from 'crypto-js';
import { keccak_256, sha3_256 } from 'js-sha3';
import { Crypto } from '../../src/core/crypto';
import { Convert as convert } from '../../src/core/format';
import {
    APIUrl, ConfNetworkMosaic,
    TestingAccount, TestingRecipient, MultisigAccount, CosignatoryAccount, Cosignatory2Account, Cosignatory3Account, GetNemesisBlockDataPromise, ConfTestingMosaicId, ConfAccountHttp, ConfTransactionHttp, ConfMosaicHttp, Customer1Account, ConfNetworkMosaicDivisibility, MultilevelMultisigAccount, Cosignatory4Account, NemesisAccount, ConfTestingNamespaceId, Configuration
} from '../conf/conf.spec';
import { SignedTransaction, CosignatureTransaction, TransactionBuilderFactory, AccountRestrictionModification, MosaicId, Mosaic, UInt64, PlainMessage, CosignatureSignedTransaction, AggregateTransaction, MosaicNonce, MosaicProperties, MetadataModification, MetadataModificationType, AliasActionType, MosaicSupplyType, RestrictionModificationType, RestrictionType, TransactionType, HashType, LinkAction } from '../../src/model/model';
import { fail } from 'assert';
import { randomBytes } from 'crypto';
import { validateTransactionConfirmed, validatePartialTransactionNotPartialAnyMore, validatePartialTransactionAnnouncedCorrectly } from '../utils';
import { TransactionHttp, AccountHttp, MosaicHttp, Listener } from '../../src/infrastructure/infrastructure';
import { TransactionMapping } from '../../src/core/utils/utility';
import { ExchangeOffer } from '../../src/model/transaction/ExchangeOffer';
import { ExchangeOfferType } from '../../src/model/transaction/ExchangeOfferType';
import { AddExchangeOffer } from '../../src/model/transaction/AddExchangeOffer';
import { RemoveExchangeOffer } from '../../src/model/transaction/RemoveExchangeOffer';


let transactionHttp: TransactionHttp;
let accountHttp: AccountHttp;
let mosaicHttp: MosaicHttp;
let namespaceName: string;
let mosaicId: MosaicId;
let listener: Listener;
let factory: TransactionBuilderFactory;

before(() => {
    transactionHttp = ConfTransactionHttp;
    accountHttp = ConfAccountHttp;
    mosaicHttp = ConfMosaicHttp;
    listener = new Listener(APIUrl);

    return listener.open().then(() => {
        return Configuration.getTransactionBuilderFactory().then(f => {
            factory = f;
        })
    });
});

after(() => {
    listener.close();
})

describe('TransactionHttp', () => {
    describe('announce', () => {
        describe('TransferTransaction', () => {
            it('standalone', (done) => {
                const transferTransaction = factory.transfer()
                    .recipient(TestingRecipient.address)
                    .mosaics([new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))])
                    .message(PlainMessage.create('test-message'))
                    .build();

                const signedTransaction = transferTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const transferTransaction = factory.transfer()
                    .recipient(TestingRecipient.address)
                    .mosaics([new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))])
                    .message(PlainMessage.create('test-message'))
                    .build();

                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([transferTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('Multisig', () => {
            it('should send transfer tx as aggregate bonded', (done) => {
                const transferTransaction = factory.transfer()
                    .recipient(TestingRecipient.address)
                    .mosaics([new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))])
                    .message(PlainMessage.create('test-message from multisig account as aggregate bonded'))
                    .build();

                const aggregateBondedTransaction = factory.aggregateBonded()
                    .innerTransactions([transferTransaction.toAggregate(MultisigAccount.publicAccount)])
                    .build();

                const signedAggregateBondedTransaction = aggregateBondedTransaction.signWith(CosignatoryAccount, factory.generationHash);
                const hashLockTransaction = factory.hashLock()
                    .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10000000)))
                    .duration(UInt64.fromUint(1000))
                    .signedTransaction(signedAggregateBondedTransaction)
                    .build();

                const signedHashLockTransaction = hashLockTransaction.signWith(CosignatoryAccount, factory.generationHash);
                validateTransactionConfirmed(listener, CosignatoryAccount.address, signedHashLockTransaction.hash)
                    .then(() => {
                        validatePartialTransactionAnnouncedCorrectly(listener, MultisigAccount.address, signedAggregateBondedTransaction.hash, (addedAggregateBondedTransaction) => {
                            const cosignatureTransaction = CosignatureTransaction.create(addedAggregateBondedTransaction);
                            const signedCosignatureTransaction = cosignatureTransaction.signWith(Cosignatory2Account);
                            validatePartialTransactionNotPartialAnyMore(listener, MultisigAccount.address, signedAggregateBondedTransaction.hash, () => {
                                done();
                            });
                            transactionHttp.announceAggregateBondedCosignature(signedCosignatureTransaction);
                        });
                        transactionHttp.announceAggregateBonded(signedAggregateBondedTransaction);
                    }).catch((reason) => fail(reason));
                transactionHttp.announce(signedHashLockTransaction);
            });

            it('should send transfer tx as aggregate complete', (done) => {
                const transferTransaction = factory.transfer()
                    .recipient(TestingRecipient.address)
                    .mosaics([new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))])
                    .message(PlainMessage.create('test-message from multisig account as aggregate complete'))
                    .build();

                const aggregateCompleteTransaction = factory.aggregateComplete()
                    .innerTransactions([transferTransaction.toAggregate(MultisigAccount.publicAccount)])
                    .build();

                const signedAggregateCompleteTransaction = CosignatoryAccount.signTransactionWithCosignatories(aggregateCompleteTransaction, [Cosignatory2Account], factory.generationHash);
                validateTransactionConfirmed(listener, CosignatoryAccount.address, signedAggregateCompleteTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedAggregateCompleteTransaction);
            })
        });

        describe('Multilevel Multisig', () => {
            it('should send transfer tx as aggregate bonded', (done) => {
                const transferTransaction = factory.transfer()
                    .recipient(TestingRecipient.address)
                    .mosaics([new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))])
                    .message(PlainMessage.create('test-message from multilevel multisig account as aggregate bonded'))
                    .build();

                const aggregateBondedTransaction = factory.aggregateBonded()
                    .innerTransactions([transferTransaction.toAggregate(MultilevelMultisigAccount.publicAccount)])
                    .build();

                const signedAggregateBondedTransaction = aggregateBondedTransaction.signWith(Cosignatory4Account, factory.generationHash);
                const hashLockTransaction = factory.hashLock()
                    .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10000000)))
                    .duration(UInt64.fromUint(1000))
                    .signedTransaction(signedAggregateBondedTransaction)
                    .build();

                const signedHashLockTransaction = hashLockTransaction.signWith(Cosignatory4Account, factory.generationHash);
                validateTransactionConfirmed(listener, Cosignatory4Account.address, signedHashLockTransaction.hash)
                    .then(() => {
                        validatePartialTransactionAnnouncedCorrectly(listener, MultilevelMultisigAccount.address, signedAggregateBondedTransaction.hash, (addedAggregateBondedTransaction) => {
                            const cosignatureTransaction = CosignatureTransaction.create(addedAggregateBondedTransaction);
                            const signedCosignatureTransaction1 = cosignatureTransaction.signWith(Cosignatory2Account);
                            const signedCosignatureTransaction2 = cosignatureTransaction.signWith(Cosignatory3Account);
                            validatePartialTransactionNotPartialAnyMore(listener, MultilevelMultisigAccount.address, signedAggregateBondedTransaction.hash, () => {
                                done();
                            });
                            transactionHttp.announceAggregateBondedCosignature(signedCosignatureTransaction1);
                            transactionHttp.announceAggregateBondedCosignature(signedCosignatureTransaction2);
                        });
                        transactionHttp.announceAggregateBonded(signedAggregateBondedTransaction);
                    }).catch((reason) => fail(reason));
                transactionHttp.announce(signedHashLockTransaction);
            });

            it('should send transfer tx as aggregate complete signed at once', (done) => {
                const transferTransaction = factory.transfer()
                    .recipient(TestingRecipient.address)
                    .mosaics([new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))])
                    .message(PlainMessage.create('test-message from multilevel multisig account as aggregate complete'))
                    .build();

                const aggregateCompleteTransaction = factory.aggregateComplete()
                    .innerTransactions([transferTransaction.toAggregate(MultilevelMultisigAccount.publicAccount)])
                    .build();

                const signedAggregateCompleteTransaction = Cosignatory4Account.signTransactionWithCosignatories(aggregateCompleteTransaction, [Cosignatory2Account, Cosignatory3Account], factory.generationHash);
                validateTransactionConfirmed(listener, Cosignatory4Account.address, signedAggregateCompleteTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedAggregateCompleteTransaction);
            })

            it('should send transfer tx as aggregate complete not signed at once (offline)', (done) => {
                const transferTransaction = factory.transfer()
                    .recipient(TestingRecipient.address)
                    .mosaics([new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))])
                    .message(PlainMessage.create('test-message from multilevel multisig account as aggregate complete'))
                    .build();
                // initiator, delivers this to other cosigners
                const aggregateCompleteTransaction = factory.aggregateComplete()
                    .innerTransactions([transferTransaction.toAggregate(MultilevelMultisigAccount.publicAccount)])
                    .build();

                const signedAggregateCompleteTransaction = aggregateCompleteTransaction.signWith(Cosignatory4Account, factory.generationHash);

                // second cosigner, cosign and send back to the initiator
                const cosignedTwo = CosignatureTransaction.signTransactionPayload(Cosignatory2Account, signedAggregateCompleteTransaction.payload, factory.generationHash);

                // third cosigner, cosign and send back to the initiator
                const cosignedThree = CosignatureTransaction.signTransactionPayload(Cosignatory3Account, signedAggregateCompleteTransaction.payload, factory.generationHash);

                // initiator combines all the signatures and the transaction into single signed transaction and announces
                const cosignatureSignedTransactions = [
                    new CosignatureSignedTransaction(cosignedTwo.parentHash, cosignedTwo.signature, cosignedTwo.signer),
                    new CosignatureSignedTransaction(cosignedThree.parentHash, cosignedThree.signature, cosignedThree.signer)
                ];
                const deserializedAggregateCompleteTransaction = TransactionMapping.createFromPayload(signedAggregateCompleteTransaction.payload) as AggregateTransaction;
                const signedDeserializedAggregateCompleteTransaction = deserializedAggregateCompleteTransaction.signTransactionGivenSignatures(Cosignatory4Account, cosignatureSignedTransactions, factory.generationHash);

                { // check that all the signatures are the same as if used the signTransactionWithCosignatories only
                    const differentlySignedAggregateCompleteTransaction = Cosignatory4Account.signTransactionWithCosignatories(aggregateCompleteTransaction, [Cosignatory2Account, Cosignatory3Account], factory.generationHash);
                    expect(differentlySignedAggregateCompleteTransaction.payload).to.be.equal(signedDeserializedAggregateCompleteTransaction.payload);
                    expect(differentlySignedAggregateCompleteTransaction.hash).to.be.equal(signedDeserializedAggregateCompleteTransaction.hash);
                }

                validateTransactionConfirmed(listener, Cosignatory4Account.address, signedDeserializedAggregateCompleteTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedDeserializedAggregateCompleteTransaction);
            })
        });

        describe('AccountLinkTransaction', () => {
            const linkAccountPubKey = 'F'.repeat(64);
            it('standalone', (done) => {
                const accountLinkTransaction = factory.accountLink()
                    .linkAction(LinkAction.Link)
                    .remoteAccountKey(linkAccountPubKey)
                    .build();
                const signedTransaction = accountLinkTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const accountLinkTransaction = factory.accountLink()
                    .linkAction(LinkAction.Unlink)
                    .remoteAccountKey(linkAccountPubKey)
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([accountLinkTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('RegisterNamespaceTransaction', () => {
            it('standalone', (done) => {
                namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
                const registerNamespaceTransaction = factory.registerRootNamespace()
                    .namespaceName(namespaceName)
                    .duration(UInt64.fromUint(1000))
                    .build();

                const signedTransaction = registerNamespaceTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const registerNamespaceTransaction = factory.registerRootNamespace()
                    .namespaceName('root-test-namespace-' + Math.floor(Math.random() * 10000))
                    .duration(UInt64.fromUint(1000))
                    .build();

                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([registerNamespaceTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('MosaicDefinitionTransaction', () => {
            it('standalone', (done) => {
                const nonce = MosaicNonce.createRandom();
                const mosaicId = MosaicId.createFromNonce(nonce, TestingAccount.publicAccount);
                const mosaicDefinitionTransaction = factory.mosaicDefinition()
                    .mosaicNonce(nonce)
                    .mosaicId(mosaicId)
                    .mosaicProperties(MosaicProperties.create({
                        supplyMutable: true,
                        transferable: true,
                        divisibility: 3,
                        duration: UInt64.fromUint(1000),
                    }))
                    .build();

                const signedTransaction = mosaicDefinitionTransaction.signWith(TestingAccount, factory.generationHash);
                console.log(mosaicId.toHex());
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash).then(() => {
                    const modifyMetadataTransaction = factory.mosaicMetadata()
                        .mosaicId(mosaicId)
                        .modifications([new MetadataModification(MetadataModificationType.ADD, 'key2', 'some other value')])
                        .build();

                    const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => fail(reason));
                    transactionHttp.announce(signedTransaction);
                }).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const nonce = MosaicNonce.createRandom();
                mosaicId = MosaicId.createFromNonce(nonce, TestingAccount.publicAccount);
                const mosaicDefinitionTransaction = factory.mosaicDefinition()
                    .mosaicNonce(nonce)
                    .mosaicId(mosaicId)
                    .mosaicProperties(MosaicProperties.create({
                        supplyMutable: true,
                        transferable: true,
                        divisibility: 3,
                        duration: UInt64.fromUint(1000),
                    }))
                    .build();

                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([mosaicDefinitionTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('MosaicDefinitionTransaction with zero nonce', () => {
            it('standalone', (done) => {
                const nonce = MosaicNonce.createFromHex('00000000');
                const mosaicId = MosaicId.createFromNonce(nonce, TestingAccount.publicAccount);
                const mosaicDefinitionTransaction = factory.mosaicDefinition()
                    .mosaicNonce(nonce)
                    .mosaicId(mosaicId)
                    .mosaicProperties(MosaicProperties.create({
                        supplyMutable: true,
                        transferable: true,
                        divisibility: 3,
                        duration: UInt64.fromUint(60000),
                    }))
                    .build();

                const signedTransaction = mosaicDefinitionTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const nonce = MosaicNonce.createFromHex('00000000');
                const mosaicId = MosaicId.createFromNonce(nonce, TestingAccount.publicAccount);
                const mosaicDefinitionTransaction = factory.mosaicDefinition()
                    .mosaicNonce(nonce)
                    .mosaicId(mosaicId)
                    .mosaicProperties(MosaicProperties.create({
                        supplyMutable: true,
                        transferable: true,
                        divisibility: 3,
                        duration: UInt64.fromUint(1000),
                    }))
                    .build();

                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([mosaicDefinitionTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('AccountAndMosaicAliasTransactions', () => {
            it('should create an alias to an account', (done) => {
                const addressAliasTransaction = factory.addressAlias()
                    .actionType(AliasActionType.Link)
                    .namespaceId(ConfTestingNamespaceId)
                    .address(TestingAccount.address)
                    .build();

                const signedTransaction = addressAliasTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('should remove the alias from an account', (done) => {
                const addressAliasTransaction = factory.addressAlias()
                    .actionType(AliasActionType.Unlink)
                    .namespaceId(ConfTestingNamespaceId)
                    .address(TestingAccount.address)
                    .build();

                const signedTransaction = addressAliasTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('should create an alias to a mosaic', (done) => {
                const mosaicAliasTransaction = factory.mosaicAlias()
                    .actionType(AliasActionType.Link)
                    .namespaceId(ConfTestingNamespaceId)
                    .mosaicId(ConfTestingMosaicId)
                    .build();

                console.log(mosaicAliasTransaction);
                const signedTransaction = mosaicAliasTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('should remove an alias from a mosaic', (done) => {
                const mosaicAliasTransaction = factory.mosaicAlias()
                    .actionType(AliasActionType.Unlink)
                    .namespaceId(ConfTestingNamespaceId)
                    .mosaicId(ConfTestingMosaicId)
                    .build();

                const signedTransaction = mosaicAliasTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('MosaicSupplyChangeTransaction', () => {
            it('standalone', (done) => {
                const mosaicSupplyChangeTransaction = factory.mosaicSupplyChange()
                    .mosaicId(mosaicId) // depends on mosaicId created randomly in the previous test
                    .direction(MosaicSupplyType.Increase)
                    .delta(UInt64.fromUint(10))
                    .build();

                const signedTransaction = mosaicSupplyChangeTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const mosaicSupplyChangeTransaction = factory.mosaicSupplyChange()
                    .mosaicId(mosaicId) // depends on mosaicId created randomly in the previous test
                    .direction(MosaicSupplyType.Increase)
                    .delta(UInt64.fromUint(10))
                    .build();

                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([mosaicSupplyChangeTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('AccountRestrictionTransaction - Address', () => {
            it('standalone', (done) => {
                const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
                    RestrictionModificationType.Add,
                    Customer1Account.address,
                );
                const addressModification = factory.accountRestrictionAddress()
                    .restrictionType(RestrictionType.BlockAddress)
                    .modifications([addressRestrictionFilter])
                    .build();

                const signedTransaction = addressModification.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
                    RestrictionModificationType.Remove,
                    Customer1Account.address,
                );
                const addressModification = factory.accountRestrictionAddress()
                    .restrictionType(RestrictionType.BlockAddress)
                    .modifications([addressRestrictionFilter])
                    .build();

                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([addressModification.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('AccountRestrictionTransaction - Mosaic', () => {
            it('standalone', (done) => {
                const mosaicRestrictionFilter = AccountRestrictionModification.createForMosaic(
                    RestrictionModificationType.Add,
                    mosaicId,
                );
                const addressModification = factory.accountRestrictionMosaic()
                    .restrictionType(RestrictionType.BlockMosaic)
                    .modifications([mosaicRestrictionFilter])
                    .build();

                const signedTransaction = addressModification.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const mosaicRestrictionFilter = AccountRestrictionModification.createForMosaic(
                    RestrictionModificationType.Remove,
                    mosaicId,
                );
                const addressModification = factory.accountRestrictionMosaic()
                    .restrictionType(RestrictionType.BlockMosaic)
                    .modifications([mosaicRestrictionFilter])
                    .build();

                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([addressModification.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('AccountRestrictionTransaction - Operation', () => {
            it('standalone', (done) => {
                const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
                    RestrictionModificationType.Add,
                    TransactionType.LINK_ACCOUNT,
                );
                const addressModification = factory.accountRestrictionOperation()
                    .restrictionType(RestrictionType.BlockTransaction)
                    .modifications([operationRestrictionFilter])
                    .build();

                const signedTransaction = addressModification.signWith(Cosignatory2Account, factory.generationHash);

                validateTransactionConfirmed(listener, Cosignatory2Account.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
                    RestrictionModificationType.Remove,
                    TransactionType.LINK_ACCOUNT,
                );
                const addressModification = factory.accountRestrictionOperation()
                    .restrictionType(RestrictionType.BlockTransaction)
                    .modifications([operationRestrictionFilter])
                    .build();

                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([addressModification.toAggregate(Cosignatory2Account.publicAccount)])
                    .build();

                const signedTransaction = aggregateTransaction.signWith(Cosignatory2Account, factory.generationHash);
                validateTransactionConfirmed(listener, Cosignatory2Account.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
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
                    new Mosaic(new NamespaceId('prx.xpx'), UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY))),
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

                const signedTransaction = TestingAccount.sign(aggregateTransaction, factory.generationHash);
                const lockFundsTransaction = factory.lockFunds()
                    .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * Math.pow(10, ConfNetworkMosaicDivisibility))))
                    .duration(UInt64.fromUint(10000))
                    .signedTransaction(signedTransaction)
                    .build();

                const signedLockFundsTransaction = lockFundsTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedLockFundsTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedLockFundsTransaction);
            });

            it('aggregate', (done) => {
                const aggregateTransaction = factory.aggregateBonded()
                    .build();
                const signedTransaction = TestingAccount.sign(aggregateTransaction, factory.generationHash);
                const lockFundsTransaction = factory.lockFunds()
                    .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * Math.pow(10, ConfNetworkMosaicDivisibility))))
                    .duration(UInt64.fromUint(10))
                    .signedTransaction(signedTransaction)
                    .build();

                const aggregateLockFundsTransaction = factory.aggregateComplete()
                    .innerTransactions([lockFundsTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedAggregateLockFundsTransaction = aggregateLockFundsTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedAggregateLockFundsTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedAggregateLockFundsTransaction);
            });
        });

        describe('Aggregate Complete Transaction', () => {
            it('should announce aggregated complete transaction', (done) => {
                const transaction = factory.transfer()
                    .recipient(TestingRecipient.address)
                    .message(PlainMessage.create('Hi'))
                    .build();

                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([
                        transaction.toAggregate(TestingAccount.publicAccount),
                    ])
                    .build();
                const signedTransaction = TestingAccount.sign(aggregateTransaction, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('SecretLockTransaction', () => {
            describe('HashType: Op_Sha3_256', () => {
                it('standalone', (done) => {
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Sha3_256)
                        .secret(sha3_256.create().update(randomBytes(20)).hex())
                        .recipient(TestingRecipient.address)
                        .build();

                    const signedTransaction = secretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => fail(reason));
                    transactionHttp.announce(signedTransaction);
                });

                it('aggregate', (done) => {
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Sha3_256)
                        .secret(sha3_256.create().update(randomBytes(20)).hex())
                        .recipient(TestingRecipient.address)
                        .build();

                    const aggregateSecretLockTransaction = factory.aggregateComplete()
                        .innerTransactions([secretLockTransaction.toAggregate(TestingAccount.publicAccount)])
                        .build();
                    const signedTransaction = aggregateSecretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => fail(reason));
                    transactionHttp.announce(signedTransaction);
                });
            });
            describe('HashType: Keccak_256', () => {
                it('standalone', (done) => {
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Keccak_256)
                        .secret(sha3_256.create().update(randomBytes(20)).hex())
                        .recipient(TestingRecipient.address)
                        .build();

                    const signedTransaction = secretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => fail(reason));
                    transactionHttp.announce(signedTransaction);
                });

                it('aggregate', (done) => {
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Keccak_256)
                        .secret(sha3_256.create().update(randomBytes(20)).hex())
                        .recipient(TestingRecipient.address)
                        .build();

                    const aggregateSecretLockTransaction = factory.aggregateComplete()
                        .innerTransactions([secretLockTransaction.toAggregate(TestingAccount.publicAccount)])
                        .build();

                    const signedTransaction = aggregateSecretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => fail(reason));
                    transactionHttp.announce(signedTransaction);
                });
            });

            describe('HashType: Op_Hash_160', () => {
                it('standalone', (done) => {
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Hash_160)
                        .secret(sha3_256.create().update(randomBytes(20)).hex().substr(0, 40))
                        .recipient(TestingRecipient.address)
                        .build();

                    const signedTransaction = secretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => fail(reason));
                    transactionHttp.announce(signedTransaction);
                });

                it('aggregate', (done) => {
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Hash_160)
                        .secret(sha3_256.create().update(randomBytes(20)).hex().substr(0, 40))
                        .recipient(TestingRecipient.address)
                        .build();

                    const aggregateSecretLockTransaction = factory.aggregateComplete()
                        .innerTransactions([secretLockTransaction.toAggregate(TestingAccount.publicAccount)])
                        .build();

                    const signedTransaction = aggregateSecretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => fail(reason));
                    transactionHttp.announce(signedTransaction);
                });
            });

            describe('HashType: Op_Hash_256', () => {
                it('standalone', (done) => {
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Hash_256)
                        .secret(sha3_256.create().update(randomBytes(20)).hex())
                        .recipient(TestingRecipient.address)
                        .build();

                    const signedTransaction = secretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => fail(reason));
                    transactionHttp.announce(signedTransaction);
                });

                it('aggregate', (done) => {
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Hash_256)
                        .secret(sha3_256.create().update(randomBytes(20)).hex())
                        .recipient(TestingRecipient.address)
                        .build();

                    const aggregateSecretLockTransaction = factory.aggregateComplete()
                        .innerTransactions([secretLockTransaction.toAggregate(TestingAccount.publicAccount)])
                        .build();

                    const signedTransaction = aggregateSecretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => fail(reason));
                    transactionHttp.announce(signedTransaction);
                });
            });
        });

        describe('SecretProofTransaction', () => {
            describe('HashType: Op_Sha3_256', () => {
                it('standalone', (done) => {
                    const secretSeed = randomBytes(20);
                    const secret = sha3_256.create().update(secretSeed).hex();
                    const proof = convert.uint8ToHex(secretSeed);
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Sha3_256)
                        .secret(secret)
                        .recipient(TestingRecipient.address)
                        .build();

                    const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                        .then(() => {
                            const secretProofTransaction = factory.secretProof()
                                .hashType(HashType.Op_Sha3_256)
                                .secret(secret)
                                .recipient(TestingRecipient.address)
                                .proof(proof)
                                .build();

                            const signedSecretProofTransaction = secretProofTransaction.signWith(TestingRecipient, factory.generationHash);
                            validateTransactionConfirmed(listener, TestingRecipient.address, signedSecretProofTransaction.hash)
                                .then(() => {
                                    done();
                                }, (reason) => {
                                    fail(reason);
                                });
                            transactionHttp.announce(signedSecretProofTransaction);
                        }, (reason) => {
                            fail(reason);
                        });
                    transactionHttp.announce(signedSecretLockTransaction);
                });

                it('aggregate', (done) => {
                    const secretSeed = randomBytes(20);
                    const secret = sha3_256.create().update(secretSeed).hex();
                    const proof = convert.uint8ToHex(secretSeed);
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Sha3_256)
                        .secret(secret)
                        .recipient(TestingRecipient.address)
                        .build();

                    const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                        .then(() => {
                            const secretProofTransaction = factory.secretProof()
                                .hashType(HashType.Op_Sha3_256)
                                .secret(secret)
                                .recipient(TestingRecipient.address)
                                .proof(proof)
                                .build();

                            const aggregateSecretProofTransaction = factory.aggregateComplete()
                                .innerTransactions([secretProofTransaction.toAggregate(TestingRecipient.publicAccount)])
                                .build();

                            const signedAggregateSecretProofTransaction = aggregateSecretProofTransaction.signWith(TestingRecipient, factory.generationHash);
                            validateTransactionConfirmed(listener, TestingRecipient.address, signedAggregateSecretProofTransaction.hash)
                                .then(() => {
                                    done();
                                }, (reason) => {
                                    fail(reason);
                                });
                            transactionHttp.announce(signedAggregateSecretProofTransaction);
                        }, (reason) => {
                            fail(reason);
                        })
                    transactionHttp.announce(signedSecretLockTransaction);
                });
            });
            describe('HashType: Op_Keccak_256', () => {
                it('standalone', (done) => {
                    const secretSeed = randomBytes(20);
                    const secret = keccak_256.create().update(secretSeed).hex();
                    const proof = convert.uint8ToHex(secretSeed);
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Keccak_256)
                        .secret(secret)
                        .recipient(TestingRecipient.address)
                        .build();

                    const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                        .then(() => {
                            const secretProofTransaction = factory.secretProof()
                                .hashType(HashType.Op_Keccak_256)
                                .secret(secret)
                                .recipient(TestingRecipient.address)
                                .proof(proof)
                                .build();

                            const signedSecretProofTransaction = secretProofTransaction.signWith(TestingRecipient, factory.generationHash);
                            validateTransactionConfirmed(listener, TestingRecipient.address, signedSecretProofTransaction.hash)
                                .then(() => {
                                    done();
                                }, (reason) => {
                                    fail(reason);
                                });
                            transactionHttp.announce(signedSecretProofTransaction);
                        }, (reason) => {
                            fail(reason);
                        });
                    transactionHttp.announce(signedSecretLockTransaction);
                });

                it('aggregate', (done) => {
                    const secretSeed = randomBytes(20);
                    const secret = keccak_256.create().update(secretSeed).hex();
                    const proof = convert.uint8ToHex(secretSeed);
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Keccak_256)
                        .secret(secret)
                        .recipient(TestingRecipient.address)
                        .build();

                    const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                        .then(() => {
                            const secretProofTransaction = factory.secretProof()
                                .hashType(HashType.Op_Keccak_256)
                                .secret(secret)
                                .recipient(TestingRecipient.address)
                                .proof(proof)
                                .build();
                            const aggregateSecretProofTransaction = factory.aggregateComplete()
                                .innerTransactions([secretProofTransaction.toAggregate(TestingRecipient.publicAccount)])
                                .build();

                            const signedAggregateSecretProofTransaction = aggregateSecretProofTransaction.signWith(TestingRecipient, factory.generationHash);
                            validateTransactionConfirmed(listener, TestingRecipient.address, signedAggregateSecretProofTransaction.hash)
                                .then(() => {
                                    done();
                                }, (reason) => {
                                    fail(reason);
                                });
                            transactionHttp.announce(signedAggregateSecretProofTransaction);
                        }, (reason) => {
                            fail(reason);
                        })
                    transactionHttp.announce(signedSecretLockTransaction);
                });
            });

            describe('HashType: Op_Hash_160', () => {
                it('standalone', (done) => {
                    const secretSeed = randomBytes(20);
                    const proof = convert.uint8ToHex(secretSeed);
                    const secret = CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(proof)).toString(CryptoJS.enc.Hex))).toString(CryptoJS.enc.Hex);
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Hash_160)
                        .secret(secret)
                        .recipient(TestingRecipient.address)
                        .build();

                    const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                        .then(() => {
                            const secretProofTransaction = factory.secretProof()
                                .hashType(HashType.Op_Hash_160)
                                .secret(secret)
                                .recipient(TestingRecipient.address)
                                .proof(proof)
                                .build();

                            const signedSecretProofTransaction = secretProofTransaction.signWith(TestingRecipient, factory.generationHash);
                            validateTransactionConfirmed(listener, TestingRecipient.address, signedSecretProofTransaction.hash)
                                .then(() => {
                                    done();
                                }, (reason) => {
                                    fail(reason);
                                });
                            transactionHttp.announce(signedSecretProofTransaction);
                        }, (reason) => {
                            fail(reason);
                        });
                    transactionHttp.announce(signedSecretLockTransaction);
                });

                it('aggregate', (done) => {
                    const secretSeed = randomBytes(20);
                    const proof = convert.uint8ToHex(secretSeed);
                    const secret = CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(proof)).toString(CryptoJS.enc.Hex))).toString(CryptoJS.enc.Hex);
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Hash_160)
                        .secret(secret)
                        .recipient(TestingRecipient.address)
                        .build();

                    const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                        .then(() => {
                            const secretProofTransaction = factory.secretProof()
                                .hashType(HashType.Op_Hash_160)
                                .secret(secret)
                                .recipient(TestingRecipient.address)
                                .proof(proof)
                                .build();

                            const aggregateSecretProofTransaction = factory.aggregateComplete()
                                .innerTransactions([secretProofTransaction.toAggregate(TestingRecipient.publicAccount)])
                                .build();

                            const signedAggregateSecretProofTransaction = aggregateSecretProofTransaction.signWith(TestingRecipient, factory.generationHash);
                            validateTransactionConfirmed(listener, TestingRecipient.address, signedAggregateSecretProofTransaction.hash)
                                .then(() => {
                                    done();
                                }, (reason) => {
                                    fail(reason);
                                });
                            transactionHttp.announce(signedAggregateSecretProofTransaction);
                        }, (reason) => {
                            fail(reason);
                        })
                    transactionHttp.announce(signedSecretLockTransaction);
                });
            });

            describe('HashType: Op_Hash_256', () => {
                it('standalone', (done) => {
                    const secretSeed = randomBytes(20);
                    const proof = convert.uint8ToHex(secretSeed);
                    const secret = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(proof)).toString(CryptoJS.enc.Hex))).toString(CryptoJS.enc.Hex);
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Hash_256)
                        .secret(secret)
                        .recipient(TestingRecipient.address)
                        .build();

                    const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                        .then(() => {
                            const secretProofTransaction = factory.secretProof()
                                .hashType(HashType.Op_Hash_256)
                                .secret(secret)
                                .recipient(TestingRecipient.address)
                                .proof(proof)
                                .build();

                            const signedSecretProofTransaction = secretProofTransaction.signWith(TestingRecipient, factory.generationHash);
                            validateTransactionConfirmed(listener, TestingRecipient.address, signedSecretProofTransaction.hash)
                                .then(() => {
                                    done();
                                }, (reason) => {
                                    fail(reason);
                                });
                            transactionHttp.announce(signedSecretProofTransaction);
                        }, (reason) => {
                            fail(reason);
                        });
                    transactionHttp.announce(signedSecretLockTransaction);
                });

                it('aggregate', (done) => {
                    const secretSeed = randomBytes(20);
                    const proof = convert.uint8ToHex(secretSeed);
                    const secret = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(proof)).toString(CryptoJS.enc.Hex))).toString(CryptoJS.enc.Hex);
                    const secretLockTransaction = factory.secretLock()
                        .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)))
                        .duration(UInt64.fromUint(100))
                        .hashType(HashType.Op_Hash_256)
                        .secret(secret)
                        .recipient(TestingRecipient.address)
                        .build();

                    const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                        .then(() => {
                            const secretProofTransaction = factory.secretProof()
                                .hashType(HashType.Op_Hash_256)
                                .secret(secret)
                                .recipient(TestingRecipient.address)
                                .proof(proof)
                                .build();

                            const aggregateSecretProofTransaction = factory.aggregateComplete()
                                .innerTransactions([secretProofTransaction.toAggregate(TestingRecipient.publicAccount)])
                                .build();

                            const signedAggregateSecretProofTransaction = aggregateSecretProofTransaction.signWith(TestingRecipient, factory.generationHash);
                            validateTransactionConfirmed(listener, TestingRecipient.address, signedAggregateSecretProofTransaction.hash)
                                .then(() => {
                                    done();
                                }, (reason) => {
                                    fail(reason);
                                });
                            transactionHttp.announce(signedAggregateSecretProofTransaction);
                        }, (reason) => {
                            fail(reason);
                        })
                    transactionHttp.announce(signedSecretLockTransaction);
                });
            });
        });

        describe('ChainConfigTransaction', () => {
            ((NemesisAccount.privateKey !== "0".repeat(64)) ? it : it.skip)('standalone', (done) => {
                GetNemesisBlockDataPromise().then(nemesisBlockInfo => {
                    const chainConfigTransaction = factory.chainConfig()
                        .applyHeightDelta(UInt64.fromUint(10))
                        .networkConfig(nemesisBlockInfo.config.networkConfig)
                        .supportedEntityVersions(nemesisBlockInfo.config.supportedEntityVersions)
                        .build();

                    const signedTransaction = chainConfigTransaction.signWith(NemesisAccount, factory.generationHash);
                    validateTransactionConfirmed(listener, NemesisAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => fail(reason));
                    transactionHttp.announce(signedTransaction);
                });
            });
        });

        describe('ChainUpgradeTransaction', () => {
            ((NemesisAccount.privateKey !== "0".repeat(64)) ? it : it.skip)('standalone', (done) => {
                const chainUpgradeTransaction = factory.chainUpgrade()
                    .upgradePeriod(UInt64.fromUint(100000))
                    .newBlockchainVersion(UInt64.fromHex('0001000200030004'))
                    .build();

                const signedTransaction = chainUpgradeTransaction.signWith(NemesisAccount, factory.generationHash);
                validateTransactionConfirmed(listener, NemesisAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('AddExchangeOfferTransaction', () => {
            it('standalone', (done) => {
                const offers = [
                    new AddExchangeOffer(
                        ConfTestingMosaicId,
                        UInt64.fromUint(10000000),
                        UInt64.fromUint(10000000),
                        ExchangeOfferType.SELL_OFFER,
                        UInt64.fromUint(10000)
                    )
                ];
                const addExchangeOfferTransaction = factory.addExchangeOffer()
                    .offers(offers)
                    .build();
                const signedTransaction = addExchangeOfferTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const offers = [
                    new AddExchangeOffer(
                        ConfTestingMosaicId,
                        UInt64.fromUint(10000000),
                        UInt64.fromUint(10000000),
                        ExchangeOfferType.BUY_OFFER,
                        UInt64.fromUint(10000)
                    )
                ];
                const addExchangeOfferTransaction = factory.addExchangeOffer()
                    .offers(offers)
                    .build();
                const aggregateComplete = factory.aggregateComplete()
                    .innerTransactions([addExchangeOfferTransaction.toAggregate(CosignatoryAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateComplete.signWith(CosignatoryAccount, factory.generationHash);
                validateTransactionConfirmed(listener, CosignatoryAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('ExchangeOfferTransaction', () => {
            it('standalone', (done) => {
                const offers = [
                    new ExchangeOffer(
                        ConfTestingMosaicId,
                        UInt64.fromUint(100),
                        UInt64.fromUint(100),
                        ExchangeOfferType.SELL_OFFER,
                        TestingAccount.publicAccount
                    )
                ];
                const exchangeOfferTransaction = factory.exchangeOffer()
                    .offers(offers)
                    .build();
                const signedTransaction = exchangeOfferTransaction.signWith(CosignatoryAccount, factory.generationHash);
                validateTransactionConfirmed(listener, CosignatoryAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const offers = [
                    new ExchangeOffer(
                        ConfTestingMosaicId,
                        UInt64.fromUint(100),
                        UInt64.fromUint(100),
                        ExchangeOfferType.BUY_OFFER,
                        CosignatoryAccount.publicAccount
                    )
                ];
                const exchangeOfferTransaction = factory.exchangeOffer()
                    .offers(offers)
                    .build();
                const aggregateComplete = factory.aggregateComplete()
                    .innerTransactions([exchangeOfferTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateComplete.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('RemoveExchangeOfferTransaction', () => {
            it('standalone', (done) => {
                const offers = [
                    new RemoveExchangeOffer(
                        ConfTestingMosaicId,
                        ExchangeOfferType.SELL_OFFER,
                    )
                ];
                const exchangeOfferTransaction = factory.removeExchangeOffer()
                    .offers(offers)
                    .build();
                const signedTransaction = exchangeOfferTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const offers = [
                    new RemoveExchangeOffer(
                        ConfTestingMosaicId,
                        ExchangeOfferType.BUY_OFFER,
                    )
                ];
                const exchangeOfferTransaction = factory.removeExchangeOffer()
                    .offers(offers)
                    .build();
                const aggregateComplete = factory.aggregateComplete()
                    .innerTransactions([exchangeOfferTransaction.toAggregate(CosignatoryAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateComplete.signWith(CosignatoryAccount, factory.generationHash);
                validateTransactionConfirmed(listener, CosignatoryAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
    });

    describe('getTransaction', () => {
        it('should return transaction info given transactionHash', (done) => {
            GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransaction(data.testTxHash)
                    .subscribe((transaction) => {
                        expect(transaction.transactionInfo!.hash).to.be.equal(data.testTxHash);
                        expect(transaction.transactionInfo!.id).to.be.equal(data.testTxId);
                        done();
                    });
            })
        });

        it('should return transaction info given transactionId', (done) => {
            GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransaction(data.testTxId)
                    .subscribe((transaction) => {
                        expect(transaction.transactionInfo!.hash).to.be.equal(data.testTxHash);
                        expect(transaction.transactionInfo!.id).to.be.equal(data.testTxId);
                        done();
                    });
            });
        });
    });

    describe('getTransactions', () => {
        it('should return transaction info given array of transactionHash', (done) => {
            GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactions([data.testTxHash])
                    .subscribe((transactions) => {
                        expect(transactions[0].transactionInfo!.hash).to.be.equal(data.testTxHash);
                        expect(transactions[0].transactionInfo!.id).to.be.equal(data.testTxId);
                        done();
                    });
            });
        });

        it('should return transaction info given array of transactionId', (done) => {
            GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactions([data.testTxId])
                    .subscribe((transactions) => {
                        expect(transactions[0].transactionInfo!.hash).to.be.equal(data.testTxHash);
                        expect(transactions[0].transactionInfo!.id).to.be.equal(data.testTxId);
                        done();
                    });
            });
        });
    });

    describe('getTransactionStatus', () => {
        it('should return transaction status given array transactionHash', (done) => {
            GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactionStatus(data.testTxHash)
                    .subscribe((transactionStatus) => {
                        expect(transactionStatus.group).to.be.equal('confirmed');
                        expect(transactionStatus.height!.lower).to.be.greaterThan(0);
                        expect(transactionStatus.height!.higher).to.be.equal(0);
                        done();
                    });
            });
        });
    });

    describe('getTransactionsStatuses', () => {
        it('should return transaction status given array of transactionHash', (done) => {
            GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactionsStatuses([data.testTxHash])
                    .subscribe((transactionStatuses) => {
                        expect(transactionStatuses[0].group).to.be.equal('confirmed');
                        expect(transactionStatuses[0].height!.lower).to.be.greaterThan(0);
                        expect(transactionStatuses[0].height!.higher).to.be.equal(0);
                        done();
                    });
            });
        });
    });

    describe('announce', () => {
        it('should return success when announce', (done) => {
            const payload = new SignedTransaction('', '0'.repeat(64), '', TransactionType.TRANSFER, factory.networkType);
            transactionHttp.announce(payload)
                .subscribe((transactionAnnounceResponse) => {
                    expect(transactionAnnounceResponse.message)
                        .to.be.equal('packet 9 was pushed to the rest via /transaction');
                    done();
                });
        });
    });

    describe('announceAggregateBonded', () => {
        it('should return success when announceAggregateBonded', (done) => {
            const payload = new SignedTransaction('', '0'.repeat(64), '', TransactionType.AGGREGATE_BONDED, factory.networkType);
            transactionHttp.announceAggregateBonded(payload)
                .subscribe((transactionAnnounceResponse) => {
                    expect(transactionAnnounceResponse.message)
                        .to.be.equal('packet 500 was pushed to the rest via /transaction/partial');
                    done();
                });
        });

        it('should return an error when a non aggregate transaction bonded is announced via announceAggregateBonded method', () => {
            const tx = factory.transfer()
                .recipient(TestingAccount.address)
                .message(PlainMessage.create('Hi'))
                .build();

            const aggTx = factory.aggregateComplete()
                .innerTransactions([
                    tx.toAggregate(TestingAccount.publicAccount),
                ])
                .build();

            const signedTx = TestingAccount.sign(aggTx, factory.generationHash);
            return transactionHttp.announceAggregateBonded(signedTx).subscribe(resp => {
                throw new Error('Shouldn\'t be called');
            }, error => {
                expect(error).to.be.equal('Only Transaction Type 0x4241 is allowed for announce aggregate bonded');
            });
        });
    });

    describe('announceAggregateBondedCosignature', () => {
        it('should return success when announceAggregateBondedCosignature', (done) => {
            const payload = new CosignatureSignedTransaction('', '', '');
            transactionHttp.announceAggregateBondedCosignature(payload)
                .subscribe((transactionAnnounceResponse) => {
                    expect(transactionAnnounceResponse.message)
                        .to.be.equal('packet 501 was pushed to the rest via /transaction/cosignature');
                    done();
                });
        });
    });

    describe('announceSync', () => {
        it('should return insufficient balance error', (done) => {
            const signerAccount = TestingAccount;

            const tx = factory.transfer()
                .recipient(TestingRecipient.address)
                .mosaics([new Mosaic(ConfNetworkMosaic, UInt64.fromUint(1000000 * 1000000))])
                .build();

            const signedTx = signerAccount.sign(tx, factory.generationHash);
            const trnsHttp = new TransactionHttp(APIUrl);
            trnsHttp
                .announceSync(signedTx)
                .subscribe((shouldNotBeCalled) => {
                    throw new Error('should not be called');
                }, (err) => {
                    expect(err).to.satisfy((err) => {
                        return (err === 'non sync server' || err.status === 'Failure_Core_Insufficient_Balance')
                    });
                    done();
                });
        });
    });

    describe('getTransactionEffectiveFee', () => {
        it('should return effective paid fee given transactionHash', (done) => {
            GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactionEffectiveFee(data.testTxHash)
                    .subscribe((effectiveFee) => {
                        expect(effectiveFee).to.not.be.undefined;
                        expect(effectiveFee).to.be.equal(0);
                        done();
                    });
            });
        });
    });

    describe('announceSync', () => {
        it('should return insufficient balance error', (done) => {
            const aggregateTransaction = factory.aggregateBonded()
                .build();

            const signedTransaction = TestingAccount.sign(aggregateTransaction, factory.generationHash);

            const lockFundsTransaction = factory.lockFunds()
                .mosaic(new Mosaic(ConfNetworkMosaic, UInt64.fromUint(0)))
                .duration(UInt64.fromUint(10000))
                .signedTransaction(signedTransaction)
                .build();

            const signedLockFundsTransactions = lockFundsTransaction.signWith(TestingAccount, factory.generationHash);

            validateTransactionConfirmed(listener, TestingAccount.address, signedLockFundsTransactions.hash)
                .then(() => {
                    fail('should not be called');
                }).catch((reason) => {
                    expect(reason.status).to.be.equal('Failure_LockHash_Invalid_Mosaic_Amount');
                    done();
                });

            transactionHttp.announce(signedLockFundsTransactions);
        });
    });
});
