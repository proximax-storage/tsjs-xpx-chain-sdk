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
 * Transaction information model included in all transactions
 */
class TransactionInfo {
    /**
     * @param height
     * @param index
     * @param id
     * @param hash
     * @param merkleComponentHash
     */
    constructor(
    /**
     * The block height in which the transaction was included.
     */
    height, 
    /**
     * The index representing either transaction index/position within block or within an aggregate transaction.
     */
    index, 
    /**
     * The transaction db id.
     */
    id, 
    /**
     * The transaction hash.
     */
    hash, 
    /**
     * The transaction merkle hash.
     */
    merkleComponentHash) {
        this.height = height;
        this.index = index;
        this.id = id;
        this.hash = hash;
        this.merkleComponentHash = merkleComponentHash;
    }
}
exports.TransactionInfo = TransactionInfo;
//# sourceMappingURL=TransactionInfo.js.map