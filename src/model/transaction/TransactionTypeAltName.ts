/*
 * Copyright 2023 ProximaX
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
 * Enum containing transaction type alternative name constants.
 */
export enum TransactionTypeAltName {

    MOSAIC_ALIAS = "SDA Alias",
    MOSAIC_DEFINITION = "SDA Definition",
    MOSAIC_SUPPLY_CHANGE = "SDA Supply Change",
    HASH_LOCK = "Lock Hash",
    MODIFY_ACCOUNT_RESTRICTION_MOSAIC = "Modify Account Restriction SDA",
    MODIFY_MOSAIC_METADATA = "SDA Metadata v1",
    MODIFY_ACCOUNT_METADATA = "Account Metadata v1",
    MODIFY_NAMESPACE_METADATA = "Namespace Metadata v1",
    MOSAIC_METADATA_V2 = "SDA Metadata",
    NAMESPACE_METADATA_V2 = "Namespace Metadata",
    ACCOUNT_METADATA_V2 = "Account Metadata",
    MODIFY_MOSAIC_LEVY = "Modify SDA Levy",
    REMOVE_MOSAIC_LEVY = "Remove SDA Levy",
    Prepare_Bc_Drive = "Prepare BC Drive",
    Add_Dbrb_Process = "Add DBRB Process",
}
