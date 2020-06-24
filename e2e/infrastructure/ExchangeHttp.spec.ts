// Copyright 2020 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {expect} from 'chai';
import { APIUrl, ConfTestingMosaicId } from '../conf/conf.spec';
import { ExchangeHttp } from '../../src/infrastructure/ExchangeHttp';
import { TestingAccount, CosignatoryAccount } from '../../e2e/conf/conf.spec';
import { ExchangeOfferType } from '../../src/model/model';
import { AccountExchanges } from '../../src/model/exchange/AccountExchanges';

describe('ExchangeHttp', () => {
    const exchangeHttp = new ExchangeHttp(APIUrl);

    it('should get offers for an account', (done) => {
        exchangeHttp.getAccountExchanges(TestingAccount.publicAccount).subscribe(a => {
            const accountExchanges = a as AccountExchanges;
            expect(accountExchanges).not.to.be.undefined;
            expect(accountExchanges.owner).not.to.be.undefined;
            expect(accountExchanges.buyOffers).not.to.be.undefined;
            expect(accountExchanges.sellOffers).not.to.be.undefined;
            done();
        });
    });
    it('should get offers for an account, too', (done) => {
        exchangeHttp.getAccountExchanges(CosignatoryAccount.address).subscribe(a => {
            const accountExchanges = a as AccountExchanges;
            expect(accountExchanges).not.to.be.undefined;
            expect(accountExchanges.owner).not.to.be.undefined;
            expect(accountExchanges.buyOffers).not.to.be.undefined;
            expect(accountExchanges.sellOffers).not.to.be.undefined;
            done();
        });
    });
    it('should get buy offers for a mosaic', (done) => {
        exchangeHttp.getExchangeOffers(ExchangeOfferType.BUY_OFFER, ConfTestingMosaicId).subscribe(mosaicExchanges => {
            expect(mosaicExchanges).not.to.be.undefined;
            done();
        });
    });
    it('should get sell offers for a mosaic, too', (done) => {
        exchangeHttp.getExchangeOffers(ExchangeOfferType.SELL_OFFER, ConfTestingMosaicId).subscribe(mosaicExchanges => {
            expect(mosaicExchanges).not.to.be.undefined;
            done();
        });
    });

});
