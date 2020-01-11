import * as chai from 'chai';
import * as spies from 'chai-spies';
import { DiagnosticHttp } from '../../src/infrastructure/infrastructure';

chai.use(spies);
const expect = chai.expect;

const client = new DiagnosticHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

describe('DiagnosticHttp', () => {

    describe('getDiagnosticStorage', () => {
        const dto = {
            numAccounts: 333,
            numBlocks: 666,
            numTransactions: 999
        };
        beforeEach(() => {
            sandbox.on((client as any).diagnosticRoutesApi, 'getDiagnosticStorage', () => Promise.resolve(dto));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getDiagnosticStorage().subscribe(response => {
                expect(response.numAccounts).to.be.equal(333);
                expect(response.numBlocks).to.be.equal(666);
                expect(response.numTransactions).to.be.equal(999);
                done();
            })
        });
    });
    describe('getServerInfo', () => {
        const dto = {
            serverInfo: {
                restVersion: 'some rest version',
                sdkVersion: 'some sdk version'
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).diagnosticRoutesApi, 'getServerInfo', () => Promise.resolve(dto));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getServerInfo().subscribe(response => {
                expect(response.restVersion).to.be.equal('some rest version');
                expect(response.sdkVersion).to.be.equal('some sdk version');
                done();
            })
        });
    });
});