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
const AccountProperties_1 = require("../../../src/model/account/AccountProperties");
const AccountPropertiesInfo_1 = require("../../../src/model/account/AccountPropertiesInfo");
const AccountProperty_1 = require("../../../src/model/account/AccountProperty");
const Address_1 = require("../../../src/model/account/Address");
const PropertyModificationType_1 = require("../../../src/model/account/PropertyModificationType");
const PropertyType_1 = require("../../../src/model/account/PropertyType");
describe('AccountPropertiesInfo', () => {
    it('should createComplete an AccountPropertiesInfo object', () => {
        const accountPropertiesInfoDTO = {
            meta: { id: '12345' },
            accountProperties: {
                address: '9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142',
                properties: [{
                        propertyType: PropertyType_1.PropertyType.AllowAddress,
                        values: [{ modificationType: PropertyModificationType_1.PropertyModificationType.Add,
                                value: 'SDUP5PLHDXKBX3UU5Q52LAY4WYEKGEWC6IB3VBFM',
                            }],
                    }],
            },
        };
        const accountPropertiesInfo = new AccountPropertiesInfo_1.AccountPropertiesInfo(accountPropertiesInfoDTO.meta, new AccountProperties_1.AccountProperties(Address_1.Address.createFromEncoded(accountPropertiesInfoDTO.accountProperties.address), accountPropertiesInfoDTO.accountProperties.properties.map((prop) => new AccountProperty_1.AccountProperty(prop.propertyType, prop.values))));
        assert_1.deepEqual(accountPropertiesInfo.meta.id, accountPropertiesInfoDTO.meta.id);
        assert_1.deepEqual(accountPropertiesInfo.accountProperties.address, Address_1.Address.createFromEncoded(accountPropertiesInfoDTO.accountProperties.address));
        assert_1.deepEqual(accountPropertiesInfo.accountProperties.properties.length, accountPropertiesInfoDTO.accountProperties.properties.length);
        assert_1.deepEqual(accountPropertiesInfo.accountProperties.properties[0].values.length, accountPropertiesInfoDTO.accountProperties.properties[0].values.length);
    });
});
//# sourceMappingURL=AccountPropertiesInfo.spec.js.map