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
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../src/model/mosaic/MosaicId';
import {APIUrl, ConfNetworkMosaic, ConfNetworkType, NemesisBlockInfo, TestingAccount, ConfNetworkMosaicDivisibility} from '../conf/conf.spec';
import { Deadline, UInt64, RegisterNamespaceTransaction, NamespaceId, AliasActionType, MosaicAliasTransaction, MosaicNonce, MosaicDefinitionTransaction, MosaicProperties, Address, Transaction } from '../../src/model/model';
import { fail } from 'assert';

describe('MosaicHttp', () => {
    const mosaicHttp = new MosaicHttp(APIUrl);
    const transactionHttp = new TransactionHttp(APIUrl);
    let listener: Listener;
    let generationHash: string;
    let namespaceId: NamespaceId;
    let mosaicId = ConfNetworkMosaic;
    const mosaicDivisibility = 6;

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

    before (() => {
        listener = new Listener(APIUrl);
        return listener.open().then(() => {
            return NemesisBlockInfo.getInstance().then(nemesicBlockinfo => {
                generationHash = nemesicBlockinfo.generationHash;
            })
        });
    });
    after(() => {
        return listener.close();
    });

    describe('Setup test NamespaceId', () => {
        it('Announce RegisterNamespaceTransaction', (done) => {
            const namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
            const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
                Deadline.create(),
                namespaceName,
                UInt64.fromUint(1000),
                ConfNetworkType,
            );
            namespaceId = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(TestingAccount, generationHash);

            validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);

            transactionHttp.announce(signedTransaction);
        });
    });

    describe('Setup test Mosaic', () => {
        it('Announce ', (done) => {
            // overwrites mosaicId globally for the rest of the tests
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, TestingAccount.publicAccount);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
                nonce,
                mosaicId,
                MosaicProperties.create({
                    supplyMutable: true,
                    transferable: true,
                    divisibility: mosaicDivisibility,
                    duration: UInt64.fromUint(1000),
                }),
                ConfNetworkType
            )
            const signedTransaction = mosaicDefinitionTransaction.signWith(TestingAccount, generationHash);

            validateTransactionAnnounceCorrectly(TestingAccount.address, done, signedTransaction.hash);

            transactionHttp.announce(signedTransaction);
        });
    });

    describe('Setup test MosaicAlias', () => {
        it('Announce MosaicAliasTransaction', (done) => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(),
                AliasActionType.Link,
                namespaceId,
                mosaicId,
                ConfNetworkType,
            );
            const signedTransaction = mosaicAliasTransaction.signWith(TestingAccount, generationHash);

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
});
