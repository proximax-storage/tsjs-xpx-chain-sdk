"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const BlockchainHttp_1 = require("../../src/infrastructure/BlockchainHttp");
const QueryParams_1 = require("../../src/infrastructure/QueryParams");
const conf_spec_1 = require("../conf/conf.spec");
describe('BlockchainHttp', () => {
    const blockchainHttp = new BlockchainHttp_1.BlockchainHttp(conf_spec_1.APIUrl);
    describe('getBlockByHeight', () => {
        it('should return block info given height', (done) => {
            blockchainHttp.getBlockByHeight(1)
                .subscribe((blockInfo) => {
                chai_1.expect(blockInfo.height.lower).to.be.equal(1);
                chai_1.expect(blockInfo.height.higher).to.be.equal(0);
                chai_1.expect(blockInfo.timestamp.lower).to.be.equal(0);
                chai_1.expect(blockInfo.timestamp.higher).to.be.equal(0);
                done();
            });
        });
    });
    describe('getBlockTransactions', () => {
        let nextId;
        let firstId;
        it('should return block transactions data given height', (done) => {
            blockchainHttp.getBlockTransactions(1)
                .subscribe((transactions) => {
                nextId = transactions[0].transactionInfo.id;
                firstId = transactions[1].transactionInfo.id;
                chai_1.expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
        it('should return block transactions data given height with paginated transactionId', (done) => {
            blockchainHttp.getBlockTransactions(1, new QueryParams_1.QueryParams(10, nextId))
                .subscribe((transactions) => {
                chai_1.expect(transactions[0].transactionInfo.id).to.be.equal(firstId);
                chai_1.expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });
    describe('getBlocksByHeightWithLimit', () => {
        it('should return block info given height and limit', (done) => {
            blockchainHttp.getBlocksByHeightWithLimit(1, 50)
                .subscribe((blocksInfo) => {
                chai_1.expect(blocksInfo.length).to.be.equal(50);
                chai_1.expect(blocksInfo[49].height.lower).to.be.equal(1);
                chai_1.expect(blocksInfo[49].height.higher).to.be.equal(0);
                chai_1.expect(blocksInfo[49].timestamp.lower).to.be.equal(0);
                chai_1.expect(blocksInfo[49].timestamp.higher).to.be.equal(0);
                done();
            });
        });
    });
    describe('getBlockchainHeight', () => {
        it('should return blockchain height', (done) => {
            blockchainHttp.getBlockchainHeight()
                .subscribe((height) => {
                chai_1.expect(height.lower).to.be.greaterThan(0);
                done();
            });
        });
    });
    describe('getBlockchainScore', () => {
        it('should return blockchain score', (done) => {
            blockchainHttp.getBlockchainScore()
                .subscribe((blockchainScore) => {
                chai_1.expect(blockchainScore.scoreLow).to.not.be.equal(undefined);
                chai_1.expect(blockchainScore.scoreHigh.lower).to.be.equal(0);
                chai_1.expect(blockchainScore.scoreHigh.higher).to.be.equal(0);
                done();
            });
        });
    });
    describe('getDiagnosticStorage', () => {
        it('should return blockchain diagnostic storage', (done) => {
            blockchainHttp.getDiagnosticStorage()
                .subscribe((blockchainStorageInfo) => {
                chai_1.expect(blockchainStorageInfo.numBlocks).to.be.greaterThan(0);
                chai_1.expect(blockchainStorageInfo.numTransactions).to.be.greaterThan(0);
                chai_1.expect(blockchainStorageInfo.numAccounts).to.be.greaterThan(0);
                done();
            });
        });
    });
});
//# sourceMappingURL=BlockchainHttp.spec.js.map