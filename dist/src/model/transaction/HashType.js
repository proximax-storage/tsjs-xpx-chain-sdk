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
/**
 * Hash type. Supported types are:
 * 0: Op_Sha3_256 (default).
 * 1: Op_Keccak_256 (ETH compatibility).
 * 2: Op_Hash_160 (first with SHA-256 and then with RIPEMD-160 (BTC compatibility))
 * 3: Op_Hash_256: input is hashed twice with SHA-256 (BTC compatibility)
 */
const format_1 = require("../../core/format");
var HashType;
(function (HashType) {
    HashType[HashType["Op_Sha3_256"] = 0] = "Op_Sha3_256";
    HashType[HashType["Op_Keccak_256"] = 1] = "Op_Keccak_256";
    HashType[HashType["Op_Hash_160"] = 2] = "Op_Hash_160";
    HashType[HashType["Op_Hash_256"] = 3] = "Op_Hash_256";
})(HashType = exports.HashType || (exports.HashType = {}));
function HashTypeLengthValidator(hashType, input) {
    if (format_1.Convert.isHexString(input)) {
        switch (hashType) {
            case HashType.Op_Sha3_256:
            case HashType.Op_Hash_256:
            case HashType.Op_Keccak_256:
                return input.length === 64;
            case HashType.Op_Hash_160:
                return input.length === 40 || input.length === 64;
            default:
                break;
        }
    }
    return false;
}
exports.HashTypeLengthValidator = HashTypeLengthValidator;
//# sourceMappingURL=HashType.js.map