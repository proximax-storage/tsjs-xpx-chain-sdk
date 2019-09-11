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
const AccountRestriction_1 = require("../../../src/model/account/AccountRestriction");
const AccountRestrictions_1 = require("../../../src/model/account/AccountRestrictions");
const AccountRestrictionsInfo_1 = require("../../../src/model/account/AccountRestrictionsInfo");
const Address_1 = require("../../../src/model/account/Address");
const RestrictionModificationType_1 = require("../../../src/model/account/RestrictionModificationType");
const RestrictionType_1 = require("../../../src/model/account/RestrictionType");
describe('AccountRestrictionsInfo', () => {
    it('should createComplete an AccountRestrictionsInfo object', () => {
        const accountRestrictionsInfoDTO = {
            meta: { id: '12345' },
            accountRestrictions: {
                address: '9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142',
                restrictions: [{
                        restrictionType: RestrictionType_1.RestrictionType.AllowAddress,
                        values: [{ modificationType: RestrictionModificationType_1.RestrictionModificationType.Add,
                                value: 'SDUP5PLHDXKBX3UU5Q52LAY4WYEKGEWC6IB3VBFM',
                            }],
                    }],
            },
        };
        const accountRestrictionsInfo = new AccountRestrictionsInfo_1.AccountRestrictionsInfo(accountRestrictionsInfoDTO.meta, new AccountRestrictions_1.AccountRestrictions(Address_1.Address.createFromEncoded(accountRestrictionsInfoDTO.accountRestrictions.address), accountRestrictionsInfoDTO.accountRestrictions.restrictions.map((prop) => new AccountRestriction_1.AccountRestriction(prop.restrictionType, prop.values))));
        assert_1.deepEqual(accountRestrictionsInfo.meta.id, accountRestrictionsInfoDTO.meta.id);
        assert_1.deepEqual(accountRestrictionsInfo.accountRestrictions.address, Address_1.Address.createFromEncoded(accountRestrictionsInfoDTO.accountRestrictions.address));
        assert_1.deepEqual(accountRestrictionsInfo.accountRestrictions.restrictions.length, accountRestrictionsInfoDTO.accountRestrictions.restrictions.length);
        assert_1.deepEqual(accountRestrictionsInfo.accountRestrictions.restrictions[0].values[0], accountRestrictionsInfoDTO.accountRestrictions.restrictions[0].values[0]);
    });
});
//# sourceMappingURL=AccountRestrictionsInfo.spec.js.map