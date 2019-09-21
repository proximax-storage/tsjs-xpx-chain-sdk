// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { UInt64 } from "../UInt64";

export enum FeeCalculationStrategy {
    ZeroFeeCalculationStrategy = 0,
    LowFeeCalculationStrategy = 25,
    MiddleFeeCalculationStrategy = 250,
    HighFeeCalculationStrategy = 2500
}

export const DefaultMaxFee = 5000000;

export const DefaultFeeCalculationStrategy: FeeCalculationStrategy = FeeCalculationStrategy.MiddleFeeCalculationStrategy;

export const calculateFee = (transactionByteSize: number, feeCalculationStratgy: FeeCalculationStrategy = DefaultFeeCalculationStrategy) => {
    return UInt64.fromUint(Math.min(DefaultMaxFee, transactionByteSize * feeCalculationStratgy));
}
