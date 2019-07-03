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
const chai_1 = require("chai");
const PlainMessage_1 = require("../../../src/model/transaction/PlainMessage");
describe('PlainMessage', () => {
    it('should createComplete an empty message', () => {
        chai_1.expect(PlainMessage_1.EmptyMessage.payload).to.be.equal('');
    });
    it('should createComplete message from payload with constructor', () => {
        const payload = 'test-message';
        const message = new PlainMessage_1.PlainMessage(payload);
        chai_1.expect(message.payload).to.be.equal(payload);
    });
    it('should createComplete message from payload with static method', () => {
        const payload = '746573742D6D657373616765';
        const message = PlainMessage_1.PlainMessage.createFromPayload(payload);
        chai_1.expect(message.payload).to.be.equal('test-message');
    });
    it('should decode hex message', () => {
        const hexMessage = '746573742D6D657373616765';
        const decodedMessage = PlainMessage_1.PlainMessage.decodeHex(hexMessage);
        chai_1.expect(decodedMessage).to.be.equal('test-message');
    });
});
//# sourceMappingURL=PlainMessage.spec.js.map