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
 * Catapult REST API Reference
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.7.15
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from '../api';
import { ArtifactExpiryReceiptDTO } from './artifactExpiryReceiptDTO';
import { BalanceChangeReceiptDTO } from './balanceChangeReceiptDTO';
import { BalanceTransferReceiptDTO } from './balanceTransferReceiptDTO';
import { InflationReceiptDTO } from './inflationReceiptDTO';
import { SourceDTO } from './sourceDTO';

/**
* The collection of receipts related to a transaction.
*/
export class TransactionStatementDTO {
    'height': Array<number>;
    'source': SourceDTO;
    /**
    * The array of receipts.
    */
    'receipts': Array<BalanceTransferReceiptDTO | BalanceChangeReceiptDTO | ArtifactExpiryReceiptDTO | InflationReceiptDTO>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "height",
            "baseName": "height",
            "type": "Array<number>"
        },
        {
            "name": "source",
            "baseName": "source",
            "type": "SourceDTO"
        },
        {
            "name": "receipts",
            "baseName": "receipts",
            "type": "Array<BalanceTransferReceiptDTO | BalanceChangeReceiptDTO | ArtifactExpiryReceiptDTO | InflationReceiptDTO>"
        }    ];

    static getAttributeTypeMap() {
        return TransactionStatementDTO.attributeTypeMap;
    }
}

