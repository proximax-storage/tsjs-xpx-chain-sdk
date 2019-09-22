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
const NetworkCurrencyMosaic_1 = require("../../../src/model/mosaic/NetworkCurrencyMosaic");
const NamespaceId_1 = require("../../../src/model/namespace/NamespaceId");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const PlainMessage_1 = require("../../../src/model/transaction/PlainMessage");
const TransferTransaction_1 = require("../../../src/model/transaction/TransferTransaction");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
const FeeCalculationStrategy_1 = require("../../../src/model/transaction/FeeCalculationStrategy");
describe('TransferTransaction', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(transferTransaction.maxFee.compact()).to.be.equal(transferTransaction.size * FeeCalculationStrategy_1.DefaultFeeCalculationStrategy);
    });
    it('should filled maxFee override transaction maxFee', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST, new UInt64_1.UInt64([1, 0]));
        chai_1.expect(transferTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(transferTransaction.maxFee.lower).to.be.equal(1);
    });
    it('should createComplete an TransferTransaction object and sign it without mosaics', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(transferTransaction.message.payload).to.be.equal('test-message');
        chai_1.expect(transferTransaction.mosaics.length).to.be.equal(0);
        chai_1.expect(transferTransaction.recipient).to.be.instanceof(Address_1.Address);
        chai_1.expect(transferTransaction.recipient.plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const signedTransaction = transferTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E1420D000000746573742D6D657373616765');
    });
    it('should createComplete an TransferTransaction object and sign it with mosaics', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [
            NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(100),
        ], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(transferTransaction.message.payload).to.be.equal('test-message');
        chai_1.expect(transferTransaction.mosaics.length).to.be.equal(1);
        chai_1.expect(transferTransaction.recipient).to.be.instanceof(Address_1.Address);
        chai_1.expect(transferTransaction.recipient.plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const signedTransaction = transferTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E1420D000100746573742D6D657373616765' +
            '44B262C46CEABB8500E1F50500000000');
    });
    it('should createComplete an TransferTransaction object with NamespaceId recipient', () => {
        const addressAlias = new NamespaceId_1.NamespaceId('nem.owner');
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), addressAlias, [
            NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(100),
        ], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(transferTransaction.message.payload).to.be.equal('test-message');
        chai_1.expect(transferTransaction.mosaics.length).to.be.equal(1);
        chai_1.expect(transferTransaction.recipient).to.be.instanceof(NamespaceId_1.NamespaceId);
        chai_1.expect(transferTransaction.recipient).to.be.equal(addressAlias);
        chai_1.expect(transferTransaction.recipient.toHex()).to.be.equal(addressAlias.toHex());
        const signedTransaction = transferTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('9151776168D24257D8000000000000000000000000000000000D000100746573742D6D657373616765' +
            '44B262C46CEABB8500E1F50500000000');
    });
    it('should format TransferTransaction payload with 25 bytes binary address', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [
            NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(100),
        ], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        // test recipientToString with Address recipient
        chai_1.expect(transferTransaction.recipientToString()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const signedTransaction = transferTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, 294)).to.be.equal('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');
    });
    it('should format TransferTransaction payload with 8 bytes binary namespaceId', () => {
        const transferTransaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), new NamespaceId_1.NamespaceId('nem.owner'), [
            NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(100),
        ], PlainMessage_1.PlainMessage.create('test-message'), NetworkType_1.NetworkType.MIJIN_TEST);
        // test recipientToString with NamespaceId recipient
        chai_1.expect(transferTransaction.recipientToString()).to.be.equal('d85742d268617751');
        const signedTransaction = transferTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, 294)).to.be.equal('9151776168D24257D800000000000000000000000000000000');
    });
    describe('size', () => {
        it('should return 160 for TransferTransaction with 1 mosaic and message NEM', () => {
            const transaction = TransferTransaction_1.TransferTransaction.create(Deadline_1.Deadline.create(), Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'), [
                NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.createRelative(100),
            ], PlainMessage_1.PlainMessage.create('NEM'), NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(transaction.size).to.be.equal(160);
        });
    });
});
//# sourceMappingURL=TransferTransaction.spec.js.map