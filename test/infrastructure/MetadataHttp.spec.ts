import * as chai from 'chai';
import * as spies from 'chai-spies';
import { MetadataHttp } from '../../src/infrastructure/infrastructure';
import { NetworkType, PublicAccount, NamespaceId, MosaicId } from '../../src/model/model';
import { Convert, RawAddress } from '../../src/core/format';

chai.use(spies);
const expect = chai.expect;

const client = new MetadataHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

const networkType = NetworkType.MIJIN_TEST;
const publicAccount = PublicAccount.createFromPublicKey('6'.repeat(64), networkType);
const address = publicAccount.address;

describe('MetadataHttp', () => {

    describe('getAccountMetadata', () => {
        const dto = {
            metadata: {
                metadataId: Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())),
                metadataType: 666,
                fields: [
                    {
                        key: 'some key',
                        value: 'some value'
                    }
                ]
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).metadataRoutesApi, 'getAccountMetadata', (number) => Promise.resolve(dto));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getAccountMetadata(address.plain()).subscribe(response => {
                expect(response.metadataId.plain()).to.be.equal(address.plain());
                expect(response.metadataType).to.be.equal(666);
                expect(response.fields.length).to.be.equal(1);
                expect(response.fields[0].key).to.be.equal('some key');
                expect(response.fields[0].value).to.be.equal('some value');
                done();
            })
        });
    });

    describe('getNamespaceMetadata', () => {
        const namespaceId = new NamespaceId([66666,99999]);
        const dto = {
            metadata: {
                metadataId: namespaceId.toDTO().id,
                metadataType: 666,
                fields: [
                    {
                        key: 'some key',
                        value: 'some value'
                    }
                ]
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).metadataRoutesApi, 'getNamespaceMetadata', (number) => Promise.resolve(dto));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getNamespaceMetadata(namespaceId).subscribe(response => {
                expect(response.metadataId.toDTO().id[0]).to.be.equal(66666);
                expect(response.metadataId.toDTO().id[1]).to.be.equal(99999);
                expect(response.metadataType).to.be.equal(666);
                expect(response.fields.length).to.be.equal(1);
                expect(response.fields[0].key).to.be.equal('some key');
                expect(response.fields[0].value).to.be.equal('some value');
                done();
            })
        });
    });

    describe('getMosaicMetadata', () => {
        const mosaicId = new MosaicId([66666,99999]);
        const dto = {
            metadata: {
                metadataId: mosaicId.toDTO().id,
                metadataType: 666,
                fields: [
                    {
                        key: 'some key',
                        value: 'some value'
                    }
                ]
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).metadataRoutesApi, 'getMosaicMetadata', (number) => Promise.resolve(dto));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getMosaicMetadata(mosaicId).subscribe(response => {
                expect(response.metadataId.toDTO().id[0]).to.be.equal(66666);
                expect(response.metadataId.toDTO().id[1]).to.be.equal(99999);
                expect(response.metadataType).to.be.equal(666);
                expect(response.fields.length).to.be.equal(1);
                expect(response.fields[0].key).to.be.equal('some key');
                expect(response.fields[0].value).to.be.equal('some value');
                done();
            })
        });
    });
});