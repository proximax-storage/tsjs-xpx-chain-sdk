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

export class SupplementalPublicKeysDTO {
    
    'linked'?: string;
    'node'?: string;
    'vrf'?: string;
    
    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "linked",
            "baseName": "linked",
            "type": "string"
        },
        {
            "name": "node",
            "baseName": "node",
            "type": "string"
        },
        {
            "name": "vrf",
            "baseName": "vrf",
            "type": "string"
        }];

    static getAttributeTypeMap() {
        return SupplementalPublicKeysDTO.attributeTypeMap;
    }
}

