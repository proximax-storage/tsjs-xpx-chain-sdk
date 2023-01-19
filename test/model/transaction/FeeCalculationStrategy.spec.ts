// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {expect} from 'chai';
import {UInt64} from '../../../src/model/UInt64';
import { DefaultFeeCalculationStrategy, calculateFee, FeeCalculationStrategy } from '../../../src/model/transaction/FeeCalculationStrategy';
import { TransactionBuilderFactory } from '../../../src/model/model';

describe('FeeCalculationStrategy', () => {
    describe('calculateFee', () => {
        it('should return 0 for all FeeCalculationStrategy values', () => {
            expect(calculateFee(0)).to.be.eql(UInt64.fromUint(0));
            expect(calculateFee(0, DefaultFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(0));
            expect(calculateFee(0, FeeCalculationStrategy.ZeroFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(0));
            expect(calculateFee(0, FeeCalculationStrategy.LowFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(0));
            expect(calculateFee(0, FeeCalculationStrategy.MiddleFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(0));
            expect(calculateFee(0, FeeCalculationStrategy.HighFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(0));
        });

        it('should return default FeeCalculationStrategy values', () => {
            // expect(DefaultMaxFee).to.be.equal(75000000);
            expect(calculateFee(1)).to.be.eql(UInt64.fromUint(DefaultFeeCalculationStrategy));
            expect(calculateFee(1, DefaultFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(FeeCalculationStrategy.MiddleFeeCalculationStrategy));
            expect(calculateFee(1, FeeCalculationStrategy.ZeroFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(0));
            expect(calculateFee(1, FeeCalculationStrategy.LowFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(15000));
            expect(calculateFee(1, FeeCalculationStrategy.MiddleFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(150000));
            expect(calculateFee(1, FeeCalculationStrategy.HighFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(1500000));
        });

        for (let length of [10, 100, 151]) {
            it('should return correctly computed maxFee with length ' + length + ' for all FeeCalculationStrategy values', () => {
                expect(calculateFee(length)).to.be.eql(UInt64.fromUint(length * DefaultFeeCalculationStrategy));
                expect(calculateFee(length, DefaultFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(length * FeeCalculationStrategy.MiddleFeeCalculationStrategy));
                expect(calculateFee(length, FeeCalculationStrategy.ZeroFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(0));
                expect(calculateFee(length, FeeCalculationStrategy.LowFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(length * 15000));
                expect(calculateFee(length, FeeCalculationStrategy.MiddleFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(length * 150000));
                expect(calculateFee(length, FeeCalculationStrategy.HighFeeCalculationStrategy)).to.be.eql(UInt64.fromUint(length * 1500000));
            });
        }

    });

    describe('TransactionBuilderFactory', () => {
        describe('should return correct maxFee for created tx with FeeCalculationStrategy configured', () => {
            const emptyTransferTxSize = 151;
            it('should return DefaultFeeCalculationStrategy as default', () => {
                const factory = new TransactionBuilderFactory();
                const transfer = factory.transfer().build();
                expect(transfer.maxFee.compact()).to.be.eql(transfer.size * DefaultFeeCalculationStrategy);
            });
            it('should return 2265000 for LowFeeCalculationStrategy', () => {
                const factory = new TransactionBuilderFactory();
                factory.feeCalculationStrategy = FeeCalculationStrategy.LowFeeCalculationStrategy;
                expect(factory.transfer().build().maxFee).to.be.eql(UInt64.fromUint(emptyTransferTxSize * FeeCalculationStrategy.LowFeeCalculationStrategy));
            });

            it('should return 22650000 for MiddleFeeCalculationStrategy', () => {
                const factory = new TransactionBuilderFactory();
                factory.feeCalculationStrategy = FeeCalculationStrategy.MiddleFeeCalculationStrategy;
                expect(factory.transfer().build().maxFee).to.be.eql(UInt64.fromUint(emptyTransferTxSize * FeeCalculationStrategy.MiddleFeeCalculationStrategy));
            });

            it('should return 226500000 for HighFeeCalculationStrategy', () => {
                const factory = new TransactionBuilderFactory();
                factory.feeCalculationStrategy = FeeCalculationStrategy.HighFeeCalculationStrategy;
                expect(factory.transfer().build().maxFee).to.be.eql(UInt64.fromUint(emptyTransferTxSize * FeeCalculationStrategy.HighFeeCalculationStrategy));
            });
        });
    });
});
