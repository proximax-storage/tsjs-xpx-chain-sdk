import * as chai from 'chai';
import * as spies from 'chai-spies';
import { AccountHttp } from '../../src/infrastructure/infrastructure';
import { deepEqual } from 'assert';
import * as createFromDto from '../../src/infrastructure/transaction/CreateTransactionFromDTO';
import * as dtoMapping from '../../src/core/utils/DtoMapping'
import { Address, NetworkType, PublicAccount, UInt64, MultisigAccountInfo } from '../../src/model/model';
import { RawAddress, Convert } from '../../src/core/format';
import { of } from 'rxjs';

chai.use(spies);
const expect = chai.expect;

const client = new AccountHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

const networkType = NetworkType.MIJIN_TEST;
const publicAccount = PublicAccount.createFromPublicKey('6'.repeat(64), networkType);
const address = publicAccount.address;

describe('AccountHttp', () => {

    describe('getAccountInfo', () => {
        const dto = {
            meta: 'some-meta',
            account: {
                address: Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())),
                addressHeight: UInt64.fromUint(666).toDTO(),
                publicKey: publicAccount.publicKey,
                publicKeyHeight: UInt64.fromUint(777).toDTO(),
                mosaics: [
                    {
                        id: UInt64.fromUint(888).toDTO(),
                        amount: UInt64.fromUint(999).toDTO()
                    }
                ]
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).accountRoutesApi, 'getAccountInfo', (tx) => Promise.resolve(dto));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getAccountInfo(address).subscribe(response => {
                expect(response.meta).to.be.equal(dto.meta);
                expect(response.address.plain()).to.be.equal(Address.createFromRawAddress(RawAddress.addressToString(Convert.hexToUint8(dto.account.address))).plain());
                deepEqual(response.addressHeight.toDTO(), dto.account.addressHeight);
                expect(response.publicKey).to.be.equal(dto.account.publicKey);
                expect(response.publicAccount.publicKey).to.be.equal(dto.account.publicKey);
                deepEqual(response.publicKeyHeight.toDTO(), dto.account.publicKeyHeight);
                expect(response.mosaics.length).to.be.equal(dto.account.mosaics.length);
                deepEqual(response.mosaics[0].id.toDTO().id, dto.account.mosaics[0].id);
                deepEqual(response.mosaics[0].amount.toDTO(), dto.account.mosaics[0].amount);
                done();
            })
        });
    });

    describe('getAccountsInfo', () => {
        const dto = {
            meta: 'some-meta',
            account: {
                address: Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())),
                addressHeight: UInt64.fromUint(666).toDTO(),
                publicKey: publicAccount.publicKey,
                publicKeyHeight: UInt64.fromUint(777).toDTO(),
                mosaics: [
                    {
                        id: UInt64.fromUint(888).toDTO(),
                        amount: UInt64.fromUint(999).toDTO()
                    }
                ]
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).accountRoutesApi, 'getAccountsInfo', (tx) => Promise.resolve([dto]));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getAccountsInfo([address]).subscribe(responses => {
                expect(responses.length).to.be.equal(1);
                responses.forEach(response => {
                    expect(response.meta).to.be.equal(dto.meta);
                    expect(response.address.plain()).to.be.equal(Address.createFromRawAddress(RawAddress.addressToString(Convert.hexToUint8(dto.account.address))).plain());
                    deepEqual(response.addressHeight.toDTO(), dto.account.addressHeight);
                    expect(response.publicKey).to.be.equal(dto.account.publicKey);
                    expect(response.publicAccount.publicKey).to.be.equal(dto.account.publicKey);
                    deepEqual(response.publicKeyHeight.toDTO(), dto.account.publicKeyHeight);
                    expect(response.mosaics.length).to.be.equal(dto.account.mosaics.length);
                    deepEqual(response.mosaics[0].id.toDTO().id, dto.account.mosaics[0].id);
                    deepEqual(response.mosaics[0].amount.toDTO(), dto.account.mosaics[0].amount);
                });
                done();
            })
        });
    });

    describe('getAccountRestrictions', () => {
        beforeEach(() => {
            sandbox.on((client as any).accountRoutesApi, 'getAccountRestrictions', (tx) => Promise.resolve('api called'));
            sandbox.on(dtoMapping.DtoMapping, 'extractAccountRestrictionFromDto', (dto) => dto === 'api called' ? 'deserialization called' : 'not ok');
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getAccountRestrictions(address).subscribe(response => {
                expect(response).to.be.equal('deserialization called');
                done();
            })
        });
    });

    describe('getAccountRestrictionsFromAccounts', () => {
        beforeEach(() => {
            sandbox.on((client as any).accountRoutesApi, 'getAccountRestrictionsFromAccounts', (tx) => Promise.resolve(['api called']));
            sandbox.on(dtoMapping.DtoMapping, 'extractAccountRestrictionFromDto', (dto) => dto === 'api called' ? 'deserialization called' : 'not ok');
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getAccountRestrictionsFromAccounts([address]).subscribe(response => {
                expect(response.length).to.be.equal(1);
                expect(response[0]).to.be.equal('deserialization called');
                done();
            })
        });
    });

    describe('getAccountsNames', () => {
        const dto = {
            address: Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())),
            names: ['some.name']
        };
        beforeEach(() => {
            sandbox.on((client as any).accountRoutesApi, 'getAccountsNames', (tx) => Promise.resolve([dto]));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getAccountsNames([address]).subscribe(responses => {
                expect(responses.length).to.be.equal(1);
                responses.forEach(response => {
                    expect(response.address.plain()).to.be.equal(Address.createFromRawAddress(RawAddress.addressToString(Convert.hexToUint8(dto.address))).plain());
                    expect(response.names.length).to.be.equal(1);
                    expect(response.names[0].name).to.be.equal('some.name');
                });
                done();
            })
        });
    });

    describe('getMultisigAccountInfo', () => {
        const dto = {
            multisig: {
                account: publicAccount.publicKey,
                minApproval: 2,
                minRemoval: 3,
                cosignatories: [publicAccount.publicKey],
                multisigAccounts: [publicAccount.publicKey]
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).accountRoutesApi, 'getAccountMultisig', (tx) => Promise.resolve(dto));
            sandbox.on((client as any).networkHttp, 'getNetworkType', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getMultisigAccountInfo(address).subscribe(response => {
                expect(response.account.publicKey).to.be.equal(dto.multisig.account);
                expect(response.minApproval).to.be.equal(dto.multisig.minApproval);
                expect(response.minRemoval).to.be.equal(dto.multisig.minRemoval);
                expect(response.cosignatories.length).to.be.equal(1);
                expect(response.cosignatories[0].publicKey).to.be.equal(dto.multisig.cosignatories[0]);
                expect(response.multisigAccounts.length).to.be.equal(1);
                expect(response.multisigAccounts[0].publicKey).to.be.equal(dto.multisig.multisigAccounts[0]);
                done();
            })
        });
    });

    describe('getMultisigAccountGraphInfo', () => {
        const dto = {
            level: 666,
            multisigEntries: [{
                multisig: {
                    account: publicAccount.publicKey,
                    minApproval: 2,
                    minRemoval: 3,
                    cosignatories: [publicAccount.publicKey],
                    multisigAccounts: [publicAccount.publicKey]
                }
            }]
        };
        beforeEach(() => {
            sandbox.on((client as any).accountRoutesApi, 'getAccountMultisigGraph', (tx) => Promise.resolve([dto]));
            sandbox.on((client as any).networkHttp, 'getNetworkType', () => of(NetworkType.MIJIN_TEST));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.getMultisigAccountGraphInfo(address).subscribe(responses => {
                expect(responses.multisigAccounts.size).to.be.equal(1);
                expect(responses.multisigAccounts.get(666)).not.to.be.undefined;
                (responses.multisigAccounts.get(666) as MultisigAccountInfo[]).forEach(response => {
                    expect(dto.multisigEntries.length).to.be.equal(1);
                    expect(response.account.publicKey).to.be.equal(dto.multisigEntries[0].multisig.account);
                    expect(response.minApproval).to.be.equal(dto.multisigEntries[0].multisig.minApproval);
                    expect(response.minRemoval).to.be.equal(dto.multisigEntries[0].multisig.minRemoval);
                    expect(response.cosignatories.length).to.be.equal(1);
                    expect(response.cosignatories[0].publicKey).to.be.equal(dto.multisigEntries[0].multisig.cosignatories[0]);
                    expect(response.multisigAccounts.length).to.be.equal(1);
                    expect(response.multisigAccounts[0].publicKey).to.be.equal(dto.multisigEntries[0].multisig.multisigAccounts[0]);
                });
                done();
            })
        });
    });

    describe('transactions', () => {
        beforeEach(() => {
            sandbox.on((client as any).accountRoutesApi, 'transactions', (tx) => Promise.resolve(['api called']));
            sandbox.on(createFromDto, 'CreateTransactionFromDTO', (dto) => dto === 'api called' ? 'deserialization called' : 'not ok');
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.transactions(publicAccount).subscribe(response => {
                expect(response.length).to.be.equal(1);
                expect(response[0]).to.be.equal('deserialization called');
                done();
            })
        });
    });

    describe('incomingTransactions', () => {
        beforeEach(() => {
            sandbox.on((client as any).accountRoutesApi, 'incomingTransactions', (tx) => Promise.resolve(['api called']));
            sandbox.on(createFromDto, 'CreateTransactionFromDTO', (dto) => dto === 'api called' ? 'deserialization called' : 'not ok');
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.incomingTransactions(publicAccount).subscribe(response => {
                expect(response.length).to.be.equal(1);
                expect(response[0]).to.be.equal('deserialization called');
                done();
            })
        });
    });

    describe('outgoingTransactions', () => {
        beforeEach(() => {
            sandbox.on((client as any).accountRoutesApi, 'outgoingTransactions', (tx) => Promise.resolve(['api called']));
            sandbox.on(createFromDto, 'CreateTransactionFromDTO', (dto) => dto === 'api called' ? 'deserialization called' : 'not ok');
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.outgoingTransactions(publicAccount).subscribe(response => {
                expect(response.length).to.be.equal(1);
                expect(response[0]).to.be.equal('deserialization called');
                done();
            })
        });
    });

    describe('unconfirmedTransactions', () => {
        beforeEach(() => {
            sandbox.on((client as any).accountRoutesApi, 'unconfirmedTransactions', (tx) => Promise.resolve(['api called']));
            sandbox.on(createFromDto, 'CreateTransactionFromDTO', (dto) => dto === 'api called' ? 'deserialization called' : 'not ok');
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.unconfirmedTransactions(publicAccount).subscribe(response => {
                expect(response.length).to.be.equal(1);
                expect(response[0]).to.be.equal('deserialization called');
                done();
            })
        });
    });

    describe('aggregateBondedTransactions', () => {
        beforeEach(() => {
            sandbox.on((client as any).accountRoutesApi, 'partialTransactions', (tx) => Promise.resolve(['api called']));
            sandbox.on(createFromDto, 'CreateTransactionFromDTO', (dto) => dto === 'api called' ? 'deserialization called' : 'not ok');
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.aggregateBondedTransactions(publicAccount).subscribe(response => {
                expect(response.length).to.be.equal(1);
                expect(response[0]).to.be.equal('deserialization called');
                done();
            })
        });
    });

});