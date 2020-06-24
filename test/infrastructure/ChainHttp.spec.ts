import * as chai from 'chai';
import * as spies from 'chai-spies';
import { ChainHttp } from '../../src/infrastructure/infrastructure';
import { UInt64 } from '../../src/model/model';

chai.use(spies);
const expect = chai.expect;

const client = new ChainHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

describe('ChainHttp', () => {

    describe('getBlockchainHeight', () => {
        const dto = {
            height: UInt64.fromUint(666).toDTO(),
        };
        beforeEach(() => {
            sandbox.on((client as any).chainRoutesApi, 'getBlockchainHeight', () => Promise.resolve({ body: dto }));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getBlockchainHeight().subscribe(response => {
                expect(response.compact()).to.be.equal(666);
                done();
            })
        });
    });

    describe('getBlockchainScore', () => {
        const dto = {
            scoreLow: UInt64.fromUint(666).toDTO(),
            scoreHigh: UInt64.fromUint(999).toDTO(),
        };
        beforeEach(() => {
            sandbox.on((client as any).chainRoutesApi, 'getBlockchainScore', () => Promise.resolve({ body: dto }));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getBlockchainScore().subscribe(response => {
                expect(response.scoreLow.compact()).to.be.equal(666);
                expect(response.scoreHigh.compact()).to.be.equal(999);
                done();
            })
        });
    });

});