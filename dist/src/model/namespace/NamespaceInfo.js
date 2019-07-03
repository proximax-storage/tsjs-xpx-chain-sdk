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
 * Object containing information of a namespace.
 */
class NamespaceInfo {
    /**
     * @param active
     * @param index
     * @param metaId
     * @param type
     * @param depth
     * @param levels
     * @param parentId
     * @param owner
     * @param startHeight
     * @param endHeight
     */
    constructor(/**
                 * Namespace is active.
                 */ active, 
    /**
     * The namespace index.
     */
    index, 
    /**
     * The meta data id.
     */
    metaId, 
    /**
     * The namespace type, namespace and sub namespace.
     */
    type, 
    /**
     * The level of namespace.
     */
    depth, 
    /**
     * The namespace id levels.
     */
    levels, 
    /**
     * The namespace parent id.
     */
    parentId, 
    /**
     * The owner of the namespace.
     */
    owner, 
    /**
     * The height at which the ownership begins.
     */
    startHeight, 
    /**
     * The height at which the ownership ends.
     */
    endHeight, 
    /**
     * The alias linked to a namespace.
     */
    alias) {
        this.active = active;
        this.index = index;
        this.metaId = metaId;
        this.type = type;
        this.depth = depth;
        this.levels = levels;
        this.parentId = parentId;
        this.owner = owner;
        this.startHeight = startHeight;
        this.endHeight = endHeight;
        this.alias = alias;
    }
    /**
     * Namespace id
     * @returns {Id}
     */
    get id() {
        return this.levels[this.levels.length - 1];
    }
    /**
     * Is root namespace
     * @returns {boolean}
     */
    isRoot() {
        return this.type === 0;
    }
    /**
     * Is sub namepsace
     * @returns {boolean}
     */
    isSubnamespace() {
        return this.type === 1;
    }
    /**
     * Has alias
     * @returns {boolean}
     */
    hasAlias() {
        return this.alias.type !== 0;
    }
    /**
     * Get parent id
     * @returns {Id}
     */
    parentNamespaceId() {
        if (this.isRoot()) {
            throw new Error('Is a Root Namespace');
        }
        return this.parentId;
    }
}
exports.NamespaceInfo = NamespaceInfo;
//# sourceMappingURL=NamespaceInfo.js.map