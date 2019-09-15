/**
 * @module transactions/AggregateTransaction
 */
import { SignSchema } from '../../core/crypto';
import { VerifiableTransaction } from './VerifiableTransaction';
export declare class AggregateTransaction extends VerifiableTransaction {
    constructor(bytes: any);
    signTransactionWithCosigners(initializer: any, cosigners: any, generationHash: any, signSchema?: SignSchema): {
        payload: string;
        hash: string;
    };
<<<<<<< HEAD
    signTransactionGivenSignatures(initializer: any, cosignedSignedTransactions: any, generationHash: any, signSchema?: SignSchema): {
=======
    signTransactionGivenSignatures(initializer: any, cosignedSignedTransactions: any, generationHash: any, signSchema: any): {
>>>>>>> jwt
        payload: string;
        hash: string;
    };
}
export declare class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    transactions: any;
    constructor();
<<<<<<< HEAD
    addMaxFee(maxFee: any): this;
=======
    addFee(maxFee: any): this;
>>>>>>> jwt
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    addTransactions(transactions: any): this;
    build(): AggregateTransaction;
}
