import * as chai from 'chai';
import * as spies from 'chai-spies';
import { BlockHttp } from '../../src/infrastructure/infrastructure';
import { deepEqual } from 'assert';
import * as createFromDto from '../../src/infrastructure/transaction/CreateTransactionFromDTO';
import * as dtoMapping from '../../src/core/utils/DtoMapping'
import { NetworkType, PublicAccount } from '../../src/model/model';
import { RawAddress, Convert } from '../../src/core/format';
import { of } from 'rxjs';

chai.use(spies);
const expect = chai.expect;

const client = new BlockHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

const networkType = NetworkType.MIJIN_TEST;
const publicAccount = PublicAccount.createFromPublicKey('6'.repeat(64), networkType);
const address = publicAccount.address;

describe('BlockHttp', () => {

    describe('getBlockTransactions', () => {
        beforeEach(() => {
            sandbox.on((client as any).blockRoutesApi, 'getBlockTransactions', (number) => Promise.resolve(['api called']));
            sandbox.on(createFromDto, 'CreateTransactionFromDTO', (dto) => dto === 'api called' ? 'deserialization called' : 'not ok');
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getBlockTransactions(666).subscribe(response => {
                expect(response.length).to.be.equal(1);
                expect(response[0]).to.be.equal('deserialization called');
                done();
            })
        });
    });

});