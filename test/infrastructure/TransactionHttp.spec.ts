import * as chai from 'chai';
import * as spies from 'chai-spies';
import { TransactionHttp } from '../../src/infrastructure/infrastructure';
import { SignedTransaction, TransactionType, CosignatureSignedTransaction, UInt64 } from '../../src/model/model';
import { deepEqual } from 'assert';
import * as createFromDto from '../../src/infrastructure/transaction/CreateTransactionFromDTO';
chai.use(spies);
const expect = chai.expect;

const client = new TransactionHttp('http://nonexistent:0');
const sandbox = (chai as any).spy.sandbox();

describe('TransactionHttp', () => {

    describe('getTransaction', () => {
        beforeEach(() => {
            sandbox.on((client as any).transactionRoutesApi, 'getTransaction', (tx) => Promise.resolve({ body: 'api called' }));
            sandbox.on(createFromDto, 'CreateTransactionFromDTO', (dto) => dto === 'api called' ? 'deserialization called': 'not ok');
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            const txId = 'some-txid';
            client.getTransaction(txId).subscribe(response => {
                expect(response).to.be.equal('deserialization called');
                done();
            })
        });
    });

    describe('getTransactions', () => {
        beforeEach(() => {
            sandbox.on((client as any).transactionRoutesApi, 'getTransactions', (tx) => Promise.resolve({ body: ['api called'] }));
            sandbox.on(createFromDto, 'CreateTransactionFromDTO', (dto) => dto === 'api called' ? 'deserialization called': 'not ok');
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            const txId = 'some-txid';
            client.getTransactions([txId]).subscribe(response => {
                deepEqual(response, ['deserialization called']);
                done();
            })
        });
    });

    describe('getTransactionStatus', () => {
        const dto = {
            status: 'some status',
            group: 'some group',
            hash: 'some hash',
            deadline: undefined,
            height: undefined
        };
        beforeEach(() => {
            sandbox.on((client as any).transactionRoutesApi, 'getTransactionStatus', (txId) => Promise.resolve({ body: dto }));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            const txId = 'some-txid';
            client.getTransactionStatus(txId).subscribe(response => {
                deepEqual(response, dto);
                done();
            })
        });
    });

    describe('getTransactionsStatuses', () => {
        const dto = {
            status: 'some status',
            group: 'some group',
            hash: 'some hash',
            deadline: undefined,
            height: undefined
        };
        beforeEach(() => {
            sandbox.on((client as any).transactionRoutesApi, 'getTransactionsStatuses', (txId) => Promise.resolve({ body: [dto] }));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            const txId = 'some-txid';
            client.getTransactionsStatuses([txId]).subscribe(response => {
                deepEqual(response, [dto]);
                done();
            })
        });
    });

    describe('announce', () => {
        beforeEach(() => {
            sandbox.on((client as any).transactionRoutesApi, 'announceTransaction', (tx) => Promise.resolve({ body: {message: 'some message'} }));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.announce({} as SignedTransaction).subscribe(response => {
                expect(response.message).to.be.equal('some message');
                done();
            })
        });
    });

    describe('announceAggregateBonded', () => {
        beforeEach(() => {
            sandbox.on((client as any).transactionRoutesApi, 'announcePartialTransaction', (tx) => {
                return Promise.resolve({ body: {message: 'some message'} });
            });
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should throw if not aggregate bonded', (done) => {
            client.announceAggregateBonded({ type: TransactionType.AGGREGATE_COMPLETE } as SignedTransaction).subscribe(
                _ => done('failed'),
                error => {
                    expect(error).to.be.equal('Only Transaction Type 0x4241 is allowed for announce aggregate bonded');
                    done();
                });
        });
        it('should call api client', (done) => {
            client.announceAggregateBonded({ type: TransactionType.AGGREGATE_BONDED } as SignedTransaction).subscribe(response => {
                expect(response.message).to.be.equal('some message');
                done();
            })
        });
    });

    describe('announceAggregateBondedCosignature', () => {
        beforeEach(() => {
            sandbox.on((client as any).transactionRoutesApi, 'announceCosignatureTransaction', (tx) => Promise.resolve({ body: {message: 'some message'} }));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            client.announceAggregateBondedCosignature({} as CosignatureSignedTransaction).subscribe(response => {
                expect(response.message).to.be.equal('some message');
                done();
            })
        });
    });

    describe('getTransactionEffectiveFee', () => {
        const tx = {
            transactionInfo: {
                height: UInt64.fromUint(666666)
            },
            size: 999
        };
        const blockDto = {
            block: {
                feeMultiplier: 2
            }
        };
        beforeEach(() => {
            sandbox.on((client as any).transactionRoutesApi, 'getTransaction', (tx) => Promise.resolve({ body: 'api called' }));
            sandbox.on(createFromDto, 'CreateTransactionFromDTO', (dto) => dto === 'api called' ? tx: {not: 'ok'});
            sandbox.on((client as any).blockRoutesApi, 'getBlockByHeight', (number) => Promise.resolve({ body: blockDto }));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should call api client', (done) => {
            const txId = 'some-txid';
            client.getTransactionEffectiveFee(txId).subscribe(response => {
                expect(response).to.be.equal(1998);
                done();
            })
        });
    });

});