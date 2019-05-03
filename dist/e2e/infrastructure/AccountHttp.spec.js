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
const Address_1 = require("../../src/model/account/Address");
const PublicAccount_1 = require("../../src/model/account/PublicAccount");
const NetworkType_1 = require("../../src/model/blockchain/NetworkType");
const conf_spec_1 = require("../conf/conf.spec");
describe('AccountHttp', () => {
    const accountAddress = Address_1.Address.createFromRawAddress('SATVSIHOBUYIVN5KPPLQ4K5FY3XVWQTN426XT645');
    const accountPublicKey = '97D1A892667B113121053AB9474E0E3F02A3006D454649AA9609845FF6A37E96';
    const publicAccount = PublicAccount_1.PublicAccount.createFromPublicKey('846B4439154579A5903B1459C9CF69CB8153F6D0110A7A0ED61DE29AE4810BF2', NetworkType_1.NetworkType.MIJIN_TEST);
    const multisigPublicAccount = PublicAccount_1.PublicAccount.createFromPublicKey('B694186EE4AB0558CA4AFCFDD43B42114AE71094F5A1FC4A913FE9971CACD21D', NetworkType_1.NetworkType.MIJIN_TEST);
    const accountHttp = new AccountHttp_1.AccountHttp(conf_spec_1.APIUrl);
    describe('getAccountInfo', () => {
        it('should return account data given a NEM Address', (done) => {
            accountHttp.getAccountInfo(accountAddress)
                .subscribe((accountInfo) => {
                chai_1.expect(accountInfo.publicKey).to.be.equal(accountPublicKey);
                done();
            });
        });
    });
    describe('getAccountsInfo', () => {
        it('should return account data given a NEM Address', (done) => {
            accountHttp.getAccountsInfo([accountAddress])
                .subscribe((accountsInfo) => {
                chai_1.expect(accountsInfo[0].publicKey).to.be.equal(accountPublicKey);
                done();
            });
        });
    });
    describe('getMultisigAccountInfo', () => {
        it('should call getMultisigAccountInfo successfully', (done) => {
            accountHttp.getMultisigAccountInfo(multisigPublicAccount.address).subscribe((multisigAccountInfo) => {
                chai_1.expect(multisigAccountInfo.account.publicKey).to.be.equal(multisigPublicAccount.publicKey);
                done();
            });
        });
    });
    describe('getAccountProperty', () => {
        it('should call getAccountProperty successfully', (done) => {
            accountHttp.getAccountProperty(publicAccount).subscribe((accountProperty) => {
                chai_1.expect(accountProperty.accountProperties[0].address).to.be.equal(accountAddress);
                done();
            });
        });
    });
    describe('getAccountProperties', () => {
        it('should call getAccountProperties successfully', (done) => {
            accountHttp.getAccountProperties([accountAddress]).subscribe((accountProperties) => {
                chai_1.expect(accountProperties[0].accountProperties[0].address).to.be.equal(accountAddress);
                done();
            });
        });
    });
    describe('getMultisigAccountGraphInfo', () => {
        it('should call getMultisigAccountGraphInfo successfully', (done) => {
            accountHttp.getMultisigAccountGraphInfo(multisigPublicAccount.address).subscribe((multisigAccountGraphInfo) => {
                chai_1.expect(multisigAccountGraphInfo.multisigAccounts.get(0)[0].account.publicKey).to.be.equal(multisigPublicAccount.publicKey);
                done();
            });
        });
    });
    describe('incomingTransactions', () => {
        it('should call incomingTransactions successfully', (done) => {
            accountHttp.incomingTransactions(publicAccount).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });
    describe('outgoingTransactions', () => {
        let nextId;
        let lastId;
        it('should call outgoingTransactions successfully', (done) => {
            accountHttp.outgoingTransactions(publicAccount).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.equal(10);
                done();
            });
        });
        it('should call outgoingTransactions successfully pageSize 11', (done) => {
            accountHttp.outgoingTransactions(publicAccount, new QueryParams_1.QueryParams(22)).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.equal(22);
                nextId = transactions[10].transactionInfo.id;
                lastId = transactions[11].transactionInfo.id;
                done();
            });
        });
        it('should call outgoingTransactions successfully pageSize 11 and next id', (done) => {
            accountHttp.outgoingTransactions(publicAccount, new QueryParams_1.QueryParams(11, nextId)).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.equal(11);
                chai_1.expect(transactions[0].transactionInfo.id).to.be.equal(lastId);
                done();
            });
        });
    });
    describe('aggregateBondedTransactions', () => {
        it('should call aggregateBondedTransactions successfully', (done) => {
            accountHttp.aggregateBondedTransactions(publicAccount).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.equal(0);
                done();
            });
        });
    });
    describe('transactions', () => {
        it('should call transactions successfully', (done) => {
            accountHttp.transactions(publicAccount).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });
    describe('unconfirmedTransactions', () => {
        it('should call unconfirmedTransactions successfully', (done) => {
            accountHttp.unconfirmedTransactions(publicAccount).subscribe((transactions) => {
                chai_1.expect(transactions.length).to.be.equal(0);
                done();
            });
        });
    });
});
//# sourceMappingURL=AccountHttp.spec.js.map