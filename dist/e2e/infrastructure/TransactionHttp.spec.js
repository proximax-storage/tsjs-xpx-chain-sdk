"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const chai_1 = require("chai");
const CryptoJS = require("crypto-js");
const js_joda_1 = require("js-joda");
const js_sha3_1 = require("js-sha3");
const js_xpx_catapult_library_1 = require("js-xpx-catapult-library");
const AccountHttp_1 = require("../../src/infrastructure/AccountHttp");
const Listener_1 = require("../../src/infrastructure/Listener");
const TransactionHttp_1 = require("../../src/infrastructure/TransactionHttp");
const Account_1 = require("../../src/model/account/Account");
const Address_1 = require("../../src/model/account/Address");
const PublicAccount_1 = require("../../src/model/account/PublicAccount");
const NetworkType_1 = require("../../src/model/blockchain/NetworkType");
const MosaicId_1 = require("../../src/model/mosaic/MosaicId");
const MosaicNonce_1 = require("../../src/model/mosaic/MosaicNonce");
const MosaicProperties_1 = require("../../src/model/mosaic/MosaicProperties");
const MosaicSupplyType_1 = require("../../src/model/mosaic/MosaicSupplyType");
const NetworkCurrencyMosaic_1 = require("../../src/model/mosaic/NetworkCurrencyMosaic");
const AggregateTransaction_1 = require("../../src/model/transaction/AggregateTransaction");
const CosignatureSignedTransaction_1 = require("../../src/model/transaction/CosignatureSignedTransaction");
const CosignatureTransaction_1 = require("../../src/model/transaction/CosignatureTransaction");
const Deadline_1 = require("../../src/model/transaction/Deadline");
const HashType_1 = require("../../src/model/transaction/HashType");
const LockFundsTransaction_1 = require("../../src/model/transaction/LockFundsTransaction");
const ModifyMultisigAccountTransaction_1 = require("../../src/model/transaction/ModifyMultisigAccountTransaction");
const MosaicDefinitionTransaction_1 = require("../../src/model/transaction/MosaicDefinitionTransaction");
const MosaicSupplyChangeTransaction_1 = require("../../src/model/transaction/MosaicSupplyChangeTransaction");
const MultisigCosignatoryModification_1 = require("../../src/model/transaction/MultisigCosignatoryModification");
const MultisigCosignatoryModificationType_1 = require("../../src/model/transaction/MultisigCosignatoryModificationType");
const PlainMessage_1 = require("../../src/model/transaction/PlainMessage");
const RegisterNamespaceTransaction_1 = require("../../src/model/transaction/RegisterNamespaceTransaction");
const SecretLockTransaction_1 = require("../../src/model/transaction/SecretLockTransaction");
const SecretProofTransaction_1 = require("../../src/model/transaction/SecretProofTransaction");
const SignedTransaction_1 = require("../../src/model/transaction/SignedTransaction");
const TransactionType_1 = require("../../src/model/transaction/TransactionType");
const TransferTransaction_1 = require("../../src/model/transaction/TransferTransaction");
const UInt64_1 = require("../../src/model/UInt64");
const conf_spec_1 = require("../conf/conf.spec");
const conf = require("../conf/conf.spec");
describe('TransactionHttp', () => {
    let account;
    let account2;
    let transactionHttp;
    let accountHttp;
    let namespaceName;
    let mosaicId;
    let listener;
    const transactionHash = 'A192621335D733351A7035644F87338B0B9E36B3FAE61253E230B1A0D8BEA332';
    const transactionId = '5A2139FC9CD1E80001573357';
    before(() => {
        account = conf_spec_1.TestingAccount;
        account2 = conf_spec_1.CosignatoryAccount;
        transactionHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.APIUrl);
        accountHttp = new AccountHttp_1.AccountHttp(conf.APIUrl);
        listener = new Listener_1.Listener(conf_spec_1.APIUrl);
        return listener.open();
    });
    const validateTransactionAnnounceCorrectly = (address, done) => {
        listener.confirmed(address).subscribe((transaction) => {
            return done();
        });
    };
    const validatePartialTransactionAnnounceCorrectly = (address, done) => {
        listener.aggregateBondedAdded(address).subscribe((transaction) => {
            return done();
        });
    };
    const validateCosignaturePartialTransactionAnnounceCorrectly = (address, publicKey, done) => {
        listener.cosignatureAdded(address).subscribe((signature) => {
            if (signature.signer === publicKey) {
                return done();
            }
        });
    };
    describe('announce', () => {
        describe('TransferTransaction', () => {
            const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10)], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
            it('standalone', (done) => {
                const signedTransaction = transferTransaction.signWith(account);
                validateTransactionAnnounceCorrectly(account.address, done);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [transferTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
                const signedTransaction = aggregateTransaction.signWith(account);
                validateTransactionAnnounceCorrectly(account.address, done);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('RegisterNamespaceTransaction', () => {
            it('standalone', (done) => {
                namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
                const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createRootNamespace(Deadline_1.Deadline.create(), namespaceName, UInt64_1.UInt64.fromUint(1000), NetworkType_1.NetworkType.MIJIN_TEST);
                const signedTransaction = registerNamespaceTransaction.signWith(account);
                validateTransactionAnnounceCorrectly(account.address, done);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createRootNamespace(Deadline_1.Deadline.create(), 'root-test-namespace-' + Math.floor(Math.random() * 10000), UInt64_1.UInt64.fromUint(1000), NetworkType_1.NetworkType.MIJIN_TEST);
                const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [registerNamespaceTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
                const signedTransaction = aggregateTransaction.signWith(account);
                validateTransactionAnnounceCorrectly(account.address, done);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('MosaicDefinitionTransaction', () => {
            it('standalone', (done) => {
                const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
                new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
                MosaicProperties_1.MosaicProperties.create({
                    supplyMutable: true,
                    transferable: true,
                    levyMutable: true,
                    divisibility: 3,
                    duration: UInt64_1.UInt64.fromUint(1000),
                }), NetworkType_1.NetworkType.MIJIN_TEST);
                mosaicId = mosaicDefinitionTransaction.mosaicId;
                const signedTransaction = mosaicDefinitionTransaction.signWith(account);
                validateTransactionAnnounceCorrectly(account.address, done);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const mosaicDefinitionTransaction = MosaicDefinitionTransaction_1.MosaicDefinitionTransaction.create(Deadline_1.Deadline.create(), new MosaicNonce_1.MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
                new MosaicId_1.MosaicId(UInt64_1.UInt64.fromUint(1).toDTO()), // ID
                MosaicProperties_1.MosaicProperties.create({
                    supplyMutable: true,
                    transferable: true,
                    levyMutable: true,
                    divisibility: 3,
                    duration: UInt64_1.UInt64.fromUint(1000),
                }), NetworkType_1.NetworkType.MIJIN_TEST);
                const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [mosaicDefinitionTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
                const signedTransaction = aggregateTransaction.signWith(account);
                validateTransactionAnnounceCorrectly(account.address, done);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('MosaicSupplyChangeTransaction', () => {
            it('standalone', (done) => {
                const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction_1.MosaicSupplyChangeTransaction.create(Deadline_1.Deadline.create(), mosaicId, MosaicSupplyType_1.MosaicSupplyType.Increase, UInt64_1.UInt64.fromUint(10), NetworkType_1.NetworkType.MIJIN_TEST);
                const signedTransaction = mosaicSupplyChangeTransaction.signWith(account);
                validateTransactionAnnounceCorrectly(account.address, done);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction_1.MosaicSupplyChangeTransaction.create(Deadline_1.Deadline.create(), mosaicId, MosaicSupplyType_1.MosaicSupplyType.Increase, UInt64_1.UInt64.fromUint(10), NetworkType_1.NetworkType.MIJIN_TEST);
                const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
                const signedTransaction = aggregateTransaction.signWith(account);
                validateTransactionAnnounceCorrectly(account.address, done);
                transactionHttp.announce(signedTransaction);
            });
        });
        it('should sign a ModifyMultisigAccountTransaction with cosignatories', (done) => {
            const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction_1.ModifyMultisigAccountTransaction.create(Deadline_1.Deadline.create(), 0, 0, [new MultisigCosignatoryModification_1.MultisigCosignatoryModification(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Add, PublicAccount_1.PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24', NetworkType_1.NetworkType.MIJIN_TEST))], NetworkType_1.NetworkType.MIJIN_TEST);
            const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(20, js_joda_1.ChronoUnit.MINUTES), [modifyMultisigAccountTransaction.toAggregate(conf_spec_1.MultisigAccount.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
            const signedTransaction = conf_spec_1.CosignatoryAccount.signTransactionWithCosignatories(aggregateTransaction, [conf_spec_1.Cosignatory2Account]);
            const lockFundsTransaction = LockFundsTransaction_1.LockFundsTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10), UInt64_1.UInt64.fromUint(10000), signedTransaction, NetworkType_1.NetworkType.MIJIN_TEST);
            setTimeout(() => {
                transactionHttp.announce(lockFundsTransaction.signWith(conf_spec_1.CosignatoryAccount));
            }, 1000);
            validateTransactionAnnounceCorrectly(conf_spec_1.CosignatoryAccount.address, () => {
                validatePartialTransactionAnnounceCorrectly(conf_spec_1.CosignatoryAccount.address, done);
                setTimeout(() => {
                    transactionHttp.announceAggregateBonded(signedTransaction);
                }, 1000);
            });
        });
        it('CosignatureTransaction', (done) => {
            const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(1)], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
            const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(2, js_joda_1.ChronoUnit.MINUTES), [transferTransaction.toAggregate(conf_spec_1.MultisigAccount.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
            const signedTransaction = aggregateTransaction.signWith(conf_spec_1.CosignatoryAccount);
            const lockFundsTransaction = LockFundsTransaction_1.LockFundsTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10), UInt64_1.UInt64.fromUint(10000), signedTransaction, NetworkType_1.NetworkType.MIJIN_TEST);
            setTimeout(() => {
                transactionHttp.announce(lockFundsTransaction.signWith(conf_spec_1.CosignatoryAccount));
            }, 1000);
            validateTransactionAnnounceCorrectly(conf_spec_1.CosignatoryAccount.address, () => {
                setTimeout(() => {
                    transactionHttp.announceAggregateBonded(signedTransaction);
                }, 1000);
                validateCosignaturePartialTransactionAnnounceCorrectly(conf_spec_1.CosignatoryAccount.address, conf_spec_1.Cosignatory2Account.publicKey, done);
                validatePartialTransactionAnnounceCorrectly(conf_spec_1.CosignatoryAccount.address, () => {
                    accountHttp.aggregateBondedTransactions(conf_spec_1.CosignatoryAccount.publicAccount).subscribe((transactions) => {
                        const partialTransaction = transactions[0];
                        const cosignatureTransaction = CosignatureTransaction_1.CosignatureTransaction.create(partialTransaction);
                        const cosignatureSignedTransaction = conf_spec_1.Cosignatory2Account.signCosignatureTransaction(cosignatureTransaction);
                        transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction);
                    });
                });
            });
        });
        describe('LockFundsTransaction', () => {
            it('standalone', (done) => {
                const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(), [], NetworkType_1.NetworkType.MIJIN_TEST, []);
                const signedTransaction = account.sign(aggregateTransaction);
                const lockFundsTransaction = LockFundsTransaction_1.LockFundsTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10), UInt64_1.UInt64.fromUint(10000), signedTransaction, NetworkType_1.NetworkType.MIJIN_TEST);
                validateTransactionAnnounceCorrectly(account.address, done);
                transactionHttp.announce(lockFundsTransaction.signWith(account));
            });
            it('aggregate', (done) => {
                const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createBonded(Deadline_1.Deadline.create(), [], NetworkType_1.NetworkType.MIJIN_TEST, []);
                const signedTransaction = account.sign(aggregateTransaction);
                const lockFundsTransaction = LockFundsTransaction_1.LockFundsTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10), UInt64_1.UInt64.fromUint(10), signedTransaction, NetworkType_1.NetworkType.MIJIN_TEST);
                const aggregateLockFundsTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [lockFundsTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
                validateTransactionAnnounceCorrectly(account.address, done);
                transactionHttp.announce(aggregateLockFundsTransaction.signWith(account));
            });
        });
        describe('SecretLockTransaction', () => {
            describe('HashType: Op_Sha3_256', () => {
                it('standalone', (done) => {
                    const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Sha3_256, js_sha3_1.sha3_256.create().update(js_xpx_catapult_library_1.nacl_catapult.randomBytes(20)).hex(), Address_1.Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'), NetworkType_1.NetworkType.MIJIN_TEST);
                    validateTransactionAnnounceCorrectly(account.address, done);
                    transactionHttp.announce(secretLockTransaction.signWith(account));
                });
                it('aggregate', (done) => {
                    const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Sha3_256, js_sha3_1.sha3_256.create().update(js_xpx_catapult_library_1.nacl_catapult.randomBytes(20)).hex(), Address_1.Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'), NetworkType_1.NetworkType.MIJIN_TEST);
                    const aggregateSecretLockTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [secretLockTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
                    validateTransactionAnnounceCorrectly(account.address, done);
                    transactionHttp.announce(aggregateSecretLockTransaction.signWith(account));
                });
            });
            describe('HashType: Keccak_256', () => {
                it('standalone', (done) => {
                    const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Keccak_256, js_sha3_1.sha3_256.create().update(js_xpx_catapult_library_1.nacl_catapult.randomBytes(20)).hex(), Address_1.Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'), NetworkType_1.NetworkType.MIJIN_TEST);
                    validateTransactionAnnounceCorrectly(account.address, done);
                    transactionHttp.announce(secretLockTransaction.signWith(account));
                });
                it('aggregate', (done) => {
                    const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Keccak_256, js_sha3_1.sha3_256.create().update(js_xpx_catapult_library_1.nacl_catapult.randomBytes(20)).hex(), Address_1.Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'), NetworkType_1.NetworkType.MIJIN_TEST);
                    const aggregateSecretLockTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [secretLockTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
                    validateTransactionAnnounceCorrectly(account.address, done);
                    transactionHttp.announce(aggregateSecretLockTransaction.signWith(account));
                });
            });
            describe('HashType: Op_Hash_160', () => {
                it('standalone', (done) => {
                    const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Hash_160, js_sha3_1.sha3_256.create().update(js_xpx_catapult_library_1.nacl_catapult.randomBytes(20)).hex(), Address_1.Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'), NetworkType_1.NetworkType.MIJIN_TEST);
                    validateTransactionAnnounceCorrectly(account.address, done);
                    transactionHttp.announce(secretLockTransaction.signWith(account));
                });
                it('aggregate', (done) => {
                    const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Hash_160, js_sha3_1.sha3_256.create().update(js_xpx_catapult_library_1.nacl_catapult.randomBytes(20)).hex(), Address_1.Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'), NetworkType_1.NetworkType.MIJIN_TEST);
                    const aggregateSecretLockTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [secretLockTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
                    validateTransactionAnnounceCorrectly(account.address, done);
                    transactionHttp.announce(aggregateSecretLockTransaction.signWith(account));
                });
            });
            describe('HashType: Op_Hash_256', () => {
                it('standalone', (done) => {
                    const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Hash_256, js_sha3_1.sha3_256.create().update(js_xpx_catapult_library_1.nacl_catapult.randomBytes(20)).hex(), Address_1.Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'), NetworkType_1.NetworkType.MIJIN_TEST);
                    validateTransactionAnnounceCorrectly(account.address, done);
                    transactionHttp.announce(secretLockTransaction.signWith(account));
                });
                it('aggregate', (done) => {
                    const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Hash_256, js_sha3_1.sha3_256.create().update(js_xpx_catapult_library_1.nacl_catapult.randomBytes(20)).hex(), Address_1.Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'), NetworkType_1.NetworkType.MIJIN_TEST);
                    const aggregateSecretLockTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [secretLockTransaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
                    validateTransactionAnnounceCorrectly(account.address, done);
                    transactionHttp.announce(aggregateSecretLockTransaction.signWith(account));
                });
            });
        });
        describe('SecretProofTransaction', () => {
            describe('HashType: Op_Sha3_256', () => {
                it('standalone', (done) => {
                    const secretSeed = js_xpx_catapult_library_1.nacl_catapult.randomBytes(20);
                    const secret = js_sha3_1.sha3_256.create().update(secretSeed).hex();
                    const proof = js_xpx_catapult_library_1.convert.uint8ToHex(secretSeed);
                    const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Sha3_256, secret, account2.address, NetworkType_1.NetworkType.MIJIN_TEST);
                    validateTransactionAnnounceCorrectly(account.address, () => {
                        const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Sha3_256, secret, proof, NetworkType_1.NetworkType.MIJIN_TEST);
                        validateTransactionAnnounceCorrectly(account2.address, done);
                        transactionHttp.announce(secretProofTransaction.signWith(account2));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(account));
                });
                it('aggregate', (done) => {
                    const secretSeed = js_xpx_catapult_library_1.nacl_catapult.randomBytes(20);
                    const secret = js_sha3_1.sha3_256.create().update(secretSeed).hex();
                    const proof = js_xpx_catapult_library_1.convert.uint8ToHex(secretSeed);
                    const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Sha3_256, secret, account2.address, NetworkType_1.NetworkType.MIJIN_TEST);
                    validateTransactionAnnounceCorrectly(account.address, () => {
                        const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Sha3_256, secret, proof, NetworkType_1.NetworkType.MIJIN_TEST);
                        const aggregateSecretProofTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [secretProofTransaction.toAggregate(account2.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
                        validateTransactionAnnounceCorrectly(account2.address, done);
                        transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2));
                    });
                    transactionHttp.announce(secretLockTransaction.signWith(account));
                });
            });
        });
        describe('HashType: Op_Keccak_256', () => {
            it('standalone', (done) => {
                const secretSeed = js_xpx_catapult_library_1.nacl_catapult.randomBytes(20);
                const secret = js_sha3_1.keccak_256.create().update(secretSeed).hex();
                const proof = js_xpx_catapult_library_1.convert.uint8ToHex(secretSeed);
                const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Keccak_256, secret, account2.address, NetworkType_1.NetworkType.MIJIN_TEST);
                validateTransactionAnnounceCorrectly(account.address, () => {
                    const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Keccak_256, secret, proof, NetworkType_1.NetworkType.MIJIN_TEST);
                    validateTransactionAnnounceCorrectly(account2.address, done);
                    transactionHttp.announce(secretProofTransaction.signWith(account2));
                });
                transactionHttp.announce(secretLockTransaction.signWith(account));
            });
            it('aggregate', (done) => {
                const secretSeed = js_xpx_catapult_library_1.nacl_catapult.randomBytes(20);
                const secret = js_sha3_1.keccak_256.create().update(secretSeed).hex();
                const proof = js_xpx_catapult_library_1.convert.uint8ToHex(secretSeed);
                const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Keccak_256, secret, account2.address, NetworkType_1.NetworkType.MIJIN_TEST);
                validateTransactionAnnounceCorrectly(account.address, () => {
                    const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Keccak_256, secret, proof, NetworkType_1.NetworkType.MIJIN_TEST);
                    const aggregateSecretProofTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [secretProofTransaction.toAggregate(account2.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
                    validateTransactionAnnounceCorrectly(account2.address, done);
                    transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2));
                });
                transactionHttp.announce(secretLockTransaction.signWith(account));
            });
        });
        describe('HashType: Op_Hash_160', () => {
            it('standalone', (done) => {
                const secretSeed = String.fromCharCode.apply(null, js_xpx_catapult_library_1.nacl_catapult.randomBytes(20));
                const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
                const proof = js_xpx_catapult_library_1.convert.uint8ToHex(secretSeed);
                const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Hash_160, secret, account2.address, NetworkType_1.NetworkType.MIJIN_TEST);
                validateTransactionAnnounceCorrectly(account.address, () => {
                    const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Hash_160, secret, proof, NetworkType_1.NetworkType.MIJIN_TEST);
                    validateTransactionAnnounceCorrectly(account2.address, done);
                    transactionHttp.announce(secretProofTransaction.signWith(account2));
                });
                transactionHttp.announce(secretLockTransaction.signWith(account));
            });
            it('aggregate', (done) => {
                const secretSeed = String.fromCharCode.apply(null, js_xpx_catapult_library_1.nacl_catapult.randomBytes(20));
                const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
                const proof = js_xpx_catapult_library_1.convert.uint8ToHex(secretSeed);
                const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Hash_160, secret, account2.address, NetworkType_1.NetworkType.MIJIN_TEST);
                validateTransactionAnnounceCorrectly(account.address, () => {
                    const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Hash_160, secret, proof, NetworkType_1.NetworkType.MIJIN_TEST);
                    const aggregateSecretProofTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [secretProofTransaction.toAggregate(account2.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
                    validateTransactionAnnounceCorrectly(account2.address, done);
                    transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2));
                });
                transactionHttp.announce(secretLockTransaction.signWith(account));
            });
        });
        describe('HashType: Op_Hash_256', () => {
            it('standalone', (done) => {
                const secretSeed = String.fromCharCode.apply(null, js_xpx_catapult_library_1.nacl_catapult.randomBytes(20));
                const secret = CryptoJS.SHA256(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
                const proof = js_xpx_catapult_library_1.convert.uint8ToHex(secretSeed);
                const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Hash_256, secret, account2.address, NetworkType_1.NetworkType.MIJIN_TEST);
                validateTransactionAnnounceCorrectly(account.address, () => {
                    const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Hash_256, secret, proof, NetworkType_1.NetworkType.MIJIN_TEST);
                    validateTransactionAnnounceCorrectly(account2.address, done);
                    transactionHttp.announce(secretProofTransaction.signWith(account2));
                });
                transactionHttp.announce(secretLockTransaction.signWith(account));
            });
            it('aggregate', (done) => {
                const secretSeed = String.fromCharCode.apply(null, js_xpx_catapult_library_1.nacl_catapult.randomBytes(20));
                const secret = CryptoJS.SHA256(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
                const proof = js_xpx_catapult_library_1.convert.uint8ToHex(secretSeed);
                const secretLockTransaction = SecretLockTransaction_1.SecretLockTransaction.create(Deadline_1.Deadline.create(), NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createAbsolute(10), UInt64_1.UInt64.fromUint(100), HashType_1.HashType.Op_Hash_256, secret, account2.address, NetworkType_1.NetworkType.MIJIN_TEST);
                validateTransactionAnnounceCorrectly(account.address, () => {
                    const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Hash_256, secret, proof, NetworkType_1.NetworkType.MIJIN_TEST);
                    const aggregateSecretProofTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [secretProofTransaction.toAggregate(account2.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
                    validateTransactionAnnounceCorrectly(account2.address, done);
                    transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2));
                });
                transactionHttp.announce(secretLockTransaction.signWith(account));
            });
        });
    });
    describe('getTransaction', () => {
        it('should return transaction info given transactionHash', (done) => {
            transactionHttp.getTransaction(transactionHash)
                .subscribe((transaction) => {
                chai_1.expect(transaction.transactionInfo.hash).to.be.equal(transactionHash);
                chai_1.expect(transaction.transactionInfo.id).to.be.equal(transactionId);
                done();
            });
        });
        it('should return transaction info given transactionId', (done) => {
            transactionHttp.getTransaction(transactionId)
                .subscribe((transaction) => {
                chai_1.expect(transaction.transactionInfo.hash).to.be.equal(transactionHash);
                chai_1.expect(transaction.transactionInfo.id).to.be.equal(transactionId);
                done();
            });
        });
    });
    describe('getTransactions', () => {
        it('should return transaction info given array of transactionHash', (done) => {
            transactionHttp.getTransactions([transactionHash])
                .subscribe((transactions) => {
                chai_1.expect(transactions[0].transactionInfo.hash).to.be.equal(transactionHash);
                chai_1.expect(transactions[0].transactionInfo.id).to.be.equal(transactionId);
                done();
            });
        });
        it('should return transaction info given array of transactionId', (done) => {
            transactionHttp.getTransactions([transactionId])
                .subscribe((transactions) => {
                chai_1.expect(transactions[0].transactionInfo.hash).to.be.equal(transactionHash);
                chai_1.expect(transactions[0].transactionInfo.id).to.be.equal(transactionId);
                done();
            });
        });
    });
    describe('getTransactionStatus', () => {
        it('should return transaction status given array transactionHash', (done) => {
            transactionHttp.getTransactionStatus(transactionHash)
                .subscribe((transactionStatus) => {
                chai_1.expect(transactionStatus.group).to.be.equal('confirmed');
                chai_1.expect(transactionStatus.height.lower).to.be.equal(1);
                chai_1.expect(transactionStatus.height.higher).to.be.equal(0);
                done();
            });
        });
    });
    describe('getTransactionsStatuses', () => {
        it('should return transaction status given array of transactionHash', (done) => {
            transactionHttp.getTransactionsStatuses([transactionHash])
                .subscribe((transactionStatuses) => {
                chai_1.expect(transactionStatuses[0].group).to.be.equal('confirmed');
                chai_1.expect(transactionStatuses[0].height.lower).to.be.equal(1);
                chai_1.expect(transactionStatuses[0].height.higher).to.be.equal(0);
                done();
            });
        });
    });
    describe('announce', () => {
        it('should return success when announce', (done) => {
            const payload = new SignedTransaction_1.SignedTransaction('', '', '', TransactionType_1.TransactionType.TRANSFER, NetworkType_1.NetworkType.MIJIN_TEST);
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
            const payload = new SignedTransaction_1.SignedTransaction('', '', '', TransactionType_1.TransactionType.TRANSFER, NetworkType_1.NetworkType.MIJIN_TEST);
            transactionHttp.announceAggregateBonded(payload)
                .subscribe((transactionAnnounceResponse) => {
                chai_1.expect(transactionAnnounceResponse.message)
                    .to.be.equal('packet 500 was pushed to the network via /transaction/partial');
                done();
            });
        });
    });
    describe('announceAggregateBondedCosignature', () => {
        it('should return success when announceAggregateBondedCosignature', (done) => {
            const payload = new CosignatureSignedTransaction_1.CosignatureSignedTransaction('', '', '');
            transactionHttp.announceAggregateBondedCosignature(payload)
                .subscribe((transactionAnnounceResponse) => {
                chai_1.expect(transactionAnnounceResponse.message)
                    .to.be.equal('packet 501 was pushed to the network via /transaction/cosignature');
                done();
            });
        });
    });
    describe('aggregate complete tx', () => {
        it('should work', () => {
            const signerAccount = Account_1.Account.createFromPrivateKey('5098D500390934F81EA416D9A2F50F276DE446E28488E1801212931E3470DA31', NetworkType_1.NetworkType.MIJIN_TEST);
            const tx = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SAGY2PTFX4T2XYKYXTJXYCTQRP3FESQH5MEQI2RQ'), [], PlainMessage_1.PlainMessage.create('Hi'), NetworkType_1.NetworkType.MIJIN_TEST);
            const aggTx = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [
                tx.toAggregate(signerAccount.publicAccount),
            ], NetworkType_1.NetworkType.MIJIN_TEST, []);
            const signedTx = signerAccount.sign(aggTx);
            const trnsHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.APIUrl);
            trnsHttp.announceAggregateBonded(signedTx)
                .subscribe((res) => {
                console.log('res', res);
            });
        });
    });
    describe('announceSync', () => {
        it('should return insufficient balance error', (done) => {
            const signerAccount = Account_1.Account.createFromPrivateKey('5098D500390934F81EA416D9A2F50F276DE446E28488E1801212931E3470DA31', NetworkType_1.NetworkType.MIJIN_TEST);
            const tx = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SAGY2PTFX4T2XYKYXTJXYCTQRP3FESQH5MEQI2RQ'), [NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(10)], PlainMessage_1.EmptyMessage, NetworkType_1.NetworkType.MIJIN_TEST);
            const signedTx = signerAccount.sign(tx);
            const trnsHttp = new TransactionHttp_1.TransactionHttp(conf_spec_1.APIUrl);
            trnsHttp
                .announceSync(signedTx)
                .subscribe((shouldNotBeCalled) => {
                throw new Error('should not be called');
            }, (err) => {
                chai_1.expect(err.status).to.be.equal('Failure_Core_Insufficient_Balance');
                done();
            });
        });
    });
    describe('getTransactionEffectiveFee', () => {
        it('should return effective paid fee given transactionHash', (done) => {
            transactionHttp.getTransactionEffectiveFee(transactionHash)
                .subscribe((effectiveFee) => {
                chai_1.expect(effectiveFee).to.not.be.undefined;
                chai_1.expect(effectiveFee).to.be.equal(0);
                done();
            });
        });
    });
});
//# sourceMappingURL=TransactionHttp.spec.js.map