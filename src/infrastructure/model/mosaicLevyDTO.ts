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

export class MosaicLevyDTO {
    'type': number;
    'recipient': string;
    'mosaicId': Array<number>;
    'fee': Array<number>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "type",
            "baseName": "type",
            "type": "number"
        },
        {
            "name": "recipient",
            "baseName": "recipient",
            "type": "string"
        },
        {
            "name": "mosaicId",
            "baseName": "mosaicId",
            "type": "Array<number>"
        },
        {
            "name": "fee",
            "baseName": "fee",
            "type": "Array<number>"
        }    
    ];

    static getAttributeTypeMap() {
        return MosaicLevyDTO.attributeTypeMap;
    }
}

