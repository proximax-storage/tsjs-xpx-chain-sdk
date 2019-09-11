"use strict";
/*
 * Copyright 2018 NEM
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class representing mosaic view information with amount
 */
class MosaicAmountView {
    /**
     * @param mosaicInfo
     * @param namespaceName
     * @param mosaicName
     * @param amount
     */
    constructor(/**
                 * The mosaic information
                 */ mosaicInfo, 
    /**
     * The amount of absolute mosaics we have
     */
    amount) {
        this.mosaicInfo = mosaicInfo;
        this.amount = amount;
    }
    /**
     * Relative amount dividing amount by the divisibility
     * @returns {string}
     */
    relativeAmount() {
        if (this.mosaicInfo.divisibility === 0) {
            return this.amount.compact();
        }
        return this.amount.compact() / Math.pow(10, this.mosaicInfo.divisibility);
    }
    /**
     * Namespace and mosaic description
     * @returns {string}
     */
    fullName() {
        return this.mosaicInfo.mosaicId.toHex();
    }
}
exports.MosaicAmountView = MosaicAmountView;
//# sourceMappingURL=MosaicAmountView.js.map