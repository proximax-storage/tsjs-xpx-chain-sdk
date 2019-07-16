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
import {BlockHttp} from '../../src/infrastructure/BlockHttp';
import { Listener, TransactionHttp } from '../../src/infrastructure/infrastructure';
import {QueryParams} from '../../src/infrastructure/QueryParams';
import { NetworkCurrencyMosaic } from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { Deadline } from '../../src/model/transaction/Deadline';
import { PlainMessage } from '../../src/model/transaction/PlainMessage';
import { Transaction } from '../../src/model/transaction/Transaction';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { APIUrl, ConfNetworkType, TestingRecipient, NemesisBlockInfo, TestingAccount } from '../conf/conf.spec';
import { Address } from '../../src/model/model';
import { fail } from 'assert';

describe('BlockHttp', () => {
    const blockHttp = new BlockHttp(APIUrl);
    const transactionHttp = new TransactionHttp(APIUrl);
    let generationHash: string;
    let listener: Listener;
    let blockReceiptHash: string;
    let blockTransactionHash: string;
    const chainHeight = 2;
    before (() => {
        listener = new Listener(APIUrl);
        return listener.open().then(() => {
            NemesisBlockInfo.getInstance().then(nemesisBlockInfo => {
                generationHash = nemesisBlockInfo.generationHash;
            })
        });
    });
    after(() => {
        return listener.close();
    });

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

    /**
     * =========================
     * Setup Test Data
     * =========================
     */
    describe('Setup Test Data', () => {
        it('Announce TransferTransaction', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                TestingRecipient.address,
                [NetworkCurrencyMosaic.createAbsolute(1)],
                PlainMessage.create('test-message'),
                ConfNetworkType,
            );
            const signedTransaction = transferTransaction.signWith(TestingAccount, generationHash);

            validateTransactionAnnounceCorrectly(TestingRecipient.address, done, signedTransaction.hash);

            transactionHttp.announce(signedTransaction);
        });
    });

    describe('getBlockByHeight', () => {
        it('should return block info given height', (done) => {
            blockHttp.getBlockByHeight(1)
                .subscribe((blockInfo) => {
                    expect(blockInfo.height.lower).to.be.equal(1);
                    expect(blockInfo.height.higher).to.be.equal(0);
                    expect(blockInfo.timestamp.lower).to.be.equal(0);
                    expect(blockInfo.timestamp.higher).to.be.equal(0);
                    done();
                });
        });
        it('should return block info given height 2', (done) => {
            blockHttp.getBlockByHeight(chainHeight)
                .subscribe((blockInfo) => {
                    blockReceiptHash = blockInfo.blockReceiptsHash;
                    blockTransactionHash = blockInfo.blockTransactionsHash;
                    expect(blockInfo.height.lower).to.be.equal(chainHeight);
                    expect(blockInfo.height.higher).to.be.equal(0);
                    expect(blockInfo.timestamp.lower).not.to.be.equal(0);
                    expect(blockInfo.timestamp.higher).not.to.be.equal(0);
                    done();
                });
        });
    });

    describe('getBlockTransactions', () => {
        let nextId: string;
        let firstId: string;

        it('should return block transactions data given height', (done) => {
            blockHttp.getBlockTransactions(1)
                .subscribe((transactions) => {
                    nextId = transactions[0].transactionInfo!.id;
                    firstId = transactions[1].transactionInfo!.id;
                    expect(transactions.length).to.be.greaterThan(0);
                    done();
                });
        });

        it('should return block transactions data given height with paginated transactionId', (done) => {
            blockHttp.getBlockTransactions(1, new QueryParams(10, nextId))
                .subscribe((transactions) => {
                    expect(transactions[0].transactionInfo!.id).to.be.equal(firstId);
                    expect(transactions.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('getBlocksByHeightWithLimit', () => {
        it('should return block info given height and limit', (done) => {
            blockHttp.getBlocksByHeightWithLimit(chainHeight, 50)
                .subscribe((blocksInfo) => {
                    expect(blocksInfo.length).to.be.greaterThan(0);
                    done();
                });
        });
    });
    describe('getMerkleReceipts', () => {
        it('should return Merkle Receipts', (done) => {
            blockHttp.getMerkleReceipts(chainHeight, blockReceiptHash)
                .subscribe((merkleReceipts) => {
                    expect(merkleReceipts.type).not.to.be.null;
                    expect(merkleReceipts.payload).not.to.be.null;
                    done();
                });
        });
    });
    describe('getMerkleTransaction', () => {
        it('should return Merkle Transaction', (done) => {
            blockHttp.getMerkleTransaction(chainHeight, blockTransactionHash)
                .subscribe((merkleTransactionss) => {
                    expect(merkleTransactionss.type).not.to.be.null;
                    expect(merkleTransactionss.payload).not.to.be.null;
                    done();
                });
        });
    });

    describe('getBlockReceipts', () => {
        it('should return block receipts', (done) => {
            blockHttp.getBlockReceipts(chainHeight)
                .subscribe((statement) => {
                    expect(statement.transactionStatements).not.to.be.null;
                    expect(statement.transactionStatements.length).to.be.greaterThan(0);
                    done();
                });
        });
    });
});
