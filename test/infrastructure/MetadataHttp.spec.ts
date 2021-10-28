import * as chai from 'chai';
import * as spies from 'chai-spies';
import { MetadataHttp } from '../../src/infrastructure/infrastructure';
import { NetworkType, PublicAccount, NamespaceId, MosaicId, MetadataType } from '../../src/model/model';
import { Convert, RawAddress } from '../../src/core/format';

chai.use(spies);
const expect = chai.expect;

const client = new MetadataHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

const networkType = NetworkType.MIJIN_TEST;
const publicAccount = PublicAccount.createFromPublicKey('6'.repeat(64), networkType);
const address = publicAccount.address;

describe('MetadataHttp', () => {

    describe('search Metadata', () => {
        const dto = {
            data: [
                {
                    metadataEntry:{
                        version:1,
                        compositeHash:"CB8DC1C05BF3BB789F8AF5410C47BF5DFB379F3A616FDA714A283A0AE61680FD",
                        sourceAddress:"A80E611CA57B40C21583342ECFB1C2B9DA074594910009FBC9",
                        targetKey:"07EF9C1B2A70F4B05F954F9A750E5A677084575802767DB5CDC0521E3B63F9D3",
                        scopedMetadataKey:[1,0],
                        targetId:[1201264286,1128561179],
                        metadataType:1,
                        valueSize:4,
                        value: Convert.utf8ToHex("test")
                    },
                    meta:{
                        id:"61756da16527b01ee40b6093"
                    }
                }
            ],
            pagination: {
                totalEntries: 1,
                pageNumber: 20,
                pageSize: 1,
                totalPages: 1
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).metadataRoutesApi, 'searchMetadata', (number) => Promise.resolve({ body: dto }));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.searchMetadata().subscribe(response => {
                expect(response.metadataEntries[0].scopedMetadataKey.compact()).to.be.equal(1);
                expect(response.metadataEntries[0].metadataType).to.be.equal(MetadataType.MOSAIC);
                expect(response.metadataEntries[0].value).to.be.equal("74657374");
                expect(response.metadataEntries[0].valueSize).to.be.equal(4);
                done();
            })
        });
    });

    describe('get Metadata', () => {
        const compositeHash = "5DB111FAFD1CD1AB10747B1BDDF895D6469965A1D11D73E8B74F0D44A16BBE8E";
        const dto = {
            metadataEntry:{
                version:1,
                compositeHash:"5DB111FAFD1CD1AB10747B1BDDF895D6469965A1D11D73E8B74F0D44A16BBE8E",
                sourceAddress:"A8648F7FAB7537B959D532E521416052F5089920E832E2D3CD",
                targetKey:"359BAB30BF217A592372FADBE1F39C36C7717AC58A592324826A8E50B6829C69",
                scopedMetadataKey:[1,0],
                targetId:[1388551086,3524401330],
                metadataType:2,
                valueSize:4,
                value: Convert.utf8ToHex("test")
            },
            id:"61756da16527b01ee40b6091"
        };

        beforeEach(() => {
            sandbox.on((client as any).metadataRoutesApi, 'getMetadata', (number) => Promise.resolve({ body: dto }));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getMetadata(compositeHash).subscribe(response => {
                expect(response.scopedMetadataKey.compact()).to.be.equal(1);
                expect(response.metadataType).to.be.equal(MetadataType.NAMESPACE);
                expect(response.value).to.be.equal("74657374");
                expect(response.valueSize).to.be.equal(4);
                done();
            })
        });
    });

    describe('get Metadatas', () => {
        const compositeHashes = [
            "5DB111FAFD1CD1AB10747B1BDDF895D6469965A1D11D73E8B74F0D44A16BBE8E",
            "8C2635D6F73EE14D8E06B8C22ADD6FA6600C486C45508142DDADA74BD090D728"
        ];
        const dto = [
            {
                metadataEntry:{
                    version:1,
                    compositeHash:"5DB111FAFD1CD1AB10747B1BDDF895D6469965A1D11D73E8B74F0D44A16BBE8E",
                    sourceAddress:"A8648F7FAB7537B959D532E521416052F5089920E832E2D3CD",
                    targetKey:"359BAB30BF217A592372FADBE1F39C36C7717AC58A592324826A8E50B6829C69",
                    scopedMetadataKey:[1,0],
                    targetId:[1388551086,3524401330],
                    metadataType:2,
                    valueSize:4,
                    value: Convert.utf8ToHex("test")
                },
                id:"61756da16527b01ee40b6091"
            },
            {
                metadataEntry:{
                    version:1,
                    compositeHash:"8C2635D6F73EE14D8E06B8C22ADD6FA6600C486C45508142DDADA74BD090D728",
                    sourceAddress:"A8E6CED688D839114715BF15FB8A8B6A9995857F441438A2B6",
                    targetKey:"F2236D32FF50159DD4318A848BF95DE39F19BF27C84291D8214E9B21E37E28A0",
                    scopedMetadataKey:[1,0],
                    targetId:[0,0],
                    metadataType:0,
                    valueSize:4,
                    value: Convert.utf8ToHex("test")
                },
                id:"61756da16527b01ee40b6091"
            }
        ];
        beforeEach(() => {
            sandbox.on((client as any).metadataRoutesApi, 'getMosaicMetadata', (number) => Promise.resolve({ body: dto }));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getMetadatas(compositeHashes).subscribe(response => {
                expect(response[0].scopedMetadataKey.compact()).to.be.equal(1);
                expect(response[0].metadataType).to.be.equal(MetadataType.NAMESPACE);
                expect(response[0].value).to.be.equal("74657374");
                expect(response[0].valueSize).to.be.equal(4);

                expect(response[1].scopedMetadataKey.compact()).to.be.equal(1);
                expect(response[1].metadataType).to.be.equal(MetadataType.ACCOUNT);
                expect(response[1].value).to.be.equal("74657374");
                expect(response[1].valueSize).to.be.equal(4);
                done();
            })
        });
    });
});