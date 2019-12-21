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
import { ExchangeOfferTransaction } from '../../../src/model/transaction/ExchangeOfferTransaction';
import { ExchangeOffer } from '../../../src/model/transaction/ExchangeOffer';
import { PublicAccount } from '../../../src/model/model';

describe('ExchangeOfferTransaction', () => {

    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const exchangeOfferTransaction = ExchangeOfferTransaction.create(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST
        );

        expect(exchangeOfferTransaction.maxFee.compact()).to.be.equal(exchangeOfferTransaction.size * DefaultFeeCalculationStrategy);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const exchangeOfferTransaction = ExchangeOfferTransaction.create(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0])
        );

        expect(exchangeOfferTransaction.maxFee.higher).to.be.equal(0);
        expect(exchangeOfferTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an ExchangeOfferTransaction object and sign', () => {
        const exchangeOfferTransaction = ExchangeOfferTransaction.create(
            Deadline.create(),
            [
                new ExchangeOffer(
                    new MosaicId('1234567890ABCDEF'),
                    UInt64.fromUint(333333),
                    UInt64.fromUint(666666),
                    1,
                    PublicAccount.createFromPublicKey('B'.repeat(64), NetworkType.MIJIN_TEST)
                ),
            ],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = exchangeOfferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            244,
            signedTransaction.payload.length,
        )).to.be.equal('01EFCDAB907856341215160500000000002A2C0A000000000001' + 'B'.repeat(64));
    });

    describe('size', () => {
        it('should return 123 for ExchangeOfferTransaction without any offer', () => {
            const exchangeOfferTransaction = ExchangeOfferTransaction.create(
                Deadline.create(),
                [],
                NetworkType.MIJIN_TEST,
            );
            expect(exchangeOfferTransaction.size).to.be.equal(123);
        });
        it('should return 180 for ExchangeOfferTransaction with 1 offer', () => {
            const exchangeOfferTransaction = ExchangeOfferTransaction.create(
                Deadline.create(),
                [
                    new ExchangeOffer(new MosaicId(UInt64.fromUint(0).toDTO()), UInt64.fromUint(0), UInt64.fromUint(1), 0, PublicAccount.createFromPublicKey('B'.repeat(64), NetworkType.MIJIN_TEST))
                ],
                NetworkType.MIJIN_TEST,
            );
            expect(exchangeOfferTransaction.size).to.be.equal(180);
        });
        it('should return 294 for ExchangeOfferTransaction with 3 offers', () => {
            const exchangeOfferTransaction = ExchangeOfferTransaction.create(
                Deadline.create(),
                [
                    new ExchangeOffer(new MosaicId(UInt64.fromUint(0).toDTO()), UInt64.fromUint(0), UInt64.fromUint(1), 0, PublicAccount.createFromPublicKey('B'.repeat(64), NetworkType.MIJIN_TEST)),
                    new ExchangeOffer(new MosaicId(UInt64.fromUint(0).toDTO()), UInt64.fromUint(0), UInt64.fromUint(1), 0, PublicAccount.createFromPublicKey('B'.repeat(64), NetworkType.MIJIN_TEST)),
                    new ExchangeOffer(new MosaicId(UInt64.fromUint(0).toDTO()), UInt64.fromUint(0), UInt64.fromUint(1), 0, PublicAccount.createFromPublicKey('B'.repeat(64), NetworkType.MIJIN_TEST))
                ],
                NetworkType.MIJIN_TEST,
            );
            expect(exchangeOfferTransaction.size).to.be.equal(294);
        });
    });
});
