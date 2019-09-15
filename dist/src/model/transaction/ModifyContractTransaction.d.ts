import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { MultisigCosignatoryModification } from './MultisigCosignatoryModification';
export declare class ModifyContractTransaction extends Transaction {
    hash: string;
    durationDelta: UInt64;
    customers: MultisigCosignatoryModification[];
    executors: MultisigCosignatoryModification[];
    verifiers: MultisigCosignatoryModification[];
    /**
     * Create a modify contract transaction object
     * @returns {ModifyContractTransaction}
     */
    static create(networkType: NetworkType, deadline: Deadline, durationDelta: UInt64, hash: string, customers: MultisigCosignatoryModification[], executors: MultisigCosignatoryModification[], verifiers: MultisigCosignatoryModification[], maxFee?: UInt64, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo | AggregateTransactionInfo): ModifyContractTransaction;
    private constructor();
    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    readonly size: number;
}
