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
const TransactionInfo_1 = require("./TransactionInfo");
/**
 * Inner transaction information model included in all aggregate inner transactions
 */
class AggregateTransactionInfo extends TransactionInfo_1.TransactionInfo {
    /**
     * @param height
     * @param index
     * @param id
     * @param aggregateHash
     * @param aggregateId
     */
    constructor(height, index, id, 
    /**
     * The hash of the aggregate transaction.
     */
    aggregateHash, 
    /**
     * The id of the aggregate transaction.
     */
    aggregateId) {
        super(height, index, id);
        this.aggregateHash = aggregateHash;
        this.aggregateId = aggregateId;
    }
}
exports.AggregateTransactionInfo = AggregateTransactionInfo;
//# sourceMappingURL=AggregateTransactionInfo.js.map