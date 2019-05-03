import { MosaicInfo } from '../model/mosaic/MosaicInfo';
import { UInt64 } from '../model/UInt64';
/**
 * Class representing mosaic view information with amount
 */
export declare class MosaicAmountView {
    readonly mosaicInfo: MosaicInfo;
    /**
     * The amount of absolute mosaics we have
     */
    readonly amount: UInt64;
    /**
     * @param mosaicInfo
     * @param namespaceName
     * @param mosaicName
     * @param amount
     */
    constructor(/**
                 * The mosaic information
                 */ mosaicInfo: MosaicInfo, 
    /**
     * The amount of absolute mosaics we have
     */
    amount: UInt64);
    /**
     * Relative amount dividing amount by the divisibility
     * @returns {string}
     */
    relativeAmount(): number;
    /**
     * Namespace and mosaic description
     * @returns {string}
     */
    fullName(): string;
}
