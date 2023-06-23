import * as chai from 'chai';
import * as spies from 'chai-spies';
import { LiquidityProviderHttp } from '../../src/infrastructure/infrastructure';
import { NetworkType, PublicAccount, MosaicId, UInt64 } from '../../src/model/model';
import { of } from 'rxjs';
import { Convert, RawAddress } from '../../src/core/format';

chai.use(spies);
const expect = chai.expect;

const client = new LiquidityProviderHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

const networkType = NetworkType.MIJIN_TEST;

describe('LiquidityProviderHttp', () => {

    describe('getLiquidityProvider', () => {
        const dto = {
            "liquidityProvider":{
                "mosaicId":[519256100,642862634],
                "providerKey":"928B5F72489A7BD8958BA8E41A96912641544F8C838BD446C2E089999A83029A",
                "owner":"1D476925C03C2BE4CB799AF06EDBF87D63A5F2F13BD1385E3B94A1ED0C8F7DDF",
                "additionallyMinted":[0,0],
                "slashingAccount":"0000000000000000000000000000000000000000000000000000000000000000",
                "slashingPeriod":500,
                "windowSize":5,
                "creationHeight":[5164375,0],
                "alpha":500,
                "beta":500,
                "turnoverHistory":[
                    {
                    "rate":{
                            "currencyAmount":[1000000,0],
                            "mosaicAmount":[100000,0]
                        },
                    "turnover":[0,0]
                    },
                    {
                        "rate":{
                            "currencyAmount":[1000000,0],
                            "mosaicAmount":[100000,0]
                        },
                        "turnover":[0,0]
                    },
                    {
                        "rate":{
                            "currencyAmount":[1000000,0],
                            "mosaicAmount":[100000,0]
                        },
                        "turnover":[0,0]
                    },
                    {
                        "rate":{
                            "currencyAmount":[1000000,0],
                            "mosaicAmount":[100000,0]
                        },
                        "turnover":[0,0]
                    },
                    {
                        "rate":{
                            "currencyAmount":[1000000,0],
                            "mosaicAmount":[100000,0]
                        },
                        "turnover":[0,0]
                    }
                ],
                "recentTurnover":{
                    "rate":{
                        "currencyAmount":[1000000,0],
                        "mosaicAmount":[100000,0]
                    },
                    "turnover":[0,0]
                }
            }};
        beforeEach(() => {
            sandbox.on((client as any).liquidityProviderRoutesApi, 'getLiquidityProvider', () => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getLiquidityProvider("928B5F72489A7BD8958BA8E41A96912641544F8C838BD446C2E089999A83029A").subscribe(response => {
                expect(response.providerKey).to.be.equal("928B5F72489A7BD8958BA8E41A96912641544F8C838BD446C2E089999A83029A");
                expect(response.owner).to.be.equal("1D476925C03C2BE4CB799AF06EDBF87D63A5F2F13BD1385E3B94A1ED0C8F7DDF");
                expect(response.additionallyMinted.compact()).to.be.equal(0);
                expect(response.slashingAccount).to.be.equal("0000000000000000000000000000000000000000000000000000000000000000");
                expect(response.slashingPeriod).to.be.equal(500);
                expect(response.windowSize).to.be.equal(5);
                expect(response.creationHeight.compact()).to.be.equal(5164375);
                expect(response.alpha).to.be.equal(500);
                expect(response.beta).to.be.equal(500);
                done();
            })
        });
    });

    describe('searchLiquidityProviders', () => {

        const dto = {
            data:[
                {
                "liquidityProvider":{
                    "mosaicId":[519256100,642862634],
                    "providerKey":"928B5F72489A7BD8958BA8E41A96912641544F8C838BD446C2E089999A83029A",
                    "owner":"1D476925C03C2BE4CB799AF06EDBF87D63A5F2F13BD1385E3B94A1ED0C8F7DDF",
                    "additionallyMinted":[0,0],
                    "slashingAccount":"0000000000000000000000000000000000000000000000000000000000000000",
                    "slashingPeriod":500,
                    "windowSize":5,
                    "creationHeight":[5164375,0],
                    "alpha":500,
                    "beta":500,
                    "turnoverHistory":[
                        {
                        "rate":{
                                "currencyAmount":[1000000,0],
                                "mosaicAmount":[100000,0]
                            },
                        "turnover":[0,0]
                        },
                        {
                            "rate":{
                                "currencyAmount":[1000000,0],
                                "mosaicAmount":[100000,0]
                            },
                            "turnover":[0,0]
                        },
                        {
                            "rate":{
                                "currencyAmount":[1000000,0],
                                "mosaicAmount":[100000,0]
                            },
                            "turnover":[0,0]
                        },
                        {
                            "rate":{
                                "currencyAmount":[1000000,0],
                                "mosaicAmount":[100000,0]
                            },
                            "turnover":[0,0]
                        },
                        {
                            "rate":{
                                "currencyAmount":[1000000,0],
                                "mosaicAmount":[100000,0]
                            },
                            "turnover":[0,0]
                        }
                    ],
                    "recentTurnover":{
                        "rate":{
                            "currencyAmount":[1000000,0],
                            "mosaicAmount":[100000,0]
                        },
                        "turnover":[0,0]
                    }
                },
                "meta":{
                    "id":"64947481ccaf12c8e52c4b76"
                }
            },
            {"liquidityProvider":{"mosaicId":[145530229,1818060917],"providerKey":"B89E4EA179CA9F6222C786FF7A49FAC58BDEEFA7455D092C0D67C4CBA456F44E","owner":"1D476925C03C2BE4CB799AF06EDBF87D63A5F2F13BD1385E3B94A1ED0C8F7DDF","additionallyMinted":[0,0],"slashingAccount":"0000000000000000000000000000000000000000000000000000000000000000","slashingPeriod":500,"windowSize":5,"creationHeight":[5164376,0],"alpha":500,"beta":500,"turnoverHistory":[{"rate":{"currencyAmount":[1000000,0],"mosaicAmount":[100000,0]},"turnover":[0,0]},{"rate":{"currencyAmount":[1000000,0],"mosaicAmount":[100000,0]},"turnover":[0,0]},{"rate":{"currencyAmount":[1000000,0],"mosaicAmount":[100000,0]},"turnover":[0,0]},{"rate":{"currencyAmount":[1000000,0],"mosaicAmount":[100000,0]},"turnover":[0,0]},{"rate":{"currencyAmount":[1000000,0],"mosaicAmount":[100000,0]},"turnover":[0,0]}],"recentTurnover":{"rate":{"currencyAmount":[1000000,0],"mosaicAmount":[100000,0]},"turnover":[0,0]}},"meta":{"id":"64947490ccaf12c8e52c4b91"}},
            {"liquidityProvider":{"mosaicId":[1700609469,1843578377],"providerKey":"1DF34DC38DDF62036246BA1063D84FB9FA898186B54FB6AAB1E197D79D498F59","owner":"1D476925C03C2BE4CB799AF06EDBF87D63A5F2F13BD1385E3B94A1ED0C8F7DDF","additionallyMinted":[82420,0],"slashingAccount":"0000000000000000000000000000000000000000000000000000000000000000","slashingPeriod":500,"windowSize":5,"creationHeight":[5164463,0],"alpha":500,"beta":500,"turnoverHistory":[{"rate":{"currencyAmount":[1000000,0],"mosaicAmount":[100000,0]},"turnover":[0,0]},{"rate":{"currencyAmount":[1000000,0],"mosaicAmount":[100000,0]},"turnover":[870181,0]},{"rate":{"currencyAmount":[1837059,0],"mosaicAmount":[181920,0]},"turnover":[0,0]},{"rate":{"currencyAmount":[1807744,0],"mosaicAmount":[181920,0]},"turnover":[15156,0]},{"rate":{"currencyAmount":[1813460,0],"mosaicAmount":[182420,0]},"turnover":[0,0]}],"recentTurnover":{"rate":{"currencyAmount":[1813460,0],"mosaicAmount":[182420,0]},"turnover":[0,0]}},"meta":{"id":"649479a9ccaf12c8e52c5346"}},
            {"liquidityProvider":{"mosaicId":[1128464668,1776116973],"providerKey":"DCBEF7710397C812A9365726B459B55A0DE2D75310A7CE052524EA159A32BBEF","owner":"1D476925C03C2BE4CB799AF06EDBF87D63A5F2F13BD1385E3B94A1ED0C8F7DDF","additionallyMinted":[164840,0],"slashingAccount":"0000000000000000000000000000000000000000000000000000000000000000","slashingPeriod":500,"windowSize":5,"creationHeight":[5164466,0],"alpha":500,"beta":500,"turnoverHistory":[{"rate":{"currencyAmount":[1000000,0],"mosaicAmount":[100000,0]},"turnover":[0,0]},{"rate":{"currencyAmount":[1000000,0],"mosaicAmount":[100000,0]},"turnover":[1752946,0]},{"rate":{"currencyAmount":[2733870,0],"mosaicAmount":[263840,0]},"turnover":[0,0]},{"rate":{"currencyAmount":[2683300,0],"mosaicAmount":[263840,0]},"turnover":[31226,0]},{"rate":{"currencyAmount":[2605269,0],"mosaicAmount":[264840,0]},"turnover":[0,0]}],"recentTurnover":{"rate":{"currencyAmount":[2605269,0],"mosaicAmount":[264840,0]},"turnover":[0,0]}},"meta":{"id":"649479d6ccaf12c8e52c5398"}}],"pagination":{"totalEntries":4,"pageNumber":1,"pageSize":20,"totalPages":1}};

        beforeEach(() => {
            sandbox.on((client as any).liquidityProviderRoutesApi, 'searchLiquidityProviders', () => Promise.resolve({ body: dto }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.searchLiquidityProviders().subscribe(responses => {
                expect(responses.liquidityProviders.length).to.be.equal(4);
                expect(responses.liquidityProviders[0].owner).to.be.equal("1D476925C03C2BE4CB799AF06EDBF87D63A5F2F13BD1385E3B94A1ED0C8F7DDF");
                expect(responses.liquidityProviders[0].slashingAccount).to.be.equal("0000000000000000000000000000000000000000000000000000000000000000");
                expect(responses.liquidityProviders[0].mosaicId.toHex()).to.be.equal(new MosaicId([519256100,642862634]).toHex());
                expect(responses.pagination.totalEntries).to.be.equal(4);
                expect(responses.pagination.pageNumber).to.be.equal(1);
                expect(responses.pagination.pageSize).to.be.equal(20);
                expect(responses.pagination.totalPages).to.be.equal(1);
                done();
            })
        });
    });
});