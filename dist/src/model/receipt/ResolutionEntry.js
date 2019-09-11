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
 * The receipt source object.
 */
class ResolutionEntry {
    /**
     * @constructor
     * @param resolved - A resolved address or resolved mosaicId (alias).
     * @param source - The receipt source.
     */
    constructor(
    /**
     * A resolved address or resolved mosaicId (alias).
     */
    resolved, 
    /**
     * The receipt source.
     */
    source) {
        this.resolved = resolved;
        this.source = source;
    }
}
exports.ResolutionEntry = ResolutionEntry;
//# sourceMappingURL=ResolutionEntry.js.map