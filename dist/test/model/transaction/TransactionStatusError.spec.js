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
const assert_1 = require("assert");
const chai_1 = require("chai");
const TransactionStatusError_1 = require("../../../src/model/transaction/TransactionStatusError");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
describe('TransactionStatusError', () => {
    it('should createComplete an TransactionStatusError object', () => {
        const statusInfoErrorDTO = {
            deadline: [1010, 0],
            hash: 'transaction-hash',
            status: 'error-message',
        };
        const transactionStatusError = new TransactionStatusError_1.TransactionStatusError(statusInfoErrorDTO.hash, statusInfoErrorDTO.status, Deadline_1.Deadline.createFromDTO(statusInfoErrorDTO.deadline));
        chai_1.expect(transactionStatusError.hash).to.be.equal(statusInfoErrorDTO.hash);
        chai_1.expect(transactionStatusError.status).to.be.equal(statusInfoErrorDTO.status);
        assert_1.deepEqual(transactionStatusError.deadline.toDTO(), statusInfoErrorDTO.deadline);
    });
});
//# sourceMappingURL=TransactionStatusError.spec.js.map