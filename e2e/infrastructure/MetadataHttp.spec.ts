import {expect} from 'chai';
import {APIUrl, TestingAccount, ConfNetworkType} from '../conf/conf.spec';
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
    return listener.open().then(() => {
        return ConfUtils.prepareE2eTestAccounts();
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

    describe('getMetadata', () => {
        it('should return metadata given accountId', (done) => {
            metadataHttp.getAccountMetadata('VCMY23PRJYEVEZWLNY3GCPYDOYLMOLZCJWUVYK7U')
                .subscribe((metadataInfo) => {
                    console.log(metadataInfo);
                    expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
        });

        it('should return metadata given namespaceId', (done) => {
            metadataHttp.getNamespaceMetadata(new NamespaceId([3157842063, 3375771904]))
                .subscribe((metadataInfo) => {
                    console.log(metadataInfo);
                    expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
        });

        it('should return metadata given mosaicId', (done) => {
            metadataHttp.getMosaicMetadata(new MosaicId('04E8F1965203B09C'))
                .subscribe((metadataInfo) => {
                    console.log(metadataInfo);
                    expect(metadataInfo).not.to.be.equal(undefined);
                    done();
                });
        });
    });

    describe('add or modifyMetadata', () => {
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
/*
        xdescribe('should add metadata to a mosaic', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction.createWithMosaicId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                TestingAccount.address,
                [new MetadataModification(MetadataModificationType.ADD, "key2", "some other value")]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            }); 
        });
        xdescribe('should remove metadata from a mosaic', () => {
            const modifyMetadataTransaction = ModifyMetadataTransaction.createWithMosaicId(
                ConfNetworkType,
                Deadline.create(),
                undefined,
                TestingAccount.address,
                [new MetadataModification(MetadataModificationType.REMOVE, "key2")]
            );
            it('standalone', (done) => {
                const signedTransaction = modifyMetadataTransaction.signWith(TestingAccount);
                validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);
                transactionHttp.announce(signedTransaction);
            });
                
        });
        
        it('should add metadata to a namespace', (done) => {
            
        });*/
    });
});
