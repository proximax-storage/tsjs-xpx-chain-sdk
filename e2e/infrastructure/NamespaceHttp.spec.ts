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
import {expect} from 'chai';
import {NamespaceHttp} from '../../src/infrastructure/NamespaceHttp';
import {APIUrl, GetNemesisBlockDataPromise, ConfTestingNamespace, TestingAccount} from '../conf/conf.spec';
import { deepEqual } from 'assert';

describe('NamespaceHttp', () => {
    const namespaceHttp = new NamespaceHttp(APIUrl);

    describe('getNamespace', () => {
        it('should return namespace data given namepsaceId', (done) => {
            GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getNamespace(data.testNamespace.Id)
                .subscribe((namespace) => {
                    expect(namespace.startHeight.lower).to.be.equal(1);
                    expect(namespace.startHeight.higher).to.be.equal(0);
                    done();
                });
            });
        });
    });

    describe('getNamespacesFromAccount', () => {
        it('should return namespace data given publicKeyNemesis', (done) => {
            GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getNamespacesFromAccount(data.nemesisBlockInfo.signer.address)
                .subscribe((namespaces) => {
                    deepEqual(namespaces[0].owner, data.nemesisBlockInfo.signer);
                    done();
                });
            });
        });
    });

    describe('getNamespacesFromAccounts', () => {
        it('should return namespaces data given publicKeyNemesis', (done) => {
            GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getNamespacesFromAccounts([data.nemesisBlockInfo.signer.address])
                .subscribe((namespaces) => {
                    deepEqual(namespaces[0].owner, data.nemesisBlockInfo.signer);
                    done();
                });
            });
        });

    });

    describe('getNamespacesName', () => {
        it('should return namespace name given array of namespaceIds', (done) => {
            GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getNamespacesName([data.testNamespace.Id])
                .subscribe((namespaceNames) => {
                    expect(namespaceNames[0].name.endsWith(data.testNamespace.Name)).to.be.equal(true);
                    done();
                });
            });
        });
    });

    describe('getLinkedMosaicId', () => {
        it('should return mosaicId given currency namespaceId', (done) => {
            GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getLinkedMosaicId(data.testNamespace.Id)
                .subscribe((mosaicId) => {
                    expect(mosaicId).to.not.be.null;
                    done();
                });
            });
        });
    });

    describe('getLinkedAddress', () => {
        it('should return address given namespaceId', (done) => {
            GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getLinkedAddress(ConfTestingNamespace)
                .subscribe((address) => {
                    expect(address.plain()).to.be.equal(TestingAccount.address.plain());
                    done();
                });
            });
        });
    });
});
