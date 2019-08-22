// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {expect} from 'chai';
import {Account} from '../../../src/model/account/Account';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';
import { ModifyContractTransaction, MultisigCosignatoryModification, MultisigCosignatoryModificationType } from '../../../src/model/model';
import { Customer1Account, Executor1Account, Verifier1Account } from '../../conf/conf.spec';

describe('ContractTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });
    describe('size', () => {
        it('should return 248 for ModifyContractTransaction byte size with one customer one executor one verifier', () => {
            const customer = new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, Customer1Account.publicAccount);
            const executor = new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, Executor1Account.publicAccount);
            const verifier = new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, Verifier1Account.publicAccount);

            const modifyContractTransaction = ModifyContractTransaction.create(
                NetworkType.MIJIN_TEST,
                Deadline.create(),
                UInt64.fromHex("1234567812345678"),
                "aaaabbbbccccddddeeeeffff11112222", // hash
                [customer], // customers
                [executor], // executors
                [verifier]  // verifiers
            );
            const signedTransaction = modifyContractTransaction.signWith(account, generationHash);

            expect(modifyContractTransaction.size).to.be.equal(248);
            expect(signedTransaction.payload.length).to.be.equal(248 * 2);
            expect(signedTransaction.payload.substring(
                244,
                signedTransaction.payload.length,
            )).to.be.equal('7856341278563412AAAABBBBCCCCDDDDEEEEFFFF1111222201010100CBCA97052E448E9066897B401B52696B58F2AABCA8C9E2C0C6C012F05FDA3B280000F4EE0D9ADBF06E6AD47E67B99B808142779D63C985EA347DFD1BD733D2B28B009226FDCF7AD1A491F2A4375DD0C8F3B2991E1600F5E0109AD0FB3A9123A4F355');
        });
    });
});
