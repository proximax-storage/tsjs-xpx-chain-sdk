/*
 * Copyright 2018 NEM
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
import {assert, expect} from 'chai';
import * as CryptoJS from 'crypto-js';
import {ChronoUnit} from 'js-joda';
import {keccak_256, sha3_256} from 'js-sha3';
import {Crypto} from '../../src/core/crypto';
import { Convert as convert } from '../../src/core/format';
import {AccountHttp} from '../../src/infrastructure/AccountHttp';
import { NamespaceHttp } from '../../src/infrastructure/infrastructure';
import {Listener} from '../../src/infrastructure/Listener';
import {TransactionHttp} from '../../src/infrastructure/TransactionHttp';
import {Account} from '../../src/model/account/Account';
import {Address} from '../../src/model/account/Address';
import { PropertyModificationType } from '../../src/model/account/PropertyModificationType';
import { PropertyType } from '../../src/model/account/PropertyType';
import {PublicAccount} from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import {MosaicId} from '../../src/model/mosaic/MosaicId';
import {MosaicNonce} from '../../src/model/mosaic/MosaicNonce';
import {MosaicProperties} from '../../src/model/mosaic/MosaicProperties';
import {MosaicSupplyType} from '../../src/model/mosaic/MosaicSupplyType';
import {NetworkCurrencyMosaic} from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { AliasActionType } from '../../src/model/namespace/AliasActionType';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { AccountLinkTransaction } from '../../src/model/transaction/AccountLinkTransaction';
import { AccountPropertyModification } from '../../src/model/transaction/AccountPropertyModification';
import { AccountPropertyTransaction } from '../../src/model/transaction/AccountPropertyTransaction';
import { AddressAliasTransaction } from '../../src/model/transaction/AddressAliasTransaction';
import {AggregateTransaction} from '../../src/model/transaction/AggregateTransaction';
import {CosignatureSignedTransaction} from '../../src/model/transaction/CosignatureSignedTransaction';
import {CosignatureTransaction} from '../../src/model/transaction/CosignatureTransaction';
import {Deadline} from '../../src/model/transaction/Deadline';
import { HashLockTransaction } from '../../src/model/transaction/HashLockTransaction';
import {HashType} from '../../src/model/transaction/HashType';
import { LinkAction } from '../../src/model/transaction/LinkAction';
import {LockFundsTransaction} from '../../src/model/transaction/LockFundsTransaction';
import { ModifyAccountPropertyAddressTransaction } from '../../src/model/transaction/ModifyAccountPropertyAddressTransaction';
import { ModifyAccountPropertyEntityTypeTransaction } from '../../src/model/transaction/ModifyAccountPropertyEntityTypeTransaction';
import { ModifyAccountPropertyMosaicTransaction } from '../../src/model/transaction/ModifyAccountPropertyMosaicTransaction';
import {ModifyMultisigAccountTransaction} from '../../src/model/transaction/ModifyMultisigAccountTransaction';
import { MosaicAliasTransaction } from '../../src/model/transaction/MosaicAliasTransaction';
import {MosaicDefinitionTransaction} from '../../src/model/transaction/MosaicDefinitionTransaction';
import {MosaicSupplyChangeTransaction} from '../../src/model/transaction/MosaicSupplyChangeTransaction';
import {MultisigCosignatoryModification} from '../../src/model/transaction/MultisigCosignatoryModification';
import {MultisigCosignatoryModificationType} from '../../src/model/transaction/MultisigCosignatoryModificationType';
import {EmptyMessage, PlainMessage} from '../../src/model/transaction/PlainMessage';
import {RegisterNamespaceTransaction} from '../../src/model/transaction/RegisterNamespaceTransaction';
import {SecretLockTransaction} from '../../src/model/transaction/SecretLockTransaction';
import {SecretProofTransaction} from '../../src/model/transaction/SecretProofTransaction';
import {SignedTransaction} from '../../src/model/transaction/SignedTransaction';
import {Transaction} from '../../src/model/transaction/Transaction';
import {TransactionType} from '../../src/model/transaction/TransactionType';
import {TransferTransaction} from '../../src/model/transaction/TransferTransaction';
import {UInt64} from '../../src/model/UInt64';
import {APIUrl , ConfNetworkType, ConfNetworkMosaic,
    SeedAccount, TestingAccount, TestingRecipient, MultisigAccount, CosignatoryAccount, Cosignatory2Account, Cosignatory3Account, GetNemesisBlockDataPromise, ConfNamespace, ConfTestingMosaic, ConfTestingNamespace, ConfAccountHttp, ConfTransactionHttp, ConfMosaicHttp, NemesisBlockInfo} from '../conf/conf.spec';
import { AliasTransaction } from '../../src/model/model';
import { ModifyMetadataTransaction, MetadataModification, MetadataModificationType } from '../../src/model/transaction/ModifyMetadataTransaction';
import { MetadataHttp } from '../../src/infrastructure/MetadataHttp';
import { ConfUtils } from '../conf/ConfUtils';
import { MosaicHttp } from '../../src/infrastructure/MosaicHttp';
import { fail } from 'assert';
import { randomBytes } from 'crypto';

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

    const validateTransactionAnnounceCorrectly = (address: Address, done, hash?: string) => {
        const status = listener.status(address).subscribe(error => {
            console.error(error);
            status.unsubscribe();
            sub.unsubscribe();
            return fail("Status reported an error.");
        });
        const sub = listener.confirmed(address).subscribe((transaction: Transaction) => {
            if (hash) {
                if (transaction && transaction.transactionInfo && transaction.transactionInfo.hash === hash) {
                    // console.log(transaction);
                    status.unsubscribe();
                    sub.unsubscribe();
                    return done();
                }
            } else {
                status.unsubscribe();
                sub.unsubscribe();
                return done();
            }
        });
    }

    const validatePartialTransactionAnnounceCorrectly = (address: Address, done) => {
        const sub = listener.aggregateBondedAdded(address).subscribe((transaction: Transaction) => {
            sub.unsubscribe();
            return done();
        });
    }

    const validateCosignaturePartialTransactionAnnounceCorrectly = (address: Address, publicKey, done) => {
        const sub = listener.cosignatureAdded(address).subscribe((signature) => {
            if (signature.signer === publicKey) {
                sub.unsubscribe();
                return done();
            }
        });
    }

    const validatePartialTransactionNotPartialAnyMore = (address: Address, hash: string, done) => {
        const sub = listener.aggregateBondedRemoved(address).subscribe(txhash => {
            if (txhash === hash) {
                sub.unsubscribe();
                return done();
            }
        });
    }

    describe('announce', () => {
        describe('TransferTransaction', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                TestingRecipient.address,
                [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10))],
                PlainMessage.create('test-message'),
                ConfNetworkType,
            );
            it('standalone', (done) => {
                const signedTransaction = transferTransaction.signWith(TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [transferTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    [],
                );
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                transactionHttp.announce(signedTransaction);
            });
        });
    });

    describe('AccountPropertyTransaction - EntityType', () => {
        it('standalone', (done) => {
            const entityTypePropertyFilter = AccountPropertyModification.createForEntityType(
                PropertyModificationType.Add,
                TransactionType.LINK_ACCOUNT,
            );
            const addressModification = AccountPropertyTransaction.createEntityTypePropertyModificationTransaction(
                Deadline.create(),
                PropertyType.BlockTransaction,
                [entityTypePropertyFilter],
                ConfNetworkType,
            );
            const signedTransaction = addressModification.signWith(TestingRecipient, generationHash);
            validateTransactionAnnounceCorrectly(TestingRecipient.address, done, signedTransaction.hash);
            transactionHttp.announce(signedTransaction);
        });
        it('aggregate', (done) => {
            const entityTypePropertyFilter = AccountPropertyModification.createForEntityType(
                PropertyModificationType.Remove,
                TransactionType.LINK_ACCOUNT,
            );
            const addressModification = AccountPropertyTransaction.createEntityTypePropertyModificationTransaction(
                Deadline.create(),
                PropertyType.BlockTransaction,
                [entityTypePropertyFilter],
                ConfNetworkType,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressModification.toAggregate(TestingRecipient.publicAccount)],
                ConfNetworkType,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(TestingRecipient, generationHash);
            validateTransactionAnnounceCorrectly(TestingRecipient.address, done, signedTransaction.hash);
            transactionHttp.announce(signedTransaction);
        });
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
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
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
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
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
                validateTransactionAnnounceCorrectly(TestingAccount.address, () => {
                        const modifyMetadataTransaction = ModifyMetadataTransaction.createWithMosaicId(
                            ConfNetworkType,
                            Deadline.create(),
                            undefined,
                            mosaicId,
                            [new MetadataModification(MetadataModificationType.ADD, "key2", "some other value")]
                        );

                        const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount, generationHash);
                        validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                        transactionHttp.announce(signedTransaction);
                });
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
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
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
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
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
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
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
                validateTransactionAnnounceCorrectly(TestingAccount.address, () => {
                    done();
                }, signedTransaction.hash);

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
                validateTransactionAnnounceCorrectly(TestingAccount.address, () => {
                    done();
                }, signedTransaction.hash);

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
                validateTransactionAnnounceCorrectly(TestingAccount.address, () => {
                    done();
                }, signedTransaction.hash);

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
                validateTransactionAnnounceCorrectly(TestingAccount.address, () => {
                    done();
                }, signedTransaction.hash);

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
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
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
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                transactionHttp.announce(signedTransaction);
            });
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

    describe('LockFundsTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(APIUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [],
                ConfNetworkType,
                [],
            );
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(networkCurrencyMosaicId, UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY))),
                UInt64.fromUint(10000),
                signedTransaction,
                ConfNetworkType);

            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(lockFundsTransaction.signWith(account, generationHash));
        });
    });
    describe('LockFundsTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(APIUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [],
                ConfNetworkType,
                [],
            );
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(networkCurrencyMosaicId, UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY))),
                UInt64.fromUint(10),
                signedTransaction,
                ConfNetworkType);
            const aggregateLockFundsTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [lockFundsTransaction.toAggregate(account.publicAccount)],
                ConfNetworkType,
                []);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(aggregateLockFundsTransaction.signWith(account, generationHash));
        });
    });

    describe('Aggregate Complete Transaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(APIUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('should announce aggregated complete transaction', (done) => {
            const tx = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [],
                PlainMessage.create('Hi'),
                ConfNetworkType,
            );
            const aggTx = AggregateTransaction.createComplete(
                Deadline.create(),
                [
                    tx.toAggregate(account.publicAccount),
                ],
                ConfNetworkType,
                [],
            );
            const signedTx = account.sign(aggTx, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTx);
        });
    });

    describe('SecretLockTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(APIUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Sha3_256,
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                ConfNetworkType,
            );
            listener.confirmed(account.address).subscribe((transaction: SecretLockTransaction) => {
                expect(transaction.mosaic, 'Mosaic').not.to.be.undefined;
                expect(transaction.duration, 'Duration').not.to.be.undefined;
                expect(transaction.hashType, 'HashType').not.to.be.undefined;
                expect(transaction.secret, 'Secret').not.to.be.undefined;
                expect(transaction.recipient, 'Recipient').not.to.be.undefined;
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Sha3_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(APIUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('aggregate', (done) => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Sha3_256,
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                ConfNetworkType,
            );
            const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [secretLockTransaction.toAggregate(account.publicAccount)],
                ConfNetworkType,
                []);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Keccak_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(APIUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Keccak_256,
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                ConfNetworkType,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Keccak_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(APIUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Keccak_256,
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                ConfNetworkType,
            );
            const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [secretLockTransaction.toAggregate(account.publicAccount)],
                ConfNetworkType,
                []);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_160', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(APIUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const secretSeed = String.fromCharCode.apply(null, Crypto.randomBytes(20));
            const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_160,
                secret,
                account2.address,
                ConfNetworkType,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_160', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(APIUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const secretSeed = String.fromCharCode.apply(null, Crypto.randomBytes(20));
            const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_160,
                secret,
                account2.address,
                ConfNetworkType,
            );
            const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [secretLockTransaction.toAggregate(account.publicAccount)],
                ConfNetworkType,
                []);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(APIUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_256,
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                ConfNetworkType,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(APIUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                0,
                0,
                [new MultisigCosignatoryModification(
                    MultisigCosignatoryModificationType.Add,
                    TestingAccount.publicAccount,
                )],
                ConfNetworkType,
                );
            const aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(20, ChronoUnit.MINUTES),
                [modifyMultisigAccountTransaction.toAggregate(MultisigAccount.publicAccount)],
                ConfNetworkType,
                []);

            const signedTransaction = CosignatoryAccount.signTransactionWithCosignatories(
                aggregateTransaction,
                [Cosignatory2Account],
                generationHash
            );

            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10*1000000)),
                UInt64.fromUint(10000),
                signedTransaction,
                ConfNetworkType);

            setTimeout(() => {
                transactionHttp.announce(lockFundsTransaction.signWith(CosignatoryAccount, generationHash));
            }, 1000);

            validateTransactionAnnounceCorrectly(CosignatoryAccount.address, () => {
                validatePartialTransactionAnnounceCorrectly(CosignatoryAccount.address, done);
                setTimeout(() => {
                    transactionHttp.announceAggregateBonded(signedTransaction);
                }, 1000);
            });
            transactionHttp.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('SecretProofTransaction - HashType: Op_Sha3_256', () => {
        it('CosignatureTransaction', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                TestingRecipient.address,
                [new Mosaic(ConfNetworkMosaic, UInt64.fromUint(1))],
                PlainMessage.create('test-message'),
                ConfNetworkType,
            );
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(2, ChronoUnit.MINUTES),
                [transferTransaction.toAggregate(MultisigAccount.publicAccount)],
                ConfNetworkType,
                []);

            const signedTransaction = aggregateTransaction.signWith(
                CosignatoryAccount, generationHash
            );

            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                UInt64.fromUint(10000),
                signedTransaction,
                ConfNetworkType);

            setTimeout(() => {
                transactionHttp.announce(lockFundsTransaction.signWith(CosignatoryAccount, generationHash));
            }, 1000);

            validateTransactionAnnounceCorrectly(CosignatoryAccount.address, () => {
                setTimeout(() => {
                    transactionHttp.announceAggregateBonded(signedTransaction);
                }, 1000);

                validateCosignaturePartialTransactionAnnounceCorrectly(CosignatoryAccount.address, Cosignatory2Account.publicKey, done);
                validatePartialTransactionNotPartialAnyMore(CosignatoryAccount.address, signedTransaction.hash, done);
                validatePartialTransactionAnnounceCorrectly(CosignatoryAccount.address, () => {
                    accountHttp.aggregateBondedTransactions(CosignatoryAccount.publicAccount).subscribe((transactions) => {
                        const partialTransaction = transactions[0];
                        const cosignatureTransaction = CosignatureTransaction.create(partialTransaction);
                        const cosignatureSignedTransaction = Cosignatory2Account.signCosignatureTransaction(cosignatureTransaction);
                        transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction);
                    });
                });
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(),
                    [],
                    ConfNetworkType,
                    [],
                );
                const signedTransaction = TestingAccount.sign(aggregateTransaction, generationHash);

                const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                UInt64.fromUint(10000),
                    signedTransaction,
                    ConfNetworkType);

                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                transactionHttp.announce(lockFundsTransaction.signWith(TestingAccount, generationHash));
            });
            listener.status(account2.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            const signedSecretLockTx = secretLockTransaction.signWith(account, generationHash);
            transactionHttp.announce(signedSecretLockTx);
        });
    });

    describe('SecretProofTransaction - HashType: Op_Sha3_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(APIUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const secretSeed = Crypto.randomBytes(20);
            const secret = sha3_256.create().update(secretSeed).hex();
            const proof = convert.uint8ToHex(secretSeed);
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Sha3_256,
                secret,
                account2.address,
                ConfNetworkType,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                listener.confirmed(account2.address).subscribe((transaction: Transaction) => {
                    done();
                });
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(),
                    [],
                    ConfNetworkType,
                    [],
                );
                const signedTransaction = TestingAccount.sign(aggregateTransaction, generationHash);
                const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                    new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                    UInt64.fromUint(10),
                    signedTransaction,
                    ConfNetworkType);
                const aggregateLockFundsTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [lockFundsTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    []);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                transactionHttp.announce(aggregateLockFundsTransaction.signWith(TestingAccount, generationHash));
            });
        });
    });
*/
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(aggregateSecretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(aggregateSecretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(aggregateSecretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(aggregateSecretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, () => {
                        const secretProofTransaction = SecretProofTransaction.create(
                            Deadline.create(),
                            HashType.Op_Sha3_256,
                            secret,
                            TestingRecipient.address,
                            proof,
                            ConfNetworkType,
                        );
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(secretProofTransaction.signWith(TestingRecipient, generationHash));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, () => {
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
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(aggregateSecretProofTransaction.signWith(TestingRecipient, generationHash));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, () => {
                        const secretProofTransaction = SecretProofTransaction.create(
                            Deadline.create(),
                            HashType.Op_Keccak_256,
                            secret,
                            TestingRecipient.address,
                            proof,
                            ConfNetworkType,
                        );
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(secretProofTransaction.signWith(TestingRecipient, generationHash));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, () => {
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
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(aggregateSecretProofTransaction.signWith(TestingRecipient, generationHash));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, () => {
                        const secretProofTransaction = SecretProofTransaction.create(
                            Deadline.create(),
                            HashType.Op_Hash_160,
                            secret,
                            TestingRecipient.address,
                            proof,
                            ConfNetworkType,
                        );
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(secretProofTransaction.signWith(TestingRecipient, generationHash));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, () => {
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
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(aggregateSecretProofTransaction.signWith(TestingRecipient, generationHash));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, () => {
                        const secretProofTransaction = SecretProofTransaction.create(
                            Deadline.create(),
                            HashType.Op_Hash_256,
                            secret,
                            TestingRecipient.address,
                            proof,
                            ConfNetworkType,
                        );
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(secretProofTransaction.signWith(TestingRecipient, generationHash));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount, generationHash));
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
                    validateTransactionAnnounceCorrectly(TestingAccount.address, () => {
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
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(aggregateSecretProofTransaction.signWith(TestingRecipient, generationHash));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount, generationHash));
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

    describe('aggregate complete tx', () => {
        it('should work', () => {
            const tx = TransferTransaction.create(
                Deadline.create(),
                TestingRecipient.address,
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
            const trnsHttp = new TransactionHttp(APIUrl);
            trnsHttp.announce(signedTx)
                .subscribe((res) => {
                    console.log('res', res);
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
    // describe('announceSync', () => {
    //     it('should return insufficient balance error', (done) => {
    //         const aggregateTransaction = AggregateTransaction.createBonded(
    //                         Deadline.create(),
    //                         [],
    //                         ConfNetworkType,
    //                         [],
    //                     );
    //         const signedTransaction = account.sign(aggregateTransaction);

    //         const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
    //             NetworkCurrencyMosaic.createAbsolute(0),
    //             UInt64.fromUint(10000),
    //             signedTransaction,
    //             ConfNetworkType);

    //         transactionHttp
    //             .announceSync(lockFundsTransaction.signWith(account, generationHash))
    //             .subscribe((shouldNotBeCalled) => {
    //                 throw new Error('should not be called');
    //             }, (err) => {
    //                 console.log(err);
    //                 expect(err.status).to.be.equal('Failure_LockHash_Invalid_Mosaic_Amount');
    //                 done();
    //             });
    //     });
    // });
});
