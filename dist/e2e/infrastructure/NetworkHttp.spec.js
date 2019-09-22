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
const chai_1 = require("chai");
const NetworkHttp_1 = require("../../src/infrastructure/NetworkHttp");
const conf_spec_1 = require("../conf/conf.spec");
describe('NetworkHttp', () => {
    let networkHttp = new NetworkHttp_1.NetworkHttp(conf_spec_1.APIUrl);
    describe('getNetworkType', () => {
        it('should return network type', (done) => {
            networkHttp.getNetworkType()
                .subscribe((networkType) => {
                chai_1.expect(networkType).not.to.be.equal(undefined);
                done();
            });
        });
    });
});
//# sourceMappingURL=NetworkHttp.spec.js.map