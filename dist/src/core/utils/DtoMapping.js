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
const AccountProperties_1 = require("../../model/account/AccountProperties");
const AccountPropertiesInfo_1 = require("../../model/account/AccountPropertiesInfo");
const AccountProperty_1 = require("../../model/account/AccountProperty");
const Address_1 = require("../../model/account/Address");
const PropertyType_1 = require("../../model/account/PropertyType");
const MosaicId_1 = require("../../model/mosaic/MosaicId");
class DtoMapping {
    /**
     * Create AccountPropertyInfo class from Json.
     * @param {object} dataJson The account property json object.
     * @returns {module: model/Account/AccountPropertiesInfo} The AccountPropertiesInfo class.
     */
    static extractAccountPropertyFromDto(accountProperties) {
        return new AccountPropertiesInfo_1.AccountPropertiesInfo(accountProperties.meta, new AccountProperties_1.AccountProperties(Address_1.Address.createFromEncoded(accountProperties.accountProperties.address), accountProperties.accountProperties.properties.map((prop) => {
            switch (prop.propertyType) {
                case PropertyType_1.PropertyType.AllowAddress:
                case PropertyType_1.PropertyType.BlockAddress:
                    return new AccountProperty_1.AccountProperty(prop.propertyType, prop.values.map((value) => Address_1.Address.createFromEncoded(value)));
                case PropertyType_1.PropertyType.AllowMosaic:
                case PropertyType_1.PropertyType.BlockMosaic:
                    return new AccountProperty_1.AccountProperty(prop.propertyType, prop.values.map((value) => new MosaicId_1.MosaicId(value)));
                case PropertyType_1.PropertyType.AllowTransaction:
                case PropertyType_1.PropertyType.BlockTransaction:
                    return new AccountProperty_1.AccountProperty(prop.propertyType, prop.values);
                default:
                    throw new Error(`Invalid property type: ${prop.propertyType}`);
            }
        })));
    }
}
exports.DtoMapping = DtoMapping;
//# sourceMappingURL=DtoMapping.js.map