import * as chai from 'chai';
import * as spies from 'chai-spies';
import { NamespaceHttp } from '../../src/infrastructure/infrastructure';
import { NetworkType, PublicAccount, MosaicId, UInt64, NamespaceId, NamespaceType, NamespaceInfo, AliasType } from '../../src/model/model';
import { of } from 'rxjs';
import { RawAddress, Convert } from '../../src/core/format';

chai.use(spies);
const expect = chai.expect;

const client = new NamespaceHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

const networkType = NetworkType.MIJIN_TEST;
const publicAccount = PublicAccount.createFromPublicKey('6'.repeat(64), networkType);
const address = publicAccount.address;

describe('NamespaceHttp', () => {

    describe('getNamespace', () => {
        const dto = {
            meta: {
                active: true,
                index: 666,
                id: 'some meta id'
            },
            namespace: {
                type: NamespaceType.SubNamespace,
                depth: 3,
                parentId: 'grand.parent',
                owner: publicAccount.publicKey,
                startHeight: UInt64.fromUint(666666).toDTO(),
                endHeight: UInt64.fromUint(999999).toDTO(),
                level0: 'grand',
                level1: 'grand.parent',
                level2: 'grand.parent.child',
                alias: {
                    type: AliasType.Address,
                    address: Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())), // either
                    // mosaicId:, // or
                }
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).namespaceRoutesApi, 'getNamespace', () => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getNamespace(new NamespaceId('grand.parent.child')).subscribe(response => {
                expect(response.active).to.be.equal(true);
                expect(response.index).to.be.equal(666);
                expect(response.metaId).to.be.equal('some meta id');
                expect(response.isRoot()).to.be.equal(false);
                expect(response.depth).to.be.equal(3);
                expect(response.levels.length).to.be.equal(3);
                expect(response.levels[0].fullName).to.be.equal('grand');
                expect(response.levels[1].fullName).to.be.equal('grand.parent');
                expect(response.levels[2].fullName).to.be.equal('grand.parent.child');
                expect(response.parentNamespaceId().fullName).to.be.equal('grand.parent');
                expect(response.owner.publicKey).to.be.equal(publicAccount.publicKey);
                expect(response.startHeight.compact()).to.be.equal(666666);
                expect(response.endHeight.compact()).to.be.equal(999999);
                expect(response.alias.type).to.be.equal(AliasType.Address);
                expect((response.alias.address as any).plain()).to.be.equal(address.plain());
                done();
            })
        });
    });

    describe('getNamespacesFromAccount', () => {
        const dto = {
            meta: {
                active: true,
                index: 666,
                id: 'some meta id'
            },
            namespace: {
                type: NamespaceType.SubNamespace,
                depth: 3,
                parentId: 'grand.parent',
                owner: publicAccount.publicKey,
                startHeight: UInt64.fromUint(666666).toDTO(),
                endHeight: UInt64.fromUint(999999).toDTO(),
                level0: 'grand',
                level1: 'grand.parent',
                level2: 'grand.parent.child',
                alias: {
                    type: AliasType.Address,
                    address: Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())), // either
                    // mosaicId:, // or
                }
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).namespaceRoutesApi, 'getNamespacesFromAccount', () => Promise.resolve({ body: [dto] }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getNamespacesFromAccount(address).subscribe(responses => {
                responses.forEach(response => {
                    expect(responses.length).to.be.equal(1);
                    expect(response.active).to.be.equal(true);
                    expect(response.index).to.be.equal(666);
                    expect(response.metaId).to.be.equal('some meta id');
                    expect(response.isRoot()).to.be.equal(false);
                    expect(response.depth).to.be.equal(3);
                    expect(response.levels.length).to.be.equal(3);
                    expect(response.levels[0].fullName).to.be.equal('grand');
                    expect(response.levels[1].fullName).to.be.equal('grand.parent');
                    expect(response.levels[2].fullName).to.be.equal('grand.parent.child');
                    expect(response.parentNamespaceId().fullName).to.be.equal('grand.parent');
                    expect(response.owner.publicKey).to.be.equal(publicAccount.publicKey);
                    expect(response.startHeight.compact()).to.be.equal(666666);
                    expect(response.endHeight.compact()).to.be.equal(999999);
                    expect(response.alias.type).to.be.equal(AliasType.Address);
                    expect((response.alias.address as any).plain()).to.be.equal(address.plain());
                });
                done();
            })
        });
    });

    describe('getNamespacesFromAccounts', () => {
        const dto = {
            meta: {
                active: true,
                index: 666,
                id: 'some meta id'
            },
            namespace: {
                type: NamespaceType.SubNamespace,
                depth: 3,
                parentId: 'grand.parent',
                owner: publicAccount.publicKey,
                startHeight: UInt64.fromUint(666666).toDTO(),
                endHeight: UInt64.fromUint(999999).toDTO(),
                level0: 'grand',
                level1: 'grand.parent',
                level2: 'grand.parent.child',
                alias: {
                    type: AliasType.Mosaic,
                    // address: Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())), // either
                    mosaicId: [777777, 888888] // or
                }
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).namespaceRoutesApi, 'getNamespacesFromAccounts', () => Promise.resolve({ body: [dto] }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getNamespacesFromAccounts([address]).subscribe(responses => {
                responses.forEach(response => {
                    expect(responses.length).to.be.equal(1);
                    expect(response.active).to.be.equal(true);
                    expect(response.index).to.be.equal(666);
                    expect(response.metaId).to.be.equal('some meta id');
                    expect(response.isRoot()).to.be.equal(false);
                    expect(response.depth).to.be.equal(3);
                    expect(response.levels.length).to.be.equal(3);
                    expect(response.levels[0].fullName).to.be.equal('grand');
                    expect(response.levels[1].fullName).to.be.equal('grand.parent');
                    expect(response.levels[2].fullName).to.be.equal('grand.parent.child');
                    expect(response.parentNamespaceId().fullName).to.be.equal('grand.parent');
                    expect(response.owner.publicKey).to.be.equal(publicAccount.publicKey);
                    expect(response.startHeight.compact()).to.be.equal(666666);
                    expect(response.endHeight.compact()).to.be.equal(999999);
                    expect(response.alias.type).to.be.equal(AliasType.Mosaic);
                    expect((response.alias.mosaicId as any).id.toDTO()[0]).to.be.equal(777777);
                    expect((response.alias.mosaicId as any).id.toDTO()[1]).to.be.equal(888888);
                });
                done();
            })
        });
    });

    describe('getNamespacesName', () => {
        const dto = {
            namespaceId: 'some.namespace',
            name: 'some name'
        };
        beforeEach(() => {
            sandbox.on((client as any).namespaceRoutesApi, 'getNamespacesNames', () => Promise.resolve({ body: [dto, dto] }));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getNamespacesName([new NamespaceId([333333, 444444])]).subscribe(responses => {
                expect(responses.length).to.be.equal(2);
                responses.forEach(response => {
                    expect(response.name).to.be.equal('some name');
                    expect(response.namespaceId.fullName).to.be.equal('some.namespace');
                });
                done();
            })
        });
    });

    describe('getLinkedMosaicId', () => {
        const dto = {
            meta: {
                active: true,
                index: 666,
                id: 'some meta id'
            },
            namespace: {
                type: NamespaceType.SubNamespace,
                depth: 3,
                parentId: 'grand.parent',
                owner: publicAccount.publicKey,
                startHeight: UInt64.fromUint(666666).toDTO(),
                endHeight: UInt64.fromUint(999999).toDTO(),
                level0: 'grand',
                level1: 'grand.parent',
                level2: 'grand.parent.child',
                alias: {
                    type: AliasType.Mosaic,
                    // address: Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())), // either
                    mosaicId: [777777, 888888] // or
                }
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).namespaceRoutesApi, 'getNamespace', () => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getLinkedMosaicId(new NamespaceId([333333, 444444])).subscribe(response => {
                expect(response.toDTO().id[0]).to.be.equal(777777);
                expect(response.toDTO().id[1]).to.be.equal(888888);
                done();
            })
        });
    });

    describe('getLinkedMosaicId - throw', () => {
        const dto = {
            meta: {
                active: true,
                index: 666,
                id: 'some meta id'
            },
            namespace: {
                type: NamespaceType.SubNamespace,
                depth: 3,
                parentId: 'grand.parent',
                owner: publicAccount.publicKey,
                startHeight: UInt64.fromUint(666666).toDTO(),
                endHeight: UInt64.fromUint(999999).toDTO(),
                level0: 'grand',
                level1: 'grand.parent',
                level2: 'grand.parent.child',
                alias: {
                    type: AliasType.Address,
                    address: Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())), // either
                    // mosaicId: [777777, 888888] // or
                }
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).namespaceRoutesApi, 'getNamespace', () => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getLinkedMosaicId(new NamespaceId([333333, 444444])).subscribe(_ => {
                done('fail');
            }, error => {
                expect(error.message).to.be.equal('No mosaicId is linked to namespace \'grand\'');
                done();
            });
        });
    });

    describe('getLinkedAddress', () => {
        const dto = {
            meta: {
                active: true,
                index: 666,
                id: 'some meta id'
            },
            namespace: {
                type: NamespaceType.SubNamespace,
                depth: 3,
                parentId: 'grand.parent',
                owner: publicAccount.publicKey,
                startHeight: UInt64.fromUint(666666).toDTO(),
                endHeight: UInt64.fromUint(999999).toDTO(),
                level0: 'grand',
                level1: 'grand.parent',
                level2: 'grand.parent.child',
                alias: {
                    type: AliasType.Address,
                    address: Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())), // either
                    // mosaicId: [777777, 888888] // or
                }
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).namespaceRoutesApi, 'getNamespace', () => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client - and throw', (done) => {
            client.getLinkedAddress(new NamespaceId([333333, 444444])).subscribe(response => {
                expect(response.plain()).to.be.equal(address.plain());
                done();
            });
        });
    });

    describe('getLinkedAddress - throw', () => {
        const dto = {
            meta: {
                active: true,
                index: 666,
                id: 'some meta id'
            },
            namespace: {
                type: NamespaceType.SubNamespace,
                depth: 3,
                parentId: 'grand.parent',
                owner: publicAccount.publicKey,
                startHeight: UInt64.fromUint(666666).toDTO(),
                endHeight: UInt64.fromUint(999999).toDTO(),
                level0: 'grand',
                level1: 'grand.parent',
                level2: 'grand.parent.child',
                alias: {
                    type: AliasType.Mosaic,
                    // address: Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())), // either
                    mosaicId: [777777, 888888] // or
                }
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).namespaceRoutesApi, 'getNamespace', () => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client - and throw', (done) => {
            client.getLinkedAddress(new NamespaceId([333333, 444444])).subscribe(_ => {
                done('fail');
            }, error => {
                expect(error.message).to.be.equal('No address is linked to namespace \'grand\'');
                done();
            })
        });
    });
});