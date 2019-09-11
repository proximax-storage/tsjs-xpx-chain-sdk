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
const CreateTransactionFromDTO_1 = require("../../infrastructure/transaction/CreateTransactionFromDTO");
const CreateTransactionFromPayload_1 = require("../../infrastructure/transaction/CreateTransactionFromPayload");
class TransactionMapping {
    /**
     * Create transaction class from Json.
     * @param {object} dataJson The transaction json object.
     * @returns {module: model/transaction/transaction} The transaction class.
     */
    static createFromDTO(dataJson) {
        return CreateTransactionFromDTO_1.CreateTransactionFromDTO(dataJson);
    }
    /**
     * Create transaction class from payload binary.
     * @param {string} dataBytes The transaction json object.
     * @returns {module: model/transaction/transaction} The transaction class.
     */
    static createFromPayload(dataBytes) {
        return CreateTransactionFromPayload_1.CreateTransactionFromPayload(dataBytes);
    }
}
exports.TransactionMapping = TransactionMapping;
//# sourceMappingURL=TransactionMapping.js.map