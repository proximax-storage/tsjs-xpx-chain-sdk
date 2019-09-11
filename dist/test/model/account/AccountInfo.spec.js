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
const AccountInfo_1 = require("../../../src/model/account/AccountInfo");
const Address_1 = require("../../../src/model/account/Address");
const PublicAccount_1 = require("../../../src/model/account/PublicAccount");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const Mosaic_1 = require("../../../src/model/mosaic/Mosaic");
const UInt64_1 = require("../../../src/model/UInt64");
const MosaicId_1 = require("../../../src/model/mosaic/MosaicId");
describe('AccountInfo', () => {
    it('should createComplete an AccountInfo object', () => {
        const accountInfoDTO = {
            account: {
                address: Address_1.Address.createFromEncoded('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142'),
                addressHeight: new UInt64_1.UInt64([1, 0]),
                importance: new UInt64_1.UInt64([405653170, 0]),
                importanceHeight: new UInt64_1.UInt64([6462, 0]),
                mosaics: [{
                        amount: new UInt64_1.UInt64([1830592442, 94387]),
                        id: new MosaicId_1.MosaicId([3646934825, 3576016193]),
                    }],
                publicKey: '846B4439154579A5903B1459C9CF69CB8153F6D0110A7A0ED61DE29AE4810BF2',
                publicKeyHeight: new UInt64_1.UInt64([13, 0]),
            },
            meta: {},
        };
        const accountInfo = new AccountInfo_1.AccountInfo(accountInfoDTO.meta, accountInfoDTO.account.address, accountInfoDTO.account.addressHeight, accountInfoDTO.account.publicKey, accountInfoDTO.account.publicKeyHeight, accountInfoDTO.account.mosaics.map((mosaicDTO) => new Mosaic_1.Mosaic(mosaicDTO.id, mosaicDTO.amount)));
        chai_1.expect(accountInfo.meta).to.be.equal(accountInfoDTO.meta);
        assert_1.deepEqual(accountInfo.address, accountInfoDTO.account.address);
        assert_1.deepEqual(accountInfo.addressHeight, accountInfoDTO.account.addressHeight);
        chai_1.expect(accountInfo.publicKey).to.be.equal(accountInfoDTO.account.publicKey);
        assert_1.deepEqual(accountInfo.publicKeyHeight, accountInfoDTO.account.publicKeyHeight);
        assert_1.deepEqual(accountInfo.publicAccount, PublicAccount_1.PublicAccount.createFromPublicKey(accountInfoDTO.account.publicKey, NetworkType_1.NetworkType.MIJIN_TEST));
    });
});
//# sourceMappingURL=AccountInfo.spec.js.map