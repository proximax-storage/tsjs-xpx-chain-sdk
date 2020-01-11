import * as chai from 'chai';
import * as spies from 'chai-spies';
import { NodeHttp } from '../../src/infrastructure/infrastructure';
import { NetworkType, PublicAccount } from '../../src/model/model';
import { deepEqual } from 'assert';

chai.use(spies);
const expect = chai.expect;

const client = new NodeHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

const networkType = NetworkType.MIJIN_TEST;
const publicAccount = PublicAccount.createFromPublicKey('6'.repeat(64), networkType);
const address = publicAccount.address;

describe('NodeHttp', () => {

    describe('getNodeInfo', () => {
        const dto = {
            publicKey: 'some public key',
            port: 7890,
            networkIdentifier: NetworkType.MIJIN_TEST,
            version: 666,
            roles: 3,
            host: 'some host',
            friendlyName: 'some friendly name',
        };
        beforeEach(() => {
            sandbox.on((client as any).nodeRoutesApi, 'getNodeInfo', () => Promise.resolve(dto));
        });
        afterEach(() => {
            sandbox.restore();
        });

        it('should call api client', (done) => {
            client.getNodeInfo().subscribe(result => {
                deepEqual(result, dto);
                done();
            });
        });
    })

    describe('getNodeTime', () => {
        const dto = {
            communicationTimestamps: {
                sendTimestamp: [666666, 999999],
                receiveTimestamp: [777777, 888888]
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).nodeRoutesApi, 'getNodeTime', () => Promise.resolve(dto));
        });
        afterEach(() => {
            sandbox.restore();
        });

        it('should call api client', (done) => {
            client.getNodeTime().subscribe(result => {
                deepEqual(result.sendTimeStamp, dto.communicationTimestamps.sendTimestamp);
                deepEqual(result.receiveTimeStamp, dto.communicationTimestamps.receiveTimestamp);
                done();
            });
        });
    })

});