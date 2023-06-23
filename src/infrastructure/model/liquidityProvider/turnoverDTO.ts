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

import { RateDTO } from "./rateDTO";

/**
 * The turnover provider structure
 */
export class TurnoverDTO {
    rate: RateDTO;
    turnover: Array<number>;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "rate",
            "baseName": "rate",
            "type": "RateDTO"
        },
        {
            "name": "turnover",
            "baseName": "turnover",
            "type": "Array<number>"
        }
    ];

    static getAttributeTypeMap() {
        return TurnoverDTO.attributeTypeMap;
    }
}