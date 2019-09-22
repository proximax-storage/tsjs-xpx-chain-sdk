import { UInt64 } from "../UInt64";
export declare enum FeeCalculationStrategy {
    ZeroFeeCalculationStrategy = 0,
    LowFeeCalculationStrategy = 25,
    MiddleFeeCalculationStrategy = 250,
    HighFeeCalculationStrategy = 2500
}
export declare const DefaultMaxFee = 5000000;
export declare const DefaultFeeCalculationStrategy: FeeCalculationStrategy;
export declare const calculateFee: (transactionByteSize: number, feeCalculationStratgy?: FeeCalculationStrategy) => UInt64;
