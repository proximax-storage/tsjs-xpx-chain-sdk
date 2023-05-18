/** 
 * Copyright 2023 ProximaX Limited. 
 * All rights reserved. 
 * Use of this source code is governed by the Apache 2.0
 * license that can be found in the LICENSE file
*/

import { RequestFile } from '../api';

export class ConfigDTO {
    'height': Array<number>;
    'networkConfig': string;
    'supportedEntityVersions': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "height",
            "baseName": "height",
            "type": "Array<number>"
        },
        {
            "name": "networkConfig",
            "baseName": "networkConfig",
            "type": "string"
        },
        {
            "name": "supportedEntityVersions",
            "baseName": "supportedEntityVersions",
            "type": "string"
        }    
    ];

    static getAttributeTypeMap() {
        return ConfigDTO.attributeTypeMap;
    }
}

