import {expect} from 'chai';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { AccountHttp } from '../../src/infrastructure/AccountHttp';
import { MosaicHttp } from '../../src/infrastructure/MosaicHttp';
import { ChainHttp } from '../../src/infrastructure/ChainHttp';
import { Address } from '../../src/model/account/Address';
import { MosaicService } from '../../src/service/MosaicService';
import { APIUrl, GetNemesisBlockDataPromise, SeedAccount } from '../conf/conf.spec';
import { MosaicId, MosaicView, MosaicAmountView, MosaicInfo, UInt64, Mosaic } from '../../src/model/model';

describe('MosaicService', () => {
    let accountAddress: Address;
    let accountHttp: AccountHttp;
    let mosaicHttp: MosaicHttp;
    let chainHttp: ChainHttp;

    it('mosaicsView', () => {
        const mosaicId = new MosaicId([3294802500, 2243684972]);
        const mosaicService = new MosaicService(
            new AccountHttp(APIUrl), new MosaicHttp(APIUrl), new ChainHttp(APIUrl));
        return mosaicService.mosaicsView([mosaicId]).subscribe((mosaicsView: MosaicView[]) => {
            const mosaicView = mosaicsView[0];
            expect(mosaicView.mosaicInfo).to.be.an.instanceof(MosaicInfo);
        });
    });

    it('mosaicsView of no existing mosaicId', () => {
        const mosaicId = new MosaicId([1234, 1234]);
        const mosaicService = new MosaicService(
            new AccountHttp(APIUrl), new MosaicHttp(APIUrl), new ChainHttp(APIUrl));
        return mosaicService.mosaicsView([mosaicId]).subscribe((mosaicsView: MosaicView[]) => {
            expect(mosaicsView.length).to.be.equal(0);
        });
    });

    it('mosaicsAmountView', () => {
        const mosaicService = new MosaicService(
            new AccountHttp(APIUrl), new MosaicHttp(APIUrl), new ChainHttp(APIUrl));
        return mosaicService.mosaicsAmountViewFromAddress(Address.createFromRawAddress('SARNASAS2BIAB6LMFA3FPMGBPGIJGK6IJETM3ZSP'))
            .subscribe((mosaicsAmountView: MosaicAmountView[]) => {
                const mosaicAmountView = mosaicsAmountView[0];
                expect(mosaicAmountView.mosaicInfo).to.be.an.instanceof(MosaicInfo);
            });
    });

    it('mosaicsAmountView of no existing account', () => {
        const mosaicService = new MosaicService(
            new AccountHttp(APIUrl), new MosaicHttp(APIUrl), new ChainHttp(APIUrl));
        return mosaicService.mosaicsAmountViewFromAddress(Address.createFromRawAddress('SCKBZAMIQ6F46QMZUANE6E33KA63KA7KEQ5X6WJW'))
            .subscribe((mosaicsAmountView: MosaicAmountView[]) => {
                expect(mosaicsAmountView.length).to.be.equal(0);
            });
    });

    it('mosaicsAmountView', () => {
        const mosaic = new Mosaic(new MosaicId([3646934825, 3576016193]), UInt64.fromUint(1000));
        const mosaicService = new MosaicService(
            new AccountHttp(APIUrl), new MosaicHttp(APIUrl), new ChainHttp(APIUrl));
        return mosaicService.mosaicsAmountView([mosaic]).subscribe((mosaicsAmountView: MosaicAmountView[]) => {
            const mosaicAmountView = mosaicsAmountView[0];
            expect(mosaicAmountView.mosaicInfo).to.be.an.instanceof(MosaicInfo);
            expect(mosaicAmountView.amount.compact()).to.be.equal(1000);
        });
    });

    it('should return the mosaic list skipping the expired mosaics', () => {
        const mosaicService = new MosaicService(
            new AccountHttp(APIUrl), new MosaicHttp(APIUrl), new ChainHttp(APIUrl));

        return GetNemesisBlockDataPromise().then(data => {
            return mosaicService.mosaicsAmountViewFromAddress(SeedAccount.address).pipe(
                mergeMap((_: MosaicAmountView[]) => _),
                map((mosaic: MosaicAmountView) => console.log('You have', mosaic.relativeAmount(), mosaic.fullName())),
                toArray(),
            ).toPromise();
        });

    });
});
