/*
 * Copyright 2023 ProximaX
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License"),
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
 * Enum class containing transaction version constants.
 *
 * Transaction format versions are defined in catapult-server in
 * each transaction's plugin source code.
 *
 * You can check out the implemented version for each transaction at the Sirius blockchain network config
 */
export enum TransactionTypeVersion {

    /**
     * Transfer Transaction transaction version.
     * @type {number}
     */
    TRANSFER = 3,

    /**
     * Register namespace transaction version.
     * @type {number}
     */
    REGISTER_NAMESPACE = 2,

    /**
     * Mosaic definition transaction version.
     * @type {number}
     */
    MOSAIC_DEFINITION = 4,

    /**
     * Mosaic supply change transaction.
     * @type {number}
     */
    MOSAIC_SUPPLY_CHANGE = 2,

    /**
     * Modify multisig account transaction version.
     * @type {number}
     */
    MODIFY_MULTISIG_ACCOUNT = 3,

    /**
     * Aggregate complete v1 transaction version.
     * @type {number}
     */
    AGGREGATE_COMPLETE_V1 = 3,

    /**
     * Aggregate bonded v1 transaction version
     * @type {number}
     */
    AGGREGATE_BONDED_V1 = 3,

    /**
     * Lock transaction version
     * @type {number}
     */
    HASH_LOCK = 1,

    /**
     * Secret Lock transaction version
     * @type {number}
     */
    SECRET_LOCK = 1,

    /**
     * Secret Proof transaction version
     * @type {number}
     */
    SECRET_PROOF = 1,

    /**
     * Address Alias transaction version
     * @type {number}
     */
    ADDRESS_ALIAS = 1,

    /**
     * Mosaic Alias transaction version
     * @type {number}
     */
    MOSAIC_ALIAS = 1,

    /**
     * Account Restriction address transaction version
     * @type {number}
     */
    MODIFY_ACCOUNT_RESTRICTION_ADDRESS = 1,

    /**
     * Account Restriction mosaic transaction version
     * @type {number}
     */
    MODIFY_ACCOUNT_RESTRICTION_MOSAIC = 1,

    /**
     * Account Restriction operation transaction version
     * @type {number}
     */
    MODIFY_ACCOUNT_RESTRICTION_ENTITY_TYPE = 1,

    /**
     * Link account transaction version
     * @type {number}
     */
    LINK_ACCOUNT = 2,

    /**
     * Modify metadata transactions version
     * @deprecated
     * @type {number}
     */
    MODIFY_METADATA = 1,

    /**
     * Modify account metadata nem transactions version
     * @type {number}
     */
     ACCOUNT_METADATA_V2 = 1,

     /**
     * Modify mosaic metadata nem transactions version
     * @type {number}
     */
    MOSAIC_METADATA_V2 = 1,

    
     /**
     * Modify namespace metadata nem transactions version
     * @type {number}
     */
    NAMESPACE_METADATA_V2 = 1,

    /**
     * Modify mosaic modify levy transactions version
     * @type {number}
     */
    MOSAIC_MODIFY_LEVY = 1,

    /**
     * Modify remove mosaic levy transactions version
     * @type {number}
     */
     MOSAIC_REMOVE_LEVY = 1,

    /**
     * Chain configuration transaction version
     * @type {number}
     */
    CHAIN_CONFIG = 1,

    /**
     * Chain upgrade transaction version
     * @type {number}
     */
    CHAIN_UPGRADE = 1,

    /**
     * Add exchange transaction version
     * @type {number}
     */
    ADD_EXCHANGE_OFFER = 4,

    /**
     * Exchange transaction version
     * @type {number}
     */
    EXCHANGE_OFFER = 2,

    /**
     * Remove exchange transaction version
     * @type {number}
     */
    REMOVE_EXCHANGE_OFFER = 2,

    /**
    * Add harvester transaction version
    * @type {number}
    */
     ADD_HARVESTER = 1,

     /**
     * Remove harvester transaction version
     * @type {number}
     */
     REMOVE_HARVESTER = 1,

     /**
     * Aggregate complete v2 transaction version.
     * @type {number}
     */
    AGGREGATE_COMPLETE_V2 = 1,

    /**
     * Aggregate bonded v2 transaction version
     * @type {number}
     */
    AGGREGATE_BONDED_V2 = 1,

    Account_V2_Upgrade = 1,

    /**
     * Place SDA exchange transaction version.
     * @type {number}
     */
    PLACE_SDA_EXCHANGE_OFFER = 1,

    /**
     * Remove SDA exchange offer transaction version
     * @type {number}
     */
    REMOVE_SDA_EXCHANGE_OFFER = 1,

    Create_Liquidity_Provider = 1,
	Manual_Rate_Change        = 1,

    // ------------------------storage transactions type-------------------------------------

    Replicator_Onboarding             = 1,
	Prepare_Bc_Drive                  = 1,
	Data_Modification                 = 1,
	Data_Modification_Approval        = 1,
	Data_Modification_Single_Approval = 1,
	Data_Modification_Cancel          = 1,
	Storage_Payment                   = 1,
	Download_Payment                  = 1,
	Download                          = 1,
	Finish_Download                   = 1,
	Verification_Payment              = 1,
	End_Drive_Verification_V2         = 1,
	Download_Approval                 = 1,
	Drive_Closure                     = 1,
	Replicator_Offboarding            = 1,

    // --------------------------------------------------------------------------------------
    // ----------------------------symbol merge type-----------------------------------------
    NetworkConfig_Absolute_Height       = 1,
	Node_Key_Link                       = 1,
	Vrf_Key_Link                        = 1,
	Lock_Fund_Transfer                  = 1,
	Lock_Fund_Cancel_Unlock             = 1,
	Account_Address_Restriction         = 1,
	Account_Mosaic_Restriction          = 1,
	Account_Operation_Restriction       = 1,
	Mosaic_Global_Restriction           = 1,
	Mosaic_Address_Restriction          = 1,
    // --------------------------------------------------------------------------------------
}
