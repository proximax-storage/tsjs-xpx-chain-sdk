/**
 * The receipt source object.
 */
export declare class ReceiptSource {
    /**
     * The transaction primary source (e.g. index within block).
     */
    readonly primaryId: number;
    /**
     * The transaction secondary source (e.g. index within aggregate).
     */
    readonly secondaryId: number;
    /**
     * @constructor
     * @param primaryId - The transaction primary source (e.g. index within block).
     * @param secondaryId - The transaction secondary source (e.g. index within aggregate).
     */
    constructor(
    /**
     * The transaction primary source (e.g. index within block).
     */
    primaryId: number, 
    /**
     * The transaction secondary source (e.g. index within aggregate).
     */
    secondaryId: number);
}
