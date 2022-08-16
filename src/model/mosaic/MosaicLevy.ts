import { Address } from "../account/Address"
import { UInt64 } from "../UInt64"
import { MosaicId } from "./MosaicId"
import { MosaicLevyType } from "./MosaicLevyType"

export class MosaicLevy{

    /**
     * default amount that Levy fee will be effective, represent 1%
     */
    public static DefaultMosaicLevyEffectiveValue: number = 100000;

    constructor(
        public readonly type: MosaicLevyType,
        public readonly recipient: Address,
        public readonly mosaicId: MosaicId,
        public fee: UInt64
    ){
        
    }

    static createWithPercentageFee(recipient: Address, mosaicId: MosaicId, percentage: number){

        if(percentage > 100){
            throw new Error("Percentage cannot be more than 100%");
        }
        else if(percentage < 0.00001){
            throw new Error("Percentage cannot be less than 0.00001%");
        }

        return new MosaicLevy(
            MosaicLevyType.LevyPercentileFee,
            recipient,
            mosaicId,
            MosaicLevy.createLevyFeePercentile(percentage)
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

    static createLevyFeePercentile(percentage: number): UInt64{

        return UInt64.fromUint(percentage * MosaicLevy.DefaultMosaicLevyEffectiveValue);
    }
}