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
const assert_1 = require("assert");
const chai_1 = require("chai");
const NamespaceName_1 = require("../../../src/model/namespace/NamespaceName");
const NamespaceId_1 = require("../../../src/model/namespace/NamespaceId");
describe('NamespaceName', () => {
    it('should createComplete an NamespaceName object', () => {
        const namespaceNameDTO = {
            name: 'nem',
            namespaceId: new NamespaceId_1.NamespaceId([929036875, 2226345261]),
            parentId: new NamespaceId_1.NamespaceId([1431234233, 1324322333]),
        };
        const namespaceName = new NamespaceName_1.NamespaceName(namespaceNameDTO.namespaceId, namespaceNameDTO.name, namespaceNameDTO.parentId);
        assert_1.deepEqual(namespaceName.namespaceId, namespaceNameDTO.namespaceId);
        assert_1.deepEqual(namespaceName.parentId, namespaceNameDTO.parentId);
        chai_1.expect(namespaceName.name).to.be.equal(namespaceNameDTO.name);
    });
});
//# sourceMappingURL=NamespaceName.spec.js.map