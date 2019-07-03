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
describe('Account', () => {
    const accountInformation = {
        address: 'SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2',
        privateKey: '26b64cb10f005e5988a36744ca19e20d835ccc7c105aaa5f3b212da593180930'.toUpperCase(),
        publicKey: 'c2f93346e27ce6ad1a9f8f5e3066f8326593a406bdf357acb041e2f9ab402efe'.toUpperCase(),
    };
    it('should be created via private key', () => {
        const account = Account_1.Account.createFromPrivateKey(accountInformation.privateKey, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(account.publicKey).to.be.equal(accountInformation.publicKey);
        chai_1.expect(account.privateKey).to.be.equal(accountInformation.privateKey);
        chai_1.expect(account.address.plain()).to.be.equal(accountInformation.address);
    });
    it('should throw exception when the private key is not valid', () => {
        chai_1.expect(() => {
            Account_1.Account.createFromPrivateKey('', NetworkType_1.NetworkType.MIJIN_TEST);
        }).to.throw();
    });
    it('should generate a new account', () => {
        const account = Account_1.Account.generateNewAccount(NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(account.publicKey).to.not.be.equal(undefined);
        chai_1.expect(account.privateKey).to.not.be.equal(undefined);
        chai_1.expect(account.address).to.not.be.equal(undefined);
    });
    describe('signData', () => {
        it('utf-8', () => {
            const account = Account_1.Account.createFromPrivateKey('AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47', NetworkType_1.NetworkType.MIJIN_TEST);
            const publicAccount = account.publicAccount;
            const signed = account.signData('ProximaX rocks!');
            chai_1.expect(publicAccount.verifySignature('ProximaX rocks!', signed))
                .to.be.true;
        });
        it('hexa', () => {
            const account = Account_1.Account.createFromPrivateKey('AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47', NetworkType_1.NetworkType.MIJIN_TEST);
            const publicAccount = account.publicAccount;
            const signed = account.signData('0xAA');
            chai_1.expect(publicAccount.verifySignature('0xAA', signed))
                .to.be.true;
        });
    });
});
//# sourceMappingURL=Account.spec.js.map