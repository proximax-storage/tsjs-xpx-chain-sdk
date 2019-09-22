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
const NamespaceHttp_1 = require("../../src/infrastructure/NamespaceHttp");
const conf_spec_1 = require("../conf/conf.spec");
const assert_1 = require("assert");
describe('NamespaceHttp', () => {
    const namespaceHttp = new NamespaceHttp_1.NamespaceHttp(conf_spec_1.APIUrl);
    describe('getNamespace', () => {
        it('should return namespace data given namepsaceId', (done) => {
            conf_spec_1.GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getNamespace(data.testNamespace.Id)
                    .subscribe((namespace) => {
                    chai_1.expect(namespace.startHeight.lower).to.be.equal(1);
                    chai_1.expect(namespace.startHeight.higher).to.be.equal(0);
                    done();
                });
            });
        });
    });
    describe('getNamespacesFromAccount', () => {
        it('should return namespace data given publicKeyNemesis', (done) => {
            conf_spec_1.GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getNamespacesFromAccount(data.nemesisBlockInfo.signer.address)
                    .subscribe((namespaces) => {
                    assert_1.deepEqual(namespaces[0].owner, data.nemesisBlockInfo.signer);
                    done();
                });
            });
        });
    });
    describe('getNamespacesFromAccounts', () => {
        it('should return namespaces data given publicKeyNemesis', (done) => {
            conf_spec_1.GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getNamespacesFromAccounts([data.nemesisBlockInfo.signer.address])
                    .subscribe((namespaces) => {
                    assert_1.deepEqual(namespaces[0].owner, data.nemesisBlockInfo.signer);
                    done();
                });
            });
        });
    });
    describe('getNamespacesName', () => {
        it('should return namespace name given array of namespaceIds', (done) => {
            conf_spec_1.GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getNamespacesName([data.testNamespace.Id])
                    .subscribe((namespaceNames) => {
                    chai_1.expect(namespaceNames[0].name.endsWith(data.testNamespace.Name)).to.be.equal(true);
                    done();
                });
            });
        });
    });
    describe('getLinkedMosaicId', () => {
        it('should return mosaicId given currency namespaceId', (done) => {
            conf_spec_1.GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getLinkedMosaicId(data.testNamespace.Id)
                    .subscribe((mosaicId) => {
                    chai_1.expect(mosaicId).to.not.be.null;
                    done();
                });
            });
        });
    });
    describe('getLinkedAddress', () => {
        it('should return address given namespaceId', (done) => {
            conf_spec_1.GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getLinkedAddress(conf_spec_1.ConfTestingNamespaceId)
                    .subscribe((address) => {
                    chai_1.expect(address.plain()).to.be.equal(conf_spec_1.TestingAccount.address.plain());
                    done();
                });
            });
        });
    });
});
//# sourceMappingURL=NamespaceHttp.spec.js.map