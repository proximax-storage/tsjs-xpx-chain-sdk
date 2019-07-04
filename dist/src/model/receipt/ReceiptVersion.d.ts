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
    static readonly BALANCE_TRANSFER;
    /**
     * Balance change receipt version
     * @type {number}
     */
    static readonly BALANCE_CHANGE;
    /**
     * Artifact expiry receipt version
     * @type {number}
     */
    static readonly ARTIFACT_EXPIRY;
    /**
     * Transaction statement version
     * @type {number}
     */
    static readonly TRANSACTION_STATEMENT;
    /**
     * Resolution statement version
     * @type {number}
     */
    static readonly RESOLUTION_STATEMENT;
    /**
     * Resolution statement version
     * @type {number}
     */
    static readonly INFLATION_RECEIPT;
}
