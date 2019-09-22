"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const chai_1 = require("chai");
const CryptoJS = require("crypto-js");
const js_sha3_1 = require("js-sha3");
const format_1 = require("../../../src/core/format");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const HashType_1 = require("../../../src/model/transaction/HashType");
const SecretProofTransaction_1 = require("../../../src/model/transaction/SecretProofTransaction");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
const FeeCalculationStrategy_1 = require("../../../src/model/transaction/FeeCalculationStrategy");
describe('SecretProofTransaction', () => {
    let account;
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Sha3_256, js_sha3_1.sha3_256.create().update(format_1.Convert.hexToUint8(proof)).hex(), account.address, proof, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(secretProofTransaction.maxFee.compact()).to.be.equal(secretProofTransaction.size * FeeCalculationStrategy_1.DefaultFeeCalculationStrategy);
    });
    it('should filled maxFee override transaction maxFee', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Sha3_256, js_sha3_1.sha3_256.create().update(format_1.Convert.hexToUint8(proof)).hex(), account.address, proof, NetworkType_1.NetworkType.MIJIN_TEST, new UInt64_1.UInt64([1, 0]));
        chai_1.expect(secretProofTransaction.maxFee.higher).to.be.equal(0);
        chai_1.expect(secretProofTransaction.maxFee.lower).to.be.equal(1);
    });
    it('should be created with HashType: Op_Sha3_256 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Sha3_256, js_sha3_1.sha3_256.create().update(format_1.Convert.hexToUint8(proof)).hex(), account.address, proof, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(secretProofTransaction.hashType).to.be.equal(0);
        chai_1.expect(secretProofTransaction.secret).to.be.equal('9b3155b37159da50aa52d5967c509b410f5a36a3b1e31ecb5ac76675d79b4a5e');
        chai_1.expect(secretProofTransaction.proof).to.be.equal(proof);
    });
    it('should throw exception when the input is not related to HashType', () => {
        chai_1.expect(() => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Sha3_256, 'non valid hash', account.address, proof, NetworkType_1.NetworkType.MIJIN_TEST);
        }).to.throw(Error);
    });
    it('should be created with HashType: Op_Keccak_256 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Keccak_256, js_sha3_1.keccak_256.create().update(format_1.Convert.hexToUint8(proof)).hex(), account.address, proof, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(secretProofTransaction.hashType).to.be.equal(1);
        chai_1.expect(secretProofTransaction.secret).to.be.equal('241c1d54c18c8422def03aa16b4b243a8ba491374295a1a6965545e6ac1af314');
        chai_1.expect(secretProofTransaction.proof).to.be.equal(proof);
    });
    it('should throw exception when the input is not related to HashType', () => {
        chai_1.expect(() => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Keccak_256, 'non valid hash', account.address, proof, NetworkType_1.NetworkType.MIJIN_TEST);
        }).to.throw(Error);
    });
    it('should be created with HashType: Op_Hash_160 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9';
        const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Hash_160, CryptoJS.RIPEMD160(CryptoJS.SHA256(proof).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex), account.address, proof, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(secretProofTransaction.hashType).to.be.equal(2);
        chai_1.expect(secretProofTransaction.secret).to.be.equal('3fc43d717d824302e3821de8129ea2f7786912e5');
        chai_1.expect(secretProofTransaction.proof).to.be.equal(proof);
    });
    it('should throw exception when the input is not related to HashType', () => {
        chai_1.expect(() => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Hash_160, 'non valid hash', account.address, proof, NetworkType_1.NetworkType.MIJIN_TEST);
        }).to.throw(Error);
    });
    it('should be created with HashType: Op_Hash_256 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Hash_256, CryptoJS.SHA256(CryptoJS.SHA256(proof).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex), account.address, proof, NetworkType_1.NetworkType.MIJIN_TEST);
        chai_1.expect(secretProofTransaction.hashType).to.be.equal(3);
        chai_1.expect(secretProofTransaction.secret).to.be.equal('c346f5ecf5bcfa54ab14fad815c8239bdeb051df8835d212dba2af59f688a00e');
        chai_1.expect(secretProofTransaction.proof).to.be.equal(proof);
    });
    it('should throw exception when the input is not related to HashType', () => {
        chai_1.expect(() => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Hash_256, 'non valid hash', account.address, proof, NetworkType_1.NetworkType.MIJIN_TEST);
        }).to.throw(Error);
    });
    describe('size', () => {
        it('should return 214 for SecretProofTransaction with proof and secret both 32 bytes', () => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            const secretProofTransaction = SecretProofTransaction_1.SecretProofTransaction.create(Deadline_1.Deadline.create(), HashType_1.HashType.Op_Hash_256, CryptoJS.SHA256(CryptoJS.SHA256(proof).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex), account.address, proof, NetworkType_1.NetworkType.MIJIN_TEST);
            chai_1.expect(secretProofTransaction.size).to.be.equal(214);
        });
    });
});
//# sourceMappingURL=SecretProofTransaction.spec.js.map