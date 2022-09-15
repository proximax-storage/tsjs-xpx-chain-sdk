import * as chai from 'chai';
import * as spies from 'chai-spies';
import { HarvesterHttp } from '../../src/infrastructure/infrastructure';
import { NetworkType, PublicAccount, MosaicId, UInt64 } from '../../src/model/model';
import { of } from 'rxjs';
import { Convert, RawAddress } from '../../src/core/format';

chai.use(spies);
const expect = chai.expect;

const client = new HarvesterHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

const networkType = NetworkType.MIJIN_TEST;
const publicAccount = PublicAccount.createFromPublicKey('6'.repeat(64), networkType);
const address = publicAccount.address;
const harvesterKey = PublicAccount.createFromPublicKey("F6A9951DDB2B9EF2C7EB5132654562FC6D2308B42AEAAFD11097B232F429AF70", networkType);

describe('HarvesterHttp', () => {

    describe('getAccountHarvestingHarvesterInfo', () => {
        const dto = [{
            harvester:{
                key:"F6A9951DDB2B9EF2C7EB5132654562FC6D2308B42AEAAFD11097B232F429AF70",
                owner:"8EED2CC22BE42B042DC35755002FDA49F3E542D990D2FB1EEE85E6CD9EBD873D",
                address:"A8ACDFFFDED55AB29A0187A282CC5F596CEE8640DD3DAD0A4A",
                disabledHeight:[0,0],
                lastSigningBlockHeight:[4382519,0],
                effectiveBalance:[635406468,93728],
                canHarvest:true,
                activity:200.9680767848939,
                greed:1
            }}];
        beforeEach(() => {
            sandbox.on((client as any).harvesterRoutesApi, 'getAccountHarvestingHarvesterInfo', () => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getAccountHarvestingHarvesterInfo(harvesterKey).subscribe(response => {
                expect(response[0].harvesterKey.publicKey).to.be.equal(harvesterKey.publicKey);
                expect(response[0].owner.publicKey).to.be.equal("8EED2CC22BE42B042DC35755002FDA49F3E542D990D2FB1EEE85E6CD9EBD873D");
                expect(response[0].disabledHeight.compact()).to.be.equal(0);
                expect(response[0].lastSigningBlockHeight.compact()).to.be.equal(4382519);
                expect(response[0].effectiveBalance.toDTO()[0]).to.be.equal(635406468);
                expect(response[0].effectiveBalance.toDTO()[1]).to.be.equal(93728);
                expect(response[0].canHarvest).to.be.equal(true);
                expect(response[0].activity).to.be.equal(200.9680767848939);
                expect(response[0].greed).to.be.equal(1);
                done();
            })
        });
    });

    describe('searchHarvesters', () => {

        const dto = {
            data:[
                {
                    harvester: {
                        key:"F6A9951DDB2B9EF2C7EB5132654562FC6D2308B42AEAAFD11097B232F429AF70",
                        owner:"8EED2CC22BE42B042DC35755002FDA49F3E542D990D2FB1EEE85E6CD9EBD873D",
                        address:"A8ACDFFFDED55AB29A0187A282CC5F596CEE8640DD3DAD0A4A",
                        disabledHeight:[0,0],
                        lastSigningBlockHeight:[4382519,0],
                        effectiveBalance:[635406468,93728],
                        canHarvest:true,
                        activity:200.9680767848939,
                        greed:1
                    },
                    meta:{
                        id:"62c5b35336e08889d3f5daf0"
                    }
                },
                {
                    harvester:{
                        key:"E94CF58CEFCB1E9F590B8D190807CA4B6EF51A39847A64CDC6DB344B5AE16A6E",
                        owner:"8EED2CC22BE42B042DC35755002FDA49F3E542D990D2FB1EEE85E6CD9EBD873D",
                        address:"A83EA09FABB61A8141DDB4419534BFB021A0057B1CAB90913A",
                        disabledHeight:[0,0],
                        lastSigningBlockHeight:[4382525,0],
                        effectiveBalance:[1496209287,47157],
                        canHarvest:false,
                        activity:95.86773678495963,
                        greed:1
                    },
                    meta:{
                        id:"62c5b48136e08889d3f5ddf1"
                    }
                },
            ],
            pagination:{
                "totalEntries":6,"pageNumber":1,"pageSize":20,"totalPages":1
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).harvesterRoutesApi, 'searchHarvesters', () => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.searchHarvesters().subscribe(responses => {
                expect(responses.harvestersMetaInfo.length).to.be.equal(2);
                expect(responses.harvestersMetaInfo[0].harvesterKey.publicKey).to.be.equal("F6A9951DDB2B9EF2C7EB5132654562FC6D2308B42AEAAFD11097B232F429AF70");
                expect(responses.harvestersMetaInfo[1].harvesterKey.publicKey).to.be.equal("E94CF58CEFCB1E9F590B8D190807CA4B6EF51A39847A64CDC6DB344B5AE16A6E");
                expect(responses.pagination.totalEntries).to.be.equal(6);
                expect(responses.pagination.pageNumber).to.be.equal(1);
                expect(responses.pagination.pageSize).to.be.equal(20);
                expect(responses.pagination.totalPages).to.be.equal(1);
                done();
            })
        });
    });
});