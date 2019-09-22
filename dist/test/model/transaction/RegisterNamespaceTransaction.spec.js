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
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const NamespaceId_1 = require("../../../src/model/namespace/NamespaceId");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const RegisterNamespaceTransaction_1 = require("../../../src/model/transaction/RegisterNamespaceTransaction");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
const FeeCalculationStrategy_1 = require("../../../src/model/transaction/FeeCalculationStrategy");
describe('RegisterNamespaceTransaction', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createRootNamespace(Deadline_1.Deadline.create(), 'root-test-namespace', UInt64_1.UInt64.fromUint(1000), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(registerNamespaceTransaction.maxFee.compact()).to.be.equal(registerNamespaceTransaction.size * FeeCalculationStrategy_1.DefaultFeeCalculationStrategy);
    });
    it('should filled maxFee override transaction maxFee', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createRootNamespace(Deadline_1.Deadline.create(), 'root-test-namespace', UInt64_1.UInt64.fromUint(1000), NetworkType_1.NetworkType.MIJIN_TEST, new UInt64_1.UInt64([1, 0]));
        chai_1.expect(registerNamespaceTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(registerNamespaceTransaction.maxFee.lower).to.be.equal(1);
    });
    it('should createComplete an root RegisterNamespaceTransaction object and sign it', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createRootNamespace(Deadline_1.Deadline.create(), 'root-test-namespace', UInt64_1.UInt64.fromUint(1000), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(registerNamespaceTransaction.duration.lower).to.be.equal(1000);
        chai_1.expect(registerNamespaceTransaction.duration.higher).to.be.equal(0);
        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('00E803000000000000CFCBE72D994BE69B13726F6F742D746573742D6E616D657370616365');
    });
    it('should createComplete an sub RegisterNamespaceTransaction object and sign it', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createSubNamespace(Deadline_1.Deadline.create(), 'root-test-namespace', 'parent-test-namespace', NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('014DF55E7F6D8FB7FF924207DF2CA1BBF313726F6F742D746573742D6E616D657370616365');
    });
    it('should createComplete an sub RegisterNamespaceTransaction object and sign it - ParentId', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createSubNamespace(Deadline_1.Deadline.create(), 'root-test-namespace', new NamespaceId_1.NamespaceId([929036875, 2226345261]), NetworkType_1.NetworkType.MIJIN_TEST);
        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
        chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('014BFA5F372D55B384CFCBE72D994BE69B13726F6F742D746573742D6E616D657370616365');
    });
    describe('size', () => {
        it('should return 159 for RegisterNamespaceTransaction with name of 19 bytes', () => {
            const registerNamespaceTransaction = RegisterNamespaceTransaction_1.RegisterNamespaceTransaction.createRootNamespace(Deadline_1.Deadline.create(), 'root-test-namespace', UInt64_1.UInt64.fromUint(1000), NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(registerNamespaceTransaction.size).to.be.equal(159);
        });
    });
});
//# sourceMappingURL=RegisterNamespaceTransaction.spec.js.map