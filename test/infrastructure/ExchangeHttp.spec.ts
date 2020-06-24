import * as chai from 'chai';
import * as spies from 'chai-spies';
import { ExchangeHttp } from '../../src/infrastructure/infrastructure';
import { UInt64, ExchangeOfferType, MosaicId, NetworkType, PublicAccount } from '../../src/model/model';
import { of } from 'rxjs';
import { AccountExchanges } from '../../src/model/exchange/AccountExchanges';

chai.use(spies);
const expect = chai.expect;

const client = new ExchangeHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

describe('ExchangeHttp', () => {

    describe('getAccountExchanges', () => {
        const offerDto = {
            mosaicId: [666, 777],
            amount: UInt64.fromUint(22222).toDTO(),
            price: 888,
            initialAmount: UInt64.fromUint(33333).toDTO(),
            initialCost: UInt64.fromUint(44444).toDTO(),
            deadline: [888, 999],
        };
        const dto = {
            exchange: {
                owner: 'a'.repeat(64),
                buyOffers: [offerDto],
                sellOffers: [offerDto, offerDto]
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).exchangeRoutesApi, 'getAccountExchangeOffers', (number) => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getAccountExchanges(PublicAccount.createFromPublicKey('a'.repeat(64), NetworkType.MIJIN_TEST)).subscribe(response => {
                expect(response).not.to.be.undefined;
                const r = response as any as AccountExchanges;
                expect(r.owner.publicKey).to.be.equal('a'.repeat(64));
                expect(r.buyOffers.length).to.be.equal(1);
                expect(r.sellOffers.length).to.be.equal(2);

                expect(r.buyOffers[0].mosaicId.toDTO().id[0]).to.be.equal(666);
                expect(r.buyOffers[0].mosaicId.toDTO().id[1]).to.be.equal(777);
                expect(r.buyOffers[0].amount.compact()).to.be.equal(22222);
                expect(r.buyOffers[0].price).to.be.equal(888);
                expect(r.buyOffers[0].initialAmount.compact()).to.be.equal(33333);
                expect(r.buyOffers[0].initialCost.compact()).to.be.equal(44444);
                expect(r.buyOffers[0].deadline.toDTO()[0]).to.be.equal(888);
                expect(r.buyOffers[0].deadline.toDTO()[1]).to.be.equal(999);

                expect(r.sellOffers[0].mosaicId.toDTO().id[0]).to.be.equal(666);
                expect(r.sellOffers[0].mosaicId.toDTO().id[1]).to.be.equal(777);
                expect(r.sellOffers[0].amount.compact()).to.be.equal(22222);
                expect(r.sellOffers[0].price).to.be.equal(888);
                expect(r.sellOffers[0].initialAmount.compact()).to.be.equal(33333);
                expect(r.sellOffers[0].initialCost.compact()).to.be.equal(44444);
                expect(r.sellOffers[0].deadline.toDTO()[0]).to.be.equal(888);
                expect(r.sellOffers[0].deadline.toDTO()[1]).to.be.equal(999);

                expect(r.sellOffers[1].mosaicId.toDTO().id[0]).to.be.equal(666);
                expect(r.sellOffers[1].mosaicId.toDTO().id[1]).to.be.equal(777);
                expect(r.sellOffers[1].amount.compact()).to.be.equal(22222);
                expect(r.sellOffers[1].price).to.be.equal(888);
                expect(r.sellOffers[1].initialAmount.compact()).to.be.equal(33333);
                expect(r.sellOffers[1].initialCost.compact()).to.be.equal(44444);
                expect(r.sellOffers[1].deadline.toDTO()[0]).to.be.equal(888);
                expect(r.sellOffers[1].deadline.toDTO()[1]).to.be.equal(999);

                done();
            })
        });
    });

    describe('getExchangeOffers', () => {
        const dto = [{
            mosaicId: [666, 777],
            owner: 'a'.repeat(64),
            amount: UInt64.fromUint(22222).toDTO(),
            price: 888,
            initialAmount: UInt64.fromUint(33333).toDTO(),
            initialCost: UInt64.fromUint(44444).toDTO(),
            deadline: [888, 999],
        }];
        beforeEach(() => {
            sandbox.on((client as any).exchangeRoutesApi, 'getExchangeOffers', (number) => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getExchangeOffers(ExchangeOfferType.BUY_OFFER, new MosaicId([666,999])).subscribe(response => {
                expect(response.length).to.be.equal(1);
                expect(response[0].mosaicId.toDTO().id[0]).to.be.equal(666);
                expect(response[0].mosaicId.toDTO().id[1]).to.be.equal(777);
                expect(response[0].owner.publicKey).to.be.equal('a'.repeat(64));
                expect(response[0].amount.compact()).to.be.equal(22222);
                expect(response[0].price).to.be.equal(888);
                expect(response[0].initialAmount.compact()).to.be.equal(33333);
                expect(response[0].initialCost.compact()).to.be.equal(44444);
                expect(response[0].deadline.toDTO()[0]).to.be.equal(888);
                expect(response[0].deadline.toDTO()[1]).to.be.equal(999);
                done();
            })
        });
    });

});