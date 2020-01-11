import * as chai from 'chai';
import * as spies from 'chai-spies';
import { ChainConfigHttp } from '../../src/infrastructure/infrastructure';
import { UInt64 } from '../../src/model/model';

chai.use(spies);
const expect = chai.expect;

const client = new ChainConfigHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

describe('ChainConfigHttp', () => {

    describe('getChainConfig', () => {
        const dto = {
            networkConfig: {
                height: UInt64.fromUint(666).toDTO(),
                networkConfig: 'some network config',
                supportedEntityVersions: 'some supported entity versions'
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).configRoutesApi, 'getConfig', (number) => Promise.resolve(dto));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getChainConfig(666).subscribe(response => {
                expect(response.height.compact()).to.be.equal(666);
                expect(response.networkConfig).to.be.equal('some network config');
                expect(response.supportedEntityVersions).to.be.equal('some supported entity versions');
                done();
            })
        });
    });

});