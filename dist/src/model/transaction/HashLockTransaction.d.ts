import { LockFundsTransaction, LockFundsTransactionBuilder } from './LockFundsTransaction';
export declare class HashLockTransaction extends LockFundsTransaction {
}
export declare class HashLockTransactionBuilder extends LockFundsTransactionBuilder {
    build(): HashLockTransaction;
}
