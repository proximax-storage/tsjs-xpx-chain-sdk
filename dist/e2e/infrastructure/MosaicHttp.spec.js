"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const chai_1 = require("chai");
const infrastructure_1 = require("../../src/infrastructure/infrastructure");
const MosaicHttp_1 = require("../../src/infrastructure/MosaicHttp");
const MosaicId_1 = require("../../src/model/mosaic/MosaicId");
const conf_spec_1 = require("../conf/conf.spec");
const model_1 = require("../../src/model/model");
const assert_1 = require("assert");
describe('MosaicHttp', () => {
    const mosaicHttp = new MosaicHttp_1.MosaicHttp(conf_spec_1.APIUrl);
    const transactionHttp = new infrastructure_1.TransactionHttp(conf_spec_1.APIUrl);
    let listener;
    let generationHash;
    let namespaceId;
    let mosaicId = conf_spec_1.ConfNetworkMosaic;
<<<<<<< HEAD
    let mosaicDivisibility = 6;
    let mosaicDuration = model_1.UInt64.fromUint(0);
=======
    const mosaicDivisibility = 6;
>>>>>>> jwt
    const validateTransactionAnnounceCorrectly = (address, done, hash) => {
        const status = listener.status(address).subscribe(error => {
            console.error(error);
            status.unsubscribe();
            sub.unsubscribe();
            return assert_1.fail("Status reported an error.");
        });
        const sub = listener.confirmed(address).subscribe((transaction) => {
            if (hash) {
                if (transaction && transaction.transactionInfo && transaction.transactionInfo.hash === hash) {
                    // console.log(transaction);
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
    before(() => {
        listener = new infrastructure_1.Listener(conf_spec_1.APIUrl);
        return listener.open().then(() => {
            return conf_spec_1.NemesisBlockInfo.getInstance().then(nemesicBlockinfo => {
                generationHash = nemesicBlockinfo.generationHash;
            });
        });
    });
    after(() => {
        return listener.close();
    });
    describe('Setup test NamespaceId', () => {
        it('Announce RegisterNamespaceTransaction', (done) => {
            const namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
            const registerNamespaceTransaction = model_1.RegisterNamespaceTransaction.createRootNamespace(model_1.Deadline.create(), namespaceName, model_1.UInt64.fromUint(1000), conf_spec_1.ConfNetworkType);
            namespaceId = new model_1.NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(conf_spec_1.TestingAccount, generationHash);
            validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('Setup test Mosaic', () => {
        it('Announce ', (done) => {
            // overwrites mosaicId globally for the rest of the tests
            const nonce = model_1.MosaicNonce.createRandom();
            mosaicId = MosaicId_1.MosaicId.createFromNonce(nonce, conf_spec_1.TestingAccount.publicAccount);
<<<<<<< HEAD
            mosaicDivisibility = 3;
            mosaicDuration = model_1.UInt64.fromUint(1000);
=======
>>>>>>> jwt
            const mosaicDefinitionTransaction = model_1.MosaicDefinitionTransaction.create(model_1.Deadline.create(), nonce, mosaicId, model_1.MosaicProperties.create({
                supplyMutable: true,
                transferable: true,
                divisibility: mosaicDivisibility,
<<<<<<< HEAD
                duration: mosaicDuration,
=======
                duration: model_1.UInt64.fromUint(1000),
>>>>>>> jwt
            }), conf_spec_1.ConfNetworkType);
            const signedTransaction = mosaicDefinitionTransaction.signWith(conf_spec_1.TestingAccount, generationHash);
            validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('Setup test MosaicAlias', () => {
        it('Announce MosaicAliasTransaction', (done) => {
            const mosaicAliasTransaction = model_1.MosaicAliasTransaction.create(model_1.Deadline.create(), model_1.AliasActionType.Link, namespaceId, mosaicId, conf_spec_1.ConfNetworkType);
            const signedTransaction = mosaicAliasTransaction.signWith(conf_spec_1.TestingAccount, generationHash);
            validateTransactionAnnounceCorrectly(conf_spec_1.TestingAccount.address, done, signedTransaction.hash);
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
                chai_1.expect(mosaicInfo.height.lower).not.to.be.null;
                chai_1.expect(mosaicInfo.divisibility).to.be.equal(mosaicDivisibility);
<<<<<<< HEAD
                chai_1.expect(mosaicInfo.duration.equals(mosaicDuration)).to.be.equal(true);
=======
>>>>>>> jwt
                chai_1.expect(mosaicInfo.isSupplyMutable()).to.be.equal(true);
                chai_1.expect(mosaicInfo.isTransferable()).to.be.equal(true);
                done();
            });
        });
    });
    describe('getMosaics', () => {
        it('should return mosaics given array of mosaicIds', (done) => {
            mosaicHttp.getMosaics([mosaicId])
                .subscribe((mosaicInfos) => {
                chai_1.expect(mosaicInfos[0].height.lower).not.to.be.null;
                chai_1.expect(mosaicInfos[0].divisibility).to.be.equal(mosaicDivisibility);
<<<<<<< HEAD
                chai_1.expect(mosaicInfos[0].duration.equals(mosaicDuration)).to.be.equal(true);
=======
>>>>>>> jwt
                chai_1.expect(mosaicInfos[0].isSupplyMutable()).to.be.equal(true);
                chai_1.expect(mosaicInfos[0].isTransferable()).to.be.equal(true);
                done();
            });
        });
    });
    describe('getMosaics', () => {
        it('should return mosaics given array of mosaicIds', (done) => {
            mosaicHttp.getMosaics([mosaicId])
                .subscribe((mosaicInfos) => {
                chai_1.expect(mosaicInfos[0].height.lower).not.to.be.null;
                chai_1.expect(mosaicInfos[0].divisibility).to.be.equal(mosaicDivisibility);
                chai_1.expect(mosaicInfos[0].isSupplyMutable()).to.be.equal(true);
                chai_1.expect(mosaicInfos[0].isTransferable()).to.be.equal(true);
                done();
            });
        });
    });
    describe('getMosaicNames', () => {
        it('should return mosaics names given array of mosaicIds', (done) => {
            mosaicHttp.getMosaicsNames([mosaicId])
                .subscribe((mosaicNames) => {
                chai_1.expect(mosaicNames[0].mosaicId.equals(mosaicId)).to.true;
                chai_1.expect(mosaicNames[0].names[0]).not.to.be.undefined;
                done();
            });
        });
    });
});
//# sourceMappingURL=MosaicHttp.spec.js.map