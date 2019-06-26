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
import { assert, expect } from 'chai';
import { AccountHttp } from '../../src/infrastructure/AccountHttp';
import { NamespaceHttp } from '../../src/infrastructure/infrastructure';
import { Listener } from '../../src/infrastructure/Listener';
import { APIUrl, Cosignatory2Account, Cosignatory3Account, CosignatoryAccount,
    MultisigAccount, TestingAccount, TestingRecipient
} from '../conf/conf.spec';
import { TransactionHttp } from '../../src/infrastructure/TransactionHttp';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { Mosaic, UInt64 } from '../../src/model/model';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { NetworkCurrencyMosaic } from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { ModifyMultisigAccountTransaction } from '../../src/model/transaction/ModifyMultisigAccountTransaction';
import { MultisigCosignatoryModification } from '../../src/model/transaction/MultisigCosignatoryModification';
import { MultisigCosignatoryModificationType } from '../../src/model/transaction/MultisigCosignatoryModificationType';
import { PlainMessage } from '../../src/model/transaction/PlainMessage';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { TransactionUtils } from './TransactionUtils';
import { ConfUtils } from '../conf/ConfUtils';
import { fail } from 'assert';

describe('Listener', () => {
    let listener: Listener;

    before(() => {
        listener = new Listener(APIUrl);
        return listener.open();
    });

    let accountHttp: AccountHttp;
    let apiUrl: string;
    let transactionHttp: TransactionHttp;
    let account: Account;
    let account2: Account;
    let cosignAccount1: Account;
    let cosignAccount2: Account;
    let cosignAccount3: Account;
    let cosignAccount4: Account;
    let multisigAccount: Account;
    let networkCurrencyMosaicId: MosaicId;
    let namespaceHttp: NamespaceHttp;
    let generationHash: string;
    let config;

    before((done) => {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(data);
            config = json;
            apiUrl = json.apiUrl;
            account = Account.createFromPrivateKey(json.testAccount.privateKey, NetworkType.MIJIN_TEST);
            account2 = Account.createFromPrivateKey(json.testAccount2.privateKey, NetworkType.MIJIN_TEST);
            multisigAccount = Account.createFromPrivateKey(json.multisigAccount.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount1 = Account.createFromPrivateKey(json.cosignatoryAccount.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount2 = Account.createFromPrivateKey(json.cosignatory2Account.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount3 = Account.createFromPrivateKey(json.cosignatory3Account.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount4 = Account.createFromPrivateKey(json.cosignatory4Account.privateKey, NetworkType.MIJIN_TEST);
            transactionHttp = new TransactionHttp(json.apiUrl);
            accountHttp = new AccountHttp(json.apiUrl);
            namespaceHttp = new NamespaceHttp(json.apiUrl);
            generationHash = json.generationHash;
            done();
        });
    });

    it('newBlock', (done) => {
        const sub = listener.newBlock().subscribe(res => {
            sub.unsubscribe();
            done();
        })

        TransactionUtils.createAndAnnounce();
    });

    it('confirmedTransactionsGiven address signer', (done) => {
        const sub = listener.confirmed(TestingAccount.address).subscribe(res => {
            sub.unsubscribe();
            done();
        });

        TransactionUtils.createAndAnnounce();
    });

    it('confirmedTransactionsGiven address recipient', (done) => {
        const recipientAddress = TestingRecipient.address;
        const sub = listener.confirmed(recipientAddress).subscribe(res => {
            sub.unsubscribe();
            done();
        });

        TransactionUtils.createAndAnnounce();
    });

    it('unconfirmedTransactionsAdded', (done) => {
        const sub = listener.unconfirmedAdded(TestingAccount.address).subscribe(res => {
            sub.unsubscribe();
            done();
        });

        setTimeout(() => {
            TransactionUtils.createAndAnnounce();
        }, 1000);
    });

    it('unconfirmedTransactionsRemoved', (done) => {
        const sub = listener.unconfirmedRemoved(TestingAccount.address).subscribe(res => {
            sub.unsubscribe();
            done();
        });

        setTimeout(() => {
            TransactionUtils.createAndAnnounce();
        }, 1000);
    });

    it('aggregateBondedTransactionsAdded', (done) => {
        const sub = listener.aggregateBondedAdded(MultisigAccount.address).subscribe(res => {
            sub.unsubscribe();
            done();
        });

        setTimeout(() => {
            TransactionUtils.createAggregateBondedTransactionAndAnnounce();
        }, 1000);
    });

    it('aggregateBondedTransactionsRemoved', (done) => {
        const subAggregated = listener.aggregateBondedAdded(MultisigAccount.address).subscribe(transactionToCosign => {
            subAggregated.unsubscribe();
            TransactionUtils.cosignTransaction(transactionToCosign, Cosignatory2Account);
        });
        const sub = listener.aggregateBondedRemoved(MultisigAccount.address).subscribe(res => {
            sub.unsubscribe();
            done();
        });

        setTimeout(() => {
            TransactionUtils.createAggregateBondedTransactionAndAnnounce();
        }, 1000);
    });

    // this listener doesn't work
    xit('cosignatureAdded', (done) => {
        let ok = false;
        const subCosign = listener.aggregateBondedAdded(MultisigAccount.address).subscribe(transactionToCosign => {
            subCosign.unsubscribe();
            setTimeout(() => {
                if (! ok) {
                    fail("cosignatureAdded not invoked in time, probably not working");
                }
            }, 60 * 1000);
            TransactionUtils.cosignTransaction(transactionToCosign, Cosignatory3Account);
        });

        const sub1 = listener.cosignatureAdded(CosignatoryAccount.address).subscribe(res => {
            sub1.unsubscribe();
            ok = true;
            done();
        });

        setTimeout(() => {
            TransactionUtils.createAggregateBondedTransactionAndAnnounce();
        }, 1000);
    });

    it('transactionStatusGiven', (done) => {
        const sub = listener.status(TestingAccount.address).subscribe(res => {
            sub.unsubscribe();
            done();
        });

        setTimeout(() => {
            TransactionUtils.createAndAnnounceWithInsufficientBalance();
        }, 1000);
    });
});
