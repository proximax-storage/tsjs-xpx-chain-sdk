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
 * When a transaction includes an alias, a so called resolution statement reflects the resolved value for that block:
 * - Address Resolution: An account alias was used in the block.
 * - Mosaic Resolution: A mosaic alias was used in the block.
 */
class ResolutionStatement {
    /**
     * Receipt - resolution statement object
     * @param height - The block height
     * @param unresolved - An unresolved address or unresolved mosaicId.
     * @param resolutionEntries - The array of resolution entries.
     */
    constructor(
    /**
     * The block height.
     */
    height, 
    /**
     * An unresolved address or unresolved mosaicId.
     */
    unresolved, 
    /**
     * The array of resolution entries.
     */
    resolutionEntries) {
        this.height = height;
        this.unresolved = unresolved;
        this.resolutionEntries = resolutionEntries;
    }
}
exports.ResolutionStatement = ResolutionStatement;
//# sourceMappingURL=ResolutionStatement.js.map