// Copyright 2020 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {expect} from 'chai';
import { APIUrl, TestingAccount, ConfTestingNamespaceId, ConfTestingMosaicId, Configuration } from '../conf/conf.spec';
import { MetadataHttp } from '../../src/infrastructure/MetadataHttp';
import { Address, Transaction, TransactionBuilderFactory, UInt64, Mosaic, NamespaceId } from '../../src/model/model';
import { Convert as convert } from '../../src/core/format';
import { MetadataModification, MetadataModificationType } from '../../src/model/transaction/ModifyMetadataTransaction';
import { TransactionHttp, Listener } from '../../src/infrastructure/infrastructure';
import { validateTransactionConfirmed, validatePartialTransactionNotPartialAnyMore, validatePartialTransactionAnnouncedCorrectly } from '../utils';
import { fail } from 'assert';

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
            it('aggregate', (done) => {
                const accountMetadataTransaction = factory.accountMetadata()
                    .targetPublicKey(TestingAccount.publicAccount)
                    .scopedMetadataKey(UInt64.fromUint(1))
                    .valueSize(5)
                    .valueSizeDelta(5)
                    .valueDifferences(convert.hexToUint8(convert.utf8ToHex("hello")))
                    .build();

                const aggregateBondedTxn = factory.aggregateBonded()
                    .innerTransactions([accountMetadataTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedMetadataTransaction = aggregateBondedTxn.signWith(TestingAccount, factory.generationHash);
                
                const lockhashTransaction = factory.lockFunds()
                    .duration(UInt64.fromUint(1000))
                    .transactionHash(signedMetadataTransaction)
                    .mosaic(new Mosaic(new NamespaceId("prx.xpx"), UInt64.fromUint(10000000)))
                    .build();

                const signedLockhashTransaction = lockhashTransaction.signWith(TestingAccount, factory.generationHash);

                validateTransactionConfirmed(listener, TestingAccount.address, signedLockhashTransaction.hash)
                    .then(() => {
                        validateTransactionConfirmed(listener, TestingAccount.address, signedMetadataTransaction.hash)
                            .then(() => done()).catch((reason) => fail(reason));
                        transactionHttp.announce(signedMetadataTransaction);
                    }).catch((reason) => fail(reason));
                transactionHttp.announce(signedLockhashTransaction);
            });
        });

        /*
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
        */

        describe('should remove metadata from an account', () => {
            it('aggregate', (done) => {
                const accountMetadataTransaction = factory.accountMetadata()
                    .targetPublicKey(TestingAccount.publicAccount)
                    .scopedMetadataKey(UInt64.fromUint(1))
                    .valueSize(5)
                    .valueSizeDelta(-5)
                    .valueDifferences(convert.hexToUint8(convert.utf8ToHex("hello")))
                    .build();

                const aggregateBondedTxn = factory.aggregateBonded()
                    .innerTransactions([accountMetadataTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedMetadataTransaction = aggregateBondedTxn.signWith(TestingAccount, factory.generationHash);
                
                const lockhashTransaction = factory.lockFunds()
                    .duration(UInt64.fromUint(1000))
                    .transactionHash(signedMetadataTransaction)
                    .mosaic(new Mosaic(new NamespaceId("prx.xpx"), UInt64.fromUint(10000000)))
                    .build();

                const signedLockhashTransaction = lockhashTransaction.signWith(TestingAccount, factory.generationHash);

                validateTransactionConfirmed(listener, TestingAccount.address, signedLockhashTransaction.hash)
                    .then(() => {
                        validateTransactionConfirmed(listener, TestingAccount.address, signedMetadataTransaction.hash)
                            .then(() => done()).catch((reason) => fail(reason));
                        transactionHttp.announce(signedMetadataTransaction);
                    }).catch((reason) => fail(reason));
                transactionHttp.announce(signedLockhashTransaction);
            });
        });

        describe('should add metadata to a namespace', () => {
            it('aggregate', (done) => {
                const namespaceMetadataTransaction = factory.namespaceMetadata()
                    .targetNamespaceId(ConfTestingNamespaceId)
                    .targetPublicKey(TestingAccount.publicAccount)
                    .scopedMetadataKey(UInt64.fromUint(1))
                    .valueSize(5)
                    .valueSizeDelta(5)
                    .valueDifferences(convert.hexToUint8(convert.utf8ToHex("hello")))
                    .build();

                const aggregateBondedTxn = factory.aggregateBonded()
                    .innerTransactions([namespaceMetadataTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedMetadataTransaction = aggregateBondedTxn.signWith(TestingAccount, factory.generationHash);
                
                const lockhashTransaction = factory.lockFunds()
                    .duration(UInt64.fromUint(1000))
                    .transactionHash(signedMetadataTransaction)
                    .mosaic(new Mosaic(new NamespaceId("prx.xpx"), UInt64.fromUint(10000000)))
                    .build();

                const signedLockhashTransaction = lockhashTransaction.signWith(TestingAccount, factory.generationHash);

                validateTransactionConfirmed(listener, TestingAccount.address, signedLockhashTransaction.hash)
                    .then(() => {
                        validateTransactionConfirmed(listener, TestingAccount.address, signedMetadataTransaction.hash)
                            .then(() => done()).catch((reason) => fail(reason));
                        transactionHttp.announce(signedMetadataTransaction);
                    }).catch((reason) => fail(reason));
                transactionHttp.announce(signedLockhashTransaction);
            });
        });

        /*
        describe('should get metadata given namespaceId', () => {
            it('standalone', (done) => {
                metadataHttp.getNamespaceMetadata(ConfTestingNamespaceId)
                .subscribe((metadataInfo) => {
                    expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
                
            });
        });
        */

        describe('should remove metadata from a namespace', () => {
            it('aggregate', (done) => {
                const namespaceMetadataTransaction = factory.namespaceMetadata()
                    .targetNamespaceId(ConfTestingNamespaceId)
                    .targetPublicKey(TestingAccount.publicAccount)
                    .scopedMetadataKey(UInt64.fromUint(1))
                    .valueSize(5)
                    .valueSizeDelta(-5)
                    .valueDifferences(convert.hexToUint8(convert.utf8ToHex("hello")))
                    .build();

                const aggregateBondedTxn = factory.aggregateBonded()
                    .innerTransactions([namespaceMetadataTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedMetadataTransaction = aggregateBondedTxn.signWith(TestingAccount, factory.generationHash);
                
                const lockhashTransaction = factory.lockFunds()
                    .duration(UInt64.fromUint(1000))
                    .transactionHash(signedMetadataTransaction)
                    .mosaic(new Mosaic(new NamespaceId("prx.xpx"), UInt64.fromUint(10000000)))
                    .build();

                const signedLockhashTransaction = lockhashTransaction.signWith(TestingAccount, factory.generationHash);

                validateTransactionConfirmed(listener, TestingAccount.address, signedLockhashTransaction.hash)
                    .then(() => {
                        validateTransactionConfirmed(listener, TestingAccount.address, signedMetadataTransaction.hash)
                            .then(() => done()).catch((reason) => fail(reason));
                        transactionHttp.announce(signedMetadataTransaction);
                    }).catch((reason) => fail(reason));
                transactionHttp.announce(signedLockhashTransaction);
            });
        });

        describe('should add metadata to a mosaic', () => {
            it('aggregate', (done) => {
                const mosaicMetadataTransaction = factory.mosaicMetadata()
                    .targetMosaicId(ConfTestingMosaicId)
                    .targetPublicKey(TestingAccount.publicAccount)
                    .scopedMetadataKey(UInt64.fromUint(1))
                    .valueSize(5)
                    .valueSizeDelta(5)
                    .valueDifferences(convert.hexToUint8(convert.utf8ToHex("hello")))
                    .build();

                const aggregateBondedTxn = factory.aggregateBonded()
                    .innerTransactions([mosaicMetadataTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedMetadataTransaction = aggregateBondedTxn.signWith(TestingAccount, factory.generationHash);
                
                const lockhashTransaction = factory.lockFunds()
                    .duration(UInt64.fromUint(1000))
                    .transactionHash(signedMetadataTransaction)
                    .mosaic(new Mosaic(new NamespaceId("prx.xpx"), UInt64.fromUint(10000000)))
                    .build();

                const signedLockhashTransaction = lockhashTransaction.signWith(TestingAccount, factory.generationHash);

                validateTransactionConfirmed(listener, TestingAccount.address, signedLockhashTransaction.hash)
                    .then(() => {
                        validateTransactionConfirmed(listener, TestingAccount.address, signedMetadataTransaction.hash)
                            .then(() => done()).catch((reason) => fail(reason));
                        transactionHttp.announce(signedMetadataTransaction);
                    }).catch((reason) => fail(reason));
                transactionHttp.announce(signedLockhashTransaction);
            });
        });

        /*
        describe('should get metadata given mosaicId', () => {
            it('standalone', (done) => {
                metadataHttp.getMosaicMetadata(ConfTestingMosaicId)
                .subscribe((metadataInfo) => {
                    expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
            });
        });
        */

        describe('should remove metadata from a mosaic', () => {
            it('aggregate', (done) => {
                const mosaicMetadataTransaction = factory.mosaicMetadata()
                    .targetMosaicId(ConfTestingMosaicId)
                    .targetPublicKey(TestingAccount.publicAccount)
                    .scopedMetadataKey(UInt64.fromUint(1))
                    .valueSize(5)
                    .valueSizeDelta(-5)
                    .valueDifferences(convert.hexToUint8(convert.utf8ToHex("hello")))
                    .build();

                const aggregateBondedTxn = factory.aggregateBonded()
                    .innerTransactions([mosaicMetadataTransaction.toAggregate(TestingAccount.publicAccount)])
                    .build();

                const signedMetadataTransaction = aggregateBondedTxn.signWith(TestingAccount, factory.generationHash);
                
                const lockhashTransaction = factory.lockFunds()
                    .duration(UInt64.fromUint(1000))
                    .transactionHash(signedMetadataTransaction)
                    .mosaic(new Mosaic(new NamespaceId("prx.xpx"), UInt64.fromUint(10000000)))
                    .build();

                const signedLockhashTransaction = lockhashTransaction.signWith(TestingAccount, factory.generationHash);

                validateTransactionConfirmed(listener, TestingAccount.address, signedLockhashTransaction.hash)
                    .then(() => {
                        validateTransactionConfirmed(listener, TestingAccount.address, signedMetadataTransaction.hash)
                            .then(() => done()).catch((reason) => fail(reason));
                        transactionHttp.announce(signedMetadataTransaction);
                    }).catch((reason) => fail(reason));
                transactionHttp.announce(signedLockhashTransaction);
            });
        });
    });
});
