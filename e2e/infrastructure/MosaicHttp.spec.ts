/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {assert, expect} from 'chai';
import { Listener, TransactionHttp } from '../../src/infrastructure/infrastructure';
import {MosaicHttp} from '../../src/infrastructure/MosaicHttp';
import {MosaicId} from '../../src/model/mosaic/MosaicId';
import {APIUrl, ConfNetworkMosaic, TestingAccount, Configuration } from '../conf/conf.spec';
import { Deadline, UInt64, RegisterNamespaceTransaction, NamespaceId, AliasActionType, MosaicAliasTransaction, MosaicNonce, MosaicDefinitionTransaction, MosaicProperties, Address, Transaction, TransactionBuilderFactory } from '../../src/model/model';
import { fail } from 'assert';


const mosaicHttp = new MosaicHttp(APIUrl);
const transactionHttp = new TransactionHttp(APIUrl);
let listener: Listener;
let namespaceId: NamespaceId;
let mosaicId = ConfNetworkMosaic;
let mosaicDivisibility = 6;
let mosaicDuration = UInt64.fromUint(0);
let factory: TransactionBuilderFactory;

before (() => {
    listener = new Listener(APIUrl);
    return listener.open().then(() => {
        return Configuration.getTransactionBuilderFactory().then(f => {
            factory = f;
        })
    });
});
after(() => {
    return listener.close();
});

describe('MosaicHttp', () => {

    const validateTransactionAnnounceCorrectly = (address: Address, done, hash?: string) => {
        const status = listener.status(address).subscribe(error => {
            console.error(error);
            status.unsubscribe();
            sub.unsubscribe();
            return fail("Status reported an error.");
        });
        const sub = listener.confirmed(address).subscribe((transaction: Transaction) => {
            if (hash) {
                if (transaction && transaction.transactionInfo && transaction.transactionInfo.hash === hash) {
                    // console.log(transaction);
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
    }

    describe('Setup test NamespaceId', () => {
        it('Announce RegisterNamespaceTransaction', (done) => {
            const namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
            const registerNamespaceTransaction = factory.registerRootNamespace()
                .namespaceName(namespaceName)
                .duration(UInt64.fromUint(1000))
                .build();

            namespaceId = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(TestingAccount, factory.generationHash);

            validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);

            transactionHttp.announce(signedTransaction);
        });
    });

    describe('Setup test Mosaic', () => {
        it('Announce ', (done) => {
            // overwrites mosaicId globally for the rest of the tests
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, TestingAccount.publicAccount);
            mosaicDivisibility = 3;
            mosaicDuration = UInt64.fromUint(1000);
            const mosaicDefinitionTransaction = factory.mosaicDefinition()
                .mosaicNonce(nonce)
                .mosaicId(mosaicId)
                .mosaicProperties(MosaicProperties.create({
                    supplyMutable: true,
                    transferable: true,
                    divisibility: mosaicDivisibility,
                    duration: mosaicDuration,
                }))
                .build();

            const signedTransaction = mosaicDefinitionTransaction.signWith(TestingAccount, factory.generationHash);

            validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);

            transactionHttp.announce(signedTransaction);
        });
    });

    describe('Setup test MosaicAlias', () => {
        it('Announce MosaicAliasTransaction', (done) => {
            const mosaicAliasTransaction = factory.mosaicAlias()
                .actionType(AliasActionType.Link)
                .namespaceId(namespaceId)
                .mosaicId(mosaicId)
                .build();

            const signedTransaction = mosaicAliasTransaction.signWith(TestingAccount, factory.generationHash);

            validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);

            transactionHttp.announce(signedTransaction);
        });
    });

    /**
     * =========================
     * Test
     * =========================
     */
    describe('getMosaic', () => {
        it('should return mosaic given mosaicId', (done) => {
            mosaicHttp.getMosaic(mosaicId)
                .subscribe((mosaicInfo) => {
                    expect(mosaicInfo.height.lower).not.to.be.null;
                    expect(mosaicInfo.divisibility).to.be.equal(mosaicDivisibility);
                    expect((mosaicInfo.duration as UInt64).equals(mosaicDuration)).to.be.equal(true);
                    expect(mosaicInfo.isSupplyMutable()).to.be.equal(true);
                    expect(mosaicInfo.isTransferable()).to.be.equal(true);
                    done();
                });
        });
    });

    describe('getMosaics', () => {
        it('should return mosaics given array of mosaicIds', (done) => {
            mosaicHttp.getMosaics([mosaicId])
                .subscribe((mosaicInfos) => {
                    expect(mosaicInfos[0].height.lower).not.to.be.null;
                    expect(mosaicInfos[0].divisibility).to.be.equal(mosaicDivisibility);
                    expect((mosaicInfos[0].duration as UInt64).equals(mosaicDuration)).to.be.equal(true);
                    expect(mosaicInfos[0].isSupplyMutable()).to.be.equal(true);
                    expect(mosaicInfos[0].isTransferable()).to.be.equal(true);
                    done();
                });
        });
    });

    describe('getMosaics', () => {
        it('should return mosaics given array of mosaicIds', (done) => {
            mosaicHttp.getMosaics([mosaicId])
                .subscribe((mosaicInfos) => {
                    expect(mosaicInfos[0].height.lower).not.to.be.null;
                    expect(mosaicInfos[0].divisibility).to.be.equal(mosaicDivisibility);
                    expect(mosaicInfos[0].isSupplyMutable()).to.be.equal(true);
                    expect(mosaicInfos[0].isTransferable()).to.be.equal(true);
                    done();
                });
        });
    });

    describe('getMosaicNames', () => {
        it('should return mosaics names given array of mosaicIds', (done) => {
            mosaicHttp.getMosaicsNames([mosaicId])
                .subscribe((mosaicNames) => {
                    expect(mosaicNames[0].mosaicId.equals(mosaicId)).to.true;
                    expect(mosaicNames[0].names[0]).not.to.be.undefined;
                    done();
                });
        });
    });

    describe('getMosaicRichlist', () => {
        it('should return mosaics richlist', (done) => {
            mosaicHttp.getMosaicRichlist(mosaicId)
                .subscribe((richlistEntry) => {
                    expect(richlistEntry[0].amount).not.to.be.undefined;
                    expect(richlistEntry[0].address).not.to.be.undefined;
                    expect(richlistEntry[0].publicKey).not.to.be.undefined;
                    console.log(richlistEntry)
                    done();
                });
        });
    });

});
