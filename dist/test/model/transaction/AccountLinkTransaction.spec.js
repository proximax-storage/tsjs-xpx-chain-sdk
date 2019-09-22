"use strict";
/*
 * Copyright 2019 NEM
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
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const AccountLinkTransaction_1 = require("../../../src/model/transaction/AccountLinkTransaction");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const LinkAction_1 = require("../../../src/model/transaction/LinkAction");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
const FeeCalculationStrategy_1 = require("../../../src/model/transaction/FeeCalculationStrategy");
describe('AccountLinkTransaction', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const accountLinkTransaction = AccountLinkTransaction_1.AccountLinkTransaction.create(Deadline_1.Deadline.create(), account.publicKey, LinkAction_1.LinkAction.Link, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(accountLinkTransaction.maxFee.compact()).to.be.equal(accountLinkTransaction.size * FeeCalculationStrategy_1.DefaultFeeCalculationStrategy);
    });
    it('should filled maxFee override transaction maxFee', () => {
        const accountLinkTransaction = AccountLinkTransaction_1.AccountLinkTransaction.create(Deadline_1.Deadline.create(), account.publicKey, LinkAction_1.LinkAction.Link, NetworkType_1.NetworkType.MIJIN_TEST, new UInt64_1.UInt64([1, 0]));
        chai_1.expect(accountLinkTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(accountLinkTransaction.maxFee.lower).to.be.equal(1);
    });
    it('should create an AccountLinkTransaction object with link action', () => {
        const accountLinkTransaction = AccountLinkTransaction_1.AccountLinkTransaction.create(Deadline_1.Deadline.create(), account.publicKey, LinkAction_1.LinkAction.Link, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(accountLinkTransaction.linkAction).to.be.equal(0);
        chai_1.expect(accountLinkTransaction.remoteAccountKey).to.be.equal(account.publicKey);
        const signedTransaction = accountLinkTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('C2F93346E27CE6AD1A9F8F5E3066F8326593A406BDF357ACB041E2F9AB402EFE00');
    });
    it('should create an AccountLinkTransaction object with unlink action', () => {
        const accountLinkTransaction = AccountLinkTransaction_1.AccountLinkTransaction.create(Deadline_1.Deadline.create(), account.publicKey, LinkAction_1.LinkAction.Unlink, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(accountLinkTransaction.linkAction).to.be.equal(1);
        chai_1.expect(accountLinkTransaction.remoteAccountKey).to.be.equal(account.publicKey);
        const signedTransaction = accountLinkTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('C2F93346E27CE6AD1A9F8F5E3066F8326593A406BDF357ACB041E2F9AB402EFE01');
    });
    describe('size', () => {
        it('should return 155 for AccountLinkTransaction byte size', () => {
            const accountLinkTransaction = AccountLinkTransaction_1.AccountLinkTransaction.create(Deadline_1.Deadline.create(), account.publicKey, LinkAction_1.LinkAction.Unlink, NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(accountLinkTransaction.size).to.be.equal(155);
        });
    });
});
//# sourceMappingURL=AccountLinkTransaction.spec.js.map