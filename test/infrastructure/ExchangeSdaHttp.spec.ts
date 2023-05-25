import * as chai from 'chai';
import * as spies from 'chai-spies';
import { ExchangeSdaHttp } from '../../src/infrastructure/infrastructure';
import { UInt64, SdaExchangeOfferType, MosaicId, NetworkType, PublicAccount } from '../../src/model/model';
import { of } from 'rxjs';
import { AccountSdaExchanges } from '../../src/model/exchangeSda/AccountSdaExchanges';

chai.use(spies);
const expect = chai.expect;

const client = new ExchangeSdaHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

describe('ExchangeSdaHttp', () => {

    describe('getAccountSdaExchanges', () => {
        const offerDto = {
            mosaicIdGive:[3450824427,234364113],
            mosaicIdGet:[987026907,410233246],
            currentMosaicGiveAmount:[300,0],
            currentMosaicGetAmount:[150,0],
            initialMosaicGiveAmount:[500,0],
            initialMosaicGetAmount:[250,0],
            deadline:[4039697,0],
        }
        const dto = {
            exchangesda: {
                owner: 'a'.repeat(64),
                version: 1,
                sdaOfferBalances: [offerDto, offerDto],
                expiredSdaOfferBalances: []
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).exchangeSdaRoutesApi, 'getAccountSdaExchangeOffers', (number) => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getAccountSdaExchangeOffers(PublicAccount.createFromPublicKey('a'.repeat(64), NetworkType.MIJIN_TEST)).subscribe(response => {
                expect(response).not.to.be.undefined;
                const r = response as any as AccountSdaExchanges;
                expect(r.owner.publicKey).to.be.equal('a'.repeat(64));
                expect(r.sdaOfferBalances.length).to.be.equal(2);

                expect(r.sdaOfferBalances[0].mosaicIdGive.toDTO().id[0]).to.be.equal(3450824427);
                expect(r.sdaOfferBalances[0].mosaicIdGive.toDTO().id[1]).to.be.equal(234364113);
                expect(r.sdaOfferBalances[0].mosaicIdGet.toDTO().id[0]).to.be.equal(987026907);
                expect(r.sdaOfferBalances[0].mosaicIdGet.toDTO().id[1]).to.be.equal(410233246);
                expect(r.sdaOfferBalances[0].currentMosaicGiveAmount.compact()).to.be.equal(300);
                expect(r.sdaOfferBalances[0].currentMosaicGetAmount.compact()).to.be.equal(150);
                expect(r.sdaOfferBalances[0].initialMosaicGiveAmount.compact()).to.be.equal(500);
                expect(r.sdaOfferBalances[0].initialMosaicGetAmount.compact()).to.be.equal(250);
                expect(r.sdaOfferBalances[0].deadline.toDTO()[0]).to.be.equal(4039697);
                expect(r.sdaOfferBalances[0].deadline.toDTO()[1]).to.be.equal(0);

                done();
            })
        });
    });

    describe('getSdaExchangeOffers', () => {
        const dto = [
            {
                mosaicIdGive:[3450824427,234364113],
                mosaicIdGet:[987026907,410233246],
                currentMosaicGiveAmount:[300,0],
                currentMosaicGetAmount:[150,0],
                initialMosaicGiveAmount:[500,0],
                initialMosaicGetAmount:[250,0],
                deadline:[4039697,0],
                owner: "8EDDA7E0730B2BD9AED9C5C8C22ADD504B8528796C2B55392A4618A80D7FC520"
            }
        ];
        beforeEach(() => {
            sandbox.on((client as any).exchangeSdaRoutesApi, 'getExchangeSdaOffers', (number) => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client - give', (done) => {
            client.getExchangeSdaOffers(SdaExchangeOfferType.GIVE, new MosaicId([3450824427,234364113])).subscribe(response => {
                expect(response.length).to.be.equal(1);

                expect(response[0].mosaicIdGive.toDTO().id[0]).to.be.equal(3450824427);
                expect(response[0].mosaicIdGive.toDTO().id[1]).to.be.equal(234364113);
                expect(response[0].mosaicIdGet.toDTO().id[0]).to.be.equal(987026907);
                expect(response[0].mosaicIdGet.toDTO().id[1]).to.be.equal(410233246);
                expect(response[0].currentMosaicGiveAmount.compact()).to.be.equal(300);
                expect(response[0].currentMosaicGetAmount.compact()).to.be.equal(150);
                expect(response[0].initialMosaicGiveAmount.compact()).to.be.equal(500);
                expect(response[0].initialMosaicGetAmount.compact()).to.be.equal(250);
                expect(response[0].deadline.toDTO()[0]).to.be.equal(4039697);
                expect(response[0].deadline.toDTO()[1]).to.be.equal(0);

                done();
            })
        });

        it('should call api client - get', (done) => {
            client.getExchangeSdaOffers(SdaExchangeOfferType.GET, new MosaicId([987026907,410233246])).subscribe(response => {
                expect(response.length).to.be.equal(1);

                expect(response[0].mosaicIdGive.toDTO().id[0]).to.be.equal(3450824427);
                expect(response[0].mosaicIdGive.toDTO().id[1]).to.be.equal(234364113);
                expect(response[0].mosaicIdGet.toDTO().id[0]).to.be.equal(987026907);
                expect(response[0].mosaicIdGet.toDTO().id[1]).to.be.equal(410233246);
                expect(response[0].currentMosaicGiveAmount.compact()).to.be.equal(300);
                expect(response[0].currentMosaicGetAmount.compact()).to.be.equal(150);
                expect(response[0].initialMosaicGiveAmount.compact()).to.be.equal(500);
                expect(response[0].initialMosaicGetAmount.compact()).to.be.equal(250);
                expect(response[0].deadline.toDTO()[0]).to.be.equal(4039697);
                expect(response[0].deadline.toDTO()[1]).to.be.equal(0);

                done();
            })
        });
    });

});