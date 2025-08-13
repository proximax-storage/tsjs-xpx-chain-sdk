// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {expect} from 'chai';
import {Account} from '../../../src/model/account/Account';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';
import { DefaultFeeCalculationStrategy } from '../../../src/model/transaction/FeeCalculationStrategy';
import { AddExchangeOfferTransaction } from '../../../src/model/transaction/AddExchangeOfferTransaction';
import { AddExchangeOffer } from '../../../src/model/transaction/AddExchangeOffer';

describe('AddExchangeOfferTransaction', () => {

    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const addExchangeOfferTransaction = AddExchangeOfferTransaction.create(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST
        );

        expect(addExchangeOfferTransaction.maxFee.compact()).to.be.equal(addExchangeOfferTransaction.size * DefaultFeeCalculationStrategy);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const addExchangeOfferTransaction = AddExchangeOfferTransaction.create(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0])
        );

        expect(addExchangeOfferTransaction.maxFee.higher).to.be.equal(0);
        expect(addExchangeOfferTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an AddExchangeOfferTransaction object and sign', () => {
        const addExchangeOfferTransaction = AddExchangeOfferTransaction.create(
            Deadline.create(),
            [
                new AddExchangeOffer(
                    new MosaicId('1234567890ABCDEF'),
                    UInt64.fromUint(333333),
                    UInt64.fromUint(666666),
                    1,
                    UInt64.fromUint(999999)
                ),
            ],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = addExchangeOfferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            244,
            signedTransaction.payload.length,
        )).to.be.equal('01EFCDAB907856341215160500000000002A2C0A0000000000013F420F0000000000');
    });

    describe('size', () => {
        it('should return 123 for AddExchangeOfferTransaction without any offer', () => {
            const addExchangeOfferTransaction = AddExchangeOfferTransaction.create(
                Deadline.create(),
                [],
                NetworkType.MIJIN_TEST,
            );
            expect(addExchangeOfferTransaction.size).to.be.equal(123);
        });
        it('should return 156 for AddExchangeOfferTransaction with 1 offer', () => {
            const addExchangeOfferTransaction = AddExchangeOfferTransaction.create(
                Deadline.create(),
                [
                    new AddExchangeOffer(new MosaicId(UInt64.fromUint(0).toDTO()), UInt64.fromUint(0), UInt64.fromUint(1), 0, UInt64.fromUint(2))
                ],
                NetworkType.MIJIN_TEST,
            );
            expect(addExchangeOfferTransaction.size).to.be.equal(156);
        });
        it('should return 222 for AddExchangeOfferTransaction with 3 offers', () => {
            const addExchangeOfferTransaction = AddExchangeOfferTransaction.create(
                Deadline.create(),
                [
                    new AddExchangeOffer(new MosaicId(UInt64.fromUint(0).toDTO()), UInt64.fromUint(0), UInt64.fromUint(1), 0, UInt64.fromUint(2)),
                    new AddExchangeOffer(new MosaicId(UInt64.fromUint(0).toDTO()), UInt64.fromUint(0), UInt64.fromUint(1), 0, UInt64.fromUint(2)),
                    new AddExchangeOffer(new MosaicId(UInt64.fromUint(0).toDTO()), UInt64.fromUint(0), UInt64.fromUint(1), 0, UInt64.fromUint(2)),
                ],
                NetworkType.MIJIN_TEST,
            );
            expect(addExchangeOfferTransaction.size).to.be.equal(222);
        });
    });
});
