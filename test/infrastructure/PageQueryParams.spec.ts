import * as chai from 'chai';
import {Http} from '../../src/infrastructure/Http';
import {PageQueryParams} from '../../src/infrastructure/PageQueryParams';
import {Order} from '../../src/infrastructure/QueryParams';

const expect = chai.expect;

describe('PageQueryParams', () => {

    describe('constructor', () => {
        it('should get default values when no param', () => {
            const result = new PageQueryParams(undefined, undefined);

            expect(result.page).to.be.equal(0);
            expect(result.pageSize).to.be.equal(25);
        });

        it('should get default values when invalid param', () => {
            const result = new PageQueryParams(500, -1);

            expect(result.page).to.be.equal(0);
            expect(result.pageSize).to.be.equal(25);
        });

        it('should get values provided', () => {
            const result = new PageQueryParams(50, 5);

            expect(result.page).to.be.equal(5);
            expect(result.pageSize).to.be.equal(50);
        });
    });
});
