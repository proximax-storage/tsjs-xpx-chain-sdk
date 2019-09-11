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
const Address_1 = require("../../../src/model/account/Address");
const model_1 = require("../../../src/model/model");
describe('AccountRestrictions', () => {
    it('should createComplete an AccountRestrictions object', () => {
        const accountRestrictionsDTO = {
            address: Address_1.Address.createFromEncoded('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142'),
            restrictions: [{
                    restrictionType: model_1.RestrictionType.AllowAddress,
                    values: [{ modificationType: model_1.RestrictionModificationType.Add,
                            value: 'SDUP5PLHDXKBX3UU5Q52LAY4WYEKGEWC6IB3VBFM',
                        }],
                }],
        };
        const accountRestrictions = new model_1.AccountRestrictions(accountRestrictionsDTO.address, accountRestrictionsDTO.restrictions.map((r) => {
            return new model_1.AccountRestriction(r.restrictionType, r.values);
        }));
        chai_1.expect(accountRestrictions.address).to.be.equal(accountRestrictionsDTO.address);
        assert_1.deepEqual(accountRestrictions.restrictions.length, accountRestrictionsDTO.restrictions.length);
        assert_1.deepEqual(accountRestrictions.restrictions[0].restrictionType, accountRestrictionsDTO.restrictions[0].restrictionType);
        assert_1.deepEqual(accountRestrictions.restrictions[0].values.length, accountRestrictionsDTO.restrictions[0].values.length);
        assert_1.deepEqual(accountRestrictions.restrictions[0].values[0].modificationType, accountRestrictionsDTO.restrictions[0].values[0].modificationType);
        assert_1.deepEqual(accountRestrictions.restrictions[0].values[0].value, accountRestrictionsDTO.restrictions[0].values[0].value);
    });
});
//# sourceMappingURL=AccountRestrictions.spec.js.map