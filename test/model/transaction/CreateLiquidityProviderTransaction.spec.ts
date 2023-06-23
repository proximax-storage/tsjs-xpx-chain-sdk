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
import { CreateLiquidityProviderTransaction } from '../../../src/model/transaction/liquidityProvider/CreateLiquidityProviderTransaction';
import { PublicAccount } from '../../../src/model/model';

describe('createLiquidityProviderTransaction', () => {

    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const createLiquidityProviderTransaction = CreateLiquidityProviderTransaction.create(
            Deadline.create(), 
            new MosaicId([1700609469,1843578377]),
            UInt64.fromUint(10000),
            UInt64.fromUint(10000),
            500, 
            5,
            PublicAccount.createFromPublicKey("0".repeat(64), NetworkType.PRIVATE_TEST),
            500,
            500,
            NetworkType.MIJIN_TEST
        );

        expect(createLiquidityProviderTransaction.maxFee.compact()).to.be.equal(createLiquidityProviderTransaction.size * DefaultFeeCalculationStrategy);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const createLiquidityProviderTransaction = CreateLiquidityProviderTransaction.create(
            Deadline.create(), 
            new MosaicId([1700609469,1843578377]),
            UInt64.fromUint(10000),
            UInt64.fromUint(10000),
            500, 
            5,
            PublicAccount.createFromPublicKey("0".repeat(64), NetworkType.PRIVATE_TEST),
            500,
            500,
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0])
        );

        expect(createLiquidityProviderTransaction.maxFee.higher).to.be.equal(0);
        expect(createLiquidityProviderTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an createLiquidityProviderTransaction object and sign', () => {
        const createLiquidityProviderTransaction = CreateLiquidityProviderTransaction.create(
            Deadline.create(), 
            new MosaicId([1700609469,1843578377]),
            UInt64.fromUint(10000),
            UInt64.fromUint(10000),
            500, 
            5,
            PublicAccount.createFromPublicKey("0".repeat(64), NetworkType.PRIVATE_TEST),
            500,
            500,
            NetworkType.MIJIN_TEST
        );

        const signedTransaction = createLiquidityProviderTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            244,
            signedTransaction.payload.length,
        )).to.be.equal('BD3D5D6509C6E26D10270000000000001027000000000000F401000005000000000000000000000000000000000000000000000000000000000000000000F4010000F4010000');
    });

    describe('size', () => {
        it('should return 192 for CreateLiquidityProviderTransaction', () => {
            const createLiquidityProviderTransaction = CreateLiquidityProviderTransaction.create(
                Deadline.create(), 
                new MosaicId([1700609469,1843578377]),
                UInt64.fromUint(10000),
                UInt64.fromUint(10000),
                500, 
                5,
                PublicAccount.createFromPublicKey("0".repeat(64), NetworkType.PRIVATE_TEST),
                500,
                500,
                NetworkType.MIJIN_TEST
            );
            expect(createLiquidityProviderTransaction.size).to.be.equal(192);
        });
    });
});
