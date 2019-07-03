"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Listener_1 = require("../../src/infrastructure/Listener");
const conf_spec_1 = require("../conf/conf.spec");
const TransactionUtils_1 = require("./TransactionUtils");
const assert_1 = require("assert");
describe('Listener', () => {
    let listener;
    before(() => {
        listener = new Listener_1.Listener(conf_spec_1.APIUrl);
        return listener.open();
    });
    after(() => {
        listener.close();
    });
    it('newBlock', (done) => {
        const sub = listener.newBlock().subscribe(res => {
            sub.unsubscribe();
            done();
        });
        TransactionUtils_1.TransactionUtils.createAndAnnounce();
    });
    it('confirmedTransactionsGiven address signer', (done) => {
        const sub = listener.confirmed(conf_spec_1.TestingAccount.address).subscribe(res => {
            sub.unsubscribe();
            done();
        });
        TransactionUtils_1.TransactionUtils.createAndAnnounce();
    });
    it('confirmedTransactionsGiven address recipient', (done) => {
        const recipientAddress = conf_spec_1.TestingRecipient.address;
        const sub = listener.confirmed(recipientAddress).subscribe(res => {
            sub.unsubscribe();
            done();
        });
        TransactionUtils_1.TransactionUtils.createAndAnnounce();
    });
    it('unconfirmedTransactionsAdded', (done) => {
        const sub = listener.unconfirmedAdded(conf_spec_1.TestingAccount.address).subscribe(res => {
            sub.unsubscribe();
            done();
        });
        setTimeout(() => {
            TransactionUtils_1.TransactionUtils.createAndAnnounce();
        }, 1000);
    });
    it('unconfirmedTransactionsRemoved', (done) => {
        const sub = listener.unconfirmedRemoved(conf_spec_1.TestingAccount.address).subscribe(res => {
            sub.unsubscribe();
            done();
        });
        setTimeout(() => {
            TransactionUtils_1.TransactionUtils.createAndAnnounce();
        }, 1000);
    });
    it('aggregateBondedTransactionsAdded', (done) => {
        const sub = listener.aggregateBondedAdded(conf_spec_1.MultisigAccount.address).subscribe(res => {
            sub.unsubscribe();
            done();
        });
        setTimeout(() => {
            TransactionUtils_1.TransactionUtils.createAggregateBondedTransactionAndAnnounce();
        }, 1000);
    });
    it('aggregateBondedTransactionsRemoved', (done) => {
        const subAggregated = listener.aggregateBondedAdded(conf_spec_1.MultisigAccount.address).subscribe(transactionToCosign => {
            subAggregated.unsubscribe();
            TransactionUtils_1.TransactionUtils.cosignTransaction(transactionToCosign, conf_spec_1.Cosignatory2Account);
        });
        const sub = listener.aggregateBondedRemoved(conf_spec_1.MultisigAccount.address).subscribe(res => {
            sub.unsubscribe();
            done();
        });
        setTimeout(() => {
            TransactionUtils_1.TransactionUtils.createAggregateBondedTransactionAndAnnounce();
        }, 1000);
    });
    // this listener doesn't work
    xit('cosignatureAdded', (done) => {
        let ok = false;
        const subCosign = listener.aggregateBondedAdded(conf_spec_1.MultisigAccount.address).subscribe(transactionToCosign => {
            subCosign.unsubscribe();
            setTimeout(() => {
                if (!ok) {
                    assert_1.fail("cosignatureAdded not invoked in time, probably not working");
                }
            }, 60 * 1000);
            TransactionUtils_1.TransactionUtils.cosignTransaction(transactionToCosign, conf_spec_1.Cosignatory3Account);
        });
        const sub1 = listener.cosignatureAdded(conf_spec_1.CosignatoryAccount.address).subscribe(res => {
            sub1.unsubscribe();
            ok = true;
            done();
        });
        setTimeout(() => {
            TransactionUtils_1.TransactionUtils.createAggregateBondedTransactionAndAnnounce();
        }, 1000);
    });
    it('transactionStatusGiven', (done) => {
        const sub = listener.status(conf_spec_1.TestingAccount.address).subscribe(res => {
            sub.unsubscribe();
            done();
        });
        setTimeout(() => {
            TransactionUtils_1.TransactionUtils.createAndAnnounceWithInsufficientBalance();
        }, 1000);
    });
});
//# sourceMappingURL=Listener.spec.js.map