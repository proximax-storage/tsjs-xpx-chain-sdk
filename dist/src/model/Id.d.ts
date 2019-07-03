import { UInt64 } from './UInt64';
/**
 * This class is used to define mosaicIds and namespaceIds
 */
export declare class Id extends UInt64 {
    static fromHex(hexId: string): Id;
    /**
     * Get string value of id
     * @returns {string}
     */
    toHex(): string;
    /**
     * @param str
     * @param maxVal
     * @returns {string}
     */
    private pad;
}
