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
import {deepStrictEqual} from 'assert';
import {expect} from 'chai';
import {PublicAccount} from '../../../src/model/account/PublicAccount';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicNonce} from '../../../src/model/mosaic/MosaicNonce';

describe('MosaicNonce', () => {

    it('should be created from Uint8Array', () => {
        const nonce = new MosaicNonce(new Uint8Array([0x12, 0x34, 0x56, 0x78]));
        deepStrictEqual(nonce.nonce, new Uint8Array([0x12, 0x34, 0x56, 0x78]));
        deepStrictEqual(nonce.toDTO(), new Uint8Array([0x12, 0x34, 0x56, 0x78]));
    });

    it('should create random nonce', () => {
        const nonce = MosaicNonce.createRandom();
        expect(nonce.nonce).to.not.be.null;
    });

    it('should create random nonce twice not the same', () => {
        const nonce1 = MosaicNonce.createRandom();
        const nonce2 = MosaicNonce.createRandom();
        expect(nonce1.nonce).to.not.be.null;
        expect(nonce2.nonce).to.not.be.null;
        expect(nonce2.nonce).to.not.be.equal(nonce1.nonce);
    });

    it('should create nonce from hexadecimal notation', () => {
        const nonce = MosaicNonce.createFromHex('12345678');
        expect(nonce.nonce).to.not.be.null;
        deepStrictEqual(nonce.nonce, new Uint8Array([0x12, 0x34, 0x56, 0x78]));
    });
});
