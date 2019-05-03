/**
 * Static class containing transaction type constants.
 */
export declare class TransactionType {
    /**
     * Transfer Transaction transaction type.
     * @type {number}
     */
    static readonly TRANSFER: number;
    /**
     * Register namespace transaction type.
     * @type {number}
     */
    static readonly REGISTER_NAMESPACE: number;
    /**
     * Address alias transaction type
     * @type {number}
     */
    static readonly ADDRESS_ALIAS: number;
    /**
     * Mosaic alias transaction type
     * @type {number}
     */
    static readonly MOSAIC_ALIAS: number;
    /**
     * Mosaic definition transaction type.
     * @type {number}
     */
    static readonly MOSAIC_DEFINITION: number;
    /**
     * Mosaic supply change transaction.
     * @type {number}
     */
    static readonly MOSAIC_SUPPLY_CHANGE: number;
    /**
     * Modify multisig account transaction type.
     * @type {number}
     */
    static readonly MODIFY_MULTISIG_ACCOUNT: number;
    /**
     * Aggregate complete transaction type.
     * @type {number}
     */
    static readonly AGGREGATE_COMPLETE: number;
    /**
     * Aggregate bonded transaction type
     */
    static readonly AGGREGATE_BONDED: number;
    /**
     * Lock transaction type
     * @type {number}
     */
    static readonly LOCK: number;
    /**
     * Secret Lock Transaction type
     * @type {number}
     */
    static readonly SECRET_LOCK: number;
    /**
     * Secret Proof transaction type
     * @type {number}
     */
    static readonly SECRET_PROOF: number;
    /**
     * Account property address transaction type
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_PROPERTY_ADDRESS: number;
    /**
     * Account property mosaic transaction type
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_PROPERTY_MOSAIC: number;
    /**
     * Account property entity type transaction type
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE: number;
    /**
     * Link account transaction type
     * @type {number}
     */
    static readonly LINK_ACCOUNT: number;
}
