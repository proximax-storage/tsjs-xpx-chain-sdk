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
const Receipt_1 = require("./Receipt");
/**
 * Artifact Expiry: An artifact (e.g. namespace, mosaic) expired.
 */
class ArtifactExpiryReceipt extends Receipt_1.Receipt {
    /**
     * Artifact expiry receipt
     * @param artifactId -The id of the artifact (eg. namespace, mosaic).
     * @param version - The receipt version
     * @param type - The receipt type
     * @param size - the receipt size
     */
    constructor(artifactId, version, type, size) {
        super(version, type, size);
        this.artifactId = artifactId;
    }
}
exports.ArtifactExpiryReceipt = ArtifactExpiryReceipt;
//# sourceMappingURL=ArtifactExpiryReceipt.js.map