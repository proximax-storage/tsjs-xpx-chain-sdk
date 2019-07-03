/**
 * Receipt version constants.
 *
 * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/ReceiptType.h
 * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/ReceiptType.cpp
 */
export declare class ReceiptVersion {
    /**
     * Balance transfer receipt version.
     * @type {number}
     */
    static readonly BALANCE_TRANSFER = 1;
    /**
     * Balance change receipt version
     * @type {number}
     */
    static readonly BALANCE_CHANGE = 1;
    /**
     * Artifact expiry receipt version
     * @type {number}
     */
    static readonly ARTIFACT_EXPIRY = 1;
    /**
     * Transaction statement version
     * @type {number}
     */
    static readonly TRANSACTION_STATEMENT = 1;
    /**
     * Resolution statement version
     * @type {number}
     */
    static readonly RESOLUTION_STATEMENT = 1;
    /**
     * Resolution statement version
     * @type {number}
     */
    static readonly INFLATION_RECEIPT = 1;
}
