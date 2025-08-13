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
import { RemoveExchangeOfferTransaction } from '../../../src/model/transaction/RemoveExchangeOfferTransaction';
import { RemoveExchangeOffer } from '../../../src/model/transaction/RemoveExchangeOffer';

describe('RemoveExchangeOfferTransaction', () => {

    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const removeExchangeOfferTransaction = RemoveExchangeOfferTransaction.create(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST
        );

        expect(removeExchangeOfferTransaction.maxFee.compact()).to.be.equal(removeExchangeOfferTransaction.size * DefaultFeeCalculationStrategy);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const removeExchangeOfferTransaction = RemoveExchangeOfferTransaction.create(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0])
        );

        expect(removeExchangeOfferTransaction.maxFee.higher).to.be.equal(0);
        expect(removeExchangeOfferTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an RemoveExchangeOfferTransaction object and sign', () => {
        const removeExchangeOfferTransaction = RemoveExchangeOfferTransaction.create(
            Deadline.create(),
            [
                new RemoveExchangeOffer(
                    new MosaicId('1234567890ABCDEF'),
                    1,
                ),
            ],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = removeExchangeOfferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            244,
            signedTransaction.payload.length,
        )).to.be.equal('01EFCDAB907856341201');
    });

    describe('size', () => {
        it('should return 123 for RemoveExchangeOfferTransaction without any offer', () => {
            const removeExchangeOfferTransaction = RemoveExchangeOfferTransaction.create(
                Deadline.create(),
                [],
                NetworkType.MIJIN_TEST,
            );
            expect(removeExchangeOfferTransaction.size).to.be.equal(123);
        });
        it('should return 132 for RemoveExchangeOfferTransaction with 1 offer', () => {
            const removeExchangeOfferTransaction = RemoveExchangeOfferTransaction.create(
                Deadline.create(),
                [
                    new RemoveExchangeOffer(new MosaicId(UInt64.fromUint(0).toDTO()), 1)
                ],
                NetworkType.MIJIN_TEST,
            );
            expect(removeExchangeOfferTransaction.size).to.be.equal(132);
        });
        it('should return 150 for RemoveExchangeOfferTransaction with 3 offers', () => {
            const removeExchangeOfferTransaction = RemoveExchangeOfferTransaction.create(
                Deadline.create(),
                [
                    new RemoveExchangeOffer(new MosaicId(UInt64.fromUint(0).toDTO()), 1),
                    new RemoveExchangeOffer(new MosaicId(UInt64.fromUint(0).toDTO()), 1),
                    new RemoveExchangeOffer(new MosaicId(UInt64.fromUint(0).toDTO()), 1)
                ],
                NetworkType.MIJIN_TEST,
            );
            expect(removeExchangeOfferTransaction.size).to.be.equal(150);
        });
    });
});
