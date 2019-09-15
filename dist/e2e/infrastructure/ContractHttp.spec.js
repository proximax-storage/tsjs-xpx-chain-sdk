"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const conf_spec_1 = require("../conf/conf.spec");
const model_1 = require("../../src/model/model");
const infrastructure_1 = require("../../src/infrastructure/infrastructure");
const ModifyContractTransaction_1 = require("../../src/model/transaction/ModifyContractTransaction");
let listener;
let contractHttp;
let transactionHttp;
let generationHash;
before(() => {
    contractHttp = new infrastructure_1.ContractHttp(conf_spec_1.APIUrl);
    transactionHttp = new infrastructure_1.TransactionHttp(conf_spec_1.APIUrl);
    listener = new infrastructure_1.Listener(conf_spec_1.APIUrl);
    return listener.open().then(() => {
        return conf_spec_1.NemesisBlockInfo.getInstance().then(nemesisBlockInfo => {
            generationHash = nemesisBlockInfo.generationHash;
        });
    });
});
after(() => {
    listener.close();
});
const validateTransactionAnnounceCorrectly = (address, done, hash) => {
    const status = listener.status(address).subscribe(error => {
        console.log(error);
        if (hash && hash === error.hash) {
            status.unsubscribe();
            sub.unsubscribe();
            throw new Error(error.status);
        }
    });
    const sub = listener.confirmed(address).subscribe((transaction) => {
        if (hash) {
            if (transaction.transactionInfo && transaction.transactionInfo.hash === hash) {
                status.unsubscribe();
                sub.unsubscribe();
                return done();
            }
        }
        else {
            status.unsubscribe();
            sub.unsubscribe();
            return done();
        }
    });
};
describe('ContractHttp', () => {
    describe('add, get Contract', () => {
        describe('should add contract to an account', () => {
            const hash = '5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03'; // echo hello | sha256sum
            const modifyContractTransaction = ModifyContractTransaction_1.ModifyContractTransaction.create(conf_spec_1.ConfNetworkType, model_1.Deadline.create(), model_1.UInt64.fromUint(1000), hash, [new model_1.MultisigCosignatoryModification(model_1.MultisigCosignatoryModificationType.Add, conf_spec_1.Customer1Account.publicAccount)], [new model_1.MultisigCosignatoryModification(model_1.MultisigCosignatoryModificationType.Add, conf_spec_1.Executor1Account.publicAccount),
                new model_1.MultisigCosignatoryModification(model_1.MultisigCosignatoryModificationType.Add, conf_spec_1.Executor2Account.publicAccount)], [new model_1.MultisigCosignatoryModification(model_1.MultisigCosignatoryModificationType.Add, conf_spec_1.Verifier1Account.publicAccount),
                new model_1.MultisigCosignatoryModification(model_1.MultisigCosignatoryModificationType.Add, conf_spec_1.Verifier2Account.publicAccount)]);
<<<<<<< HEAD
            it('aggregate', (done) => {
                const aggregateTransaction = model_1.AggregateTransaction.createComplete(model_1.Deadline.create(), [modifyContractTransaction.toAggregate(conf_spec_1.Customer1Account.publicAccount)], conf_spec_1.ConfNetworkType, []);
                const signedTransaction = aggregateTransaction.signWith(conf_spec_1.Customer1Account, generationHash);
=======
            it('standalone', (done) => {
                const signedTransaction = modifyContractTransaction.signWith(conf_spec_1.Customer1Account, generationHash);
>>>>>>> jwt
                validateTransactionAnnounceCorrectly(conf_spec_1.Customer1Account.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('should get contracts', () => {
            it('for given publicKey', (done) => {
                contractHttp.getAccountContract(conf_spec_1.Customer1Account.publicAccount)
                    .subscribe((contracts) => {
                    chai_1.expect(contracts).not.to.be.equal(undefined);
                    chai_1.expect(contracts.length).not.to.be.equal(0);
                    done();
                });
            });
            it('for given publicKeys', (done) => {
                contractHttp.getAccountsContracts([conf_spec_1.Customer1Account.publicAccount])
                    .subscribe((contracts) => {
                    chai_1.expect(contracts).not.to.be.equal(undefined);
                    chai_1.expect(contracts.length).not.to.be.equal(0);
                    done();
                });
            });
            it('for given address', (done) => {
                contractHttp.getContract(conf_spec_1.Customer1Account.publicAccount.address)
                    .subscribe((contract) => {
                    chai_1.expect(contract).not.to.be.equal(undefined);
                    done();
                });
            });
            it('for given addresses', (done) => {
                contractHttp.getContracts([conf_spec_1.Customer1Account.publicAccount.address])
                    .subscribe((contracts) => {
                    chai_1.expect(contracts).not.to.be.equal(undefined);
                    chai_1.expect(contracts.length).not.to.be.equal(0);
                    done();
                });
            });
        });
    });
});
//# sourceMappingURL=ContractHttp.spec.js.map