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

import {deepStrictEqual} from 'assert';
import {assert, expect} from 'chai';
import {AccountHttp} from '../../src/infrastructure/AccountHttp';
import {QueryParams} from '../../src/infrastructure/QueryParams';
import {TransactionQueryParams} from '../../src/infrastructure/TransactionQueryParams';

import { TestingAccount, MultisigAccount, APIUrl, CosignatoryAccount, Cosignatory2Account, Cosignatory3Account, TestingRecipient, SeedAccount } from '../conf/conf.spec';
import { ConfUtils } from '../conf/ConfUtils';
import { RestrictionType } from '../../src/model/model';

const accountHttp = new AccountHttp(APIUrl);

describe('AccountHttp', () => {

    describe('getAccountInfo', () => {
        it('should return account data given a Sirius Address', (done) => {
            accountHttp.getAccountInfo(TestingAccount.address)
                .subscribe((accountInfo) => {
                    expect(accountInfo.publicKey).to.be.equal(TestingAccount.publicKey);
                    done();
            });
        });
    });

    describe('getAccountsInfo', () => {
        it('should return account data given a Sirius Address', (done) => {
            accountHttp.getAccountsInfo([TestingAccount.address])
                .subscribe((accountsInfo) => {
                    expect(accountsInfo[0].publicKey).to.be.equal(TestingAccount.publicKey);
                    done();
                });
        });
    });

    describe('getAccountRestrictions', () => {
        it('should call getAccountRestrictions successfully', (done) => {
            setTimeout(() => {
                accountHttp.getAccountRestrictions(TestingAccount.address).subscribe((accountRestrictions) => {
                    deepStrictEqual(accountRestrictions.accountRestrictions.address, TestingAccount.address);
                    deepStrictEqual(accountRestrictions.accountRestrictions.restrictions[0]!.restrictionType, RestrictionType.BlockAddress);
                    deepStrictEqual(accountRestrictions.accountRestrictions.restrictions[0]!.values[0], TestingRecipient.address);
                    done();
                });
            }, 1000);
        });
    });

    describe('getAccountRestrictions', () => {
        it('should call getAccountRestrictions successfully', (done) => {
            setTimeout(() => {
                accountHttp.getAccountRestrictionsFromAccounts([TestingAccount.address]).subscribe((accountRestrictions) => {
                    deepStrictEqual(accountRestrictions[0]!.accountRestrictions.address, TestingAccount.address);
                    deepStrictEqual(accountRestrictions[0]!.accountRestrictions.restrictions[0]!.restrictionType, RestrictionType.BlockAddress);
                    deepStrictEqual(accountRestrictions[0]!.accountRestrictions.restrictions[0]!.values[0], TestingRecipient.address);
                    done();
                });
            }, 1000);
        });
    });

    describe('getMultisigAccountGraphInfo', () => {
        it('should call getMultisigAccountGraphInfo successfully', (done) => {
            setTimeout(() => {
                accountHttp.getMultisigAccountGraphInfo(MultisigAccount.address).subscribe((multisigAccountGraphInfo) => {
                    expect(multisigAccountGraphInfo.multisigAccounts.get(0)![0].
                        account.publicKey).to.be.equal(MultisigAccount.publicKey);
                    done();
                });
            }, 1000);
        });
    });
    describe('getMultisigAccountInfo', () => {
        it('should call getMultisigAccountInfo successfully', (done) => {
            setTimeout(() => {
                accountHttp.getMultisigAccountInfo(MultisigAccount.address).subscribe((multisigAccountInfo) => {
                    expect(multisigAccountInfo.account.publicKey).to.be.equal(MultisigAccount.publicKey);
                    done();
                });
            }, 1000);
        });
    });

    describe('getMultisigAccountGraphInfo', () => {
        it('should call getMultisigAccountGraphInfo successfully', (done) => {
            accountHttp.getMultisigAccountGraphInfo(MultisigAccount.address).subscribe((multisigAccountGraphInfo) => {
                expect(multisigAccountGraphInfo.multisigAccounts.get(0)![0].account.publicKey).to.be.equal(MultisigAccount.publicKey);
                done();
            });
        });
    });

    describe('incomingTransactions using public key', () => {
        it('should call incomingTransactions successfully', (done) => {
            accountHttp.incomingTransactions(TestingAccount.publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });

    describe('incomingTransactions using address', () => {
        it('should call incomingTransactions successfully', (done) => {
            accountHttp.incomingTransactions(TestingAccount.address).subscribe((transactions) => {
                expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });

    describe('outgoingTransactions', () => {
        let nextId;
        let lastId;

        it('should call outgoingTransactions successfully', (done) => {
            accountHttp.outgoingTransactions(TestingAccount.publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.equal(10);
                done();
            });
        });

        it('should call outgoingTransactions successfully pageSize 11', (done) => {
            let txnQueryParams = new TransactionQueryParams();
            txnQueryParams.pageSize = 22;
            accountHttp.outgoingTransactions(TestingAccount.publicAccount, txnQueryParams).subscribe((transactions) => {
                expect(transactions.length).to.be.equal(22);
                nextId = transactions[10].transactionInfo!.id;
                lastId = transactions[11].transactionInfo!.id;
                done();
            });
        });

        it('should call outgoingTransactions successfully pageSize 11', (done) => {
            let txnQueryParams = new TransactionQueryParams();
            txnQueryParams.pageSize = 11;
            accountHttp.outgoingTransactions(TestingAccount.publicAccount, txnQueryParams).subscribe((transactions) => {
                expect(transactions.length).to.be.equal(11);
                // expect(transactions[0].transactionInfo!.id).to.be.equal(lastId); // id temporary removed ?
                done();
            });
        });
    });

    describe('aggregateBondedTransactions', () => {
        it('should call aggregateBondedTransactions successfully', (done) => {
            accountHttp.aggregateBondedTransactions(TestingAccount.publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.equal(0);
                done();
            }, (error) => {
                console.log('Error:', error);
                assert(false);
            });
        });
    });

    describe('transactions', () => {
        it('should call transactions successfully', (done) => {
            accountHttp.transactions(TestingAccount.publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });

    describe('unconfirmedTransactions', () => {
        it('should call unconfirmedTransactions successfully', (done) => {
            accountHttp.unconfirmedTransactions(TestingAccount.publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.equal(0);
                done();
            });
        });
    });
})
