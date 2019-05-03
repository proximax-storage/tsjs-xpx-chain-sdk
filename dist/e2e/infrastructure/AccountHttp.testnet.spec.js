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
const AccountHttp_1 = require("../../src/infrastructure/AccountHttp");
const Address_1 = require("../../src/model/account/Address");
describe('AccountHttp on testnet', () => {
    const accountAddress = Address_1.Address.createFromRawAddress('VDQTK5NIX2INTR2SAYU5DJPFWCE4VSKJ5BTV7K2D');
    const accountPublicKey = '162E3493C7E016C26992FDF03D9A068463BB4D72CDF3AD414A35E60FFAA47E05';
    const accountHttp = new AccountHttp_1.AccountHttp('http://bctestnet1.xpxsirius.io:3000');
    describe('getAccountInfo', () => {
        it('should return account data given a NEM Address', (done) => {
            accountHttp.getAccountInfo(accountAddress)
                .subscribe((accountInfo) => {
                chai_1.expect(accountInfo.publicKey).to.be.equal(accountPublicKey);
                done();
            });
        });
    });
    describe('getAccountsInfo', () => {
        it('should return account data given a NEM Address', (done) => {
            accountHttp.getAccountsInfo([accountAddress])
                .subscribe((accountsInfo) => {
                chai_1.expect(accountsInfo[0].publicKey).to.be.equal(accountPublicKey);
                done();
            });
        });
    });
});
//# sourceMappingURL=AccountHttp.testnet.spec.js.map