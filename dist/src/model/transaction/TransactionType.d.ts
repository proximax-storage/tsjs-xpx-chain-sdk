/**
 * Static class containing transaction type constants.
 */
export declare class TransactionType {
    /**
     * Transfer Transaction transaction type.
     * @type {number}
     */
    static readonly TRANSFER = 16724;
    /**
     * Register namespace transaction type.
     * @type {number}
     */
    static readonly REGISTER_NAMESPACE = 16718;
    /**
     * Address alias transaction type
     * @type {number}
     */
    static readonly ADDRESS_ALIAS = 16974;
    /**
     * Mosaic alias transaction type
     * @type {number}
     */
    static readonly MOSAIC_ALIAS = 17230;
    /**
     * Mosaic definition transaction type.
     * @type {number}
     */
    static readonly MOSAIC_DEFINITION = 16717;
    /**
     * Mosaic supply change transaction.
     * @type {number}
     */
    static readonly MOSAIC_SUPPLY_CHANGE = 16973;
    /**
     * Modify multisig account transaction type.
     * @type {number}
     */
    static readonly MODIFY_MULTISIG_ACCOUNT = 16725;
    /**
     * Aggregate complete transaction type.
     * @type {number}
     */
    static readonly AGGREGATE_COMPLETE = 16705;
    /**
     * Aggregate bonded transaction type
     */
    static readonly AGGREGATE_BONDED = 16961;
    /**
     * Lock transaction type
     * @type {number}
     */
    static readonly LOCK = 16712;
    /**
     * Secret Lock Transaction type
     * @type {number}
     */
    static readonly SECRET_LOCK = 16722;
    /**
     * Secret Proof transaction type
     * @type {number}
     */
    static readonly SECRET_PROOF = 16978;
    /**
     * Account property address transaction type
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_PROPERTY_ADDRESS = 16720;
    /**
     * Account property mosaic transaction type
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_PROPERTY_MOSAIC = 16976;
    /**
     * Account property entity type transaction type
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE = 17232;
    /**
     * Link account transaction type
     * @type {number}
     */
    static readonly LINK_ACCOUNT = 16716;
}
