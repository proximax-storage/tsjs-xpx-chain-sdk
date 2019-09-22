"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const conf_spec_1 = require("../conf/conf.spec");
const MetadataHttp_1 = require("../../src/infrastructure/MetadataHttp");
const ModifyMetadataTransaction_1 = require("../../src/model/transaction/ModifyMetadataTransaction");
const infrastructure_1 = require("../../src/infrastructure/infrastructure");
let listener;
let metadataHttp;
let transactionHttp;
let factory;
before(() => {
    metadataHttp = new MetadataHttp_1.MetadataHttp(conf_spec_1.APIUrl);
    transactionHttp = new infrastructure_1.TransactionHttp(conf_spec_1.APIUrl);
    listener = new infrastructure_1.Listener(conf_spec_1.APIUrl);
    return listener.open().then(() => {
        return conf_spec_1.Configuration.getTransactionBuilderFactory().then(f => {
            factory = f;
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
describe('MetadataHttp', () => {
    describe('add ,modify, get Metadata', () => {
        describe('should add metadata to an account', () => {
            it('standalone', (done) => {
                const modifyMetadataTransaction = factory.accountMetadata()
                    .address(conf_spec_1.TestingAccount.address)
                    .modifications([new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.ADD, "key1", "x".repeat(256))])
                    .build();
                const signedTransaction = modifyMetadataTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const modifyMetadataTransaction = factory.accountMetadata()
                    .address(conf_spec_1.TestingAccount.address)
                    .modifications([new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.ADD, "key2", "x".repeat(256))])
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([modifyMetadataTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('should get metadata given accountId', () => {
            it('standalone', (done) => {
                metadataHttp.getAccountMetadata(conf_spec_1.TestingAccount.address.plain())
                    .subscribe((addressMetadata) => {
                    chai_1.expect(addressMetadata).not.to.be.equal(undefined);
                    chai_1.expect(addressMetadata.fields[0].value.length).to.be.equal(256);
                    chai_1.expect(addressMetadata.fields[1].value.length).to.be.equal(256);
                    done();
                });
            });
        });
        describe('should remove metadata from an account', () => {
            it('standalone', (done) => {
                const modifyMetadataTransaction = factory.accountMetadata()
                    .address(conf_spec_1.TestingAccount.address)
                    .modifications([new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.REMOVE, "key1")])
                    .build();
                const signedTransaction = modifyMetadataTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const modifyMetadataTransaction = factory.accountMetadata()
                    .address(conf_spec_1.TestingAccount.address)
                    .modifications([new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.REMOVE, "key2")])
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([modifyMetadataTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('should add metadata to a namespace', () => {
            it('standalone', (done) => {
                const modifyMetadataTransaction = factory.namespaceMetadata()
                    .namespaceId(conf_spec_1.ConfTestingNamespaceId)
                    .modifications([new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.ADD, "key1", "some value")])
                    .build();
                const signedTransaction = modifyMetadataTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const modifyMetadataTransaction = factory.namespaceMetadata()
                    .namespaceId(conf_spec_1.ConfTestingNamespaceId)
                    .modifications([new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.ADD, "key2", "some value")])
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([modifyMetadataTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('should get metadata given namespaceId', () => {
            it('standalone', (done) => {
                metadataHttp.getNamespaceMetadata(conf_spec_1.ConfTestingNamespaceId)
                    .subscribe((metadataInfo) => {
                    chai_1.expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
            });
        });
        describe('should remove metadata from a namespace', () => {
            it('standalone', (done) => {
                const modifyMetadataTransaction = factory.namespaceMetadata()
                    .namespaceId(conf_spec_1.ConfTestingNamespaceId)
                    .modifications([new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.REMOVE, "key1")])
                    .build();
                const signedTransaction = modifyMetadataTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const modifyMetadataTransaction = factory.namespaceMetadata()
                    .namespaceId(conf_spec_1.ConfTestingNamespaceId)
                    .modifications([new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.REMOVE, "key2")])
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([modifyMetadataTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('should add metadata to a mosaic', () => {
            it('standalone', (done) => {
                const modifyMetadataTransaction = factory.mosaicMetadata()
                    .mosaicId(conf_spec_1.ConfTestingMosaicId)
                    .modifications([new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.ADD, "key1", "some value")])
                    .build();
                const signedTransaction = modifyMetadataTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const modifyMetadataTransaction = factory.mosaicMetadata()
                    .mosaicId(conf_spec_1.ConfTestingMosaicId)
                    .modifications([new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.ADD, "key2", "some value")])
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([modifyMetadataTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('should get metadata given mosaicId', () => {
            it('standalone', (done) => {
                metadataHttp.getMosaicMetadata(conf_spec_1.ConfTestingMosaicId)
                    .subscribe((metadataInfo) => {
                    chai_1.expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
            });
        });
        describe('should remove metadata from a mosaic', () => {
            it('standalone', (done) => {
                const modifyMetadataTransaction = factory.mosaicMetadata()
                    .mosaicId(conf_spec_1.ConfTestingMosaicId)
                    .modifications([new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.REMOVE, "key1")])
                    .build();
                const signedTransaction = modifyMetadataTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
            it('aggregate', (done) => {
                const modifyMetadataTransaction = factory.mosaicMetadata()
                    .mosaicId(conf_spec_1.ConfTestingMosaicId)
                    .modifications([new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.REMOVE, "key2")])
                    .build();
                const aggregateTransaction = factory.aggregateComplete()
                    .innerTransactions([modifyMetadataTransaction.toAggregate(conf_spec_1.TestingAccount.publicAccount)])
                    .build();
                const signedTransaction = aggregateTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
    });
});
//# sourceMappingURL=MetadataHttp.spec.js.map