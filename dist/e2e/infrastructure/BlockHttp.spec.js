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
const BlockHttp_1 = require("../../src/infrastructure/BlockHttp");
const infrastructure_1 = require("../../src/infrastructure/infrastructure");
const QueryParams_1 = require("../../src/infrastructure/QueryParams");
const PlainMessage_1 = require("../../src/model/transaction/PlainMessage");
const conf_spec_1 = require("../conf/conf.spec");
const model_1 = require("../../src/model/model");
const assert_1 = require("assert");
const blockHttp = new BlockHttp_1.BlockHttp(conf_spec_1.APIUrl);
const transactionHttp = new infrastructure_1.TransactionHttp(conf_spec_1.APIUrl);
let listener;
let blockReceiptHash;
let blockTransactionHash;
const chainHeight = 2;
let factory;
before(() => {
    listener = new infrastructure_1.Listener(conf_spec_1.APIUrl);
    return listener.open().then(() => {
        return conf_spec_1.Configuration.getTransactionBuilderFactory().then(f => {
            factory = f;
        });
    });
});
after(() => {
    return listener.close();
});
describe('BlockHttp', () => {
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
    /**
     * =========================
     * Setup Test Data
     * =========================
     */
    describe('Setup Test Data', () => {
        it('Announce TransferTransaction', (done) => {
            const transferTransaction = factory.transfer()
                .recipient(conf_spec_1.TestingRecipient.address)
                .mosaics([new model_1.Mosaic(conf_spec_1.ConfNetworkMosaic, model_1.UInt64.fromUint(1000000))])
                .message(PlainMessage_1.PlainMessage.create('test-message'))
                .build();
            const signedTransaction = transferTransaction.signWith(conf_spec_1.TestingAccount, factory.generationHash);
            validateTransactionAnnounceCorrectly(conf_spec_1.TestingRecipient.address, done, signedTransaction.hash);
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('getBlockByHeight', () => {
        it('should return block info given height', (done) => {
            blockHttp.getBlockByHeight(1)
                .subscribe((blockInfo) => {
                chai_1.expect(blockInfo.height.lower).to.be.equal(1);
                chai_1.expect(blockInfo.height.higher).to.be.equal(0);
                chai_1.expect(blockInfo.timestamp.lower).to.be.equal(0);
                chai_1.expect(blockInfo.timestamp.higher).to.be.equal(0);
                done();
            });
        });
        it('should return block info given height 2', (done) => {
            blockHttp.getBlockByHeight(chainHeight)
                .subscribe((blockInfo) => {
                blockReceiptHash = blockInfo.blockReceiptsHash;
                blockTransactionHash = blockInfo.blockTransactionsHash;
                chai_1.expect(blockInfo.height.lower).to.be.equal(chainHeight);
                chai_1.expect(blockInfo.height.higher).to.be.equal(0);
                chai_1.expect(blockInfo.timestamp.lower).not.to.be.equal(0);
                chai_1.expect(blockInfo.timestamp.higher).not.to.be.equal(0);
                done();
            });
        });
    });
    describe('getBlockTransactions', () => {
        let nextId;
        let firstId;
        it('should return block transactions data given height', (done) => {
            blockHttp.getBlockTransactions(1)
                .subscribe((transactions) => {
                nextId = transactions[0].transactionInfo.id;
                firstId = transactions[1].transactionInfo.id;
                chai_1.expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
        it('should return block transactions data given height with paginated transactionId', (done) => {
            blockHttp.getBlockTransactions(1, new QueryParams_1.QueryParams(10, nextId))
                .subscribe((transactions) => {
                chai_1.expect(transactions[0].transactionInfo.id).to.be.equal(firstId);
                chai_1.expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });
    describe('getBlocksByHeightWithLimit', () => {
        it('should return block info given height and limit', (done) => {
            blockHttp.getBlocksByHeightWithLimit(chainHeight, 50)
                .subscribe((blocksInfo) => {
                chai_1.expect(blocksInfo.length).to.be.greaterThan(0);
                done();
            });
        });
    });
    describe('getMerkleReceipts', () => {
        it('should return Merkle Receipts', (done) => {
            blockHttp.getMerkleReceipts(chainHeight, blockReceiptHash)
                .subscribe((merkleReceipts) => {
                chai_1.expect(merkleReceipts.type).not.to.be.null;
                chai_1.expect(merkleReceipts.payload).not.to.be.null;
                done();
            });
        });
    });
    describe('getMerkleTransaction', () => {
        it('should return Merkle Transaction', (done) => {
            blockHttp.getMerkleTransaction(chainHeight, blockTransactionHash)
                .subscribe((merkleTransactionss) => {
                chai_1.expect(merkleTransactionss.type).not.to.be.null;
                chai_1.expect(merkleTransactionss.payload).not.to.be.null;
                done();
            });
        });
    });
    describe('getBlockReceipts', () => {
        it('should return block receipts', (done) => {
            blockHttp.getBlockReceipts(chainHeight)
                .subscribe((statement) => {
                chai_1.expect(statement.transactionStatements).not.to.be.null;
                chai_1.expect(statement.transactionStatements.length).to.be.greaterThan(0);
                done();
            });
        });
    });
});
//# sourceMappingURL=BlockHttp.spec.js.map