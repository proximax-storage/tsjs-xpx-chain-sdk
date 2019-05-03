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
const chai_1 = require("chai");
const EncryptedMessage_1 = require("../../../src/model/transaction/EncryptedMessage");
const conf_spec_1 = require("../../conf/conf.spec");
describe('EncryptedMessage', () => {
    let account;
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    it('should create a encrypted message from a DTO', () => {
        const encryptedMessage = EncryptedMessage_1.EncryptedMessage.createFromDTO('test transaction');
        chai_1.expect(encryptedMessage.payload).to.be.equal('test transaction');
    });
    it('should return encrypted message dto', () => {
        ;
        const encryptedMessage = account.encryptMessage('test transaction', account.publicAccount);
        const plainMessage = account.decryptMessage(encryptedMessage, account.publicAccount);
        chai_1.expect(plainMessage.payload).to.be.equal('test transaction');
    });
    it('should create an encrypted message from a DTO and decrypt it', () => {
        const encryptMessage = EncryptedMessage_1.EncryptedMessage
            .createFromDTO('7245170507448c53d808524221b5d157e19b06f574120a044e48f54dd8e0a4dedbf50ded7ae71' +
            'b90b59949bb6acde81d987ee6648aae9f093b94ac7cc3e8dba0bed8fa04ba286df6b32d2d6d21cbdc4e');
        const plainMessage = account.decryptMessage(encryptMessage, account.publicAccount);
        chai_1.expect(plainMessage.payload).to.be.equal('test transaction');
    });
});
//# sourceMappingURL=EncryptedMessage.spec.js.map