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
import {deepStrictEqual} from 'assert';
import {expect} from 'chai';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {NetworkCurrencyMosaic} from '../../../src/model/mosaic/NetworkCurrencyMosaic';
import {AggregateTransaction} from '../../../src/model/transaction/AggregateTransaction';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {HashLockTransaction} from '../../../src/model/transaction/HashLockTransaction';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';
import { DefaultFeeCalculationStrategy } from '../../../src/model/transaction/FeeCalculationStrategy';
import { XpxMosaicProperties } from '../../../src/model/mosaic/NetworkMosaic';

describe('HashLockTransaction', () => {
    const account = TestingAccount;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const aggregateTransaction = AggregateTransaction.createBondedV1(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.preV2Sign(aggregateTransaction, generationHash);
        const lockHashTransaction = HashLockTransaction.create(Deadline.create(),
            NetworkCurrencyMosaic.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST,
        );

        expect(lockHashTransaction.maxFee.compact()).to.be.equal(lockHashTransaction.size * DefaultFeeCalculationStrategy);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const aggregateTransaction = AggregateTransaction.createBondedV1(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.preV2Sign(aggregateTransaction, generationHash);
        const lockHashTransaction = HashLockTransaction.create(Deadline.create(),
            NetworkCurrencyMosaic.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0])
        );

        expect(lockHashTransaction.maxFee.higher).to.be.equal(0);
        expect(lockHashTransaction.maxFee.lower).to.be.equal(1);
    });

    it('creation with an aggregate bonded tx', () => {
        const aggregateTransaction = AggregateTransaction.createBondedV1(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.preV2Sign(aggregateTransaction, generationHash);
        const transaction = HashLockTransaction.create(Deadline.create(),
            NetworkCurrencyMosaic.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST);
        deepStrictEqual(transaction.mosaic.id.id, XpxMosaicProperties.ID.id);
        expect(transaction.mosaic.amount.compact()).to.be.equal(10000000);
        expect(transaction.hash).to.be.equal(signedTransaction.hash);
    });

    it('should throw exception if it is not a aggregate bonded tx', () => {
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.preV2Sign(aggregateTransaction, generationHash);
        expect(() => {
            HashLockTransaction.create(Deadline.create(),
                NetworkCurrencyMosaic.createRelative(10),
                UInt64.fromUint(10),
                signedTransaction,
                NetworkType.MIJIN_TEST);
        }).to.throw(Error);
    });

    describe('size', () => {
        it('should return 178 for HashLockTransaction transaction byte size', () => {
            const aggregateTransaction = AggregateTransaction.createBondedV1(
                Deadline.create(),
                [],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = account.preV2Sign(aggregateTransaction, generationHash);
            const lockHashTransaction = HashLockTransaction.create(Deadline.create(),
                NetworkCurrencyMosaic.createRelative(10),
                UInt64.fromUint(10),
                signedTransaction,
                NetworkType.MIJIN_TEST,
            );
            expect(lockHashTransaction.size).to.be.equal(178);
        });
    });
});
