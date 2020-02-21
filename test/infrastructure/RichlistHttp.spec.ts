import * as chai from 'chai';
import * as spies from 'chai-spies';
import {Convert, RawAddress} from '../../src/core/format';
import {RichlistHttp} from '../../src/infrastructure/RichlistHttp';
import { NetworkType, PublicAccount, MosaicId, UInt64 } from '../../src/model/model';
import { of } from 'rxjs';

chai.use(spies);
const expect = chai.expect;

const client = new RichlistHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

const networkType = NetworkType.MIJIN_TEST;
const publicAccount = PublicAccount.createFromPublicKey('6'.repeat(64), networkType);
const address = publicAccount.address;
const mosaicId = new MosaicId([66666,99999]);

describe('RichlistHttp', () => {

      describe('getMosaicRichlist', () => {
        const dto = {
            address: Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())),
            publicKey: publicAccount.publicKey,
            amount: UInt64.fromUint(999).toDTO(),
        };
        beforeEach(() => {
            sandbox.on((client as any).richlistRoutesApi, 'getMosaicRichlist', () => Promise.resolve({ body: [dto] }));
            sandbox.on(client, 'getNetworkTypeObservable', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getMosaicRichlist(mosaicId).subscribe(responses => {
                expect(responses.length).to.be.equal(1);
                responses.forEach(response => {
                    expect(response.address.plain()).to.be.equal(address.plain());
                    expect(response.publicKey).to.be.equal(publicAccount.publicKey);
                    expect(response.amount.toDTO()).to.be.deep.equal(dto.amount);
                });
                done();
            })
        });
    });
});
