/*
 * Copyright 2024 ProximaX
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

import { RequestFile } from '../api';
import { AccountLinkTypeEnum } from './accountLinkTypeEnum';
import { MosaicDTO } from './mosaicDTO';
import { SupplementalPublicKeysDTO } from './supplementalPublicKeysDTO';

export class AccountDTO {
    'version'?: number;
    /**
    * The account unique address in hexadecimal. 
    */
    'address': string;
    'addressHeight': Array<number>;
    /**
    * The public key of an account can be used to verify signatures of the account. Only accounts that have already published a transaction have a public key assigned to the account. Otherwise, the field is null. 
    */
    'publicKey': string;
    'publicKeyHeight': Array<number>;
    /**
    * The list of mosaics the account owns. The amount is represented in absolute amount. Thus a balance of 123456789 for a mosaic with divisibility 6 (absolute) means the account owns 123.456789 instead. 
    */
    'mosaics': Array<MosaicDTO>;
    'accountType': AccountLinkTypeEnum;
    /**
    * The public key of a linked account. The linked account can use|provide balance for delegated harvesting. 
    */
    'linkedAccountKey'?: string;
    /**
    * The public key of all linked accounts. The linked account can use|provide balance for remote delegated harvesting. 
    */
    'supplementalPublicKeys'?: SupplementalPublicKeysDTO;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "version",
            "baseName": "version",
            "type": "number"
        },
        {
            "name": "address",
            "baseName": "address",
            "type": "string"
        },
        {
            "name": "addressHeight",
            "baseName": "addressHeight",
            "type": "Array<number>"
        },
        {
            "name": "publicKey",
            "baseName": "publicKey",
            "type": "string"
        },
        {
            "name": "publicKeyHeight",
            "baseName": "publicKeyHeight",
            "type": "Array<number>"
        },
        {
            "name": "mosaics",
            "baseName": "mosaics",
            "type": "Array<MosaicDTO>"
        },
        {
            "name": "accountType",
            "baseName": "accountType",
            "type": "AccountLinkTypeEnum"
        },
        {
            "name": "linkedAccountKey",
            "baseName": "linkedAccountKey",
            "type": "string"
        },
        {
            "name": "supplementalPublicKeys",
            "baseName": "supplementalPublicKeys",
            "type": "SupplementalPublicKeysDTO"
        }    
    ];

    static getAttributeTypeMap() {
        return AccountDTO.attributeTypeMap;
    }
}

