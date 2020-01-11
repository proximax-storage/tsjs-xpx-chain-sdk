import * as chai from 'chai';
import * as spies from 'chai-spies';
import { NetworkHttp } from '../../src/infrastructure/infrastructure';
import { NetworkType, PublicAccount } from '../../src/model/model';

chai.use(spies);
const expect = chai.expect;

const client = new NetworkHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

const networkType = NetworkType.MIJIN_TEST;
const publicAccount = PublicAccount.createFromPublicKey('6'.repeat(64), networkType);
const address = publicAccount.address;

describe('NetworkHttp', () => {

    describe('getNetworkType - unsupported', () => {
        const dto = {
            name: 'unsupported'
        };
        beforeEach(() => {
            sandbox.on((client as any).networkRoutesApi, 'getNetworkType', () => Promise.resolve(dto));
        });
        afterEach(() => {
            sandbox.restore();
        });

        it('should call api client', (done) => {
            client.getNetworkType().subscribe(
                _ => done('failed'),
                error => {
                    expect(error.message).to.be.equal('network unsupported is not supported yet by the sdk');
                    done();
                });
        });
    })

    describe('getNetworkType', () => {
        let i = 0;
        const nameValue = [
            ['mijinTest', NetworkType.MIJIN_TEST],
            ['mijin', NetworkType.MIJIN],
            ['testnet', NetworkType.TEST_NET],
            ['publicTest', NetworkType.TEST_NET],
            ['privateTest', NetworkType.PRIVATE_TEST],
            ['mainnet', NetworkType.MAIN_NET],
            ['public', NetworkType.MAIN_NET],
            ['private', NetworkType.PRIVATE]
        ];
        const getDto = (idx) => Promise.resolve({
            name: nameValue[idx][0]
        });
        beforeEach(() => {
            sandbox.on((client as any).networkRoutesApi, 'getNetworkType', () => Promise.resolve(getDto(i)));
        });
        afterEach(() => {
            sandbox.restore();
        });

        nameValue.forEach(value => {
            it('should call api client', (done) => {
                client.getNetworkType().subscribe(response => {
                    expect(response).to.be.equal(value[1]);
                    i += 1;
                    done();
                });
            });
        });
    })
});