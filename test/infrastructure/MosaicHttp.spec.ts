import * as chai from 'chai';
import * as spies from 'chai-spies';
import { MosaicHttp } from '../../src/infrastructure/infrastructure';
import { NetworkType, PublicAccount, MosaicId, UInt64 } from '../../src/model/model';
import { of } from 'rxjs';
import { Convert, RawAddress } from '../../src/core/format';

chai.use(spies);
const expect = chai.expect;

const client = new MosaicHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

const networkType = NetworkType.MIJIN_TEST;
const publicAccount = PublicAccount.createFromPublicKey('6'.repeat(64), networkType);
const address = publicAccount.address;

describe('MosaicHttp', () => {

    describe('getMosaic', () => {
        const mosaicId = new MosaicId([66666,99999]);
        const dto = {
            meta: {
                id: 'some meta id'
            },
            mosaic: {
                mosaicId: mosaicId.toDTO().id,
                supply: UInt64.fromUint(1000000).toDTO(),
                height: UInt64.fromUint(666).toDTO(),
                owner: publicAccount.publicKey,
                revision: 33333,
                properties: [{
                        value: UInt64.fromUint(3).toDTO(), // mutable = true, transferable = true
                    },{
                        value: UInt64.fromUint(5).toDTO(), // divisibility
                    },{
                        value: UInt64.fromUint(12345).toDTO() // duration
                    }
                ]
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).mosaicRoutesApi, 'getMosaic', () => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getMosaic(mosaicId).subscribe(response => {
                expect(response.metaId).to.be.equal('some meta id');
                expect(response.divisibility).to.be.equal(5);
                expect(response.isSupplyMutable()).to.be.equal(true);
                expect(response.isTransferable()).to.be.equal(true);
                expect((response.duration as any).compact()).to.be.equal(12345);
                expect(response.height.compact()).to.be.equal(666);
                expect(response.mosaicId.toDTO().id[0]).to.be.equal(66666);
                expect(response.mosaicId.toDTO().id[1]).to.be.equal(99999);
                expect(response.owner.publicKey).to.be.equal(publicAccount.publicKey);
                expect(response.revision).to.be.equal(33333);
                expect(response.supply.compact()).to.be.equal(1000000);
                done();
            })
        });
    });

    describe('getMosaics', () => {
        const mosaicId = new MosaicId([66666,99999]);
        const dto = {
            meta: {
                id: 'some meta id'
            },
            mosaic: {
                mosaicId: mosaicId.toDTO().id,
                supply: UInt64.fromUint(1000000).toDTO(),
                height: UInt64.fromUint(666).toDTO(),
                owner: publicAccount.publicKey,
                revision: 33333,
                properties: [{
                        value: UInt64.fromUint(3).toDTO(), // mutable = true, transferable = true
                    },{
                        value: UInt64.fromUint(5).toDTO(), // divisibility
                    },{
                        value: UInt64.fromUint(12345).toDTO() // duration
                    }
                ]
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).mosaicRoutesApi, 'getMosaics', () => Promise.resolve({ body: [dto] }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getMosaics([mosaicId]).subscribe(responses => {
                expect(responses.length).to.be.equal(1);
                responses.forEach(response => {
                    expect(response.metaId).to.be.equal('some meta id');
                    expect(response.divisibility).to.be.equal(5);
                    expect(response.isSupplyMutable()).to.be.equal(true);
                    expect(response.isTransferable()).to.be.equal(true);
                    expect((response.duration as any).compact()).to.be.equal(12345);
                    expect(response.height.compact()).to.be.equal(666);
                    expect(response.mosaicId.toDTO().id[0]).to.be.equal(66666);
                    expect(response.mosaicId.toDTO().id[1]).to.be.equal(99999);
                    expect(response.owner.publicKey).to.be.equal(publicAccount.publicKey);
                    expect(response.revision).to.be.equal(33333);
                    expect(response.supply.compact()).to.be.equal(1000000);
                });
                done();
            })
        });
    });

    describe('getMosaicsNames', () => {
        const mosaicId = new MosaicId([66666,99999]);
        const dto = {
            mosaicId: mosaicId.toDTO().id,
            names: [
                'some.name',
                'some.other.name'
            ]
        };
        beforeEach(() => {
            sandbox.on((client as any).mosaicRoutesApi, 'getMosaicsNames', () => Promise.resolve({ body: [dto] }));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getMosaicsNames([mosaicId]).subscribe(responses => {
                expect(responses.length).to.be.equal(1);
                responses.forEach(response => {
                    expect(response.mosaicId.toDTO().id[0]).to.be.equal(66666);
                    expect(response.mosaicId.toDTO().id[1]).to.be.equal(99999);
                    expect(response.names.length).to.be.equal(2);
                    expect(response.names[0].name).to.be.equal('some.name');
                    expect(response.names[1].name).to.be.equal('some.other.name');
                });
                done();
            })
        });
    });

    describe('getMosaicRichList', () => {
        const mosaicId = new MosaicId([66666,99999]);

        const dto = {
            address: Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())),
            publicKey: publicAccount.publicKey,
            amount: UInt64.fromUint(999).toDTO(),
        };
        beforeEach(() => {
            sandbox.on((client as any).mosaicRoutesApi, 'getMosaicRichList', () => Promise.resolve({ body: [dto] }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getMosaicRichlist(mosaicId).subscribe(responses => {
                expect(responses.length).to.be.equal(1);
                responses.forEach(response => {
                    expect(response.address.plain()).to.be.equal(address.plain());
                    expect(response.publicKey).to.be.equal(publicAccount.publicKey);
                    expect(response.amount.toDTO()).to.be.deep.equal(dto.amount);
                });
                done();
            })
        });
    });
});