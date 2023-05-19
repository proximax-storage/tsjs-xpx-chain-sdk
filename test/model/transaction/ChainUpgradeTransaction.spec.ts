// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {expect} from 'chai';
import {Account} from '../../../src/model/account/Account';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';
import { ChainUpgradeTransaction } from '../../../src/model/model';

describe('ChainUpgradeTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });
    describe('size', () => {
        it('should return 138 for ChainUpgradeTransaction byte size with some config values', () => {

            const chainUpgradeTransaction = ChainUpgradeTransaction.create(
                Deadline.create(),
                UInt64.fromHex("1234567812345678"),
                UInt64.fromHex("abcdefabcdefabcd"),
                NetworkType.MIJIN_TEST
            );
            const signedTransaction = chainUpgradeTransaction.preV2SignWith(account, generationHash);

            expect(chainUpgradeTransaction.size).to.be.equal(138);
            expect(signedTransaction.payload.length).to.be.equal(138 * 2);
            expect(signedTransaction.payload.substring(
                244,
                signedTransaction.payload.length,
            )).to.be.equal('7856341278563412CDABEFCDABEFCDAB');
        });
    });
});
