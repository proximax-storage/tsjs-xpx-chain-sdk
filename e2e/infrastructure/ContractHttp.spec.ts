import {expect} from 'chai';
import {APIUrl, Customer1Account, Executor1Account, Executor2Account, Verifier1Account, Verifier2Account, Configuration} from '../conf/conf.spec';
import { Address, Transaction, UInt64, MultisigCosignatoryModification, MultisigCosignatoryModificationType, TransactionBuilderFactory } from '../../src/model/model';
import { TransactionHttp, Listener, ContractHttp } from '../../src/infrastructure/infrastructure';

let listener: Listener;
let contractHttp: ContractHttp;
let transactionHttp: TransactionHttp;
let factory: TransactionBuilderFactory;

before(() => {
    contractHttp = new ContractHttp(APIUrl);
    transactionHttp = new TransactionHttp(APIUrl);

    listener = new Listener(APIUrl);
    return listener.open().then(() => {
        return Configuration.getTransactionBuilderFactory().then(f => {
            factory = f;
        })
    });
});

after(() => {
    listener.close();
})

const validateTransactionAnnounceCorrectly = (address: Address, done, hash?:string) => {
    const status = listener.status(address).subscribe(error => {
        console.log(error);
        if (hash && hash === error.hash) {
            status.unsubscribe();
            sub.unsubscribe();
            throw new Error(error.status);
        }
    });
    const sub = listener.confirmed(address).subscribe((transaction: Transaction) => {
        if (hash) {
            if (transaction.transactionInfo && transaction.transactionInfo.hash === hash) {
                status.unsubscribe();
                sub.unsubscribe();
                return done();
            }
        } else {
            status.unsubscribe();
            sub.unsubscribe();
            return done();
        }
    });
};

xdescribe('ContractHttp', () => {

    describe('add, get Contract', () => {
        describe('should add contract to an account', () => {
            const hash = '5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03'; // echo hello | sha256sum
            it('aggregate', (done) => {
                const modifyContractTransaction = factory.modifyContract()
                    .hash(hash)
                    .durationDelta(UInt64.fromUint(1000))
                    .customers([new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, Customer1Account.publicAccount)])
                    .executors([new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, Executor1Account.publicAccount),
                        new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, Executor2Account.publicAccount)])
                    .verifiers([new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, Verifier1Account.publicAccount),
                        new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, Verifier2Account.publicAccount)])
                    .build();

                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([modifyContractTransaction.toAggregate(Customer1Account.publicAccount)])
                    .build();

                const signedTransaction = aggregateTransaction.signWith(Customer1Account, factory.generationHash);
                validateTransactionAnnounceCorrectly(Customer1Account.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('should get contracts', () => {
            it('for given publicKey', (done) => {
                contractHttp.getAccountContract(Customer1Account.publicAccount)
                .subscribe((contracts) => {
                    expect(contracts).not.to.be.equal(undefined);
                    expect(contracts.length).not.to.be.equal(0);
                    done();
                });
            });
            it('for given publicKeys', (done) => {
                contractHttp.getAccountsContracts([Customer1Account.publicAccount])
                .subscribe((contracts) => {
                    expect(contracts).not.to.be.equal(undefined);
                    expect(contracts.length).not.to.be.equal(0);
                    done();
                });
            });
            it('for given address', (done) => {
                contractHttp.getContract(Customer1Account.publicAccount.address)
                .subscribe((contract) => {
                    expect(contract).not.to.be.equal(undefined);
                    done();
                });
            });
            it('for given addresses', (done) => {
                contractHttp.getContracts([Customer1Account.publicAccount.address])
                .subscribe((contracts) => {
                    expect(contracts).not.to.be.equal(undefined);
                    expect(contracts.length).not.to.be.equal(0);
                    done();
                });
            });
        });
    });
});
