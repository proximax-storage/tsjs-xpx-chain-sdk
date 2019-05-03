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
const model_1 = require("../../../src/model/model");
describe('AccountProperty', () => {
    it('should createComplete an AccountProperty object', () => {
        const accountPropertyDTO = {
            propertyType: model_1.PropertyType.AllowAddress,
            values: [{ modificationType: model_1.PropertyModificationType.Add,
                    value: 'SDUP5PLHDXKBX3UU5Q52LAY4WYEKGEWC6IB3VBFM',
                }],
        };
        const accountProperty = new model_1.AccountProperty(accountPropertyDTO.propertyType, accountPropertyDTO.values);
        chai_1.expect(accountProperty.propertyType).to.be.equal(accountPropertyDTO.propertyType);
        assert_1.deepEqual(accountProperty.values.length, accountPropertyDTO.values.length);
    });
});
//# sourceMappingURL=AccountProperty.spec.js.map