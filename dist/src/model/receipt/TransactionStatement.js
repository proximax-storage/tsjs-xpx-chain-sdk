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
/**
 * A transaction statement is a collection of receipts linked with a transaction in a particular block.
 * - Balance Transfer: A mosaic transfer was triggered.
 * - Balance Change: A mosaic credit or debit was triggered.
 * - Artifact Expiry: An artifact (e.g. namespace, mosaic) expired.
 */
class TransactionStatement {
    /**
     * Receipt - transaction statement object
     * @param height - The block height
     * @param source - The receipt source
     * @param receipts - The array of receipt headers.
     */
    constructor(
    /**
     * The block height.
     */
    height, 
    /**
     * The receipt source.
     */
    source, 
    /**
     * The array of receipt headers.
     */
    receipts) {
        this.height = height;
        this.source = source;
        this.receipts = receipts;
    }
}
exports.TransactionStatement = TransactionStatement;
//# sourceMappingURL=TransactionStatement.js.map