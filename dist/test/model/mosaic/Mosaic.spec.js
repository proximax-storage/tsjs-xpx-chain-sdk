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
const Mosaic_1 = require("../../../src/model/mosaic/Mosaic");
const UInt64_1 = require("../../../src/model/UInt64");
const MosaicId_1 = require("../../../src/model/mosaic/MosaicId");
describe('Mosaic', () => {
    it('should createComplete an Mosaic object', () => {
        const mosaicDTO = {
            amount: new UInt64_1.UInt64([1, 0]),
            mosaicId: new MosaicId_1.MosaicId([3646934825, 3576016193]),
        };
        const mosaic = new Mosaic_1.Mosaic(mosaicDTO.mosaicId, mosaicDTO.amount);
        assert_1.deepEqual(mosaic.id, mosaicDTO.mosaicId);
        assert_1.deepEqual(mosaic.amount, mosaicDTO.amount);
    });
});
//# sourceMappingURL=Mosaic.spec.js.map