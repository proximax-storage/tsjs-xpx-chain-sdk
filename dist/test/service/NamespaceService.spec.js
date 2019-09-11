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
const rxjs_1 = require("rxjs");
const ts_mockito_1 = require("ts-mockito");
const NamespaceHttp_1 = require("../../src/infrastructure/NamespaceHttp");
const PublicAccount_1 = require("../../src/model/account/PublicAccount");
const NetworkType_1 = require("../../src/model/blockchain/NetworkType");
const EmptyAlias_1 = require("../../src/model/namespace/EmptyAlias");
const NamespaceId_1 = require("../../src/model/namespace/NamespaceId");
const NamespaceInfo_1 = require("../../src/model/namespace/NamespaceInfo");
const NamespaceName_1 = require("../../src/model/namespace/NamespaceName");
const UInt64_1 = require("../../src/model/UInt64");
const NamespaceService_1 = require("../../src/service/NamespaceService");
describe('NamespaceService', () => {
    it('should return the NamespaceInfo + name for a root namespace', () => {
        const mockedNamespaceHttp = ts_mockito_1.mock(NamespaceHttp_1.NamespaceHttp);
        const rootNamespace = givenRootNamespace();
        const subnamespace = givenSubnamespace();
        ts_mockito_1.when(mockedNamespaceHttp.getNamespace(rootNamespace.id))
            .thenReturn(rxjs_1.of(rootNamespace));
        ts_mockito_1.when(mockedNamespaceHttp.getNamespace(subnamespace.id))
            .thenReturn(rxjs_1.of(subnamespace));
        ts_mockito_1.when(mockedNamespaceHttp.getNamespacesName(ts_mockito_1.deepEqual([rootNamespace.id])))
            .thenReturn(rxjs_1.of([new NamespaceName_1.NamespaceName(new NamespaceId_1.NamespaceId([3316183705, 3829351378]), 'nem2tests')]));
        ts_mockito_1.when(mockedNamespaceHttp.getNamespacesName(ts_mockito_1.deepEqual([rootNamespace.id, subnamespace.id])))
            .thenReturn(rxjs_1.of([
            new NamespaceName_1.NamespaceName(new NamespaceId_1.NamespaceId([3316183705, 3829351378]), 'nem2tests'),
            new NamespaceName_1.NamespaceName(new NamespaceId_1.NamespaceId([1781696705, 4157485863]), 'level2'),
        ]));
        const namespaceHttp = ts_mockito_1.instance(mockedNamespaceHttp);
        const namespaceService = new NamespaceService_1.NamespaceService(namespaceHttp);
        namespaceService.namespace(rootNamespace.id).subscribe((namespace) => {
            chai_1.expect(namespace.name).to.be.equal('nem2tests');
        });
    });
    it('should return the NamespaceInfo + name for a subnamespace', () => {
        const mockedNamespaceHttp = ts_mockito_1.mock(NamespaceHttp_1.NamespaceHttp);
        const rootNamespace = givenRootNamespace();
        const subnamespace = givenSubnamespace();
        ts_mockito_1.when(mockedNamespaceHttp.getNamespace(rootNamespace.id))
            .thenReturn(rxjs_1.of(rootNamespace));
        ts_mockito_1.when(mockedNamespaceHttp.getNamespace(subnamespace.id))
            .thenReturn(rxjs_1.of(subnamespace));
        ts_mockito_1.when(mockedNamespaceHttp.getNamespacesName(ts_mockito_1.deepEqual([rootNamespace.id])))
            .thenReturn(rxjs_1.of([new NamespaceName_1.NamespaceName(new NamespaceId_1.NamespaceId([3316183705, 3829351378]), 'nem2tests')]));
        ts_mockito_1.when(mockedNamespaceHttp.getNamespacesName(ts_mockito_1.deepEqual([subnamespace.id])))
            .thenReturn(rxjs_1.of([new NamespaceName_1.NamespaceName(new NamespaceId_1.NamespaceId([1781696705, 4157485863]), 'level2')]));
        ts_mockito_1.when(mockedNamespaceHttp.getNamespacesName(ts_mockito_1.deepEqual([rootNamespace.id, subnamespace.id])))
            .thenReturn(rxjs_1.of([
            new NamespaceName_1.NamespaceName(new NamespaceId_1.NamespaceId([3316183705, 3829351378]), 'nem2tests'),
            new NamespaceName_1.NamespaceName(new NamespaceId_1.NamespaceId([1781696705, 4157485863]), 'level2'),
        ]));
        const namespaceHttp = ts_mockito_1.instance(mockedNamespaceHttp);
        const namespaceService = new NamespaceService_1.NamespaceService(namespaceHttp);
        namespaceService.namespace(subnamespace.id).subscribe((namespace) => {
            chai_1.expect(namespace.name).to.be.equal('nem2tests.level2');
        });
    });
    function givenRootNamespace() {
        return new NamespaceInfo_1.NamespaceInfo(true, 0, '59DFBA84B2E9E7000135E80C', 0, 1, [new NamespaceId_1.NamespaceId([
                3316183705,
                3829351378,
            ])], new NamespaceId_1.NamespaceId([0, 0]), PublicAccount_1.PublicAccount.createFromPublicKey('1026D70E1954775749C6811084D6450A3184D977383F0E4282CD47118AF37755', NetworkType_1.NetworkType.MIJIN_TEST), new UInt64_1.UInt64([795, 0]), new UInt64_1.UInt64([50795, 0]), new EmptyAlias_1.EmptyAlias());
    }
    function givenSubnamespace() {
        return new NamespaceInfo_1.NamespaceInfo(true, 0, '5A1D85A1D53061000117D1EE', 1, 2, [new NamespaceId_1.NamespaceId([3316183705, 3829351378]), new NamespaceId_1.NamespaceId([1781696705, 4157485863])], new NamespaceId_1.NamespaceId([3316183705, 3829351378]), PublicAccount_1.PublicAccount.createFromPublicKey('1026D70E1954775749C6811084D6450A3184D977383F0E4282CD47118AF37755', NetworkType_1.NetworkType.MIJIN_TEST), new UInt64_1.UInt64([795, 0]), new UInt64_1.UInt64([50795, 0]), new EmptyAlias_1.EmptyAlias());
    }
});
//# sourceMappingURL=NamespaceService.spec.js.map