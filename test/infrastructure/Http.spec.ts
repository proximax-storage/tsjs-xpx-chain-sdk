import * as chai from 'chai';
import {Http} from '../../src/infrastructure/Http';
import {Order} from '../../src/infrastructure/QueryParams';

const expect = chai.expect;

describe('Http', () => {

    class TestHttp extends Http {}
    const testHttp = new TestHttp();

    describe('queryParams', () => {

        it('should get undefined values when no param', () => {
            const result = testHttp.queryParams(undefined);

            expect(result.page).to.be.undefined;
            expect(result.id).to.be.undefined;
            expect(result.order).to.be.undefined;
        });

        it('should get values', () => {
            const q = {
                id: 'aaaaaaaaaaaaaaaa',
                pageSize: 100,
                order: Order.DESC,
            };
            const result = testHttp.queryParams(q);

            expect(result.id).to.be.equal('aaaaaaaaaaaaaaaa');
            expect(result.pageSize).to.be.equal(100);
            expect(result.order).to.be.equal(Order.DESC);
        });
    });

    describe('pageQueryParams', () => {

        it('should get undefined values when no param', () => {
            const result = testHttp.pageQueryParams(undefined);

            expect(result.page).to.be.undefined;
            expect(result.pageSize).to.be.undefined;
        });

        it('should get values', () => {
            const q = {
                page: 5,
                pageSize: 100,
            };
            const result = testHttp.pageQueryParams(q);

            expect(result.page).to.be.equal(5);
            expect(result.pageSize).to.be.equal(100);
        });
    });
});
