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
const AccountHttp_1 = require("../../src/infrastructure/AccountHttp");
const Listener_1 = require("../../src/infrastructure/Listener");
const Address_1 = require("../../src/model/account/Address");
const conf = require("../conf/conf.spec");
const conf_spec_1 = require("../conf/conf.spec");
const TransactionUtils_1 = require("./TransactionUtils");
describe('Listener', () => {
    let account;
    let multisigAccount;
    let listener;
    before(() => {
        account = conf_spec_1.TestingAccount;
        multisigAccount = conf_spec_1.MultisigAccount;
        listener = new Listener_1.Listener(conf_spec_1.APIUrl);
        return listener.open();
    });
    after(() => {
        listener.close();
    });
    it('newBlock', (done) => {
        listener.newBlock()
            .toPromise()
            .then((res) => {
            done();
        });
        TransactionUtils_1.TransactionUtils.createAndAnnounce();
    });
    it('confirmedTransactionsGiven address signer', (done) => {
        listener.confirmed(account.address)
            .toPromise()
            .then((res) => {
            done();
        });
        TransactionUtils_1.TransactionUtils.createAndAnnounce();
    });
    it('confirmedTransactionsGiven address recipient', (done) => {
        const recipientAddress = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        listener.confirmed(recipientAddress)
            .toPromise()
            .then((res) => {
            done();
        });
        TransactionUtils_1.TransactionUtils.createAndAnnounce();
    });
    it('unconfirmedTransactionsAdded', (done) => {
        listener.unconfirmedAdded(account.address)
            .toPromise()
            .then((res) => {
            done();
        });
        setTimeout(() => {
            TransactionUtils_1.TransactionUtils.createAndAnnounce();
        }, 1000);
    });
    it('unconfirmedTransactionsRemoved', (done) => {
        listener.unconfirmedRemoved(account.address)
            .toPromise()
            .then((res) => {
            done();
        });
        setTimeout(() => {
            TransactionUtils_1.TransactionUtils.createAndAnnounce();
        }, 1000);
    });
    it('aggregateBondedTransactionsAdded', (done) => {
        listener.aggregateBondedAdded(multisigAccount.address)
            .toPromise()
            .then((res) => {
            done();
        });
        setTimeout(() => {
            TransactionUtils_1.TransactionUtils.createAggregateBoundedTransactionAndAnnounce();
        }, 1000);
    });
    it('aggregateBondedTransactionsRemoved', (done) => {
        listener.aggregateBondedRemoved(multisigAccount.address)
            .toPromise()
            .then((res) => {
            done();
        });
        setTimeout(() => {
            TransactionUtils_1.TransactionUtils.createAggregateBoundedTransactionAndAnnounce();
            setTimeout(() => {
                new AccountHttp_1.AccountHttp(conf.APIUrl).aggregateBondedTransactions(conf_spec_1.CosignatoryAccount.publicAccount).subscribe((transactions) => {
                    const transactionToCosign = transactions[0];
                    TransactionUtils_1.TransactionUtils.cosignTransaction(transactionToCosign, conf_spec_1.Cosignatory2Account);
                    TransactionUtils_1.TransactionUtils.cosignTransaction(transactionToCosign, conf_spec_1.Cosignatory3Account);
                });
            }, 2000);
        }, 1000);
    });
    it('cosignatureAdded', (done) => {
        listener.cosignatureAdded(multisigAccount.address)
            .toPromise()
            .then((res) => {
            done();
        });
        setTimeout(() => {
            TransactionUtils_1.TransactionUtils.createAggregateBoundedTransactionAndAnnounce();
            setTimeout(() => {
                new AccountHttp_1.AccountHttp(conf.APIUrl).aggregateBondedTransactions(conf_spec_1.CosignatoryAccount.publicAccount).subscribe((transactions) => {
                    const transactionToCosign = transactions[0];
                    TransactionUtils_1.TransactionUtils.cosignTransaction(transactionToCosign, conf_spec_1.Cosignatory2Account);
                });
            }, 1000);
        }, 1000);
    });
    it('transactionStatusGiven', (done) => {
        listener.status(account.address)
            .toPromise()
            .then((res) => {
            done();
        });
        setTimeout(() => {
            TransactionUtils_1.TransactionUtils.createAndAnnounceWithInsufficientBalance();
        }, 1000);
    });
    it('multisigAccountAdded', (done) => {
        listener.multisigAccountAdded(account.address)
            .toPromise()
            .then((res) => {
            done();
        });
        setTimeout(() => {
            TransactionUtils_1.TransactionUtils.createModifyMultisigAccountTransaction(account);
        }, 1000);
    });
});
//# sourceMappingURL=Listener.spec.js.map