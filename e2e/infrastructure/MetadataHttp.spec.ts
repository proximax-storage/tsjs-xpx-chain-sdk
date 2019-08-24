import {expect} from 'chai';
import {APIUrl, TestingAccount, ConfNetworkType, ConfTestingNamespace, ConfTestingMosaic, NemesisBlockInfo} from '../conf/conf.spec';
import { MetadataHttp } from '../../src/infrastructure/MetadataHttp';
import { MosaicId, NamespaceId, Deadline, Address, Transaction, SignedTransaction, AggregateTransaction } from '../../src/model/model';
import { ModifyMetadataTransaction, MetadataModification, MetadataModificationType } from '../../src/model/transaction/ModifyMetadataTransaction';
import { TransactionHttp, Listener } from '../../src/infrastructure/infrastructure';
import { ConfUtils } from '../conf/ConfUtils';

let listener: Listener;
let metadataHttp: MetadataHttp;
let transactionHttp: TransactionHttp;
let generationHash: string;

before(() => {
    metadataHttp = new MetadataHttp(APIUrl);
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

describe('MetadataHttp', () => {

    describe('add ,modify, get Metadata', () => {
        describe('should add metadata to an account', () => {
            const modifyMetadataTransaction1 = ModifyMetadataTransaction.createWithAddress(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                TestingAccount.address,
                [new MetadataModification(MetadataModificationType.ADD, "key1", "x".repeat(256))]
            );
            const modifyMetadataTransaction2 = ModifyMetadataTransaction.createWithAddress(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                TestingAccount.address,
                [new MetadataModification(MetadataModificationType.ADD, "key2", "x".repeat(256))]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction1.signWith(TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });

            it('aggregate', (done) => {
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [modifyMetadataTransaction2.toAggregate(TestingAccount.publicAccount)],
                ConfNetworkType,
                []);
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });

        });

        describe('should get metadata given accountId', () => {
            it('standalone', (done) => {
                metadataHttp.getAccountMetadata(TestingAccount.address.plain())
                .subscribe((addressMetadata) => {
                    expect(addressMetadata).not.to.be.equal(undefined);
                    expect(addressMetadata.fields[0].value.length).to.be.equal(256);
                    expect(addressMetadata.fields[1].value.length).to.be.equal(256);
                    done();
                });
            });
        });

        describe('should remove metadata from an account', () => {
            const modifyMetadataTransaction1 = ModifyMetadataTransaction.createWithAddress(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                TestingAccount.address,
                [new MetadataModification(MetadataModificationType.REMOVE, "key1")]
            );
            const modifyMetadataTransaction2 = ModifyMetadataTransaction.createWithAddress(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                TestingAccount.address,
                [new MetadataModification(MetadataModificationType.REMOVE, "key2")]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction1.signWith(TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [modifyMetadataTransaction2.toAggregate(TestingAccount.publicAccount)],
                ConfNetworkType,
                []);
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('should add metadata to a namespace', () => {
            const modifyMetadataTransaction1 = ModifyMetadataTransaction.createWithNamespaceId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                ConfTestingNamespace,
                [new MetadataModification(MetadataModificationType.ADD, "key1", "some value")]
            );
            const modifyMetadataTransaction2 = ModifyMetadataTransaction.createWithNamespaceId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                ConfTestingNamespace,
                [new MetadataModification(MetadataModificationType.ADD, "key2", "some value")]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction1.signWith(TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [modifyMetadataTransaction2.toAggregate(TestingAccount.publicAccount)],
                ConfNetworkType,
                []);
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
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
            const modifyMetadataTransaction1 = ModifyMetadataTransaction.createWithNamespaceId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                ConfTestingNamespace,
                [new MetadataModification(MetadataModificationType.REMOVE, "key1")]
            );
            const modifyMetadataTransaction2 = ModifyMetadataTransaction.createWithNamespaceId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                ConfTestingNamespace,
                [new MetadataModification(MetadataModificationType.REMOVE, "key2")]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction1.signWith(TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [modifyMetadataTransaction2.toAggregate(TestingAccount.publicAccount)],
                ConfNetworkType,
                []);
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('should add metadata to a mosaic', () => {
            const modifyMetadataTransaction1 = ModifyMetadataTransaction.createWithMosaicId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                ConfTestingMosaic,
                [new MetadataModification(MetadataModificationType.ADD, "key1", "some value")]
            );
            const modifyMetadataTransaction2 = ModifyMetadataTransaction.createWithMosaicId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                ConfTestingMosaic,
                [new MetadataModification(MetadataModificationType.ADD, "key2", "some value")]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction1.signWith(TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [modifyMetadataTransaction2.toAggregate(TestingAccount.publicAccount)],
                ConfNetworkType,
                []);
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
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
            const modifyMetadataTransaction1 = ModifyMetadataTransaction.createWithMosaicId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                ConfTestingMosaic,
                [new MetadataModification(MetadataModificationType.REMOVE, "key1")]
            );
            const modifyMetadataTransaction2 = ModifyMetadataTransaction.createWithMosaicId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                ConfTestingMosaic,
                [new MetadataModification(MetadataModificationType.REMOVE, "key2")]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction1.signWith(TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [modifyMetadataTransaction2.toAggregate(TestingAccount.publicAccount)],
                ConfNetworkType,
                []);
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
    });
});
