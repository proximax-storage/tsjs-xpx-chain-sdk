import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { MultisigCosignatoryModification } from './MultisigCosignatoryModification';
export declare class ModifyContractTransaction extends Transaction {
    /**
     * Create ModifyContractTransaction object
     * @returns {ModifyContractTransaction}
     */
    static create(networkType: NetworkType, deadline: Deadline, durationDelta: UInt64, hash: string, customers: MultisigCosignatoryModification[], executors: MultisigCosignatoryModification[], verifiers: MultisigCosignatoryModification[], maxFee?: UInt64): ModifyContractTransaction;
    hash: string;
    durationDelta: UInt64;
    customers: MultisigCosignatoryModification[];
    executors: MultisigCosignatoryModification[];
    verifiers: MultisigCosignatoryModification[];
    constructor(networkType: NetworkType, deadline: Deadline, durationDelta: UInt64, hash: string, customers: MultisigCosignatoryModification[], executors: MultisigCosignatoryModification[], verifiers: MultisigCosignatoryModification[], maxFee: UInt64, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo | AggregateTransactionInfo);
    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    readonly size: number;
    static calculateSize(hashLength: number, customersCount: number, executorsCount: number, verifiersCount: number): number;
}
export declare class ModifyContractTransactionBuilder extends TransactionBuilder {
    private _durationDelta;
    private _hash;
    private _customers;
    private _executors;
    private _verifiers;
    durationDelta(durationDelta: UInt64): this;
    hash(hash: string): this;
    customers(customers: MultisigCosignatoryModification[]): this;
    executors(executors: MultisigCosignatoryModification[]): this;
    verifiers(verifiers: MultisigCosignatoryModification[]): this;
    build(): ModifyContractTransaction;
}
