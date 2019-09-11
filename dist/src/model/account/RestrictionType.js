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
 * Account restriction type
 * 0x01	The restriction type is an address.
 * 0x02	The restriction type is mosaic id.
 * 0x03	The restriction type is a transaction type.
 * 0x04	restriction type sentinel.
 * 0x80 + type	The restriction is interpreted as a blocking operation.
 */
var RestrictionType;
(function (RestrictionType) {
    RestrictionType[RestrictionType["AllowAddress"] = 1] = "AllowAddress";
    RestrictionType[RestrictionType["AllowMosaic"] = 2] = "AllowMosaic";
    RestrictionType[RestrictionType["AllowTransaction"] = 4] = "AllowTransaction";
    RestrictionType[RestrictionType["Sentinel"] = 5] = "Sentinel";
    RestrictionType[RestrictionType["BlockAddress"] = 129] = "BlockAddress";
    RestrictionType[RestrictionType["BlockMosaic"] = 130] = "BlockMosaic";
    RestrictionType[RestrictionType["BlockTransaction"] = 132] = "BlockTransaction";
})(RestrictionType = exports.RestrictionType || (exports.RestrictionType = {}));
//# sourceMappingURL=RestrictionType.js.map