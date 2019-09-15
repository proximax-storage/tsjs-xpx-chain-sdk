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
<<<<<<< HEAD
const AccountRestriction_1 = require("../../model/account/AccountRestriction");
const AccountRestrictions_1 = require("../../model/account/AccountRestrictions");
const AccountRestrictionsInfo_1 = require("../../model/account/AccountRestrictionsInfo");
const Address_1 = require("../../model/account/Address");
const RestrictionType_1 = require("../../model/account/RestrictionType");
const MosaicId_1 = require("../../model/mosaic/MosaicId");
class DtoMapping {
    /**
     * Create AccountRestrictionsInfo class from Json.
     * @param {object} dataJson The account restriction json object.
     * @returns {module: model/Account/AccountRestrictionsInfo} The AccountRestrictionsInfo class.
     */
    static extractAccountRestrictionFromDto(accountRestrictions) {
        return new AccountRestrictionsInfo_1.AccountRestrictionsInfo(accountRestrictions.meta, new AccountRestrictions_1.AccountRestrictions(Address_1.Address.createFromEncoded(accountRestrictions.accountRestrictions.address), accountRestrictions.accountRestrictions.restrictions.map((prop) => {
            switch (prop.restrictionType) {
                case RestrictionType_1.RestrictionType.AllowAddress:
                case RestrictionType_1.RestrictionType.BlockAddress:
                    return new AccountRestriction_1.AccountRestriction(prop.restrictionType, prop.values.map((value) => Address_1.Address.createFromEncoded(value)));
                case RestrictionType_1.RestrictionType.AllowMosaic:
                case RestrictionType_1.RestrictionType.BlockMosaic:
                    return new AccountRestriction_1.AccountRestriction(prop.restrictionType, prop.values.map((value) => new MosaicId_1.MosaicId(value)));
                case RestrictionType_1.RestrictionType.AllowTransaction:
                case RestrictionType_1.RestrictionType.BlockTransaction:
                    return new AccountRestriction_1.AccountRestriction(prop.restrictionType, prop.values);
                default:
                    throw new Error(`Invalid restriction type: ${prop.restrictionType}`);
=======
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
>>>>>>> jwt
            }
        })));
    }
}
exports.DtoMapping = DtoMapping;
//# sourceMappingURL=DtoMapping.js.map