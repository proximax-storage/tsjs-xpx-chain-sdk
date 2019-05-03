"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const assert_1 = require("assert");
const chai_1 = require("chai");
const MosaicNonce_1 = require("../../../src/model/mosaic/MosaicNonce");
describe('MosaicNonce', () => {
    it('should be created from Uint8Array', () => {
        const nonce = new MosaicNonce_1.MosaicNonce(new Uint8Array([0x0, 0x0, 0x0, 0x0]));
        assert_1.deepEqual(nonce.nonce, new Uint8Array([0x0, 0x0, 0x0, 0x0]));
        assert_1.deepEqual(nonce.toDTO(), [0, 0, 0, 0]);
    });
    it('should create random nonce', () => {
        const nonce = MosaicNonce_1.MosaicNonce.createRandom();
        chai_1.expect(nonce.nonce).to.not.be.null;
    });
    it('should create random nonce twice not the same', () => {
        const nonce1 = MosaicNonce_1.MosaicNonce.createRandom();
        const nonce2 = MosaicNonce_1.MosaicNonce.createRandom();
        chai_1.expect(nonce1.nonce).to.not.be.null;
        chai_1.expect(nonce2.nonce).to.not.be.null;
        chai_1.expect(nonce2.nonce).to.not.be.equal(nonce1.nonce);
    });
    it('should create nonce from hexadecimal notation', () => {
        const nonce = MosaicNonce_1.MosaicNonce.createFromHex('00000000');
        chai_1.expect(nonce.nonce).to.not.be.null;
        assert_1.deepEqual(nonce.nonce, new Uint8Array([0x0, 0x0, 0x0, 0x0]));
    });
});
//# sourceMappingURL=MosaicNonce.spec.js.map