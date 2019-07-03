"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const conf_spec_1 = require("../conf/conf.spec");
const MetadataHttp_1 = require("../../src/infrastructure/MetadataHttp");
const model_1 = require("../../src/model/model");
const ModifyMetadataTransaction_1 = require("../../src/model/transaction/ModifyMetadataTransaction");
const infrastructure_1 = require("../../src/infrastructure/infrastructure");
let listener;
let metadataHttp;
let transactionHttp;
let generationHash;
before(() => {
    metadataHttp = new MetadataHttp_1.MetadataHttp(conf_spec_1.APIUrl);
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
describe('MetadataHttp', () => {
    describe('add ,modify, get Metadata', () => {
        describe('should add metadata to an account', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction_1.ModifyMetadataTransaction.createWithAddress(conf_spec_1.ConfNetworkType, model_1.Deadline.create(), undefined, conf_spec_1.TestingAccount.address, [new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.ADD, "key1", "x".repeat(256))]);
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(conf_spec_1.TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('should get metadata given accountId', () => {
            it('standalone', (done) => {
                metadataHttp.getAccountMetadata(conf_spec_1.TestingAccount.address.plain())
                    .subscribe((addressMetadata) => {
                    chai_1.expect(addressMetadata.fields[0].value.length).to.be.equal(256);
                    chai_1.expect(addressMetadata).not.to.be.equal(undefined);
                    done();
                });
            });
        });
        describe('should remove metadata from an account', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction_1.ModifyMetadataTransaction.createWithAddress(conf_spec_1.ConfNetworkType, model_1.Deadline.create(), undefined, conf_spec_1.TestingAccount.address, [new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.REMOVE, "key1")]);
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(conf_spec_1.TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('should add metadata to a namespace', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction_1.ModifyMetadataTransaction.createWithNamespaceId(conf_spec_1.ConfNetworkType, model_1.Deadline.create(), undefined, conf_spec_1.ConfTestingNamespace, [new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.ADD, "key1", "some value")]);
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(conf_spec_1.TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('should get metadata given namespaceId', () => {
            it('standalone', (done) => {
                metadataHttp.getNamespaceMetadata(conf_spec_1.ConfTestingNamespace)
                    .subscribe((metadataInfo) => {
                    chai_1.expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
            });
        });
        describe('should remove metadata from a namespace', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction_1.ModifyMetadataTransaction.createWithNamespaceId(conf_spec_1.ConfNetworkType, model_1.Deadline.create(), undefined, conf_spec_1.ConfTestingNamespace, [new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.REMOVE, "key1")]);
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(conf_spec_1.TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('should add metadata to a mosaic', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction_1.ModifyMetadataTransaction.createWithMosaicId(conf_spec_1.ConfNetworkType, model_1.Deadline.create(), undefined, conf_spec_1.ConfTestingMosaic, [new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.ADD, "key1", "some value")]);
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(conf_spec_1.TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
        describe('should get metadata given mosaicId', () => {
            it('standalone', (done) => {
                metadataHttp.getMosaicMetadata(conf_spec_1.ConfTestingMosaic)
                    .subscribe((metadataInfo) => {
                    chai_1.expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
            });
        });
        describe('should remove metadata from a mosaic', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction_1.ModifyMetadataTransaction.createWithMosaicId(conf_spec_1.ConfNetworkType, model_1.Deadline.create(), undefined, conf_spec_1.ConfTestingMosaic, [new ModifyMetadataTransaction_1.MetadataModification(ModifyMetadataTransaction_1.MetadataModificationType.REMOVE, "key1")]);
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(conf_spec_1.TestingAccount, generationHash);
                validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
        });
    });
});
//# sourceMappingURL=MetadataHttp.spec.js.map