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
import {APIUrl, GetNemesisBlockDataPromise} from '../conf/conf.spec';

describe('NamespaceHttp', () => {
    const namespaceHttp = new NamespaceHttp(APIUrl);

    describe('getNamespace', () => {
        it('should return namespace data given namepsaceId', (done) => {
            GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getNamespace(data.someNamespace.Id)
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
                    expect(namespaces[0].startHeight.lower).to.be.equal(1);
                    expect(namespaces[0].startHeight.higher).to.be.equal(0);
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
                    expect(namespaces[0].startHeight.lower).to.be.equal(1);
                    expect(namespaces[0].startHeight.higher).to.be.equal(0);
                    done();
                });
            });
        });

    });

    describe('getNamespacesName', () => {
        it('should return namespace name given array of namespaceIds', (done) => {
            GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getNamespacesName([data.someNamespace.Id])
                .subscribe((namespaceNames) => {
                    expect(namespaceNames[0].name).to.be.equal(data.someNamespace.Name);
                    done();
                });
            });
        });
    });

    describe('getLinkedMosaicId', () => {
        it('should return mosaicId given currency namespaceId', (done) => {
            GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getLinkedMosaicId(data.someNamespace.Id)
                .subscribe((mosaicId) => {
                    expect(mosaicId).to.not.be.null;
                    done();
                });
            });
        });
    });

    xdescribe('getLinkedAddress', () => {
        it('should return address given namespaceId', (done) => {
            GetNemesisBlockDataPromise().then(data => {
                namespaceHttp.getLinkedAddress(data.someNamespace.Id)
                .subscribe((address) => {
                    expect(address).to.be.null;
                    done();
                });
            });
        });
    });
});
