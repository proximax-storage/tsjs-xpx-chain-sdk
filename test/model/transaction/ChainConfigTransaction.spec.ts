// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {expect} from 'chai';
import {Account} from '../../../src/model/account/Account';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';
import { ChainConfigTransaction } from '../../../src/model/model';

describe('ChainConfigTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });
    describe('size', () => {
        it('should return 186 for ChainConfigTransaction byte size with some config values', () => {

            const chainConfigTransaction = ChainConfigTransaction.create(
                Deadline.create(),
                UInt64.fromHex("1234567812345678"),
                "some blockchain config",
                "some supported entity versions",
                NetworkType.MIJIN_TEST
            );
            const signedTransaction = chainConfigTransaction.signWith(account, generationHash);

            expect(chainConfigTransaction.size).to.be.equal(186);
            expect(signedTransaction.payload.length).to.be.equal(186 * 2);
            expect(signedTransaction.payload.substring(
                244,
                signedTransaction.payload.length,
            )).to.be.equal('785634127856341216001E00736F6D6520626C6F636B636861696E20636F6E666967736F6D6520737570706F7274656420656E746974792076657273696F6E73');
        });
    });
});
