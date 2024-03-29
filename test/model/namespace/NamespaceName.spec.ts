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

import {deepStrictEqual} from 'assert';
import {expect} from 'chai';
import {NamespaceName} from '../../../src/model/namespace/NamespaceName';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';

describe('NamespaceName', () => {

    it('should createComplete an NamespaceName object', () => {
        const namespaceNameDTO = {
            name: 'nem',
            namespaceId: new NamespaceId([929036875, 2226345261]),
            parentId: new NamespaceId([1431234233, 1324322333]),
        };

        const namespaceName = new NamespaceName(
            namespaceNameDTO.namespaceId,
            namespaceNameDTO.name,
            namespaceNameDTO.parentId,
        );

        deepStrictEqual(namespaceName.namespaceId, namespaceNameDTO.namespaceId);
        deepStrictEqual(namespaceName.parentId, namespaceNameDTO.parentId);
        expect(namespaceName.name).to.be.equal(namespaceNameDTO.name);
    });
});
