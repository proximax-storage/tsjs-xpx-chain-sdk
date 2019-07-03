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
const Account_1 = require("../../../src/model/account/Account");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const Password_1 = require("../../../src/model/wallet/Password");
const SimpleWallet_1 = require("../../../src/model/wallet/SimpleWallet");
describe('SimpleWallet', () => {
    it('should createComplete a new simple wallet', () => {
        const simpleWallet = SimpleWallet_1.SimpleWallet.create('wallet-name', new Password_1.Password('password'), NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(simpleWallet.name).to.be.equal('wallet-name');
        chai_1.expect(simpleWallet.network).to.be.equal(NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(simpleWallet.schema).to.be.equal('simple_v1');
    });
    it('should createComplete a new wallet with privateKey', () => {
        const privateKey = '5149a02ca2b2610138376717daaff8477f1639796aa108b7eee83e99e585b250';
        const account = Account_1.Account.createFromPrivateKey(privateKey, NetworkType_1.NetworkType.MIJIN_TEST);
        const simpleWallet = SimpleWallet_1.SimpleWallet.createFromPrivateKey('wallet-name', new Password_1.Password('password'), privateKey, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(simpleWallet.name).to.be.equal('wallet-name');
        chai_1.expect(simpleWallet.network).to.be.equal(NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(simpleWallet.address.plain()).to.be.equal(account.address.plain());
    });
    it('should open a new simple wallet', () => {
        const simpleWallet = SimpleWallet_1.SimpleWallet.create('wallet-name', new Password_1.Password('password'), NetworkType_1.NetworkType.MIJIN_TEST);
        const account = simpleWallet.open(new Password_1.Password('password'));
        chai_1.expect(account.address.plain()).to.be.equal(simpleWallet.address.plain());
    });
    it('should open a new simple wallet created from private key', () => {
        const privateKey = '5149a02ca2b2610138376717daaff8477f1639796aa108b7eee83e99e585b250';
        const simpleWallet = SimpleWallet_1.SimpleWallet.createFromPrivateKey('wallet-name', new Password_1.Password('password'), privateKey, NetworkType_1.NetworkType.MIJIN_TEST);
        const account = simpleWallet.open(new Password_1.Password('password'));
        chai_1.expect(simpleWallet.address.plain()).to.be.equal(account.address.plain());
    });
});
//# sourceMappingURL=SimpleWallet.spec.js.map