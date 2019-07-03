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
const crypto_1 = require("../../core/crypto");
const format_1 = require("../../core/format");
class NamespaceMosaicIdGenerator {
}
/**
 * @returns mosaic Id
 */
NamespaceMosaicIdGenerator.mosaicId = (nonce, ownerPublicId) => {
    return format_1.IdGenerator.generateMosaicId(nonce, ownerPublicId);
};
/**
 * @returns random mosaic nonce
 */
NamespaceMosaicIdGenerator.generateRandomMosaicNonce = () => {
    return crypto_1.Crypto.randomBytes(4);
};
/**
 * @param {string} namespaceName - The namespace name
 * @returns sub namespace id
 */
NamespaceMosaicIdGenerator.namespaceId = (namespaceName) => {
    const path = format_1.IdGenerator.generateNamespacePath(namespaceName);
    return path.length ? format_1.IdGenerator.generateNamespacePath(namespaceName)[path.length - 1] : [];
};
/**
 * @param {string} parentNamespaceName - The parent namespace name
 * @param {string} namespaceName - The namespace name
 * @returns sub namespace parent id
 */
NamespaceMosaicIdGenerator.subnamespaceParentId = (parentNamespaceName, namespaceName) => {
    const path = format_1.IdGenerator.generateNamespacePath(`${parentNamespaceName}.${namespaceName}`);
    return format_1.IdGenerator.generateNamespacePath(parentNamespaceName)[path.length - 2];
};
/**
 * @param {string} parentNamespaceName - The parent namespace name
 * @param {string} namespaceName - The namespace name
 * @returns sub namespace id
 */
NamespaceMosaicIdGenerator.subnamespaceNamespaceId = (parentNamespaceName, namespaceName) => {
    const path = format_1.IdGenerator.generateNamespacePath(`${parentNamespaceName}.${namespaceName}`);
    return path[path.length - 1];
};
exports.NamespaceMosaicIdGenerator = NamespaceMosaicIdGenerator;
//# sourceMappingURL=NamespaceMosaicIdGenerator.js.map