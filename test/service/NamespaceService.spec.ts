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
import {Observable, of as observableOf} from 'rxjs';
import {deepEqual, instance, mock, when} from 'ts-mockito';
import {NamespaceHttp} from '../../src/infrastructure/NamespaceHttp';
import {ChainHttp} from '../../src/infrastructure/ChainHttp';
import {PublicAccount} from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import {EmptyAlias} from '../../src/model/namespace/EmptyAlias';
import {NamespaceId} from '../../src/model/namespace/NamespaceId';
import {NamespaceInfo} from '../../src/model/namespace/NamespaceInfo';
import {NamespaceName} from '../../src/model/namespace/NamespaceName';
import {UInt64} from '../../src/model/UInt64';
import {NamespaceService} from '../../src/service/NamespaceService';

describe('NamespaceService', () => {

    it('should return the NamespaceInfo + name for a root namespace', (done) => {
        const mockedNamespaceHttp = mock(NamespaceHttp);
        const mockedChainHttp = mock(ChainHttp);
        const rootNamespace = givenRootNamespace();
        const subnamespace = givenSubnamespace();
        when(mockedNamespaceHttp.getNamespace(rootNamespace.id))
            .thenReturn(observableOf(rootNamespace));
        when(mockedNamespaceHttp.getNamespace(subnamespace.id))
            .thenReturn(observableOf(subnamespace));
        when(mockedNamespaceHttp.getNamespacesName(deepEqual([rootNamespace.id])))
            .thenReturn(observableOf([new NamespaceName(new NamespaceId([3316183705, 3829351378]), 'nem2tests')]));
        when(mockedNamespaceHttp.getNamespacesName(deepEqual([rootNamespace.id, subnamespace.id])))
            .thenReturn(observableOf([
                new NamespaceName(new NamespaceId([3316183705, 3829351378]), 'nem2tests'),
                new NamespaceName(new NamespaceId([1781696705, 4157485863]), 'level2'),
            ]));
        const namespaceHttp = instance(mockedNamespaceHttp);
        const chainHttp = instance(mockedChainHttp);
        const namespaceService = new NamespaceService(namespaceHttp, chainHttp);
        namespaceService.namespace(rootNamespace.id).subscribe((namespace) => {
            expect(namespace.name).to.be.equal('nem2tests');
            done();
        });
    });

    it('should return the NamespaceInfo + name for a subnamespace', (done) => {
        const mockedNamespaceHttp = mock(NamespaceHttp);
        const mockedChainHttp = mock(ChainHttp);
        const rootNamespace = givenRootNamespace();
        const subnamespace = givenSubnamespace();
        when(mockedNamespaceHttp.getNamespace(rootNamespace.id))
            .thenReturn(observableOf(rootNamespace));
        when(mockedNamespaceHttp.getNamespace(subnamespace.id))
            .thenReturn(observableOf(subnamespace));
        when(mockedNamespaceHttp.getNamespacesName(deepEqual([rootNamespace.id])))
            .thenReturn(observableOf([new NamespaceName(new NamespaceId([3316183705, 3829351378]), 'nem2tests')]));
        when(mockedNamespaceHttp.getNamespacesName(deepEqual([subnamespace.id])))
            .thenReturn(observableOf([new NamespaceName(new NamespaceId([1781696705, 4157485863]), 'level2')]));
        when(mockedNamespaceHttp.getNamespacesName(deepEqual([rootNamespace.id, subnamespace.id])))
            .thenReturn(observableOf([
                new NamespaceName(new NamespaceId([3316183705, 3829351378]), 'nem2tests'),
                new NamespaceName(new NamespaceId([1781696705, 4157485863]), 'level2'),
            ]));
        const namespaceHttp = instance(mockedNamespaceHttp);
        const chainHttp = instance(mockedChainHttp);
        const namespaceService = new NamespaceService(namespaceHttp, chainHttp);

        namespaceService.namespace(subnamespace.id).subscribe((namespace) => {
            expect(namespace.name).to.be.equal('nem2tests.level2');
            done();
        });
    });

    it('should return Infinity when NamespaceInfo endHeight is of max value', (done) => {
        const mockedNamespaceHttp = mock(NamespaceHttp);
        const mockedChainHttp = mock(ChainHttp);
        const nativeAssetNamespace = givenNativeAssetNamespace();
        
        when(mockedChainHttp.getBlockchainHeight())
            .thenReturn(observableOf(UInt64.fromUint(50695)));
        when(mockedNamespaceHttp.getNamespace(nativeAssetNamespace.id))
            .thenReturn(observableOf(nativeAssetNamespace));

        const namespaceHttp = instance(mockedNamespaceHttp);
        const chainHttp = instance(mockedChainHttp);
        const namespaceService = new NamespaceService(namespaceHttp, chainHttp);

        namespaceService.namespaceRemainingBlock(nativeAssetNamespace.id).subscribe((remainingBlock) => {
            expect(remainingBlock).to.be.equal(Number.POSITIVE_INFINITY);
            done();
        });
    });

    it('should return negative number when NamespaceInfo endHeight is of passed block height', (done) => {
        const mockedNamespaceHttp = mock(NamespaceHttp);
        const mockedChainHttp = mock(ChainHttp);
        const subnamespace = givenSubnamespace();

        when(mockedNamespaceHttp.getNamespace(subnamespace.id))
            .thenReturn(observableOf(subnamespace));
        when(mockedChainHttp.getBlockchainHeight())
            .thenReturn(observableOf(UInt64.fromUint(50895)));

        const namespaceHttp = instance(mockedNamespaceHttp);
        const chainHttp = instance(mockedChainHttp);
        const namespaceService = new NamespaceService(namespaceHttp, chainHttp);

        namespaceService.namespaceRemainingBlock(subnamespace.id).subscribe((remainingBlock) => {
            expect(remainingBlock).to.be.equal(-100);
            done();
        });
    });

    it('should return positive number when NamespaceInfo endHeight is of higher than block height', (done) => {
        const mockedNamespaceHttp = mock(NamespaceHttp);
        const mockedChainHttp = mock(ChainHttp);
        const subnamespace = givenSubnamespace();
        when(mockedChainHttp.getBlockchainHeight())
            .thenReturn(observableOf(UInt64.fromUint(50695)));
        when(mockedNamespaceHttp.getNamespace(subnamespace.id))
            .thenReturn(observableOf(subnamespace));
            
        const namespaceHttp = instance(mockedNamespaceHttp);
        const chainHttp = instance(mockedChainHttp);
        const namespaceService = new NamespaceService(namespaceHttp, chainHttp);

        namespaceService.namespaceRemainingBlock(subnamespace.id).subscribe((remainingBlock) => {
            expect(remainingBlock).to.be.equal(100);
            done();
        });
    });

    function givenRootNamespace(): NamespaceInfo {
        return new NamespaceInfo(
            true,
            0,
            '59DFBA84B2E9E7000135E80C',
            0,
            1,
            [new NamespaceId([
                3316183705,
                3829351378,
            ])],
            new NamespaceId([0, 0]),
            PublicAccount.createFromPublicKey('1026D70E1954775749C6811084D6450A3184D977383F0E4282CD47118AF37755', NetworkType.MIJIN_TEST),
            new UInt64([795, 0]),
            new UInt64([50795, 0]),
            new EmptyAlias());
    }

    function givenSubnamespace(): NamespaceInfo {
        return new NamespaceInfo(
            true,
            0,
            '5A1D85A1D53061000117D1EE',
            1,
            2,
            [new NamespaceId([3316183705, 3829351378]), new NamespaceId([1781696705, 4157485863])],
            new NamespaceId([3316183705, 3829351378]),
            PublicAccount.createFromPublicKey('1026D70E1954775749C6811084D6450A3184D977383F0E4282CD47118AF37755', NetworkType.MIJIN_TEST),
            new UInt64([795, 0]),
            new UInt64([50795, 0]),
            new EmptyAlias());
    }

    function givenNativeRootNamespace(): NamespaceInfo {
        return new NamespaceInfo(
            true,
            0,
            '5A1D85A1D53061000117D1EE',
            1,
            1,
            [new NamespaceId([2339353534, 2976741373])],
            new NamespaceId([0, 0]),
            PublicAccount.createFromPublicKey('1026D70E1954775749C6811084D6450A3184D977383F0E4282CD47118AF37755', NetworkType.MIJIN_TEST),
            new UInt64([1, 0]),
            new UInt64([0xFFFFFFFF, 0xFFFFFFFF]),
            new EmptyAlias());
    }

    function givenNativeAssetNamespace(): NamespaceInfo {
        return new NamespaceInfo(
            true,
            0,
            '5A1D85A1D53061000117D1EE',
            1,
            2,
            [new NamespaceId([2339353534, 2976741373]), new NamespaceId([2434186742, 3220914849])],
            new NamespaceId([2339353534, 2976741373]),
            PublicAccount.createFromPublicKey('1026D70E1954775749C6811084D6450A3184D977383F0E4282CD47118AF37755', NetworkType.MIJIN_TEST),
            new UInt64([1, 0]),
            new UInt64([0xFFFFFFFF, 0xFFFFFFFF]),
            new EmptyAlias());
    }
});
