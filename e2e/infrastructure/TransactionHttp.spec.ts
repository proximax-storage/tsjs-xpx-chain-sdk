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
import { ChronoUnit } from 'js-joda';
import { keccak_256, sha3_256 } from 'js-sha3';
import { Crypto } from '../../src/core/crypto';
import { Convert as convert } from '../../src/core/format';
import { AccountHttp } from '../../src/infrastructure/AccountHttp';
import { NamespaceHttp } from '../../src/infrastructure/infrastructure';
import { Listener } from '../../src/infrastructure/Listener';
import { TransactionHttp } from '../../src/infrastructure/TransactionHttp';
import { Account } from '../../src/model/account/Account';
import { RestrictionModificationType } from '../../src/model/account/RestrictionModificationType';
import { RestrictionType } from '../../src/model/account/RestrictionType';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { MosaicProperties } from '../../src/model/mosaic/MosaicProperties';
import { MosaicSupplyType } from '../../src/model/mosaic/MosaicSupplyType';
import { NetworkCurrencyMosaic } from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { AliasActionType } from '../../src/model/namespace/AliasActionType';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { AccountAddressRestrictionModificationTransaction } from '../../src/model/transaction/AccountAddressRestrictionModificationTransaction';
import { AccountLinkTransaction } from '../../src/model/transaction/AccountLinkTransaction';
import { AccountMosaicRestrictionModificationTransaction } from '../../src/model/transaction/AccountMosaicRestrictionModificationTransaction';
import { AccountOperationRestrictionModificationTransaction } from '../../src/model/transaction/AccountOperationRestrictionModificationTransaction';
import { AccountRestrictionModification } from '../../src/model/transaction/AccountRestrictionModification';
import { AccountRestrictionTransaction } from '../../src/model/transaction/AccountRestrictionTransaction';
import { AddressAliasTransaction } from '../../src/model/transaction/AddressAliasTransaction';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { CosignatureSignedTransaction } from '../../src/model/transaction/CosignatureSignedTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { HashLockTransaction } from '../../src/model/transaction/HashLockTransaction';
import { HashType } from '../../src/model/transaction/HashType';
import { LinkAction } from '../../src/model/transaction/LinkAction';
import { LockFundsTransaction } from '../../src/model/transaction/LockFundsTransaction';
import { MosaicAliasTransaction } from '../../src/model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicSupplyChangeTransaction } from '../../src/model/transaction/MosaicSupplyChangeTransaction';
import { PlainMessage, EmptyMessage } from '../../src/model/transaction/PlainMessage';
import { RegisterNamespaceTransaction } from '../../src/model/transaction/RegisterNamespaceTransaction';
import { SecretLockTransaction } from '../../src/model/transaction/SecretLockTransaction';
import { SecretProofTransaction } from '../../src/model/transaction/SecretProofTransaction';
import { Transaction } from '../../src/model/transaction/Transaction';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import {
    APIUrl, ConfNetworkType, ConfNetworkMosaic,
    SeedAccount, TestingAccount, TestingRecipient, MultisigAccount, CosignatoryAccount, Cosignatory2Account, Cosignatory3Account, GetNemesisBlockDataPromise, ConfNamespace, ConfTestingMosaic, ConfTestingNamespace, ConfAccountHttp, ConfTransactionHttp, ConfMosaicHttp, NemesisBlockInfo, Customer1Account, ConfNetworkMosaicDivisibility, MultilevelMultisigAccount, Cosignatory4Account, NemesisAccount
} from '../conf/conf.spec';
import { AliasTransaction, Address, ChainConfigTransaction, SignedTransaction, AggregateTransactionCosignature, CosignatureTransaction } from '../../src/model/model';
import { ModifyMetadataTransaction, MetadataModification, MetadataModificationType } from '../../src/model/transaction/ModifyMetadataTransaction';
import { MetadataHttp } from '../../src/infrastructure/MetadataHttp';
import { ConfUtils } from '../conf/ConfUtils';
import { MosaicHttp } from '../../src/infrastructure/MosaicHttp';
import { fail } from 'assert';
import { randomBytes } from 'crypto';
import { validateTransactionConfirmed, validateCosignaturePartialTransactionAnnouncedCorrectly, validatePartialTransactionNotPartialAnyMore, validatePartialTransactionAnnouncedCorrectly } from '../utils';
import { TransactionMapping } from '../../src/core/utils/utility';

