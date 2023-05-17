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
import { RemoveSdaExchangeOfferTransaction } from '../../../src/model/transaction/RemoveSdaExchangeOfferTransaction';
import { RemoveSdaExchangeOffer } from '../../../src/model/transaction/RemoveSdaExchangeOffer';

describe('RemoveSdaExchangeOfferTransaction', () => {

    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const removeExchangeOfferTransaction = RemoveSdaExchangeOfferTransaction.create(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST
        );

        expect(removeExchangeOfferTransaction.maxFee.compact()).to.be.equal(removeExchangeOfferTransaction.size * DefaultFeeCalculationStrategy);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const removeExchangeOfferTransaction = RemoveSdaExchangeOfferTransaction.create(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0])
        );

        expect(removeExchangeOfferTransaction.maxFee.higher).to.be.equal(0);
        expect(removeExchangeOfferTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an RemoveSdaExchangeOfferTransaction object and sign', () => {
        const removeExchangeOfferTransaction = RemoveSdaExchangeOfferTransaction.create(
            Deadline.create(),
            [
                new RemoveSdaExchangeOffer(
                    new MosaicId('1234567890ABCDEF'),
                    new MosaicId('1234567890ABCDEE'),
                ),
            ],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = removeExchangeOfferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            244,
            signedTransaction.payload.length,
        )).to.be.equal('01EFCDAB9078563412EECDAB9078563412');
    });

    describe('size', () => {
        it('should return 123 for RemoveSdaExchangeOfferTransaction without any offer', () => {
            const removeExchangeOfferTransaction = RemoveSdaExchangeOfferTransaction.create(
                Deadline.create(),
                [],
                NetworkType.MIJIN_TEST,
            );
            expect(removeExchangeOfferTransaction.size).to.be.equal(123);
        });
        it('should return 139 for RemoveSdaExchangeOfferTransaction with 1 offer', () => {
            const removeExchangeOfferTransaction = RemoveSdaExchangeOfferTransaction.create(
                Deadline.create(),
                [
                    new RemoveSdaExchangeOffer(
                        new MosaicId('1234567890ABCDEF'),
                        new MosaicId('1234567890ABCDEE'),
                    )
                ],
                NetworkType.MIJIN_TEST,
            );
            expect(removeExchangeOfferTransaction.size).to.be.equal(139);
        });
        it('should return 171 for RemoveSdaExchangeOfferTransaction with 3 offers', () => {
            const removeExchangeOfferTransaction = RemoveSdaExchangeOfferTransaction.create(
                Deadline.create(),
                [
                    new RemoveSdaExchangeOffer(
                        new MosaicId('1234567890ABCDEF'),
                        new MosaicId('1234567890ABCDEE'),
                    ),
                    new RemoveSdaExchangeOffer(
                        new MosaicId('1234567890ABCDEF'),
                        new MosaicId('1234567890ABCDEE'),
                    ),
                    new RemoveSdaExchangeOffer(
                        new MosaicId('1234567890ABCDEF'),
                        new MosaicId('1234567890ABCDEE'),
                    )
                ],
                NetworkType.MIJIN_TEST,
            );
            expect(removeExchangeOfferTransaction.size).to.be.equal(171);
        });
    });
});
