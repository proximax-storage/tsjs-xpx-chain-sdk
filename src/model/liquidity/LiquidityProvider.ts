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

import { UInt64 } from "../UInt64";
import { MosaicId } from "../mosaic/MosaicId";
import { Turnover } from "./Turnover";

/**
 * The liquidity provider structure
 */
export class LiquidityProvider {

    constructor(
        public readonly mosaicId: MosaicId,
        public readonly providerKey: string,
        public readonly owner: string,
        public readonly additionallyMinted: UInt64,
        public readonly slashingAccount: string,
        public readonly slashingPeriod: number,
        public readonly windowSize: number,
        public readonly creationHeight: UInt64,
        public readonly alpha: number,
        public readonly beta: number, 
        public readonly turnoverHistory: Turnover[],
        public readonly recentTurnover: Turnover
    ){}
}