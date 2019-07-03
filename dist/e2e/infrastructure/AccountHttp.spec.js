"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const AccountHttp_1 = require("../../src/infrastructure/AccountHttp");
const QueryParams_1 = require("../../src/infrastructure/QueryParams");
const conf_spec_1 = require("../conf/conf.spec");
const accountHttp = new AccountHttp_1.AccountHttp(conf_spec_1.APIUrl);
describe('AccountHttp', () => {
    describe('getAccountInfo', () => {
        it('should return account data given a NEM Address', (done) => {
            accountHttp.getAccountInfo(conf_spec_1.TestingAccount.address)
                .subscribe((accountInfo) => {
                chai_1.expect(accountInfo.publicKey).to.be.equal(conf_spec_1.TestingAccount.publicKey);
                done();
            });
        });
    });
    describe('getAccountsInfo', () => {
        it('should return account data given a NEM Address', (done) => {
            accountHttp.getAccountsInfo([conf_spec_1.TestingAccount.address])
                .subscribe((accountsInfo) => {
                chai_1.expect(accountsInfo[0].publicKey).to.be.equal(conf_spec_1.TestingAccount.publicKey);
                done();
            });
        });
    });
    describe('getMultisigAccountInfo', () => {
        it('should call getMultisigAccountInfo successfully', (done) => {
            accountHttp.getMultisigAccountInfo(conf_spec_1.MultisigAccount.address).subscribe((multisigAccountInfo) => {
                chai_1.expect(multisigAccountInfo.account.publicKey).to.be.equal(conf_spec_1.MultisigAccount.publicKey);
                done();
            });
        });
    });
    describe('getAccountProperties', () => {
        it('should call getAccountProperties successfully', (done) => {
            accountHttp.getAccountProperties(conf_spec_1.TestingAccount.publicAccount.address).subscribe((accountProperty) => {
                chai_1.expect(accountProperty.accountProperties.address).not.to.be.equal(undefined);
                done();
            });
        });
    });
    describe('getAccountPropertiesFromAccounts', () => {
        it('should call getAccountPropertiesFromAccounts successfully', (done) => {
            accountHttp.getAccountPropertiesFromAccounts([conf_spec_1.TestingAccount.address]).subscribe((accountProperties) => {
                chai_1.expect(accountProperties[0].accountProperties.address).not.to.be.equal(undefined);
                done();
            });
        });
    });
    describe('getMultisigAccountGraphInfo', () => {
        it('should call getMultisigAccountGraphInfo successfully', (done) => {
            accountHttp.getMultisigAccountGraphInfo(conf_spec_1.MultisigAccount.address).subscribe((multisigAccountGraphInfo) => {
                chai_1.expect(multisigAccountGraphInfo.multisigAccounts.get(0)[0].account.publicKey).to.be.equal(conf_spec_1.MultisigAccount.publicKey);
                done();
            });
        });
    });
    describe('incomingTransactions', () => {
        it('should call incomingTransactions successfully', (done) => {
            accountHttp.incomingTransactions(conf_spec_1.TestingAccount.publicAccount).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });
    describe('outgoingTransactions', () => {
        let nextId;
        let lastId;
        it('should call outgoingTransactions successfully', (done) => {
            accountHttp.outgoingTransactions(conf_spec_1.TestingAccount.publicAccount).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.equal(10);
                done();
            });
        });
        it('should call outgoingTransactions successfully pageSize 11', (done) => {
            accountHttp.outgoingTransactions(conf_spec_1.TestingAccount.publicAccount, new QueryParams_1.QueryParams(22)).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.equal(22);
                nextId = transactions[10].transactionInfo.id;
                lastId = transactions[11].transactionInfo.id;
                done();
            });
        });
        it('should call outgoingTransactions successfully pageSize 11 and next id', (done) => {
            accountHttp.outgoingTransactions(conf_spec_1.TestingAccount.publicAccount, new QueryParams_1.QueryParams(11, nextId)).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.equal(11);
                chai_1.expect(transactions[0].transactionInfo.id).to.be.equal(lastId);
                done();
            });
        });
    });
    describe('aggregateBondedTransactions', () => {
        it('should call aggregateBondedTransactions successfully', (done) => {
            accountHttp.aggregateBondedTransactions(conf_spec_1.TestingAccount.publicAccount).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.equal(0);
                done();
            }, (error) => {
                console.log('Error:', error);
                chai_1.assert(false);
            });
        });
    });
    describe('transactions', () => {
        it('should call transactions successfully', (done) => {
            accountHttp.transactions(conf_spec_1.TestingAccount.publicAccount).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });
    describe('unconfirmedTransactions', () => {
        it('should call unconfirmedTransactions successfully', (done) => {
            accountHttp.unconfirmedTransactions(conf_spec_1.TestingAccount.publicAccount).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.equal(0);
                done();
            });
        });
    });
});
//# sourceMappingURL=AccountHttp.spec.js.map