/**
 * Static class containing transaction type constants.
 */
export declare class TransactionType {
    /**
     * Transfer Transaction transaction type.
     * @type {number}
     */
    static readonly TRANSFER;
    /**
     * Register namespace transaction type.
     * @type {number}
     */
    static readonly REGISTER_NAMESPACE;
    /**
     * Address alias transaction type
     * @type {number}
     */
    static readonly ADDRESS_ALIAS;
    /**
     * Mosaic alias transaction type
     * @type {number}
     */
    static readonly MOSAIC_ALIAS;
    /**
     * Mosaic definition transaction type.
     * @type {number}
     */
    static readonly MOSAIC_DEFINITION;
    /**
     * Mosaic supply change transaction.
     * @type {number}
     */
    static readonly MOSAIC_SUPPLY_CHANGE;
    /**
     * Modify multisig account transaction type.
     * @type {number}
     */
    static readonly MODIFY_MULTISIG_ACCOUNT;
    /**
     * Aggregate complete transaction type.
     * @type {number}
     */
    static readonly AGGREGATE_COMPLETE;
    /**
     * Aggregate bonded transaction type
     */
    static readonly AGGREGATE_BONDED;
    /**
     * Lock transaction type
     * @type {number}
     */
    static readonly LOCK;
    /**
     * Secret Lock Transaction type
     * @type {number}
     */
    static readonly SECRET_LOCK;
    /**
     * Secret Proof transaction type
     * @type {number}
     */
    static readonly SECRET_PROOF;
    /**
     * Account restriction address transaction type
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_RESTRICTION_ADDRESS;
    /**
     * Account restriction mosaic transaction type
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_RESTRICTION_MOSAIC;
    /**
     * Account restriction operation transaction type
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_RESTRICTION_OPERATION;
    /**
     * Link account transaction type
     * @type {number}
     */
    static readonly LINK_ACCOUNT;
    /**
     * Modify account/address related metadata transaction type
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_METADATA;
    /**
     * Modify mosaic related metadata transaction type
     * @type {number}
     */
    static readonly MODIFY_MOSAIC_METADATA;
    /**
     * Modify namespace related metadata transaction type
     * @type {number}
     */
    static readonly MODIFY_NAMESPACE_METADATA;
    /**
     * Modify contract transaction type
     */
    static readonly MODIFY_CONTRACT;
    /**
     * Upgrade chain transaction type
     */
    static readonly CHAIN_UPGRADE;
    /**
     * Configure chain transaction type
     */
    static readonly CHAIN_CONFIGURE;
}
