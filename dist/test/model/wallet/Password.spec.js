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
const Password_1 = require("../../../src/model/wallet/Password");
describe('Password', () => {
    it('should throw Error if Password is empty', () => {
        chai_1.expect(() => {
            new Password_1.Password('');
        }).to.throw(Error, 'Password must be at least 8 characters');
    });
    it('should be valid with at least 8 characters', () => {
        const password = new Password_1.Password('newvalidpassword');
        chai_1.expect(password.value).to.be.equal('newvalidpassword');
    });
    it('should throw Error if Password has less than 8 characters', () => {
        chai_1.expect(() => {
            new Password_1.Password('1234567');
        }).to.throw(Error, 'Password must be at least 8 characters');
    });
});
//# sourceMappingURL=Password.spec.js.map