describe('TransactionHttp', () => {
    let transactionHttp: TransactionHttp;
    let accountHttp: AccountHttp;
    let mosaicHttp: MosaicHttp;
    let namespaceName: string;
    let mosaicId: MosaicId;
    let listener: Listener;
    let generationHash: string;

    before(() => {
        transactionHttp = ConfTransactionHttp;
        accountHttp = ConfAccountHttp;
        mosaicHttp = ConfMosaicHttp;
        listener = new Listener(APIUrl);

        return listener.open().then(() => {
            return NemesisBlockInfo.getInstance().then(nemesisBlockInfo => {
                generationHash = nemesisBlockInfo.generationHash;
            });
        });
    });

    after(() => {
        listener.close();
    })

    describe('announce', () => {
        describe('TransferTransaction', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                TestingRecipient.address,
                [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))],
                PlainMessage.create('test-message'),
                ConfNetworkType);
            it('standalone', (done) => {
                const signedTransaction = transferTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [transferTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    [],
                );
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
    });

    describe('Multisig', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            TestingRecipient.address,
            [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))],
            PlainMessage.create('test-message from multisig account as aggregate bonded'),
            ConfNetworkType);
        it('should send transfer tx as aggregate bonded', (done) => {
            const aggregateBondedTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [transferTransaction.toAggregate(MultisigAccount.publicAccount)],
                ConfNetworkType
            )
            const signedAggregateBondedTransaction = aggregateBondedTransaction.signWith(CosignatoryAccount, generationHash);
            const hashLockTransaction = HashLockTransaction.create(
                Deadline.create(),
                new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10000000)),
                UInt64.fromUint(1000),
                signedAggregateBondedTransaction,
                ConfNetworkType,
            );
            const signedHashLockTransaction = hashLockTransaction.signWith(CosignatoryAccount, generationHash);
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
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                TestingRecipient.address,
                [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))],
                PlainMessage.create('test-message from multisig account as aggregate complete'),
                ConfNetworkType);
            const aggregateCompleteTransaction = AggregateTransaction.createComplete(
                Deadline.create(),
                [transferTransaction.toAggregate(MultisigAccount.publicAccount)],
                ConfNetworkType,
                []
            )
            const signedAggregateCompleteTransaction = CosignatoryAccount.signTransactionWithCosignatories(aggregateCompleteTransaction, [Cosignatory2Account], generationHash);
            validateTransactionConfirmed(listener, CosignatoryAccount.address, signedAggregateCompleteTransaction.hash)
                .then(() => done()).catch((reason) => fail(reason));
            transactionHttp.announce(signedAggregateCompleteTransaction);
        })
    });

    describe('Multilevel Multisig', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            TestingRecipient.address,
            [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))],
            PlainMessage.create('test-message from multilevel multisig account as aggregate bonded'),
            ConfNetworkType);
        it('should send transfer tx as aggregate bonded', (done) => {
            const aggregateBondedTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [transferTransaction.toAggregate(MultilevelMultisigAccount.publicAccount)],
                ConfNetworkType
            )
            const signedAggregateBondedTransaction = aggregateBondedTransaction.signWith(Cosignatory4Account, generationHash);
            const hashLockTransaction = HashLockTransaction.create(
                Deadline.create(),
                new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10000000)),
                UInt64.fromUint(1000),
                signedAggregateBondedTransaction,
                ConfNetworkType,
            );
            const signedHashLockTransaction = hashLockTransaction.signWith(Cosignatory4Account, generationHash);
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
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                TestingRecipient.address,
                [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))],
                PlainMessage.create('test-message from multilevel multisig account as aggregate complete'),
                ConfNetworkType);
            const aggregateCompleteTransaction = AggregateTransaction.createComplete(
                Deadline.create(),
                [transferTransaction.toAggregate(MultilevelMultisigAccount.publicAccount)],
                ConfNetworkType,
                []
            )
            const signedAggregateCompleteTransaction = Cosignatory4Account.signTransactionWithCosignatories(aggregateCompleteTransaction, [Cosignatory2Account, Cosignatory3Account], generationHash);
            validateTransactionConfirmed(listener, Cosignatory4Account.address, signedAggregateCompleteTransaction.hash)
                .then(() => done()).catch((reason) => fail(reason));
            transactionHttp.announce(signedAggregateCompleteTransaction);
        })

        it('should send transfer tx as aggregate complete not signed at once (offline)', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                TestingRecipient.address,
                [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))],
                PlainMessage.create('test-message from multilevel multisig account as aggregate complete'),
                ConfNetworkType);
            // initiator, delivers this to other cosigners
            const aggregateCompleteTransaction = AggregateTransaction.createComplete(
                Deadline.create(),
                [transferTransaction.toAggregate(MultilevelMultisigAccount.publicAccount)],
                ConfNetworkType,
                []
            )
            const signedAggregateCompleteTransaction = aggregateCompleteTransaction.signWith(Cosignatory4Account, generationHash);

            // second cosigner, cosign and send back to the initiator
            const cosignedTwo = CosignatureTransaction.signTransactionPayload(Cosignatory2Account, signedAggregateCompleteTransaction.payload, generationHash);

            // third cosigner, cosign and send back to the initiator
            const cosignedThree = CosignatureTransaction.signTransactionPayload(Cosignatory3Account, signedAggregateCompleteTransaction.payload, generationHash);

            // initiator combines all the signatures and the transaction into single signed transaction and announces
            const cosignatureSignedTransactions = [
                new CosignatureSignedTransaction(cosignedTwo.parentHash, cosignedTwo.signature, cosignedTwo.signer),
                new CosignatureSignedTransaction(cosignedThree.parentHash, cosignedThree.signature, cosignedThree.signer)
            ];
            const deserializedAggregateCompleteTransaction = TransactionMapping.createFromPayload(signedAggregateCompleteTransaction.payload) as AggregateTransaction;
            const signedDeserializedAggregateCompleteTransaction = deserializedAggregateCompleteTransaction.signTransactionGivenSignatures(Cosignatory4Account, cosignatureSignedTransactions, generationHash);

            { // check that all the signatures are the same as if used the signTransactionWithCosignatories only
                const differentlySignedAggregateCompleteTransaction = Cosignatory4Account.signTransactionWithCosignatories(aggregateCompleteTransaction, [Cosignatory2Account, Cosignatory3Account], generationHash);
                expect(differentlySignedAggregateCompleteTransaction.payload).to.be.equal(signedDeserializedAggregateCompleteTransaction.payload);
                expect(differentlySignedAggregateCompleteTransaction.hash).to.be.equal(signedDeserializedAggregateCompleteTransaction.hash);
            }

            validateTransactionConfirmed(listener, Cosignatory4Account.address, signedDeserializedAggregateCompleteTransaction.hash)
                .then(() => done()).catch((reason) => fail(reason));
            transactionHttp.announce(signedDeserializedAggregateCompleteTransaction);
        })
    });

    describe('AccountLinkTransaction', () => {
        describe('RegisterNamespaceTransaction', () => {
            it('standalone', (done) => {
                namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
                const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
                    Deadline.create(),
                    namespaceName,
                    UInt64.fromUint(1000),
                    ConfNetworkType,
                );
                const signedTransaction = registerNamespaceTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
                    Deadline.create(),
                    'root-test-namespace-' + Math.floor(Math.random() * 10000),
                    UInt64.fromUint(1000),
                    ConfNetworkType,
                );
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [registerNamespaceTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    []);
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('MosaicDefinitionTransaction', () => {
            it('standalone', (done) => {
                const nonce = MosaicNonce.createRandom();
                const mosaicId = MosaicId.createFromNonce(nonce, TestingAccount.publicAccount);
                const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                    Deadline.create(),
                    nonce,
                    mosaicId,
                    MosaicProperties.create({
                        supplyMutable: true,
                        transferable: true,
                        divisibility: 3,
                        duration: UInt64.fromUint(1000),
                    }),
                    ConfNetworkType,
                );
                const signedTransaction = mosaicDefinitionTransaction.signWith(TestingAccount, generationHash);
                console.log(mosaicId.toHex());
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash).then(() => {
                    const modifyMetadataTransaction = ModifyMetadataTransaction.createWithMosaicId(
                        ConfNetworkType,
                        Deadline.create(),
                        undefined,
                        mosaicId,
                        [new MetadataModification(MetadataModificationType.ADD, 'key2', 'some other value')]
                    );
                    const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount, generationHash);
                    validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => fail(reason));
                    transactionHttp.announce(signedTransaction);
                }).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const nonce = MosaicNonce.createRandom();
                mosaicId = MosaicId.createFromNonce(nonce, TestingAccount.publicAccount);
                const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                    Deadline.create(),
                    nonce,
                    mosaicId,
                    MosaicProperties.create({
                        supplyMutable: true,
                        transferable: true,
                        divisibility: 3,
                        duration: UInt64.fromUint(1000),
                    }),
                    ConfNetworkType,
                );
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [mosaicDefinitionTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    []);
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('MosaicDefinitionTransaction with zero nonce', () => {
            it('standalone', (done) => {
                const nonce = MosaicNonce.createFromHex('00000000');
                const mosaicId = MosaicId.createFromNonce(nonce, TestingAccount.publicAccount);
                const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                    Deadline.create(),
                    nonce,
                    mosaicId,
                    MosaicProperties.create({
                        supplyMutable: true,
                        transferable: true,
                        divisibility: 3,
                        duration: UInt64.fromUint(60000),
                    }),
                    ConfNetworkType,
                );
                const signedTransaction = mosaicDefinitionTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const nonce = MosaicNonce.createFromHex('00000000');
                const mosaicId = MosaicId.createFromNonce(nonce, TestingAccount.publicAccount);
                const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                    Deadline.create(),
                    nonce,
                    mosaicId,
                    MosaicProperties.create({
                        supplyMutable: true,
                        transferable: true,
                        divisibility: 3,
                        duration: UInt64.fromUint(1000),
                    }),
                    ConfNetworkType,
                );
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [mosaicDefinitionTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    []);
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('AccountAndMosaicAliasTransactions', () => {
            it('should create an alias to an account', (done) => {
                const addressAliasTransaction = AliasTransaction.createForAddress(
                    Deadline.create(),
                    AliasActionType.Link,
                    ConfTestingNamespace,
                    TestingAccount.address,
                    ConfNetworkType
                );
                const signedTransaction = addressAliasTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('should remove the alias from an account', (done) => {
                const addressAliasTransaction = AliasTransaction.createForAddress(
                    Deadline.create(),
                    AliasActionType.Unlink,
                    ConfTestingNamespace,
                    TestingAccount.address,
                    ConfNetworkType
                );
                const signedTransaction = addressAliasTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('should create an alias to a mosaic', (done) => {
                const mosaicAliasTransaction = AliasTransaction.createForMosaic(
                    Deadline.create(),
                    AliasActionType.Link,
                    ConfTestingNamespace,
                    ConfTestingMosaic,
                    ConfNetworkType
                );
                console.log(mosaicAliasTransaction);
                const signedTransaction = mosaicAliasTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('should remove an alias from a mosaic', (done) => {
                const mosaicAliasTransaction = AliasTransaction.createForMosaic(
                    Deadline.create(),
                    AliasActionType.Unlink,
                    ConfTestingNamespace,
                    ConfTestingMosaic,
                    ConfNetworkType
                );
                const signedTransaction = mosaicAliasTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('MosaicSupplyChangeTransaction', () => {
            it('standalone', (done) => {
                const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
                    Deadline.create(),
                    mosaicId, // depends on mosaicId created randomly in the previous test
                    MosaicSupplyType.Increase,
                    UInt64.fromUint(10),
                    ConfNetworkType,
                );
                const signedTransaction = mosaicSupplyChangeTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
                    Deadline.create(),
                    mosaicId, // depends on mosaicId created randomly in the previous test
                    MosaicSupplyType.Increase,
                    UInt64.fromUint(10),
                    ConfNetworkType,
                );
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [mosaicSupplyChangeTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    []);
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
    });

    describe('AccountRestrictionTransaction - Address', () => {
        it('standalone', (done) => {
            const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
                RestrictionModificationType.Add,
                Customer1Account.address,
            );
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(),
                RestrictionType.BlockAddress,
                [addressRestrictionFilter],
                ConfNetworkType,
            );
            const signedTransaction = addressModification.signWith(TestingAccount, generationHash);
            validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                .then(() => done()).catch((reason) => fail(reason));
            transactionHttp.announce(signedTransaction);
        });

        it('aggregate', (done) => {
            const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
                RestrictionModificationType.Remove,
                Customer1Account.address,
            );
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(),
                RestrictionType.BlockAddress,
                [addressRestrictionFilter],
                ConfNetworkType,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressModification.toAggregate(TestingAccount.publicAccount)],
                ConfNetworkType,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
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
            const addressModification = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
                Deadline.create(),
                RestrictionType.BlockMosaic,
                [mosaicRestrictionFilter],
                ConfNetworkType,
            );
            const signedTransaction = addressModification.signWith(TestingAccount, generationHash);
            validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                .then(() => done()).catch((reason) => fail(reason));
            transactionHttp.announce(signedTransaction);
        });

        it('aggregate', (done) => {
            const mosaicRestrictionFilter = AccountRestrictionModification.createForMosaic(
                RestrictionModificationType.Remove,
                mosaicId,
            );
            const addressModification = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
                Deadline.create(),
                RestrictionType.BlockMosaic,
                [mosaicRestrictionFilter],
                ConfNetworkType,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressModification.toAggregate(TestingAccount.publicAccount)],
                ConfNetworkType,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
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
            const addressModification = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
                Deadline.create(),
                RestrictionType.BlockTransaction,
                [operationRestrictionFilter],
                ConfNetworkType,
            );
            const signedTransaction = addressModification.signWith(Cosignatory2Account, generationHash);

            validateTransactionConfirmed(listener, Cosignatory2Account.address, signedTransaction.hash)
                .then(() => done()).catch((reason) => fail(reason));
            transactionHttp.announce(signedTransaction);
        });

        it('aggregate', (done) => {
            const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
                RestrictionModificationType.Remove,
                TransactionType.LINK_ACCOUNT,
            );
            const addressModification = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
                Deadline.create(),
                RestrictionType.BlockTransaction,
                [operationRestrictionFilter],
                ConfNetworkType,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressModification.toAggregate(Cosignatory2Account.publicAccount)],
                ConfNetworkType,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(Cosignatory2Account, generationHash);
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
            const signedTransaction = TestingAccount.sign(aggregateTransaction, generationHash);
            const hashLockTransaction = HashLockTransaction.create(Deadline.create(),
                new Mosaic(new NamespaceId('cat.currency'), UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY))),
                UInt64.fromUint(10000),
                signedTransaction,
                ConfNetworkType);

            const signedHashLockTransaction = hashLockTransaction.signWith(TestingAccount, generationHash);
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
            const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
            validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
            transactionHttp.announce(signedTransaction);
        });
    });
*/
    describe('LockFundsTransaction', () => {
        it('standalone', (done) => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [],
                ConfNetworkType,
                [],
            );
            const signedTransaction = TestingAccount.sign(aggregateTransaction, generationHash);
            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * Math.pow(10, ConfNetworkMosaicDivisibility))),
                UInt64.fromUint(10000),
                signedTransaction,
                ConfNetworkType);
            const signedLockFundsTransaction = lockFundsTransaction.signWith(TestingAccount, generationHash);
            validateTransactionConfirmed(listener, TestingAccount.address, signedLockFundsTransaction.hash)
                .then(() => done()).catch((reason) => fail(reason));
            transactionHttp.announce(signedLockFundsTransaction);
        });

        it('aggregate', (done) => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [],
                ConfNetworkType,
                [],
            );
            const signedTransaction = TestingAccount.sign(aggregateTransaction, generationHash);
            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * Math.pow(10, ConfNetworkMosaicDivisibility))),
                UInt64.fromUint(10),
                signedTransaction,
                ConfNetworkType);
            const aggregateLockFundsTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [lockFundsTransaction.toAggregate(TestingAccount.publicAccount)],
                ConfNetworkType,
                []);
            const signedAggregateLockFundsTransaction = aggregateLockFundsTransaction.signWith(TestingAccount, generationHash);
            validateTransactionConfirmed(listener, TestingAccount.address, signedAggregateLockFundsTransaction.hash)
                .then(() => done()).catch((reason) => fail(reason));
            transactionHttp.announce(signedAggregateLockFundsTransaction);
        });
    });

    describe('Aggregate Complete Transaction', () => {
        it('should announce aggregated complete transaction', (done) => {
            const transaction = TransferTransaction.create(
                Deadline.create(),
                TestingRecipient.address,
                [],
                PlainMessage.create('Hi'),
                ConfNetworkType,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(),
                [
                    transaction.toAggregate(TestingAccount.publicAccount),
                ],
                ConfNetworkType,
                [],
            );
            const signedTransaction = TestingAccount.sign(aggregateTransaction, generationHash);
            validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                .then(() => done()).catch((reason) => fail(reason));
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('SecretLockTransaction', () => {
        describe('HashType: Op_Sha3_256', () => {
            it('standalone', (done) => {
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Sha3_256,
                    sha3_256.create().update(randomBytes(20)).hex(),
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const signedTransaction = secretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Sha3_256,
                    sha3_256.create().update(randomBytes(20)).hex(),
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [secretLockTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    []);
                const signedTransaction = aggregateSecretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('HashType: Keccak_256', () => {
            it('standalone', (done) => {
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Keccak_256,
                    sha3_256.create().update(randomBytes(20)).hex(),
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const signedTransaction = secretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Keccak_256,
                    sha3_256.create().update(randomBytes(20)).hex(),
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [secretLockTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    []);
                const signedTransaction = aggregateSecretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('HashType: Op_Hash_160', () => {
            it('standalone', (done) => {
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Hash_160,
                    sha3_256.create().update(randomBytes(20)).hex().substr(0, 40),
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const signedTransaction = secretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Hash_160,
                    sha3_256.create().update(randomBytes(20)).hex().substr(0, 40),
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [secretLockTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    []);
                const signedTransaction = aggregateSecretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('HashType: Op_Hash_256', () => {
            it('standalone', (done) => {
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Hash_256,
                    sha3_256.create().update(randomBytes(20)).hex(),
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const signedTransaction = secretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedTransaction.hash)
                    .then(() => done()).catch((reason) => fail(reason));
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Hash_256,
                    sha3_256.create().update(randomBytes(20)).hex(),
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [secretLockTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    []);
                const signedTransaction = aggregateSecretLockTransaction.signWith(TestingAccount, generationHash);
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
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Sha3_256,
                    secret,
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                        const secretProofTransaction = SecretProofTransaction.create(
                            Deadline.create(),
                            HashType.Op_Sha3_256,
                            secret,
                            TestingRecipient.address,
                            proof,
                            ConfNetworkType,
                        );
                        const signedSecretProofTransaction = secretProofTransaction.signWith(TestingRecipient, generationHash);
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
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Sha3_256,
                    secret,
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                        const secretProofTransaction = SecretProofTransaction.create(
                            Deadline.create(),
                            HashType.Op_Sha3_256,
                            secret,
                            TestingRecipient.address,
                            proof,
                            ConfNetworkType,
                        );
                        const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                            [secretProofTransaction.toAggregate(TestingRecipient.publicAccount)],
                            ConfNetworkType,
                            []);
                        const signedAggregateSecretProofTransaction = aggregateSecretProofTransaction.signWith(TestingRecipient, generationHash);
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
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Keccak_256,
                    secret,
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                        const secretProofTransaction = SecretProofTransaction.create(
                            Deadline.create(),
                            HashType.Op_Keccak_256,
                            secret,
                            TestingRecipient.address,
                            proof,
                            ConfNetworkType,
                        );
                        const signedSecretProofTransaction = secretProofTransaction.signWith(TestingRecipient, generationHash);
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
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Keccak_256,
                    secret,
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                        const secretProofTransaction = SecretProofTransaction.create(
                            Deadline.create(),
                            HashType.Op_Keccak_256,
                            secret,
                            TestingRecipient.address,
                            proof,
                            ConfNetworkType,
                        );
                        const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                            [secretProofTransaction.toAggregate(TestingRecipient.publicAccount)],
                            ConfNetworkType,
                            []);
                        const signedAggregateSecretProofTransaction = aggregateSecretProofTransaction.signWith(TestingRecipient, generationHash);
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
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Hash_160,
                    secret,
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                        const secretProofTransaction = SecretProofTransaction.create(
                            Deadline.create(),
                            HashType.Op_Hash_160,
                            secret,
                            TestingRecipient.address,
                            proof,
                            ConfNetworkType,
                        );
                        const signedSecretProofTransaction = secretProofTransaction.signWith(TestingRecipient, generationHash);
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
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Hash_160,
                    secret,
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                        const secretProofTransaction = SecretProofTransaction.create(
                            Deadline.create(),
                            HashType.Op_Hash_160,
                            secret,
                            TestingRecipient.address,
                            proof,
                            ConfNetworkType,
                        );
                        const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                            [secretProofTransaction.toAggregate(TestingRecipient.publicAccount)],
                            ConfNetworkType,
                            []);
                        const signedAggregateSecretProofTransaction = aggregateSecretProofTransaction.signWith(TestingRecipient, generationHash);
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
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Hash_256,
                    secret,
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                        const secretProofTransaction = SecretProofTransaction.create(
                            Deadline.create(),
                            HashType.Op_Hash_256,
                            secret,
                            TestingRecipient.address,
                            proof,
                            ConfNetworkType,
                        );
                        const signedSecretProofTransaction = secretProofTransaction.signWith(TestingRecipient, generationHash);
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
                const secretLockTransaction = SecretLockTransaction.create(
                    Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(100),
                    HashType.Op_Hash_256,
                    secret,
                    TestingRecipient.address,
                    ConfNetworkType,
                );
                const signedSecretLockTransaction = secretLockTransaction.signWith(TestingAccount, generationHash);
                validateTransactionConfirmed(listener, TestingAccount.address, signedSecretLockTransaction.hash)
                    .then(() => {
                        const secretProofTransaction = SecretProofTransaction.create(
                            Deadline.create(),
                            HashType.Op_Hash_256,
                            secret,
                            TestingRecipient.address,
                            proof,
                            ConfNetworkType,
                        );
                        const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                            [secretProofTransaction.toAggregate(TestingRecipient.publicAccount)],
                            ConfNetworkType,
                            []);
                        const signedAggregateSecretProofTransaction = aggregateSecretProofTransaction.signWith(TestingRecipient, generationHash);
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

    describe.only('announce', () => {
        describe('ChainConfigTransaction', () => {
            it('standalone', (done) => {
                GetNemesisBlockDataPromise().then(nemesisBlockInfo => {
                    const chainConfigTransaction = ChainConfigTransaction.create(
                        Deadline.create(),
                        UInt64.fromUint(10),
                        nemesisBlockInfo.config.blockChainConfig,
                        nemesisBlockInfo.config.supportedEntityVersions,
                        ConfNetworkType
                    );
                    const signedTransaction = chainConfigTransaction.signWith(NemesisAccount, generationHash);
                    validateTransactionConfirmed(listener, NemesisAccount.address, signedTransaction.hash)
                        .then(() => done()).catch((reason) => fail(reason));
                    transactionHttp.announce(signedTransaction);
                });
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
            const payload = new SignedTransaction('', '0'.repeat(64), '', TransactionType.TRANSFER, ConfNetworkType);
            transactionHttp.announce(payload)
                .subscribe((transactionAnnounceResponse) => {
                    expect(transactionAnnounceResponse.message)
                        .to.be.equal('packet 9 was pushed to the network via /transaction');
                    done();
                });
        });
    });

    describe('announceAggregateBonded', () => {
        it('should return success when announceAggregateBonded', (done) => {
            const payload = new SignedTransaction('', '0'.repeat(64), '', TransactionType.AGGREGATE_BONDED, ConfNetworkType);
            transactionHttp.announceAggregateBonded(payload)
                .subscribe((transactionAnnounceResponse) => {
                    expect(transactionAnnounceResponse.message)
                        .to.be.equal('packet 500 was pushed to the network via /transaction/partial');
                    done();
                });
        });

        it('should return an error when a non aggregate transaction bonded is announced via announceAggregateBonded method', () => {
            const tx = TransferTransaction.create(
                Deadline.create(),
                TestingAccount.address,
                [],
                PlainMessage.create('Hi'),
                ConfNetworkType,
            );
            const aggTx = AggregateTransaction.createComplete(
                Deadline.create(),
                [
                    tx.toAggregate(TestingAccount.publicAccount),
                ],
                ConfNetworkType,
                [],
            );

            const signedTx = TestingAccount.sign(aggTx, generationHash);
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
                        .to.be.equal('packet 501 was pushed to the network via /transaction/cosignature');
                    done();
                });
        });
    });

    describe('announceSync', () => {
        it('should return insufficient balance error', (done) => {
            const signerAccount = TestingAccount;

            const tx = TransferTransaction.create(
                Deadline.create(),
                TestingRecipient.address,
                [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(1000000 * 1000000))],
                EmptyMessage,
                ConfNetworkType,
            );
            const signedTx = signerAccount.sign(tx, generationHash);
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
             const aggregateTransaction = AggregateTransaction.createBonded(
                            Deadline.create(),
                             [],
                             ConfNetworkType,
                             [],
                         );
             const signedTransaction = TestingAccount.sign(aggregateTransaction, generationHash);

             const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                 new Mosaic(ConfNetworkMosaic, UInt64.fromUint(0)),
                 UInt64.fromUint(10000),
                 signedTransaction,
                 ConfNetworkType);

             const signedLockFundsTransactions = lockFundsTransaction.signWith(TestingAccount, generationHash);

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
