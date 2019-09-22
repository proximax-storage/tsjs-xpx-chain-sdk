"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const UInt64_1 = require("../../../src/model/UInt64");
const FeeCalculationStrategy_1 = require("../../../src/model/transaction/FeeCalculationStrategy");
const model_1 = require("../../../src/model/model");
describe('FeeCalculationStrategy', () => {
    describe('calculateFee', () => {
        it('should return 0 for all FeeCalculationStrategy values', () => {
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(0)).to.be.eql(UInt64_1.UInt64.fromUint(0));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(0, FeeCalculationStrategy_1.DefaultFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(0));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(0, FeeCalculationStrategy_1.FeeCalculationStrategy.ZeroFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(0));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(0, FeeCalculationStrategy_1.FeeCalculationStrategy.LowFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(0));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(0, FeeCalculationStrategy_1.FeeCalculationStrategy.MiddleFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(0));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(0, FeeCalculationStrategy_1.FeeCalculationStrategy.HighFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(0));
        });
        it('should return default FeeCalculationStrategy values', () => {
            chai_1.expect(FeeCalculationStrategy_1.DefaultMaxFee).to.be.equal(5000000);
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(1)).to.be.eql(UInt64_1.UInt64.fromUint(FeeCalculationStrategy_1.DefaultFeeCalculationStrategy));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(1, FeeCalculationStrategy_1.DefaultFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(FeeCalculationStrategy_1.FeeCalculationStrategy.MiddleFeeCalculationStrategy));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(1, FeeCalculationStrategy_1.FeeCalculationStrategy.ZeroFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(0));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(1, FeeCalculationStrategy_1.FeeCalculationStrategy.LowFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(25));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(1, FeeCalculationStrategy_1.FeeCalculationStrategy.MiddleFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(250));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(1, FeeCalculationStrategy_1.FeeCalculationStrategy.HighFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(2500));
        });
        for (let length of [10, 100, 1000]) {
            it('should return correctly computed maxFee with length ' + length + ' for all FeeCalculationStrategy values', () => {
                chai_1.expect(FeeCalculationStrategy_1.calculateFee(length)).to.be.eql(UInt64_1.UInt64.fromUint(length * FeeCalculationStrategy_1.DefaultFeeCalculationStrategy));
                chai_1.expect(FeeCalculationStrategy_1.calculateFee(length, FeeCalculationStrategy_1.DefaultFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(length * FeeCalculationStrategy_1.FeeCalculationStrategy.MiddleFeeCalculationStrategy));
                chai_1.expect(FeeCalculationStrategy_1.calculateFee(length, FeeCalculationStrategy_1.FeeCalculationStrategy.ZeroFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(0));
                chai_1.expect(FeeCalculationStrategy_1.calculateFee(length, FeeCalculationStrategy_1.FeeCalculationStrategy.LowFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(length * 25));
                chai_1.expect(FeeCalculationStrategy_1.calculateFee(length, FeeCalculationStrategy_1.FeeCalculationStrategy.MiddleFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(length * 250));
                chai_1.expect(FeeCalculationStrategy_1.calculateFee(length, FeeCalculationStrategy_1.FeeCalculationStrategy.HighFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(length * 2500));
            });
        }
        it('should return DefaultMaxFee if calculated fee exceeds it', () => {
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(199999, FeeCalculationStrategy_1.FeeCalculationStrategy.LowFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(199999 * 25));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(200000, FeeCalculationStrategy_1.FeeCalculationStrategy.LowFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(FeeCalculationStrategy_1.DefaultMaxFee));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(200001, FeeCalculationStrategy_1.FeeCalculationStrategy.LowFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(FeeCalculationStrategy_1.DefaultMaxFee));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(19999, FeeCalculationStrategy_1.FeeCalculationStrategy.MiddleFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(19999 * 250));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(20000, FeeCalculationStrategy_1.FeeCalculationStrategy.MiddleFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(FeeCalculationStrategy_1.DefaultMaxFee));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(20001, FeeCalculationStrategy_1.FeeCalculationStrategy.MiddleFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(FeeCalculationStrategy_1.DefaultMaxFee));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(1999, FeeCalculationStrategy_1.FeeCalculationStrategy.HighFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(1999 * 2500));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(2000, FeeCalculationStrategy_1.FeeCalculationStrategy.HighFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(FeeCalculationStrategy_1.DefaultMaxFee));
            chai_1.expect(FeeCalculationStrategy_1.calculateFee(2001, FeeCalculationStrategy_1.FeeCalculationStrategy.HighFeeCalculationStrategy)).to.be.eql(UInt64_1.UInt64.fromUint(FeeCalculationStrategy_1.DefaultMaxFee));
        });
    });
    describe('TransactionBuilderFactory', () => {
        describe('should return correct maxFee for created tx with FeeCalculationStrategy configured', () => {
            const emptyTransferTxSize = 149;
            it('should return DefaultFeeCalculationStrategy as default', () => {
                const factory = new model_1.TransactionBuilderFactory();
                const transfer = factory.transfer().build();
                chai_1.expect(transfer.maxFee.compact()).to.be.eql(transfer.size * FeeCalculationStrategy_1.DefaultFeeCalculationStrategy);
            });
            it('should return 3725 for LowFeeCalculationStrategy', () => {
                const factory = new model_1.TransactionBuilderFactory();
                factory.feeCalculationStrategy = FeeCalculationStrategy_1.FeeCalculationStrategy.LowFeeCalculationStrategy;
                chai_1.expect(factory.transfer().build().maxFee).to.be.eql(UInt64_1.UInt64.fromUint(emptyTransferTxSize * FeeCalculationStrategy_1.FeeCalculationStrategy.LowFeeCalculationStrategy));
            });
            it('should return 37250 for MiddleFeeCalculationStrategy', () => {
                const factory = new model_1.TransactionBuilderFactory();
                factory.feeCalculationStrategy = FeeCalculationStrategy_1.FeeCalculationStrategy.MiddleFeeCalculationStrategy;
                chai_1.expect(factory.transfer().build().maxFee).to.be.eql(UInt64_1.UInt64.fromUint(emptyTransferTxSize * FeeCalculationStrategy_1.FeeCalculationStrategy.MiddleFeeCalculationStrategy));
            });
            it('should return 372500 for HighFeeCalculationStrategy', () => {
                const factory = new model_1.TransactionBuilderFactory();
                factory.feeCalculationStrategy = FeeCalculationStrategy_1.FeeCalculationStrategy.HighFeeCalculationStrategy;
                chai_1.expect(factory.transfer().build().maxFee).to.be.eql(UInt64_1.UInt64.fromUint(emptyTransferTxSize * FeeCalculationStrategy_1.FeeCalculationStrategy.HighFeeCalculationStrategy));
            });
        });
    });
});
//# sourceMappingURL=FeeCalculationStrategy.spec.js.map