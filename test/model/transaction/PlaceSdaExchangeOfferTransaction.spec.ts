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
import { PlaceSdaExchangeOfferTransaction } from '../../../src/model/transaction/PlaceSdaExchangeOfferTransaction';
import { SdaExchangeOffer } from '../../../src/model/transaction/SdaExchangeOffer';
import { PublicAccount } from '../../../src/model/model';

describe('PlaceSdaExchangeOfferTransaction', () => {

    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const placeSdaExchangeOfferTransaction = PlaceSdaExchangeOfferTransaction.create(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST
        );

        expect(placeSdaExchangeOfferTransaction.maxFee.compact()).to.be.equal(placeSdaExchangeOfferTransaction.size * DefaultFeeCalculationStrategy);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const placeSdaExchangeOfferTransaction = PlaceSdaExchangeOfferTransaction.create(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0])
        );

        expect(placeSdaExchangeOfferTransaction.maxFee.higher).to.be.equal(0);
        expect(placeSdaExchangeOfferTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an PlaceSdaExchangeOfferTransaction object and sign', () => {
        const placeSdaExchangeOfferTransaction = PlaceSdaExchangeOfferTransaction.create(
            Deadline.create(),
            [
                new SdaExchangeOffer(
                    new MosaicId('1234567890ABCDEF'),
                    UInt64.fromUint(333333),
                    new MosaicId('1234567890ABCDEE'),
                    UInt64.fromUint(666666),
                    UInt64.fromUint(10000)
                ),
            ],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = placeSdaExchangeOfferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            244,
            signedTransaction.payload.length,
        )).to.be.equal('01EFCDAB90785634121516050000000000EECDAB90785634122A2C0A00000000001027000000000000');
    });

    describe('size', () => {
        it('should return 123 for PlaceSdaExchangeOfferTransaction without any offer', () => {
            const placeSdaExchangeOfferTransaction = PlaceSdaExchangeOfferTransaction.create(
                Deadline.create(),
                [],
                NetworkType.MIJIN_TEST,
            );
            expect(placeSdaExchangeOfferTransaction.size).to.be.equal(123);
        });
        it('should return 163 for PlaceSdaExchangeOfferTransaction with 1 offer', () => {
            const placeSdaExchangeOfferTransaction = PlaceSdaExchangeOfferTransaction.create(
                Deadline.create(),
                [
                    new SdaExchangeOffer(
                        new MosaicId(UInt64.fromUint(0).toDTO()), 
                        UInt64.fromUint(0), 
                        new MosaicId(UInt64.fromUint(0).toDTO()), 
                        UInt64.fromUint(1),
                        UInt64.fromUint(1), 
                    )
                ],
                NetworkType.MIJIN_TEST,
            );
            expect(placeSdaExchangeOfferTransaction.size).to.be.equal(163);
        });
        it('should return 243 for PlaceSdaExchangeOfferTransaction with 3 offers', () => {
            const placeSdaExchangeOfferTransaction = PlaceSdaExchangeOfferTransaction.create(
                Deadline.create(),
                [
                    new SdaExchangeOffer(
                        new MosaicId(UInt64.fromUint(0).toDTO()), 
                        UInt64.fromUint(0), 
                        new MosaicId(UInt64.fromUint(0).toDTO()), 
                        UInt64.fromUint(1),
                        UInt64.fromUint(1), 
                    ),
                    new SdaExchangeOffer(
                        new MosaicId(UInt64.fromUint(0).toDTO()), 
                        UInt64.fromUint(0), 
                        new MosaicId(UInt64.fromUint(0).toDTO()), 
                        UInt64.fromUint(1),
                        UInt64.fromUint(1), 
                    ),
                    new SdaExchangeOffer(
                        new MosaicId(UInt64.fromUint(0).toDTO()), 
                        UInt64.fromUint(0), 
                        new MosaicId(UInt64.fromUint(0).toDTO()), 
                        UInt64.fromUint(1),
                        UInt64.fromUint(1), 
                    )
                ],
                NetworkType.MIJIN_TEST,
            );
            expect(placeSdaExchangeOfferTransaction.size).to.be.equal(243);
        });
    });
});
