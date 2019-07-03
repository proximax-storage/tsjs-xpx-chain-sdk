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
const chai_1 = require("chai");
const Id_1 = require("../../src/model/Id");
describe('Id', () => {
    describe('toHex()', () => {
        it('should generate mosaic xem id', () => {
            const idName = new Id_1.Id([3646934825, 3576016193]).toHex();
            chai_1.expect(idName).to.be.equal('d525ad41d95fcf29');
        });
        it('should generate namespace nem id', () => {
            const idName = new Id_1.Id([929036875, 2226345261]).toHex();
            chai_1.expect(idName).to.be.equal('84b3552d375ffa4b');
        });
    });
    describe('fromHex()', () => {
        it('should createComplete from xem hex string', () => {
            const id = Id_1.Id.fromHex('d525ad41d95fcf29');
            chai_1.expect(id.lower).to.be.equal(3646934825);
            chai_1.expect(id.higher).to.be.equal(3576016193);
        });
        it('should createComplete from nem hex string', () => {
            const id = Id_1.Id.fromHex('84b3552d375ffa4b');
            chai_1.expect(id.lower).to.be.equal(929036875);
            chai_1.expect(id.higher).to.be.equal(2226345261);
        });
    });
});
//# sourceMappingURL=Id.spec.js.map