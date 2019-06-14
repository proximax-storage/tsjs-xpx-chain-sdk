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
import { AccountHttp } from '../../src/infrastructure/AccountHttp';
import { Listener } from '../../src/infrastructure/Listener';
import { APIUrl, Cosignatory2Account, Cosignatory3Account, CosignatoryAccount,
    MultisigAccount, TestingAccount, TestingRecipient
} from '../conf/conf.spec';
import { TransactionUtils } from './TransactionUtils';
import { ConfUtils } from '../conf/ConfUtils';
import { MultisigCosignatoryModificationType } from '../../src/model/model';
import { fail } from 'assert';

describe('Listener', () => {
    let listener: Listener;

    before(() => {
        listener = new Listener(APIUrl);
        return listener.open();
    });

    after(() => {
        listener.close();
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
