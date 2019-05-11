import { MosaicInfo } from '../model/mosaic/MosaicInfo';
/**
 * Class representing mosaic view information
 */
export declare class MosaicView {
    readonly mosaicInfo: MosaicInfo;
    /**
     * @internal
     * @param mosaicInfo
     * @param namespaceName
     * @param mosaicName
     */
    constructor(/**
                 * The mosaic information
                 */ mosaicInfo: MosaicInfo);
}
