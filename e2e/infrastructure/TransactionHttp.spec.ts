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
import {expect} from 'chai';
import * as CryptoJS from 'crypto-js';
import {ChronoUnit} from 'js-joda';
import {keccak_256, sha3_256 } from 'js-sha3';
import {convert, nacl_catapult} from 'proximax-nem2-library';
import {AccountHttp} from '../../src/infrastructure/AccountHttp';
import {Listener} from '../../src/infrastructure/Listener';
import {TransactionHttp} from '../../src/infrastructure/TransactionHttp';
import {Account} from '../../src/model/account/Account';
import {Address} from '../../src/model/account/Address';
import {PublicAccount} from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../src/model/mosaic/MosaicId';
import {MosaicNonce} from '../../src/model/mosaic/MosaicNonce';
import {MosaicProperties} from '../../src/model/mosaic/MosaicProperties';
import {MosaicSupplyType} from '../../src/model/mosaic/MosaicSupplyType';
import {AggregateTransaction} from '../../src/model/transaction/AggregateTransaction';
import {CosignatureSignedTransaction} from '../../src/model/transaction/CosignatureSignedTransaction';
import {CosignatureTransaction} from '../../src/model/transaction/CosignatureTransaction';
import {Deadline} from '../../src/model/transaction/Deadline';
import {HashType} from '../../src/model/transaction/HashType';
import {LockFundsTransaction} from '../../src/model/transaction/LockFundsTransaction';
import {ModifyMultisigAccountTransaction} from '../../src/model/transaction/ModifyMultisigAccountTransaction';
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
    SeedAccount, TestingAccount, TestingRecipient, MultisigAccount, CosignatoryAccount, Cosignatory2Account, Cosignatory3Account, GetNemesisBlockDataPromise} from '../conf/conf.spec';
import { Mosaic } from '../../src/model/model';

