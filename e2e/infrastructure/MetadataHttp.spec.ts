// Copyright 2020 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {expect} from 'chai';
import { APIUrl, TestingAccount, ConfTestingNamespaceId, ConfTestingMosaicId, Configuration } from '../conf/conf.spec';
import { MetadataHttp } from '../../src/infrastructure/MetadataHttp';
import { Address, Transaction, TransactionBuilderFactory } from '../../src/model/model';
import { MetadataModification, MetadataModificationType } from '../../src/model/transaction/ModifyMetadataTransaction';
import { TransactionHttp, Listener } from '../../src/infrastructure/infrastructure';

let listener: Listener;
let metadataHttp: MetadataHttp;
let transactionHttp: TransactionHttp;
let factory: TransactionBuilderFactory;

before(() => {
    metadataHttp = new MetadataHttp(APIUrl);
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

describe('MetadataHttp', () => {

    describe('add ,modify, get Metadata', () => {
        describe('should add metadata to an account', () => {
            it('standalone', (done) => {
                const modifyMetadataTransaction = factory.accountMetadata()
                    .address(TestingAccount.address)
                    .modifications([new MetadataModification(MetadataModificationType.ADD, "key1", "x".repeat(256))])
                    .build();
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const modifyMetadataTransaction = factory.accountMetadata()
                    .address(TestingAccount.address)
                    .modifications([new MetadataModification(MetadataModificationType.ADD, "key2", "x".repeat(256))])
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([modifyMetadataTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
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
            it('standalone', (done) => {
                const modifyMetadataTransaction = factory.accountMetadata()
                    .address(TestingAccount.address)
                    .modifications([new MetadataModification(MetadataModificationType.REMOVE, "key1")])
                    .build();
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const modifyMetadataTransaction = factory.accountMetadata()
                    .address(TestingAccount.address)
                    .modifications([new MetadataModification(MetadataModificationType.REMOVE, "key2")])
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([modifyMetadataTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('should add metadata to a namespace', () => {
            it('standalone', (done) => {
                const modifyMetadataTransaction = factory.namespaceMetadata()
                    .namespaceId(ConfTestingNamespaceId)
                    .modifications([new MetadataModification(MetadataModificationType.ADD, "key1", "some value")])
                    .build();
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const modifyMetadataTransaction = factory.namespaceMetadata()
                    .namespaceId(ConfTestingNamespaceId)
                    .modifications([new MetadataModification(MetadataModificationType.ADD, "key2", "some value")])
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([modifyMetadataTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('should get metadata given namespaceId', () => {
            it('standalone', (done) => {
                metadataHttp.getNamespaceMetadata(ConfTestingNamespaceId)
                .subscribe((metadataInfo) => {
                    expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
            });
        });

        describe('should remove metadata from a namespace', () => {
            it('standalone', (done) => {
                const modifyMetadataTransaction = factory.namespaceMetadata()
                    .namespaceId(ConfTestingNamespaceId)
                    .modifications([new MetadataModification(MetadataModificationType.REMOVE, "key1")])
                    .build();
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const modifyMetadataTransaction = factory.namespaceMetadata()
                    .namespaceId(ConfTestingNamespaceId)
                    .modifications([new MetadataModification(MetadataModificationType.REMOVE, "key2")])
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([modifyMetadataTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('should add metadata to a mosaic', () => {
            it('standalone', (done) => {
                const modifyMetadataTransaction = factory.mosaicMetadata()
                    .mosaicId(ConfTestingMosaicId)
                    .modifications([new MetadataModification(MetadataModificationType.ADD, "key1", "some value")])
                    .build();
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const modifyMetadataTransaction = factory.mosaicMetadata()
                    .mosaicId(ConfTestingMosaicId)
                    .modifications([new MetadataModification(MetadataModificationType.ADD, "key2", "some value")])
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([modifyMetadataTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });

        describe('should get metadata given mosaicId', () => {
            it('standalone', (done) => {
                metadataHttp.getMosaicMetadata(ConfTestingMosaicId)
                .subscribe((metadataInfo) => {
                    expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
            });
        });

        describe('should remove metadata from a mosaic', () => {
            it('standalone', (done) => {
                const modifyMetadataTransaction = factory.mosaicMetadata()
                    .mosaicId(ConfTestingMosaicId)
                    .modifications([new MetadataModification(MetadataModificationType.REMOVE, "key1")])
                    .build();
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const modifyMetadataTransaction = factory.mosaicMetadata()
                    .mosaicId(ConfTestingMosaicId)
                    .modifications([new MetadataModification(MetadataModificationType.REMOVE, "key2")])
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([modifyMetadataTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build()

                const signedTransaction = aggregateTransaction.signWith(TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
    });
});
