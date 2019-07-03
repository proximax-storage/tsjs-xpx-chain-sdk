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
const Address_1 = require("../../../src/model/account/Address");
const MosaicId_1 = require("../../../src/model/mosaic/MosaicId");
const AddressAlias_1 = require("../../../src/model/namespace/AddressAlias");
const AliasType_1 = require("../../../src/model/namespace/AliasType");
const EmptyAlias_1 = require("../../../src/model/namespace/EmptyAlias");
const MosaicAlias_1 = require("../../../src/model/namespace/MosaicAlias");
describe('Alias', () => {
    let emptyAliasDTO;
    let addressAliasDTO;
    let mosaicAliasDTO;
    let address;
    let address2;
    before(() => {
        address = Address_1.Address.createFromRawAddress('SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2');
        address2 = Address_1.Address.createFromRawAddress('SARNASAS2BIAB6LMFA3FPMGBPGIJGK6IJETM3ZSP');
        emptyAliasDTO = {
            type: 0,
        };
        mosaicAliasDTO = {
            type: AliasType_1.AliasType.Mosaic,
            mosaicId: new MosaicId_1.MosaicId([481110499, 231112638]),
        };
        addressAliasDTO = {
            type: AliasType_1.AliasType.Address,
            address,
        };
    });
    it('should create an EmptyAlias object', () => {
        const alias = new EmptyAlias_1.EmptyAlias();
        chai_1.expect(alias.type).to.be.equal(AliasType_1.AliasType.None);
    });
    it('should create a AddressAlias object', () => {
        const alias = new AddressAlias_1.AddressAlias(addressAliasDTO.type, addressAliasDTO.address);
        chai_1.expect(alias.type).to.be.equal(AliasType_1.AliasType.Address);
        chai_1.expect(alias.address).to.be.equal(addressAliasDTO.address);
    });
    it('should create a MosaicAlias object', () => {
        const alias = new MosaicAlias_1.MosaicAlias(mosaicAliasDTO.type, mosaicAliasDTO.mosaicId);
        chai_1.expect(alias.type).to.be.equal(AliasType_1.AliasType.Mosaic);
        chai_1.expect(alias.mosaicId).to.be.equal(mosaicAliasDTO.mosaicId);
    });
    it('should compare addresses in AddressAlias.equals()', () => {
        const alias1 = new AddressAlias_1.AddressAlias(addressAliasDTO.type, addressAliasDTO.address);
        const alias2 = new AddressAlias_1.AddressAlias(addressAliasDTO.type, addressAliasDTO.address);
        const alias3 = new AddressAlias_1.AddressAlias(addressAliasDTO.type, address2);
        chai_1.expect(alias1.equals(alias2)).to.be.equal(true);
        chai_1.expect(alias1.equals(alias3)).to.be.equal(false);
    });
    it('should compare mosaicIds in MosaicAlias.equals()', () => {
        const alias1 = new MosaicAlias_1.MosaicAlias(mosaicAliasDTO.type, mosaicAliasDTO.mosaicId);
        const alias2 = new MosaicAlias_1.MosaicAlias(mosaicAliasDTO.type, mosaicAliasDTO.mosaicId);
        const alias3 = new MosaicAlias_1.MosaicAlias(mosaicAliasDTO.type, new MosaicId_1.MosaicId([481110498, 231112637]));
        chai_1.expect(alias1.equals(alias2)).to.be.equal(true);
        chai_1.expect(alias1.equals(alias3)).to.be.equal(false);
    });
});
//# sourceMappingURL=Alias.spec.js.map