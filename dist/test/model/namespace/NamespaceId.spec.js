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
const Id_1 = require("../../../src/model/Id");
const NamespaceId_1 = require("../../../src/model/namespace/NamespaceId");
describe('NamespaceId', () => {
    it('should be created from root namespace name', () => {
        const id = new NamespaceId_1.NamespaceId('nem');
        assert_1.deepEqual(id.id, new Id_1.Id([929036875, 2226345261]));
        chai_1.expect(id.fullName).to.be.equal('nem');
    });
    it('should be created from subnamespace name ', () => {
        const id = new NamespaceId_1.NamespaceId('nem.subnem');
        assert_1.deepEqual(id.id, new Id_1.Id([373240754, 3827892399]));
        chai_1.expect(id.fullName).to.be.equal('nem.subnem');
    });
    it('should be created from id', () => {
        const id = new NamespaceId_1.NamespaceId([3646934825, 3576016193]);
        assert_1.deepEqual(id.id, new Id_1.Id([3646934825, 3576016193]));
        chai_1.expect(id.fullName).to.be.equal(undefined);
    });
    const vectors = [
        { encoded: '4bfa5f372d55b384', uint: [929036875, 2226345261] },
        { encoded: '08a12f89ee5a49f8', uint: [2301600008, 4165556974] },
        { encoded: '1f810565e8f4aeab', uint: [1694859551, 2880369896] },
        { encoded: '552d1c0a2bc9b8ae', uint: [169618773, 2931345707] },
        { encoded: 'bfca1440d49ae090', uint: [1075104447, 2430638804] },
        { encoded: 'ccf10b96814211ab', uint: [2517365196, 2870035073] },
    ];
    it('should be created from encoded vectors', () => {
        vectors.map(({ encoded, uint }) => {
            const fromHex = NamespaceId_1.NamespaceId.createFromEncoded(encoded.toUpperCase());
            const fromId = new NamespaceId_1.NamespaceId(uint);
            assert_1.deepEqual(fromId.id, fromHex.id);
        });
    });
});
//# sourceMappingURL=NamespaceId.spec.js.map