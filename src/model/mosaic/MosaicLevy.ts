import { Address } from "../account/Address"
import { UInt64 } from "../UInt64"
import { MosaicId } from "./MosaicId"
import { MosaicLevyType } from "./MosaicLevyType"

const defaultMosaicLevyOnePercentValue: number = 100000; // default amount that represent 1% of native currency

export class MosaicLevy{

    constructor(
        public readonly type: MosaicLevyType,
        public readonly recipient: Address,
        public readonly mosaicId: MosaicId,
        public fee: UInt64
    ){
        
    }

    static createWithPercentageFee(recipient: Address, mosaicId: MosaicId, percentage: number, mosaicOnePercentValue?: number){
        return new MosaicLevy(
            MosaicLevyType.LevyPercentileFee,
            recipient,
            mosaicId,
            MosaicLevy.createLevyFeePercentile(percentage, mosaicOnePercentValue)
        );
    }

    static createWithAbsoluteFee(recipient: Address, mosaicId: MosaicId, amount: number){
        return new MosaicLevy(
            MosaicLevyType.LevyAbsoluteFee,
            recipient,
            mosaicId,
            UInt64.fromUint(amount)
        );
    }

    static createLevyFeePercentile(percentage: number, mosaicOnePercentValue?: number): UInt64{

        if(mosaicOnePercentValue){
            return UInt64.fromUint(percentage * mosaicOnePercentValue);
        }
        return UInt64.fromUint(percentage * defaultMosaicLevyOnePercentValue);
    }
}