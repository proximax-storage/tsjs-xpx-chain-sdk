import { VerifiableTransaction } from './VerifiableTransaction';
export declare class AggregateTransaction extends VerifiableTransaction {
    constructor(bytes: any);
    signTransactionWithCosigners(initializer: any, cosigners: any, generationHash: any): {
        payload: string;
        hash: string;
    };
    signTransactionGivenSignatures(initializer: any, cosignedSignedTransactions: any, generationHash: any): {
        payload: string;
        hash: string;
    };
}
export declare class Builder {
    fee: any;
    version: any;
    type: any;
    deadline: any;
    transactions: any;
    constructor();
    addFee(fee: any): this;
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    addTransactions(transactions: any): this;
    build(): AggregateTransaction;
}
