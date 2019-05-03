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
    static readonly TRANSFER: number;
    /**
     * Register namespace transaction version.
     * @type {number}
     */
    static readonly REGISTER_NAMESPACE: number;
    /**
     * Mosaic definition transaction version.
     * @type {number}
     */
    static readonly MOSAIC_DEFINITION: number;
    /**
     * Mosaic supply change transaction.
     * @type {number}
     */
    static readonly MOSAIC_SUPPLY_CHANGE: number;
    /**
     * Modify multisig account transaction version.
     * @type {number}
     */
    static readonly MODIFY_MULTISIG_ACCOUNT: number;
    /**
     * Aggregate complete transaction version.
     * @type {number}
     */
    static readonly AGGREGATE_COMPLETE: number;
    /**
     * Aggregate bonded transaction version
     */
    static readonly AGGREGATE_BONDED: number;
    /**
     * Lock transaction version
     * @type {number}
     */
    static readonly LOCK: number;
    /**
     * Secret Lock transaction version
     * @type {number}
     */
    static readonly SECRET_LOCK: number;
    /**
     * Secret Proof transaction version
     * @type {number}
     */
    static readonly SECRET_PROOF: number;
    /**
     * Address Alias transaction version
     * @type {number}
     */
    static readonly ADDRESS_ALIAS: number;
    /**
     * Mosaic Alias transaction version
     * @type {number}
     */
    static readonly MOSAIC_ALIAS: number;
    /**
     * Account Property address transaction version
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_PROPERTY_ADDRESS: number;
    /**
     * Account Property mosaic transaction version
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_PROPERTY_MOSAIC: number;
    /**
     * Account Property entity type transaction version
     * @type {number}
     */
    static readonly MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE: number;
    /**
     * Link account transaction version
     * @type {number}
     */
    static readonly LINK_ACCOUNT: number;
}
