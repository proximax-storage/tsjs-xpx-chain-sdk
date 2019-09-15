import { VerifiableTransaction } from './VerifiableTransaction';
export default class ModifyContractTransaction extends VerifiableTransaction {
    constructor(bytes: any);
}
export declare class Builder {
    fee: any;
    version: any;
    type: any;
    deadline: any;
    durationDelta: any;
    hash: any;
    customers: any[];
    executors: any[];
    verifiers: any[];
    constructor();
    addMaxFee(fee: any): this;
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    addDurationDelta(durationDelta: any): this;
    addHash(hash: any): this;
    addCustomers(customers: any[]): this;
    addExecutors(executors: any[]): this;
    addVerifiers(verifiers: any[]): this;
    build(): ModifyContractTransaction;
}
