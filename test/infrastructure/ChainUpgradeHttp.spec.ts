import * as chai from 'chai';
import * as spies from 'chai-spies';
import { ChainUpgradeHttp } from '../../src/infrastructure/infrastructure';
import { UInt64, BlockChainVersion } from '../../src/model/model';

chai.use(spies);
const expect = chai.expect;

const client = new ChainUpgradeHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

describe('ChainUpgradeHttp', () => {

    describe('getChainUpgrade', () => {
        const dto = {
            blockchainUpgrade: {
                height: UInt64.fromUint(666).toDTO(),
                blockChainVersion: [196608, 4]
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).upgradeRoutesApi, 'getUpgrade', () => Promise.resolve({ body: dto }));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getChainUpgrade(666).subscribe(response => {
                expect(response.height.compact()).to.be.equal(666);
                expect(response.catapultVersion.build).to.be.equal(0);
                expect(response.catapultVersion.revision).to.be.equal(3);
                expect(response.catapultVersion.minor).to.be.equal(4);
                expect(response.catapultVersion.major).to.be.equal(0);
                done();
            })
        });
    });
});