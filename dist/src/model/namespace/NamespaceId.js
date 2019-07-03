"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const format_1 = require("../../core/format");
const NamespaceMosaicIdGenerator_1 = require("../../infrastructure/transaction/NamespaceMosaicIdGenerator");
const Id_1 = require("../Id");
/**
 * The namespace id structure describes namespace id
 *
 * @since 1.0
 */
class NamespaceId {
    /**
     * Create NamespaceId from namespace string name (ex: nem or domain.subdom.subdome)
     * or id in form of array number (ex: [929036875, 2226345261])
     *
     * @param id
     */
    constructor(id) {
        if (id instanceof Array) {
            this.id = new Id_1.Id(id);
        }
        else if (typeof id === 'string') {
            this.fullName = id;
            this.id = new Id_1.Id(NamespaceMosaicIdGenerator_1.NamespaceMosaicIdGenerator.namespaceId(id));
        }
    }
    /**
     * Create a NamespaceId object from its encoded hexadecimal notation.
     * @param encoded
     * @returns {NamespaceId}
     */
    static createFromEncoded(encoded) {
        const uint = format_1.Convert.hexToUint8(encoded).reverse();
        const hex = format_1.Convert.uint8ToHex(uint);
        const namespace = new NamespaceId(Id_1.Id.fromHex(hex).toDTO());
        return namespace;
    }
    /**
     * Get string value of id
     * @returns {string}
     */
    toHex() {
        return this.id.toHex();
    }
    /**
     * Compares namespaceIds for equality.
     *
     * @return boolean
     */
    equals(id) {
        if (id instanceof NamespaceId) {
            return this.id.equals(id.id);
        }
        return false;
    }
    /**
     * Create DTO object
     */
    toDTO() {
        return {
            id: this.id.toDTO(),
            fullName: this.fullName ? this.fullName : '',
        };
    }
}
exports.NamespaceId = NamespaceId;
//# sourceMappingURL=NamespaceId.js.map