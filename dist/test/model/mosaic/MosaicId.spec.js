"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const assert_1 = require("assert");
const PublicAccount_1 = require("../../../src/model/account/PublicAccount");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const Id_1 = require("../../../src/model/Id");
const MosaicId_1 = require("../../../src/model/mosaic/MosaicId");
const MosaicNonce_1 = require("../../../src/model/mosaic/MosaicNonce");
describe('MosaicId', () => {
    const publicKey = 'b4f12e7c9f6946091e2cb8b6d3a12b50d17ccbbf646386ea27ce2946a7423dcf';
    it('should be created from id', () => {
        const id = new MosaicId_1.MosaicId([3294802500, 2243684972]);
        assert_1.deepEqual(id.id, new Id_1.Id([3294802500, 2243684972]));
    });
    it('should be created from id', () => {
        const id = new MosaicId_1.MosaicId('85BBEA6CC462B244');
        assert_1.deepEqual(id.id, new Id_1.Id([3294802500, 2243684972]));
    });
    it('should create id given nonce and owner', () => {
        const owner = PublicAccount_1.PublicAccount.createFromPublicKey(publicKey, NetworkType_1.NetworkType.MIJIN_TEST);
        const bytes = new Uint8Array([0x0, 0x0, 0x0, 0x0]);
        const id = MosaicId_1.MosaicId.createFromNonce(new MosaicNonce_1.MosaicNonce(bytes), owner);
        assert_1.deepEqual(id.id, new Id_1.Id([481110499, 231112638]));
    });
    it('should create id given nonce and owner, too', () => {
        const owner = PublicAccount_1.PublicAccount.createFromPublicKey('4AFF7B4BA8C1C26A7917575993346627CB6C80DE62CD92F7F9AEDB7064A3DE62', NetworkType_1.NetworkType.MIJIN_TEST);
        const bytes = new Uint8Array([0x78, 0xE3, 0x6F, 0xB7]);
        const id = MosaicId_1.MosaicId.createFromNonce(new MosaicNonce_1.MosaicNonce(bytes), owner);
        assert_1.deepEqual(id.id, new Id_1.Id([0xC0AFC518, 0x3AD842A8]));
    });
    it('should create id twice the same given nonce and owner', () => {
        const owner = PublicAccount_1.PublicAccount.createFromPublicKey(publicKey, NetworkType_1.NetworkType.MIJIN_TEST);
        const bytes = new Uint8Array([0x0, 0x0, 0x0, 0x0]);
        const id1 = MosaicId_1.MosaicId.createFromNonce(new MosaicNonce_1.MosaicNonce(bytes), owner);
        const id2 = MosaicId_1.MosaicId.createFromNonce(new MosaicNonce_1.MosaicNonce(bytes), owner);
        assert_1.deepEqual(id1.id, id2.id);
    });
});
//# sourceMappingURL=MosaicId.spec.js.map