describe('TransactionHttp', () => {
    let transactionHttp: TransactionHttp;
    let accountHttp: AccountHttp;
    let namespaceName: string;
    let mosaicId: MosaicId;
    let listener: Listener;

    before(() => {
        transactionHttp = new TransactionHttp(APIUrl);
        accountHttp = new AccountHttp(APIUrl);
        listener = new Listener(APIUrl);

        return listener.open();
    });

    after(() => {
        listener.close();
    })

    const validateTransactionAnnounceCorrectly = (address: Address, done) => {
        const sub = listener.confirmed(address).subscribe((transaction: Transaction) => {
            sub.unsubscribe();
            return done();
        });
    };

    const validatePartialTransactionAnnounceCorrectly = (address: Address, done) => {
        const sub = listener.aggregateBondedAdded(address).subscribe((transaction: Transaction) => {
            sub.unsubscribe();
            return done();
        });
    };

    const validateCosignaturePartialTransactionAnnounceCorrectly = (address: Address, publicKey, done) => {
        const sub = listener.cosignatureAdded(address).subscribe((signature) => {
            if (signature.signer === publicKey) {
                sub.unsubscribe();
                return done();
            }
        });
    };

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
                const signedTransaction = transferTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [transferTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    [],
                );
                const signedTransaction = aggregateTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('RegisterNamespaceTransaction', () => {

            it('standalone', (done) => {
                namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
                const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
                    Deadline.create(),
                    namespaceName,
                    UInt64.fromUint(1000),
                    ConfNetworkType,
                );
                const signedTransaction = registerNamespaceTransaction.signWith(TestingAccount);
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
                const signedTransaction = aggregateTransaction.signWith(TestingAccount);
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
                        levyMutable: true,
                        divisibility: 3,
                        duration: UInt64.fromUint(1000),
                    }),
                    ConfNetworkType,
                );
                const signedTransaction = mosaicDefinitionTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const nonce = MosaicNonce.createRandom();
                const mosaicId = MosaicId.createFromNonce(nonce, TestingAccount.publicAccount);
                const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                    Deadline.create(),
                    nonce,
                    mosaicId,
                    MosaicProperties.create({
                        supplyMutable: true,
                        transferable: true,
                        levyMutable: true,
                        divisibility: 3,
                        duration: UInt64.fromUint(1000),
                    }),
                    ConfNetworkType,
                );
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [mosaicDefinitionTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    []);
                const signedTransaction = aggregateTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                transactionHttp.announce(signedTransaction);
            });
        });
        xdescribe('MosaicSupplyChangeTransaction', () => {
            
            it('standalone', (done) => {
                const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
                    Deadline.create(),
                    mosaicId,
                    MosaicSupplyType.Increase,
                    UInt64.fromUint(10),
                    ConfNetworkType,
                );
                const signedTransaction = mosaicSupplyChangeTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
                    Deadline.create(),
                    mosaicId,
                    MosaicSupplyType.Increase,
                    UInt64.fromUint(10),
                    ConfNetworkType,
                );
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [mosaicSupplyChangeTransaction.toAggregate(TestingAccount.publicAccount)],
                    ConfNetworkType,
                    []);
                const signedTransaction = aggregateTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                transactionHttp.announce(signedTransaction);
            });
        });

        it('should sign a ModifyMultisigAccountTransaction with cosignatories', (done) => {
            const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
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
            );

            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10*1000000)),
                UInt64.fromUint(10000),
                signedTransaction,
                ConfNetworkType);

            setTimeout(() => {
                transactionHttp.announce(lockFundsTransaction.signWith(CosignatoryAccount));
            }, 1000);

            validateTransactionAnnounceCorrectly(CosignatoryAccount.address, () => {
                validatePartialTransactionAnnounceCorrectly(CosignatoryAccount.address, done);
                setTimeout(() => {
                    transactionHttp.announceAggregateBonded(signedTransaction);
                }, 1000);
            });
        });

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
                CosignatoryAccount,
            );

            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                UInt64.fromUint(10000),
                signedTransaction,
                ConfNetworkType);

            setTimeout(() => {
                transactionHttp.announce(lockFundsTransaction.signWith(CosignatoryAccount));
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
            });
        });

        describe('LockFundsTransaction', () => {
            it('standalone', (done) => {
                const aggregateTransaction = AggregateTransaction.createBonded(
                    Deadline.create(),
                    [],
                    ConfNetworkType,
                    [],
                );
                const signedTransaction = TestingAccount.sign(aggregateTransaction);

                const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                UInt64.fromUint(10000),
                    signedTransaction,
                    ConfNetworkType);

                validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                transactionHttp.announce(lockFundsTransaction.signWith(TestingAccount));
            });
            it('aggregate', (done) => {
                const aggregateTransaction = AggregateTransaction.createBonded(
                    Deadline.create(),
                    [],
                    ConfNetworkType,
                    [],
                );
                const signedTransaction = TestingAccount.sign(aggregateTransaction);
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
                transactionHttp.announce(aggregateLockFundsTransaction.signWith(TestingAccount));
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
                        sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
                        TestingRecipient.address,
                        ConfNetworkType,
                    );
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount));
                });

                it('aggregate', (done) => {
                    const secretLockTransaction = SecretLockTransaction.create(
                        Deadline.create(),
                        new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                        UInt64.fromUint(100),
                        HashType.Op_Sha3_256,
                        sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
                        TestingRecipient.address,
                        ConfNetworkType,
                    );
                    const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                        [secretLockTransaction.toAggregate(TestingAccount.publicAccount)],
                        ConfNetworkType,
                        []);
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(aggregateSecretLockTransaction.signWith(TestingAccount));
                });
            });
            describe('HashType: Keccak_256', () => {
                it('standalone', (done) => {
                    const secretLockTransaction = SecretLockTransaction.create(
                        Deadline.create(),
                        new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                        UInt64.fromUint(100),
                        HashType.Op_Keccak_256,
                        sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
                        TestingRecipient.address,
                        ConfNetworkType,
                    );
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount));
                });

                it('aggregate', (done) => {
                    const secretLockTransaction = SecretLockTransaction.create(
                        Deadline.create(),
                        new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                        UInt64.fromUint(100),
                        HashType.Op_Keccak_256,
                        sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
                        TestingRecipient.address,
                        ConfNetworkType,
                    );
                    const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                        [secretLockTransaction.toAggregate(TestingAccount.publicAccount)],
                        ConfNetworkType,
                        []);
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(aggregateSecretLockTransaction.signWith(TestingAccount));
                });
            });

            xdescribe('HashType: Op_Hash_160', () => {
                it('standalone', (done) => {
                    const secretLockTransaction = SecretLockTransaction.create(
                        Deadline.create(),
                        new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                        UInt64.fromUint(100),
                        HashType.Op_Hash_160,
                        sha3_256.create().update(nacl_catapult.randomBytes(20)).hex().substr(0, 40),
                        TestingRecipient.address,
                        ConfNetworkType,
                    );
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount));
                });
        
                it('aggregate', (done) => {
                    const secretLockTransaction = SecretLockTransaction.create(
                        Deadline.create(),
                        new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                        UInt64.fromUint(100),
                        HashType.Op_Hash_160,
                        sha3_256.create().update(nacl_catapult.randomBytes(20)).hex().substr(0, 40),
                        TestingRecipient.address,
                        ConfNetworkType,
                    );
                    const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                        [secretLockTransaction.toAggregate(TestingAccount.publicAccount)],
                        ConfNetworkType,
                        []);
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(aggregateSecretLockTransaction.signWith(TestingAccount));
                });
            });    
        
            describe('HashType: Op_Hash_256', () => {
                it('standalone', (done) => {
                    const secretLockTransaction = SecretLockTransaction.create(
                        Deadline.create(),
                        new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                        UInt64.fromUint(100),
                        HashType.Op_Hash_256,
                        sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
                        TestingRecipient.address,
                        ConfNetworkType,
                    );
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount));
                });

                it('aggregate', (done) => {
                    const secretLockTransaction = SecretLockTransaction.create(
                        Deadline.create(),
                        new Mosaic(ConfNetworkMosaic, UInt64.fromUint(10 * 1000000)),
                        UInt64.fromUint(100),
                        HashType.Op_Hash_256,
                        sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
                        TestingRecipient.address,
                        ConfNetworkType,
                    );
                    const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                        [secretLockTransaction.toAggregate(TestingAccount.publicAccount)],
                        ConfNetworkType,
                        []);
                    validateTransactionAnnounceCorrectly(TestingAccount.address, done);
                    transactionHttp.announce(aggregateSecretLockTransaction.signWith(TestingAccount));
                });
            });

        });

        describe('SecretProofTransaction', () => {
            describe('HashType: Op_Sha3_256', () => {
                it('standalone', (done) => {
                    const secretSeed = nacl_catapult.randomBytes(20);
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
                            proof,
                            ConfNetworkType,
                        );
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(secretProofTransaction.signWith(TestingRecipient));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount));
                });

                it('aggregate', (done) => {
                    const secretSeed = nacl_catapult.randomBytes(20);
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
                            proof,
                            ConfNetworkType,
                        );
                        const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                            [secretProofTransaction.toAggregate(TestingRecipient.publicAccount)],
                            ConfNetworkType,
                            []);
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(aggregateSecretProofTransaction.signWith(TestingRecipient));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount));
                });
            });
            describe('HashType: Op_Keccak_256', () => {
                it('standalone', (done) => {
                    const secretSeed = nacl_catapult.randomBytes(20);
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
                            proof,
                            ConfNetworkType,
                        );
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(secretProofTransaction.signWith(TestingRecipient));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount));
                });

                it('aggregate', (done) => {
                    const secretSeed = nacl_catapult.randomBytes(20);
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
                            proof,
                            ConfNetworkType,
                        );
                        const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                            [secretProofTransaction.toAggregate(TestingRecipient.publicAccount)],
                            ConfNetworkType,
                            []);
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(aggregateSecretProofTransaction.signWith(TestingRecipient));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount));
                });
            });

            xdescribe('HashType: Op_Hash_160', () => {
                it('standalone', (done) => {
                    const secretSeed = nacl_catapult.randomBytes(20);
                    const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(String.fromCharCode.apply(null, secretSeed)).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
                    const proof = convert.uint8ToHex(secretSeed);
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
                            proof,
                            ConfNetworkType,
                        );
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(secretProofTransaction.signWith(TestingRecipient));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount));
                });

                it('aggregate', (done) => {
                    const secretSeed = String.fromCharCode.apply(null, nacl_catapult.randomBytes(20));
                    const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
                    const proof = convert.uint8ToHex(secretSeed);
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
                            proof,
                            ConfNetworkType,
                        );
                        const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                            [secretProofTransaction.toAggregate(TestingRecipient.publicAccount)],
                            ConfNetworkType,
                            []);
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(aggregateSecretProofTransaction.signWith(TestingRecipient));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount));
                });
            });

            xdescribe('HashType: Op_Hash_256', () => {
                it('standalone', (done) => {
                    const secretSeed = String.fromCharCode.apply(null, nacl_catapult.randomBytes(20));
                    //const secret = CryptoJS.SHA256(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
                    const secret = CryptoJS.SHA256(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
                    const proof = convert.uint8ToHex(secretSeed);
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
                            proof,
                            ConfNetworkType,
                        );
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(secretProofTransaction.signWith(TestingRecipient));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount));
                });

                it('aggregate', (done) => {
                    const secretSeed = String.fromCharCode.apply(null, nacl_catapult.randomBytes(20));
                    const secret = CryptoJS.SHA256(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
                    const proof = convert.uint8ToHex(secretSeed);
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
                            proof,
                            ConfNetworkType,
                        );
                        const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                            [secretProofTransaction.toAggregate(TestingRecipient.publicAccount)],
                            ConfNetworkType,
                            []);
                        validateTransactionAnnounceCorrectly(TestingRecipient.address, done);
                        transactionHttp.announce(aggregateSecretProofTransaction.signWith(TestingRecipient));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(TestingAccount));
                });
            });
        });
    });

    describe('getTransaction', () => {
        it('should return transaction info given transactionHash', (done) => {
            GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransaction(data.someTxHash)
                .subscribe((transaction) => {
                    expect(transaction.transactionInfo!.hash).to.be.equal(data.someTxHash);
                    expect(transaction.transactionInfo!.id).to.be.equal(data.someTxId);
                    done();
                });
            })
        });

        it('should return transaction info given transactionId', (done) => {
            GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransaction(data.someTxId)
                .subscribe((transaction) => {
                    expect(transaction.transactionInfo!.hash).to.be.equal(data.someTxHash);
                    expect(transaction.transactionInfo!.id).to.be.equal(data.someTxId);
                    done();
                });
            });
        });
    });

    describe('getTransactions', () => {
        it('should return transaction info given array of transactionHash', (done) => {
            GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactions([data.someTxHash])
                .subscribe((transactions) => {
                    expect(transactions[0].transactionInfo!.hash).to.be.equal(data.someTxHash);
                    expect(transactions[0].transactionInfo!.id).to.be.equal(data.someTxId);
                    done();
                });
            });
        });

        it('should return transaction info given array of transactionId', (done) => {
            GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactions([data.someTxId])
                .subscribe((transactions) => {
                    expect(transactions[0].transactionInfo!.hash).to.be.equal(data.someTxHash);
                    expect(transactions[0].transactionInfo!.id).to.be.equal(data.someTxId);
                    done();
                });
            });
        });
    });

    describe('getTransactionStatus', () => {
        it('should return transaction status given array transactionHash', (done) => {
            GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactionStatus(data.someTxHash)
                .subscribe((transactionStatus) => {
                    expect(transactionStatus.group).to.be.equal('confirmed');
                    expect(transactionStatus.height.lower).to.be.equal(1);
                    expect(transactionStatus.height.higher).to.be.equal(0);
                    done();
                });
            });
        });
    });

    describe('getTransactionsStatuses', () => {
        it('should return transaction status given array of transactionHash', (done) => {
            GetNemesisBlockDataPromise().then((data) => {
                transactionHttp.getTransactionsStatuses([data.someTxHash])
                .subscribe((transactionStatuses) => {
                    expect(transactionStatuses[0].group).to.be.equal('confirmed');
                    expect(transactionStatuses[0].height.lower).to.be.equal(1);
                    expect(transactionStatuses[0].height.higher).to.be.equal(0);
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

            const signedTx = TestingAccount.sign(aggTx);
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
            const signedTx = TestingAccount.sign(aggTx);
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
            const signedTx = signerAccount.sign(tx);
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
                transactionHttp.getTransactionEffectiveFee(data.someTxHash)
                .subscribe((effectiveFee) => {
                    expect(effectiveFee).to.not.be.undefined;
                    expect(effectiveFee).to.be.equal(0);
                    done();
                });
            });
        });
    });
});
