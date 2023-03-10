/*
 * Copyright 2023 ProximaX
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
import {expect} from 'chai';
import * as CryptoJS from 'crypto-js';
import {keccak_256, sha3_256} from 'js-sha3';
import {Convert as convert} from '../../../src/core/format';
import { Account } from '../../../src/model/account/Account';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {HashType} from '../../../src/model/transaction/HashType';
import {HarvesterTransaction} from '../../../src/model/transaction/HarvesterTransaction';
import {UInt64} from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';
import { DefaultFeeCalculationStrategy } from '../../../src/model/transaction/FeeCalculationStrategy';
import { PublicAccount, TransactionType } from '../../../src/model/model';

describe('HarvesterTransaction', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const harvesterTransaction = HarvesterTransaction.createAdd(
            Deadline.create(),
            PublicAccount.createFromPublicKey("C".repeat(64), NetworkType.MIJIN_TEST),
            NetworkType.MIJIN_TEST,
        );

        expect(harvesterTransaction.maxFee.compact()).to.be.equal(harvesterTransaction.size * DefaultFeeCalculationStrategy);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const harvesterTransaction = HarvesterTransaction.createAdd(
            Deadline.create(),
            PublicAccount.createFromPublicKey("C".repeat(64), NetworkType.MIJIN_TEST),
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0]),
        );

        expect(harvesterTransaction.maxFee.higher).to.be.equal(0);
        expect(harvesterTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should be created with harvesterKey', () => {
        const harvesterTransaction = HarvesterTransaction.createAdd(
            Deadline.create(),
            PublicAccount.createFromPublicKey("C".repeat(64), NetworkType.MIJIN_TEST),
            NetworkType.MIJIN_TEST
        );
        expect(harvesterTransaction.harvesterKey.publicKey).to.be.equal("C".repeat(64));
    });

    it('should be created with add harvester type', () => {
        const harvesterTransaction = HarvesterTransaction.createAdd(
            Deadline.create(),
            PublicAccount.createFromPublicKey("C".repeat(64), NetworkType.MIJIN_TEST),
            NetworkType.MIJIN_TEST
        );
        expect(harvesterTransaction.type).to.be.equal(TransactionType.ADD_HARVESTER);
    });

    it('should be created with remove harvester type', () => {
        const harvesterTransaction = HarvesterTransaction.createRemove(
            Deadline.create(),
            PublicAccount.createFromPublicKey("C".repeat(64), NetworkType.MIJIN_TEST),
            NetworkType.MIJIN_TEST
        );
        expect(harvesterTransaction.type).to.be.equal(TransactionType.REMOVE_HARVESTER);
    });

    it('should have the correct transaction payload', () => {
        const harvesterTransaction = HarvesterTransaction.createRemove(
            Deadline.create(),
            PublicAccount.createFromPublicKey("C".repeat(64), NetworkType.MIJIN_TEST),
            NetworkType.MIJIN_TEST
        );
        const txnPayload = harvesterTransaction.serialize();
        expect(txnPayload.substring(
            244,
            txnPayload.length,
        )).to.be.equal('C'.repeat(64));
    });

    describe('size', () => {
        it('should return 154 for transaction size', () => {
            const harvesterTransaction = HarvesterTransaction.createRemove(
                Deadline.create(),
                PublicAccount.createFromPublicKey("C".repeat(64), NetworkType.MIJIN_TEST),
                NetworkType.MIJIN_TEST
            );
            expect(harvesterTransaction.size).to.be.equal(154);
        });
    });
});
