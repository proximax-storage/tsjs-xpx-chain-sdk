"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
const model_1 = require("../../../src/model/model");
describe('ChainConfigTransaction', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    describe('size', () => {
        it('should return 186 for ChainConfigTransaction byte size with some config values', () => {
            const chainConfigTransaction = model_1.ChainConfigTransaction.create(Deadline_1.Deadline.create(), UInt64_1.UInt64.fromHex("1234567812345678"), "some blockchain config", "some supported entity versions", NetworkType_1.NetworkType.MIJIN_TEST);
            const signedTransaction = chainConfigTransaction.signWith(account, generationHash);
            chai_1.expect(chainConfigTransaction.size).to.be.equal(186);
            chai_1.expect(signedTransaction.payload.length).to.be.equal(186 * 2);
            chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('785634127856341216001E00736F6D6520626C6F636B636861696E20636F6E666967736F6D6520737570706F7274656420656E746974792076657273696F6E73');
        });
    });
});
//# sourceMappingURL=ChainConfigTransaction.spec.js.map