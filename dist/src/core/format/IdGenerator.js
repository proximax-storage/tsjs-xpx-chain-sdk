"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const js_sha3_1 = require("js-sha3");
const utilities = require("./Utilities");
class IdGenerator {
}
/**
 * Generates a mosaic id given a nonce and a public id.
 * @param {object} nonce The mosaic nonce.
 * @param {object} ownerPublicId The public id.
 * @returns {module:coders/uint64~uint64} The mosaic id.
 */
IdGenerator.generateMosaicId = (nonce, ownerPublicId) => {
    const hash = js_sha3_1.sha3_256.create();
    hash.update(nonce);
    hash.update(ownerPublicId);
    const result = new Uint32Array(hash.arrayBuffer());
    return [result[0], result[1] & 0x7FFFFFFF];
};
/**
 * Parses a unified namespace name into a path.
 * @param {string} name The unified namespace name.
 * @returns {array<module:coders/uint64~uint64>} The namespace path.
 */
IdGenerator.generateNamespacePath = (name) => {
    if (0 >= name.length) {
        utilities.throwInvalidFqn('having zero length', name);
    }
    let namespaceId = utilities.idGeneratorConst.namespace_base_id;
    const path = [];
    const start = utilities.split(name, (substringStart, size) => {
        namespaceId = utilities.generateNamespaceId(namespaceId, utilities.extractPartName(name, substringStart, size));
        utilities.append(path, namespaceId, name);
    });
    namespaceId = utilities.generateNamespaceId(namespaceId, utilities.extractPartName(name, start, name.length - start));
    utilities.append(path, namespaceId, name);
    return path;
};
exports.IdGenerator = IdGenerator;
//# sourceMappingURL=IdGenerator.js.map