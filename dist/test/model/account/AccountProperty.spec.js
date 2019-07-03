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
const AccountProperty_1 = require("../../../src/model/account/AccountProperty");
const Address_1 = require("../../../src/model/account/Address");
const PropertyType_1 = require("../../../src/model/account/PropertyType");
describe('AccountProperty', () => {
    it('should createComplete an AccountProperty object', () => {
        const accountPropertyDTO = {
            propertyType: PropertyType_1.PropertyType.AllowAddress,
            values: ['906415867F121D037AF447E711B0F5E4D52EBBF066D96860EB'],
        };
        const accountProperty = new AccountProperty_1.AccountProperty(accountPropertyDTO.propertyType, accountPropertyDTO.values.map((value) => {
            return Address_1.Address.createFromEncoded(value);
        }));
        chai_1.expect(accountProperty.propertyType).to.be.equal(accountPropertyDTO.propertyType);
        assert_1.deepEqual(accountProperty.values.length, accountPropertyDTO.values.length);
    });
});
//# sourceMappingURL=AccountProperty.spec.js.map