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
 * Transaction status error model returned by listeners
 */
class TransactionStatusError {
    /**
     * @internal
     * @param hash
     * @param status
     * @param deadline
     */
    constructor(
    /**
     * The transaction hash.
     */
    hash, 
    /**
     * The status error message.
     */
    status, 
    /**
     * The transaction deadline.
     */
    deadline) {
        this.hash = hash;
        this.status = status;
        this.deadline = deadline;
    }
}
exports.TransactionStatusError = TransactionStatusError;
//# sourceMappingURL=TransactionStatusError.js.map