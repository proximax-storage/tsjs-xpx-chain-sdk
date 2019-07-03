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
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
describe('NetworkType', () => {
    it('MAIN_NET is 0xb8', () => {
        chai_1.expect(NetworkType_1.NetworkType.MAIN_NET).to.be.equal(0xb8);
        chai_1.expect(NetworkType_1.NetworkType.MAIN_NET).to.be.equal(184);
    });
    it('TEST_NET is 0xa8', () => {
        chai_1.expect(NetworkType_1.NetworkType.TEST_NET).to.be.equal(0xa8);
        chai_1.expect(NetworkType_1.NetworkType.TEST_NET).to.be.equal(168);
    });
    it('PRIVATE is 0xc8', () => {
        chai_1.expect(NetworkType_1.NetworkType.PRIVATE).to.be.equal(0xc8);
        chai_1.expect(NetworkType_1.NetworkType.PRIVATE).to.be.equal(200);
    });
    it('PRIVATE_TEST is 0xb0', () => {
        chai_1.expect(NetworkType_1.NetworkType.PRIVATE_TEST).to.be.equal(0xb0);
        chai_1.expect(NetworkType_1.NetworkType.PRIVATE_TEST).to.be.equal(176);
    });
    it('MIJIN is 0x60', () => {
        chai_1.expect(NetworkType_1.NetworkType.MIJIN).to.be.equal(0x60);
        chai_1.expect(NetworkType_1.NetworkType.MIJIN).to.be.equal(96);
    });
    it('MIJIN_TEST is 0x90', () => {
        chai_1.expect(NetworkType_1.NetworkType.MIJIN_TEST).to.be.equal(0x90);
        chai_1.expect(NetworkType_1.NetworkType.MIJIN_TEST).to.be.equal(144);
    });
});
//# sourceMappingURL=NetworkType.spec.js.map