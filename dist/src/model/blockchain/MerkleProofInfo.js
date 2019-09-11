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
 * The block merkle proof info
 */
class MerkleProofInfo {
    /**
     * @param payload - The merkle proof payload
     * @param type - The merkle proof type
     */
    constructor(/**
                 * The merkle proof payload
                 */ payload, 
    /**
     * The merkle proof type
     */
    type) {
        this.payload = payload;
        this.type = type;
    }
}
exports.MerkleProofInfo = MerkleProofInfo;
//# sourceMappingURL=MerkleProofInfo.js.map