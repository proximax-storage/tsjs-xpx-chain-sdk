"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
class Statement {
    /**
     * Receipt - transaction statement object
     * @param transactionStatements - The transaction statements.
     * @param addressResolutionStatements - The address resolution statements.
     * @param mosaicResolutionStatements - The mosaic resolution statements.
     */
    constructor(
    /**
     * The transaction statements.
     */
    transactionStatements, 
    /**
     * The address resolution statements.
     */
    addressResolutionStatements, 
    /**
     * The mosaic resolution statements.
     */
    mosaicResolutionStatements) {
        this.transactionStatements = transactionStatements;
        this.addressResolutionStatements = addressResolutionStatements;
        this.mosaicResolutionStatements = mosaicResolutionStatements;
    }
}
exports.Statement = Statement;
//# sourceMappingURL=Statement.js.map