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
const NodeHttp_1 = require("../../src/infrastructure/NodeHttp");
const conf_spec_1 = require("../conf/conf.spec");
describe('NodeHttp', () => {
    const nodeHttp = new NodeHttp_1.NodeHttp(conf_spec_1.APIUrl);
    describe('getNodeInfo', () => {
        it('should return node info', (done) => {
            nodeHttp.getNodeInfo()
                .subscribe((nodeInfo) => {
                chai_1.expect(nodeInfo.friendlyName).not.to.be.undefined;
                chai_1.expect(nodeInfo.host).not.to.be.undefined;
                chai_1.expect(nodeInfo.networkIdentifier).not.to.be.undefined;
                chai_1.expect(nodeInfo.port).not.to.be.undefined;
                chai_1.expect(nodeInfo.publicKey).not.to.be.undefined;
                chai_1.expect(nodeInfo.roles).not.to.be.undefined;
                chai_1.expect(nodeInfo.version).not.to.be.undefined;
                done();
            });
        });
    });
    describe('getNodeTime', () => {
        it('should return node time', (done) => {
            nodeHttp.getNodeTime()
                .subscribe((nodeTime) => {
                chai_1.expect(nodeTime.receiveTimeStamp).not.to.be.undefined;
                chai_1.expect(nodeTime.sendTimeStamp).not.to.be.undefined;
                done();
            });
        });
    });
});
//# sourceMappingURL=NodeHttp.spec.js.map