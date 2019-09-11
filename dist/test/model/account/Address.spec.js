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
const crypto_1 = require("../../../src/core/crypto");
describe('Address', () => {
    const publicKey = 'c2f93346e27ce6ad1a9f8f5e3066f8326593a406bdf357acb041e2f9ab402efe'.toUpperCase();
    const NIS_PublicKey = 'c5f54ba980fcbb657dbaaa42700539b207873e134d2375efeab5f1ab52f87844';
    it('createComplete an address given publicKey + NetworkType.MIJIN_TEST', () => {
        const address = Address_1.Address.createFromPublicKey(publicKey, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(address.plain()).to.be.equal('SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.MIJIN_TEST);
    });
    it('print the address in pretty format', () => {
        const address = Address_1.Address.createFromPublicKey(publicKey, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(address.pretty()).to.be.equal('SCTVW2-3D2MN5-VE4AQ4-TZIDZE-NGNOZX-PRPRLI-KCF2');
    });
    it('createComplete an address given publicKey + NetworkType.MIJIN', () => {
        const address = Address_1.Address.createFromPublicKey(publicKey, NetworkType_1.NetworkType.MIJIN);
        chai_1.expect(address.plain()).to.be.equal('MCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR72DYSX');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.MIJIN);
    });
    it('createComplete an address given publicKey + NetworkType.MAIN_NET', () => {
        const address = Address_1.Address.createFromPublicKey(publicKey, NetworkType_1.NetworkType.MAIN_NET);
        chai_1.expect(address.plain()).to.be.equal('XCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRVLFKS6');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.MAIN_NET);
    });
    it('createComplete an address given publicKey + NetworkType.TEST_NET', () => {
        const address = Address_1.Address.createFromPublicKey(publicKey, NetworkType_1.NetworkType.TEST_NET);
        chai_1.expect(address.plain()).to.be.equal('VCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR3HTEHT');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.TEST_NET);
    });
    it('createComplete an address given publicKey + NetworkType.PRIVATE', () => {
        const address = Address_1.Address.createFromPublicKey(publicKey, NetworkType_1.NetworkType.PRIVATE);
        chai_1.expect(address.plain()).to.be.equal('ZCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR2FNT66');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.PRIVATE);
    });
    it('createComplete an address given publicKey + NetworkType.PRIVATE_TEST', () => {
        const address = Address_1.Address.createFromPublicKey(publicKey, NetworkType_1.NetworkType.PRIVATE_TEST);
        chai_1.expect(address.plain()).to.be.equal('WCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPSIBCI5Q');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.PRIVATE_TEST);
    });
    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address-nis1.json
     */
    it('createComplete an address given publicKey + NetworkType.MIJIN using NIS1 schema', () => {
        const address = Address_1.Address.createFromPublicKey(NIS_PublicKey, NetworkType_1.NetworkType.MIJIN, crypto_1.SignSchema.KECCAK_REVERSED_KEY);
        chai_1.expect(address.plain()).to.be.equal('MDD2CT6LQLIYQ56KIXI3ENTM6EK3D44P5LDT7JHT');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.MIJIN);
    });
    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address-nis1.json
     */
    it('createComplete an address given publicKey + NetworkType.MAIN_NET using NIS1 schema', () => {
        const address = Address_1.Address.createFromPublicKey(NIS_PublicKey, NetworkType_1.NetworkType.MAIN_NET, crypto_1.SignSchema.KECCAK_REVERSED_KEY);
        chai_1.expect(address.plain()).to.be.equal('XDD2CT6LQLIYQ56KIXI3ENTM6EK3D44P5ITPFYGC');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.MAIN_NET);
    });
    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address-nis1.json
     */
    it('createComplete an address given publicKey + NetworkType.TEST_NET using NIS1 schema', () => {
        const address = Address_1.Address.createFromPublicKey(NIS_PublicKey, NetworkType_1.NetworkType.TEST_NET, crypto_1.SignSchema.KECCAK_REVERSED_KEY);
        chai_1.expect(address.plain()).to.be.equal('VDD2CT6LQLIYQ56KIXI3ENTM6EK3D44P5IJ2HFJB');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.TEST_NET);
    });
    it('createComplete an address given SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2', () => {
        const address = Address_1.Address.createFromRawAddress('SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.MIJIN_TEST);
    });
    it('createComplete an address given MCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR72DYSX', () => {
        const address = Address_1.Address.createFromRawAddress('MCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR72DYSX');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.MIJIN);
    });
    it('createComplete an address given XCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRVLFKS6', () => {
        const address = Address_1.Address.createFromRawAddress('XCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRVLFKS6');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.MAIN_NET);
    });
    it('createComplete an address given VCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR3HTEHT', () => {
        const address = Address_1.Address.createFromRawAddress('VCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR3HTEHT');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.TEST_NET);
    });
    it('createComplete an address given ZCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR2FNT66', () => {
        const address = Address_1.Address.createFromRawAddress('ZCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR2FNT66');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.PRIVATE);
    });
    it('createComplete an address given WCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPSIBCI5Q', () => {
        const address = Address_1.Address.createFromRawAddress('WCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPSIBCI5Q');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.PRIVATE_TEST);
    });
    it('createComplete an address given SDRDGF-TDLLCB-67D4HP-GIMIHP-NSRYRJ-RT7DOB-GWZY', () => {
        const address = Address_1.Address.createFromRawAddress('SDRDGF-TDLLCB-67D4HP-GIMIHP-NSRYRJ-RT7DOB-GWZY');
        chai_1.expect(address.networkType).to.be.equal(NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(address.pretty()).to.be.equal('SDRDGF-TDLLCB-67D4HP-GIMIHP-NSRYRJ-RT7DOB-GWZY');
    });
    it('should throw Error when the address contain an invalid network identifier', () => {
        chai_1.expect(() => {
            Address_1.Address.createFromRawAddress('NCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPQUJ2ZML');
        }).to.throw('Address Network unsupported');
    });
    it('should throw Error when the address is not valid in length', () => {
        chai_1.expect(() => {
            Address_1.Address.createFromRawAddress('ZCTVW234AQ4TZIDZENGNOZXPRPSDRSFRF');
        }).to.throw('Address ZCTVW234AQ4TZIDZENGNOZXPRPSDRSFRF has to be 40 characters long');
    });
    it('should turn a lowercase address to uppercase', () => {
        const address = Address_1.Address.createFromRawAddress('xctvw23d2mn5ve4aq4tzidzengnozxprprvlfks6');
        chai_1.expect(address.plain()).to.be.equal('XCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRVLFKS6');
    });
    it('should equal addresses', () => {
        const address = Address_1.Address.createFromRawAddress('XCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRVLFKS6');
        const compareAddress = Address_1.Address.createFromRawAddress('XCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRVLFKS6');
        chai_1.expect(address.equals(compareAddress)).to.be.equal(true);
    });
    it('should not equal addresses', () => {
        const address = Address_1.Address.createFromRawAddress('XCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRVLFKS6');
        const compareAddress = Address_1.Address.createFromRawAddress('XCTMW23D2MN5VE4AQ4TZIDZENGNOZXPRPSDRSFRF');
        chai_1.expect(address.equals(compareAddress)).to.be.equal(false);
    });
});
//# sourceMappingURL=Address.spec.js.map