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
/**
 * Account property type
 * 0x01	The property type is an address.
 * 0x02	The property type is mosaic id.
 * 0x03	The property type is a transaction type.
 * 0x04	Property type sentinel.
 * 0x80 + type	The property is interpreted as a blocking operation.
 */
var PropertyType;
(function (PropertyType) {
    PropertyType[PropertyType["AllowAddress"] = 1] = "AllowAddress";
    PropertyType[PropertyType["AllowMosaic"] = 2] = "AllowMosaic";
    PropertyType[PropertyType["AllowTransaction"] = 4] = "AllowTransaction";
    PropertyType[PropertyType["Sentinel"] = 5] = "Sentinel";
    PropertyType[PropertyType["BlockAddress"] = 129] = "BlockAddress";
    PropertyType[PropertyType["BlockMosaic"] = 130] = "BlockMosaic";
    PropertyType[PropertyType["BlockTransaction"] = 132] = "BlockTransaction";
})(PropertyType = exports.PropertyType || (exports.PropertyType = {}));
//# sourceMappingURL=PropertyType.js.map