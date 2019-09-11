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
const MosaicProperties_1 = require("../../../src/model/mosaic/MosaicProperties");
const UInt64_1 = require("../../../src/model/UInt64");
describe('MosaicProperties', () => {
    it('should createComplete an MosaicProperties object with constructor', () => {
        const propertiesDTO = [
            new UInt64_1.UInt64([
                7,
                0,
            ]),
            new UInt64_1.UInt64([
                3,
                0,
            ]),
            new UInt64_1.UInt64([
                1000,
                0,
            ]),
        ];
        const mosaicProperties = new MosaicProperties_1.MosaicProperties(propertiesDTO[0], propertiesDTO[1].compact(), propertiesDTO[2]);
        chai_1.expect(mosaicProperties.divisibility).to.be.equal(propertiesDTO[1].lower);
        assert_1.deepEqual(mosaicProperties.duration, propertiesDTO[2]);
        chai_1.expect(mosaicProperties.supplyMutable).to.be.equal(true);
        chai_1.expect(mosaicProperties.transferable).to.be.equal(true);
    });
    it('should createComplete an MosaicProperties object with static method', () => {
        const duration = UInt64_1.UInt64.fromUint(1000);
        const mosaicProperties = MosaicProperties_1.MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            divisibility: 10,
            duration,
        });
        chai_1.expect(mosaicProperties.divisibility).to.be.equal(10);
        assert_1.deepEqual(mosaicProperties.duration, duration);
        chai_1.expect(mosaicProperties.supplyMutable).to.be.equal(false);
        chai_1.expect(mosaicProperties.transferable).to.be.equal(false);
    });
    it('should createComplete an MosaicProperties object without duration', () => {
        const mosaicProperties = MosaicProperties_1.MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            divisibility: 10,
        });
        chai_1.expect(mosaicProperties.divisibility).to.be.equal(10);
        assert_1.deepEqual(mosaicProperties.duration, undefined);
        chai_1.expect(mosaicProperties.supplyMutable).to.be.equal(false);
        chai_1.expect(mosaicProperties.transferable).to.be.equal(false);
    });
});
//# sourceMappingURL=MosaicProperties.spec.js.map