import {expect} from 'chai';
import {APIUrl, TestingAccount, ConfNetworkType, ConfTestingNamespace, ConfTestingMosaic} from '../conf/conf.spec';
import { MetadataHttp } from '../../src/infrastructure/MetadataHttp';
import { MosaicId, NamespaceId, Deadline, Address, Transaction, SignedTransaction } from '../../src/model/model';
import { ModifyMetadataTransaction, MetadataModification, MetadataModificationType } from '../../src/model/transaction/ModifyMetadataTransaction';
import { TransactionHttp, Listener } from '../../src/infrastructure/infrastructure';
import { ConfUtils } from '../conf/ConfUtils';

let listener: Listener;
let metadataHttp: MetadataHttp;
let transactionHttp: TransactionHttp;

before(() => {
    metadataHttp = new MetadataHttp(APIUrl);
    transactionHttp = new TransactionHttp(APIUrl);

    listener = new Listener(APIUrl);
    return listener.open();
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

describe('MetadataHttp', () => {

    describe('add ,modify, get Metadata', () => {
        describe('should add metadata to an account', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction.createWithAddress(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                TestingAccount.address,
                [new MetadataModification(MetadataModificationType.ADD, "key1", "some value")]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
                
        });

        describe('should get metadata given accountId', () => {
            it('standalone', (done) => {
                metadataHttp.getAccountMetadata(TestingAccount.address.plain())
                .subscribe((metadataInfo) => {
                    expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
            });
        });

        describe('should remove metadata from an account', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction.createWithAddress(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                TestingAccount.address,
                [new MetadataModification(MetadataModificationType.REMOVE, "key1")]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
                
        });

        describe('should add metadata to a namespace', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction.createWithNamespaceId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                ConfTestingNamespace,
                [new MetadataModification(MetadataModificationType.ADD, "key1", "some value")]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
                
        });

        describe('should get metadata given namespaceId', () => {
            it('standalone', (done) => {
                metadataHttp.getNamespaceMetadata(ConfTestingNamespace)
                .subscribe((metadataInfo) => {
                    expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
            });
        });

        describe('should remove metadata from a namespace', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction.createWithNamespaceId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                ConfTestingNamespace,
                [new MetadataModification(MetadataModificationType.REMOVE, "key1")]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
                
        });

        describe('should add metadata to a mosaic', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction.createWithMosaicId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                ConfTestingMosaic,
                [new MetadataModification(MetadataModificationType.ADD, "key1", "some value")]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
                
        });

        describe('should get metadata given mosaicId', () => {
            it('standalone', (done) => {
                metadataHttp.getMosaicMetadata(ConfTestingMosaic)
                .subscribe((metadataInfo) => {
                    expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
            });
        });

        describe('should remove metadata from a mosaic', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction.createWithMosaicId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                ConfTestingMosaic,
                [new MetadataModification(MetadataModificationType.REMOVE, "key1")]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
                
        });
    });
});
