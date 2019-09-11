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
const conf_spec_2 = require("../../conf/conf.spec");
describe('ModifyContractTransaction', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    describe('size', () => {
        it('should return 248 for ModifyContractTransaction byte size with one customer one executor one verifier', () => {
            const customer = new model_1.MultisigCosignatoryModification(model_1.MultisigCosignatoryModificationType.Add, conf_spec_2.Customer1Account.publicAccount);
            const executor = new model_1.MultisigCosignatoryModification(model_1.MultisigCosignatoryModificationType.Add, conf_spec_2.Executor1Account.publicAccount);
            const verifier = new model_1.MultisigCosignatoryModification(model_1.MultisigCosignatoryModificationType.Add, conf_spec_2.Verifier1Account.publicAccount);
            const modifyContractTransaction = model_1.ModifyContractTransaction.create(NetworkType_1.NetworkType.MIJIN_TEST, Deadline_1.Deadline.create(), UInt64_1.UInt64.fromHex("1234567812345678"), "aaaabbbbccccddddeeeeffff11112222", // hash
            [customer], // customers
            [executor], // executors
            [verifier] // verifiers
            );
            const signedTransaction = modifyContractTransaction.signWith(account, generationHash);
            chai_1.expect(modifyContractTransaction.size).to.be.equal(248);
            chai_1.expect(signedTransaction.payload.length).to.be.equal(248 * 2);
            chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('7856341278563412AAAABBBBCCCCDDDDEEEEFFFF1111222201010100CBCA97052E448E9066897B401B52696B58F2AABCA8C9E2C0C6C012F05FDA3B280000F4EE0D9ADBF06E6AD47E67B99B808142779D63C985EA347DFD1BD733D2B28B009226FDCF7AD1A491F2A4375DD0C8F3B2991E1600F5E0109AD0FB3A9123A4F355');
        });
    });
});
//# sourceMappingURL=ModifyContractTransaction.spec.js.map