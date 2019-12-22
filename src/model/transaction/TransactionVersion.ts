/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
export class TransactionVersion {

    /**
     * Transfer Transaction transaction version.
     * @type {number}
     */
    public static readonly TRANSFER = 3;

    /**
     * Register namespace transaction version.
     * @type {number}
     */
    public static readonly REGISTER_NAMESPACE = 2;

    /**
     * Mosaic definition transaction version.
     * @type {number}
     */
    public static readonly MOSAIC_DEFINITION = 3;

    /**
     * Mosaic supply change transaction.
     * @type {number}
     */
    public static readonly MOSAIC_SUPPLY_CHANGE = 2;

    /**
     * Modify multisig account transaction version.
     * @type {number}
     */
    public static readonly MODIFY_MULTISIG_ACCOUNT = 3;

    /**
     * Aggregate complete transaction version.
     * @type {number}
     */
    public static readonly AGGREGATE_COMPLETE = 2;

    /**
     * Aggregate bonded transaction version
     */
    public static readonly AGGREGATE_BONDED = 2;

    /**
     * Lock transaction version
     * @type {number}
     */
    public static readonly LOCK = 1;

    /**
     * Secret Lock transaction version
     * @type {number}
     */
    public static readonly SECRET_LOCK = 1;

    /**
     * Secret Proof transaction version
     * @type {number}
     */
    public static readonly SECRET_PROOF = 1;

    /**
     * Address Alias transaction version
     * @type {number}
     */
    public static readonly ADDRESS_ALIAS = 1;

    /**
     * Mosaic Alias transaction version
     * @type {number}
     */
    public static readonly MOSAIC_ALIAS = 1;

    /**
     * Account Restriction address transaction version
     * @type {number}
     */
    public static readonly MODIFY_ACCOUNT_RESTRICTION_ADDRESS = 1;

    /**
     * Account Restriction mosaic transaction version
     * @type {number}
     */
    public static readonly MODIFY_ACCOUNT_RESTRICTION_MOSAIC = 1;

    /**
     * Account Restriction operation transaction version
     * @type {number}
     */
    public static readonly MODIFY_ACCOUNT_RESTRICTION_ENTITY_TYPE = 1;

    /**
     * Link account transaction version
     * @type {number}
     */
    public static readonly LINK_ACCOUNT = 2;

    /**
     * Modify metadata transactions version
     * @type {number}
     */
    public static readonly MODIFY_METADATA = 1;

    /**
     * Modify contract transaction version
     * @type {number}
     */
    public static readonly MODIFY_CONTRACT = 3;

    /**
     * Chain configuration transaction version
     * @type {number}
     */
    public static readonly CHAIN_CONFIG = 1;

    /**
     * Chain upgrade transaction version
     * @type {number}
     */
    public static readonly CHAIN_UPGRADE = 1;

    /**
     * Add exchange transaction version
     * @type {number}
     */
    public static readonly ADD_EXCHANGE_OFFER = 1;

    /**
     * Exchange transaction version
     * @type {number}
     */
    public static readonly EXCHANGE_OFFER = 1;

    /**
     * Remove exchange transaction version
     * @type {number}
     */
    public static readonly REMOVE_EXCHANGE_OFFER = 1;

}
