"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const chai_1 = require("chai");
const TransactionType_1 = require("../../../src/model/transaction/TransactionType");
describe('TransactionType', () => {
    it('Should match the specification', () => {
        chai_1.expect(TransactionType_1.TransactionType.TRANSFER).to.be.equal(0x4154);
        chai_1.expect(TransactionType_1.TransactionType.REGISTER_NAMESPACE).to.be.equal(0x414E);
        chai_1.expect(TransactionType_1.TransactionType.MOSAIC_DEFINITION).to.be.equal(0x414D);
        chai_1.expect(TransactionType_1.TransactionType.MOSAIC_SUPPLY_CHANGE).to.be.equal(0x424D);
        chai_1.expect(TransactionType_1.TransactionType.MODIFY_MULTISIG_ACCOUNT).to.be.equal(0x4155);
        chai_1.expect(TransactionType_1.TransactionType.AGGREGATE_COMPLETE).to.be.equal(0x4141);
        chai_1.expect(TransactionType_1.TransactionType.AGGREGATE_BONDED).to.be.equal(0x4241);
        chai_1.expect(TransactionType_1.TransactionType.AGGREGATE_BONDED).to.be.equal(0x4241);
        chai_1.expect(TransactionType_1.TransactionType.LOCK).to.be.equal(0x4148);
        chai_1.expect(TransactionType_1.TransactionType.SECRET_LOCK).to.be.equal(0x4152);
        chai_1.expect(TransactionType_1.TransactionType.SECRET_PROOF).to.be.equal(0x4252);
    });
});
//# sourceMappingURL=TransactionType.spec.js.map