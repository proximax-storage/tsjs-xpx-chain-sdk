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
import { ManualRateChangeTransaction } from '../../../src/model/transaction/liquidityProvider/ManualRateChangeTransaction';
import { PublicAccount } from '../../../src/model/model';

describe('manualRateChangeTransaction', () => {

    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const manualRateChangeTransaction = ManualRateChangeTransaction.create(
            Deadline.create(), 
            new MosaicId([1700609469,1843578377]),
            true,
            UInt64.fromUint(10000),
            true, 
            UInt64.fromUint(10000),
            NetworkType.MIJIN_TEST
        );

        expect(manualRateChangeTransaction.maxFee.compact()).to.be.equal(manualRateChangeTransaction.size * DefaultFeeCalculationStrategy);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const manualRateChangeTransaction = ManualRateChangeTransaction.create(
            Deadline.create(), 
            new MosaicId([1700609469,1843578377]),
            true,
            UInt64.fromUint(10000),
            true, 
            UInt64.fromUint(10000),
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0])
        );

        expect(manualRateChangeTransaction.maxFee.higher).to.be.equal(0);
        expect(manualRateChangeTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an manualRateChangeTransaction object and sign', () => {
        const manualRateChangeTransaction = ManualRateChangeTransaction.create(
            Deadline.create(), 
            new MosaicId([1700609469,1843578377]),
            false,
            UInt64.fromUint(10000),
            true, 
            UInt64.fromUint(10000),
            NetworkType.MIJIN_TEST
        );

        const signedTransaction = manualRateChangeTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            244,
            signedTransaction.payload.length,
        )).to.be.equal('BD3D5D6509C6E26D001027000000000000011027000000000000');
    });

    describe('size', () => {
        it('should return 148 for ManualRateChangeTransaction', () => {
            const manualRateChangeTransaction = ManualRateChangeTransaction.create(
                Deadline.create(), 
                new MosaicId([1700609469,1843578377]),
                true,
                UInt64.fromUint(10000),
                true, 
                UInt64.fromUint(10000),
                NetworkType.MIJIN_TEST
            );
            expect(manualRateChangeTransaction.size).to.be.equal(148);
        });
    });
});
