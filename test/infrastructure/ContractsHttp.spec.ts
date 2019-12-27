import * as chai from 'chai';
import * as spies from 'chai-spies';
import { ContractHttp } from '../../src/infrastructure/infrastructure';
import { UInt64, NetworkType, PublicAccount } from '../../src/model/model';
import { deepEqual } from 'assert';

chai.use(spies);
const expect = chai.expect;

const client = new ContractHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

const networkType = NetworkType.MIJIN_TEST;
const publicAccount = PublicAccount.createFromPublicKey('6'.repeat(64), networkType);
const address = publicAccount.address;

describe('ContractHttp', () => {

    describe('getAccountContract', () => {
        const dto = {
            contract: {
                multisig: 'some multisig',
                multisigAddress: 'some multisig address',
                start: UInt64.fromUint(666).toDTO(),
                duration: UInt64.fromUint(999).toDTO(),
                hash: 'some hash',
                customers: ['some customer'],
                executors: ['some executor'],
                verifiers: ['some verifier']
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).contractRoutesApi, 'getAccountContract', () => Promise.resolve([dto]));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getAccountContract(publicAccount).subscribe(response => {
                expect(response.length).to.be.equal(1);
                deepEqual({// pre-process response so we can use deepEqual directly
                    ...response[0],
                    start: response[0].start.toDTO(),
                    duration: response[0].duration.toDTO()
                }, dto.contract);
                done();
            })
        });
    });
    describe('getAccountsContracts', () => {
        const dto = {
            contract: {
                multisig: 'some multisig',
                multisigAddress: 'some multisig address',
                start: UInt64.fromUint(666).toDTO(),
                duration: UInt64.fromUint(999).toDTO(),
                hash: 'some hash',
                customers: ['some customer'],
                executors: ['some executor'],
                verifiers: ['some verifier']
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).contractRoutesApi, 'getAccountContracts', () => Promise.resolve([dto]));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getAccountsContracts([publicAccount]).subscribe(response => {
                expect(response.length).to.be.equal(1);
                deepEqual({// pre-process response so we can use deepEqual directly
                    ...response[0],
                    start: response[0].start.toDTO(),
                    duration: response[0].duration.toDTO()
                }, dto.contract);
                done();
            })
        });
    });
    describe('getContract', () => {
        const dto = {
            contract: {
                multisig: 'some multisig',
                multisigAddress: 'some multisig address',
                start: UInt64.fromUint(666).toDTO(),
                duration: UInt64.fromUint(999).toDTO(),
                hash: 'some hash',
                customers: ['some customer'],
                executors: ['some executor'],
                verifiers: ['some verifier']
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).contractRoutesApi, 'getContract', () => Promise.resolve(dto));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getContract(address).subscribe(response => {
                deepEqual({// pre-process response so we can use deepEqual directly
                    ...response,
                    start: response.start.toDTO(),
                    duration: response.duration.toDTO()
                }, dto.contract);
                done();
            })
        });
    });
    describe('getContracts', () => {
        const dto = {
            contract: {
                multisig: 'some multisig',
                multisigAddress: 'some multisig address',
                start: UInt64.fromUint(666).toDTO(),
                duration: UInt64.fromUint(999).toDTO(),
                hash: 'some hash',
                customers: ['some customer'],
                executors: ['some executor'],
                verifiers: ['some verifier']
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).contractRoutesApi, 'getContracts', () => Promise.resolve([dto]));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getContracts([address]).subscribe(response => {
                expect(response.length).to.be.equal(1);
                deepEqual({// pre-process response so we can use deepEqual directly
                    ...response[0],
                    start: response[0].start.toDTO(),
                    duration: response[0].duration.toDTO()
                }, dto.contract);
                done();
            })
        });
    });
});