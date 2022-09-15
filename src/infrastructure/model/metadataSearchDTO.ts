/*
 * Copyright 2021 ProximaX
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

import { MetadataEntryInlineResponse } from './metadataEntryInlineResponse';
import { PaginationDTO } from './paginationDTO';

export class MetadataSearchDTO {
    'data': Array<MetadataEntryInlineResponse>;
    'pagination': PaginationDTO;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "data",
            "baseName": "data",
            "type": "Array<MetadataEntryInlineResponse>"
        },
        {
            "name": "pagination",
            "baseName": "pagination",
            "type": "PaginationDTO"
        }    ];

    static getAttributeTypeMap() {
        return MetadataSearchDTO.attributeTypeMap;
    }
}

