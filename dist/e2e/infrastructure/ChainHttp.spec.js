"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ChainHttp_1 = require("../../src/infrastructure/ChainHttp");
const conf_spec_1 = require("../conf/conf.spec");
describe('ChainHttp', () => {
    let chainHttp = new ChainHttp_1.ChainHttp(conf_spec_1.APIUrl);
    describe('getBlockchainHeight', () => {
        it('should return blockchain height', (done) => {
            chainHttp.getBlockchainHeight()
                .subscribe((height) => {
                chai_1.expect(height.lower).to.be.greaterThan(0);
                done();
            });
        });
    });
    describe('getBlockchainScore', () => {
        it('should return blockchain score', (done) => {
            chainHttp.getBlockchainScore()
                .subscribe((blockchainScore) => {
                chai_1.expect(blockchainScore.scoreLow).to.not.be.equal(undefined);
                chai_1.expect(blockchainScore.scoreHigh.lower).to.be.equal(0);
                chai_1.expect(blockchainScore.scoreHigh.higher).to.be.equal(0);
                done();
            });
        });
    });
});
//# sourceMappingURL=ChainHttp.spec.js.map