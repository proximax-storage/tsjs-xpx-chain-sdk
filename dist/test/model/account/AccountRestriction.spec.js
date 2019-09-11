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
const AccountRestriction_1 = require("../../../src/model/account/AccountRestriction");
const Address_1 = require("../../../src/model/account/Address");
const RestrictionType_1 = require("../../../src/model/account/RestrictionType");
describe('AccountRestriction', () => {
    it('should createComplete an AccountRestriction object', () => {
        const accountRestrictionDTO = {
            restrictionType: RestrictionType_1.RestrictionType.AllowAddress,
            values: ['906415867F121D037AF447E711B0F5E4D52EBBF066D96860EB'],
        };
        const accountRestriction = new AccountRestriction_1.AccountRestriction(accountRestrictionDTO.restrictionType, accountRestrictionDTO.values.map((value) => {
            return Address_1.Address.createFromEncoded(value);
        }));
        chai_1.expect(accountRestriction.restrictionType).to.be.equal(accountRestrictionDTO.restrictionType);
        assert_1.deepEqual(accountRestriction.values.length, accountRestrictionDTO.values.length);
    });
});
//# sourceMappingURL=AccountRestriction.spec.js.map