import {expect} from 'chai';
import {APIUrl, TestingAccount, ConfNetworkType, ConfTestingNamespace, ConfTestingMosaic, NemesisBlockInfo, Customer1Account, Executor1Account, Executor2Account, Verifier1Account, Verifier2Account} from '../conf/conf.spec';
import { MetadataHttp } from '../../src/infrastructure/MetadataHttp';
import { MosaicId, NamespaceId, Deadline, Address, Transaction, SignedTransaction, UInt64, MultisigCosignatoryModification, MultisigCosignatoryModificationType } from '../../src/model/model';
import { ModifyMetadataTransaction, MetadataModification, MetadataModificationType } from '../../src/model/transaction/ModifyMetadataTransaction';
import { TransactionHttp, Listener, ContractHttp } from '../../src/infrastructure/infrastructure';
import { ConfUtils } from '../conf/ConfUtils';
import { ModifyContractTransaction } from '../../src/model/transaction/ModifyContractTransaction';

let listener: Listener;
let contractHttp: ContractHttp;
let transactionHttp: TransactionHttp;
let generationHash: string;

before(() => {
    contractHttp = new ContractHttp(APIUrl);
    transactionHttp = new TransactionHttp(APIUrl);

    listener = new Listener(APIUrl);
    return listener.open().then(() => {
        return NemesisBlockInfo.getInstance().then(nemesisBlockInfo => {
            generationHash = nemesisBlockInfo.generationHash;
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

describe('ContractHttp', () => {

    describe('add, get Contract', () => {
        describe('should add contract to an account', () => {
            const hash = '5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03'; // echo hello | sha256sum
            const modifyContractTransaction = ModifyContractTransaction.create(
                ConfNetworkType,
                Deadline.create(),
                UInt64.fromUint(1000),
                hash,
                [new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, Customer1Account.publicAccount)],
                [new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, Executor1Account.publicAccount),
                 new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, Executor2Account.publicAccount)],
                [new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, Verifier1Account.publicAccount),
                 new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, Verifier2Account.publicAccount)]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyContractTransaction.signWith(Customer1Account, generationHash);
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
