/**
 * Static class containing transaction version constants.
 *
 * Transaction format versions are defined in catapult-server in
 * each transaction's plugin source code.
 *
 * In [catapult-server](https://github.com/nemtech/catapult-server), the `DEFINE_TRANSACTION_CONSTANTS` macro
 * is used to define the `TYPE` and `VERSION` of the transaction format.
 *
 * @see https://github.com/nemtech/catapult-server/blob/master/plugins/txes/transfer/src/model/TransferTransaction.h#L37
 */
export declare class TransactionVersion {
    /**
     * Transfer Transaction transaction version.
     * @type {number}
     */
    static readonly TRANSFER = 3;
    /**
     * Register namespace transaction version.
     * @type {number}
     */
    static readonly REGISTER_NAMESPACE = 2;
    /**
     * Mosaic definition transaction version.
     * @type {number}
     */
    static readonly MOSAIC_DEFINITION = 3;
    /**
     * Mosaic supply change transaction.
     * @type {number}
     */
    static readonly MOSAIC_SUPPLY_CHANGE = 2;
    /**
     * Modify multisig account transaction version.
     * @type {number}
     */
    static readonly MODIFY_MULTISIG_ACCOUNT = 3;
    /**
     * Aggregate complete transaction version.
     * @type {number}
     */
    static readonly AGGREGATE_COMPLETE = 2;
    /**
     * Aggregate bonded transaction version
     */
    static readonly AGGREGATE_BONDED = 2;
    /**
     * Lock transaction version
     * @type {number}
     */
    static readonly LOCK = 1;
    /**
     * Secret Lock transaction version
     * @type {number}
     */
    static readonly SECRET_LOCK = 1;
    /**
     * Secret Proof transaction version
     * @type {number}
     */
    static readonly SECRET_PROOF = 1;
    /**
     * Address Alias transaction version
     * @type {number}
     */
    static readonly ADDRESS_ALIAS = 1;
    /**
     * Mosaic Alias transaction version
     * @type {number}
     */
    static readonly MOSAIC_ALIAS = 1;
    /**
     * Account Restriction address transaction version
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_RESTRICTION_ADDRESS = 1;
    /**
     * Account Restriction mosaic transaction version
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_RESTRICTION_MOSAIC = 1;
    /**
     * Account Restriction operation transaction version
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_RESTRICTION_ENTITY_TYPE = 1;
    /**
     * Link account transaction version
     * @type {number}
     */
    static readonly LINK_ACCOUNT = 2;
    /**
     * Modify metadata transactions version
     * @type {number}
     */
    static readonly MODIFY_METADATA = 1;
    /**
     * Modify contract transaction version
     * @type {number}
     */
    static readonly MODIFY_CONTRACT = 3;
    /**
     * Chain configuration transaction version
     * @type {number}
     */
    static readonly CHAIN_CONFIG = 1;
    /**
     * Chain upgrade transaction version
     * @type {number}
     */
    static readonly CHAIN_UPGRADE = 1;
}
