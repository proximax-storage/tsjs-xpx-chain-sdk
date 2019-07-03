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
 * The blockchain storage info structure describes stored data.
 */
class BlockchainStorageInfo {
    /**
     * @param numBlocks
     * @param numTransactions
     * @param numAccounts
     */
    constructor(/**
                 * The number of confirmed blocks.
                 */ numBlocks, 
    /**
     * The number of confirmed transactions.
     */
    numTransactions, 
    /**
     * The number accounts published in the blockchain.
     */
    numAccounts) {
        this.numBlocks = numBlocks;
        this.numTransactions = numTransactions;
        this.numAccounts = numAccounts;
    }
}
exports.BlockchainStorageInfo = BlockchainStorageInfo;
//# sourceMappingURL=BlockchainStorageInfo.js.map