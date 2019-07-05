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
const js_sha3_1 = require("js-sha3");
const format_1 = require("../format");
const SignSchema_1 = require("./SignSchema");
class SHA3Hasher {
}
/**
 * Calculates the hash of data.
 * @param {Uint8Array} dest The computed hash destination.
 * @param {Uint8Array} data The data to hash.
 * @param {numeric} length The hash length in bytes.
 * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
 */
SHA3Hasher.func = (dest, data, length, signSchema = SignSchema_1.SignSchema.SHA3) => {
    const hasher = SHA3Hasher.getHasher(length, signSchema);
    const hash = hasher.arrayBuffer(data);
    format_1.RawArray.copy(dest, format_1.RawArray.uint8View(hash));
};
/**
 * Creates a hasher object.
 * @param {numeric} length The hash length in bytes.
 * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
 * @returns {object} The hasher.
 */
SHA3Hasher.createHasher = (length = 64, signSchema = SignSchema_1.SignSchema.SHA3) => {
    let hash;
    return {
        reset: () => {
            hash = SHA3Hasher.getHasher(length, signSchema).create();
        },
        update: (data) => {
            if (data instanceof Uint8Array) {
                hash.update(data);
            }
            else if ('string' === typeof data) {
                hash.update(format_1.Convert.hexToUint8(data));
            }
            else {
                throw Error('unsupported data type');
            }
        },
        finalize: (result) => {
            format_1.RawArray.copy(result, format_1.RawArray.uint8View(hash.arrayBuffer()));
        },
    };
};
/**
 * Get a hasher instance.
 * @param {numeric} length The hash length in bytes.
 * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
 * @returns {object} The hasher.
 */
SHA3Hasher.getHasher = (length = 64, signSchema = SignSchema_1.SignSchema.SHA3) => {
    return {
        32: signSchema === SignSchema_1.SignSchema.SHA3 ? js_sha3_1.sha3_256 : js_sha3_1.keccak256,
        64: signSchema === SignSchema_1.SignSchema.SHA3 ? js_sha3_1.sha3_512 : js_sha3_1.keccak512,
    }[length];
};
exports.SHA3Hasher = SHA3Hasher;
//# sourceMappingURL=SHA3Hasher.js.map