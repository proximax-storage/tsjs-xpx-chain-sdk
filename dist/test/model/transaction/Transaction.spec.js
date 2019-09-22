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
const Address_1 = require("../../../src/model/account/Address");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const AggregateTransaction_1 = require("../../../src/model/transaction/AggregateTransaction");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const PlainMessage_1 = require("../../../src/model/transaction/PlainMessage");
const Transaction_1 = require("../../../src/model/transaction/Transaction");
const TransactionInfo_1 = require("../../../src/model/transaction/TransactionInfo");
const TransactionType_1 = require("../../../src/model/transaction/TransactionType");
const TransferTransaction_1 = require("../../../src/model/transaction/TransferTransaction");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
describe('Transaction', () => {
    let account;
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    describe('isUnannounced', () => {
        it('should return true when there is no Transaction Info', () => {
            const transaction = new FakeTransaction(TransactionType_1.TransactionType.TRANSFER, NetworkType_1.NetworkType.MIJIN_TEST, 1, Deadline_1.Deadline.create(), UInt64_1.UInt64.fromUint(0), undefined, undefined, undefined);
            chai_1.expect(transaction.isUnannounced()).to.be.equal(true);
        });
    });
    describe('isUnconfirmed', () => {
        it('should return true when height is 0', () => {
            const transaction = new FakeTransaction(TransactionType_1.TransactionType.TRANSFER, NetworkType_1.NetworkType.MIJIN_TEST, 1, Deadline_1.Deadline.create(), UInt64_1.UInt64.fromUint(0), undefined, undefined, new TransactionInfo_1.TransactionInfo(UInt64_1.UInt64.fromUint(0), 1, 'id_hash', 'hash', 'hash'));
            chai_1.expect(transaction.isUnconfirmed()).to.be.equal(true);
        });
        it('should return false when height is not 0', () => {
            const transaction = new FakeTransaction(TransactionType_1.TransactionType.TRANSFER, NetworkType_1.NetworkType.MIJIN_TEST, 1, Deadline_1.Deadline.create(), UInt64_1.UInt64.fromUint(0), undefined, undefined, new TransactionInfo_1.TransactionInfo(UInt64_1.UInt64.fromUint(100), 1, 'id_hash', 'hash', 'hash'));
            chai_1.expect(transaction.isUnconfirmed()).to.be.equal(false);
        });
    });
    describe('isConfirmed', () => {
        it('should return true when height is not 0', () => {
            const transaction = new FakeTransaction(TransactionType_1.TransactionType.TRANSFER, NetworkType_1.NetworkType.MIJIN_TEST, 1, Deadline_1.Deadline.create(), UInt64_1.UInt64.fromUint(0), undefined, undefined, new TransactionInfo_1.TransactionInfo(UInt64_1.UInt64.fromUint(100), 1, 'id_hash', 'hash', 'hash'));
            chai_1.expect(transaction.isConfirmed()).to.be.equal(true);
        });
    });
    describe('hasMissingSignatures', () => {
        it('should return false when height is 0 and hash and markehash are different', () => {
            const transaction = new FakeTransaction(TransactionType_1.TransactionType.TRANSFER, NetworkType_1.NetworkType.MIJIN_TEST, 1, Deadline_1.Deadline.create(), UInt64_1.UInt64.fromUint(0), undefined, undefined, new TransactionInfo_1.TransactionInfo(UInt64_1.UInt64.fromUint(0), 1, 'id_hash', 'hash', 'hash_2'));
            chai_1.expect(transaction.hasMissingSignatures()).to.be.equal(true);
        });
    });
    describe('reapplyGiven', () => {
        it('should throw an error if the transaction is announced', () => {
            const transaction = new FakeTransaction(TransactionType_1.TransactionType.TRANSFER, NetworkType_1.NetworkType.MIJIN_TEST, 1, Deadline_1.Deadline.create(), UInt64_1.UInt64.fromUint(0), undefined, undefined, new TransactionInfo_1.TransactionInfo(UInt64_1.UInt64.fromUint(100), 1, 'id_hash', 'hash', 'hash'));
            chai_1.expect(() => {
                transaction.reapplyGiven(Deadline_1.Deadline.create());
            }).to.throws('an Announced transaction can\'t be modified');
        });
        it('should return a new transaction', () => {
            const transaction = new FakeTransaction(TransactionType_1.TransactionType.TRANSFER, NetworkType_1.NetworkType.MIJIN_TEST, 1, Deadline_1.Deadline.create(), UInt64_1.UInt64.fromUint(0), undefined, undefined);
            const newTransaction = transaction.reapplyGiven(Deadline_1.Deadline.create());
            chai_1.expect(newTransaction).to.not.equal(transaction);
        });
        it('should overide deadline properly', () => {
            const transaction = new FakeTransaction(TransactionType_1.TransactionType.TRANSFER, NetworkType_1.NetworkType.MIJIN_TEST, 1, Deadline_1.Deadline.create(), UInt64_1.UInt64.fromUint(0), undefined, undefined);
            const newDeadline = Deadline_1.Deadline.create(3);
            const newTransaction = transaction.reapplyGiven(newDeadline);
            const equal = newTransaction.deadline.value.equals(transaction.deadline.value);
            const after = newTransaction.deadline.value.isAfter(transaction.deadline.value);
            chai_1.expect(newTransaction.deadline).to.be.equal(newDeadline);
            chai_1.expect(equal).to.be.equal(false);
            chai_1.expect(after).to.be.equal(true);
        });
    });
    describe('toAggregate', () => {
        it('should throw exception when adding an aggregated transaction as inner transaction', () => {
            const transaction = new FakeTransaction(TransactionType_1.TransactionType.TRANSFER, NetworkType_1.NetworkType.MIJIN_TEST, 1, Deadline_1.Deadline.create(), UInt64_1.UInt64.fromUint(0), undefined, undefined);
            const aggregateTransaction = AggregateTransaction_1.AggregateTransaction.createComplete(Deadline_1.Deadline.create(), [transaction.toAggregate(account.publicAccount)], NetworkType_1.NetworkType.MIJIN_TEST, []);
            chai_1.expect(() => {
                aggregateTransaction.toAggregate(account.publicAccount);
            }).to.throw(Error, 'Inner transaction cannot be an aggregated transaction.');
        });
    });
    describe('Transaction serialize', () => {
        it('Should return serialized payload', () => {
            const transaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
            const serialized = transaction.serialize();
            chai_1.expect(serialized.substring(244, serialized.length)).to.be.equal('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E1420D000000746573742D6D657373616765');
        });
    });
    describe('size', () => {
        it('should return 122 for base transaction size', () => {
            const transaction = new FakeTransaction(TransactionType_1.TransactionType.TRANSFER, NetworkType_1.NetworkType.MIJIN_TEST, 1, Deadline_1.Deadline.create(), UInt64_1.UInt64.fromUint(0), undefined, undefined, new TransactionInfo_1.TransactionInfo(UInt64_1.UInt64.fromUint(100), 1, 'id_hash', 'hash', 'hash'));
            chai_1.expect(transaction.size).to.be.equal(122);
        });
    });
    describe('version', () => {
        it('should return version in hex format', () => {
            const transaction = new FakeTransaction(TransactionType_1.TransactionType.TRANSFER, NetworkType_1.NetworkType.MIJIN_TEST, 1, Deadline_1.Deadline.create(), UInt64_1.UInt64.fromUint(0), undefined, undefined, new TransactionInfo_1.TransactionInfo(UInt64_1.UInt64.fromUint(100), 1, 'id_hash', 'hash', 'hash'));
            chai_1.expect(transaction.versionToHex()).to.be.equal('0x90000001');
        });
    });
});
class FakeTransaction extends Transaction_1.Transaction {
    signWith(account) {
        throw new Error('Method not implemented.');
    }
    buildTransaction() {
        throw new Error('Method not implemented.');
    }
    get size() {
        return Transaction_1.Transaction.getHeaderSize();
    }
}
//# sourceMappingURL=Transaction.spec.js.map