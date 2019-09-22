"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const UInt64_1 = require("../UInt64");
var FeeCalculationStrategy;
(function (FeeCalculationStrategy) {
    FeeCalculationStrategy[FeeCalculationStrategy["ZeroFeeCalculationStrategy"] = 0] = "ZeroFeeCalculationStrategy";
    FeeCalculationStrategy[FeeCalculationStrategy["LowFeeCalculationStrategy"] = 25] = "LowFeeCalculationStrategy";
    FeeCalculationStrategy[FeeCalculationStrategy["MiddleFeeCalculationStrategy"] = 250] = "MiddleFeeCalculationStrategy";
    FeeCalculationStrategy[FeeCalculationStrategy["HighFeeCalculationStrategy"] = 2500] = "HighFeeCalculationStrategy";
})(FeeCalculationStrategy = exports.FeeCalculationStrategy || (exports.FeeCalculationStrategy = {}));
exports.DefaultMaxFee = 5000000;
exports.DefaultFeeCalculationStrategy = FeeCalculationStrategy.MiddleFeeCalculationStrategy;
exports.calculateFee = (transactionByteSize, feeCalculationStratgy = exports.DefaultFeeCalculationStrategy) => {
    return UInt64_1.UInt64.fromUint(Math.min(exports.DefaultMaxFee, transactionByteSize * feeCalculationStratgy));
};
//# sourceMappingURL=FeeCalculationStrategy.js.map