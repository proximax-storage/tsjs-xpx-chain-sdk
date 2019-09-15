import { VerifiableTransaction } from './VerifiableTransaction';
<<<<<<< HEAD
export default class ModifyContractTransaction extends VerifiableTransaction {
=======
export default class ModifyMetadataTransaction extends VerifiableTransaction {
>>>>>>> jwt
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
<<<<<<< HEAD
    addMaxFee(fee: any): this;
=======
    addFee(fee: any): this;
>>>>>>> jwt
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    addDurationDelta(durationDelta: any): this;
    addHash(hash: any): this;
    addCustomers(customers: any[]): this;
    addExecutors(executors: any[]): this;
    addVerifiers(verifiers: any[]): this;
<<<<<<< HEAD
    build(): ModifyContractTransaction;
=======
    build(): ModifyMetadataTransaction;
>>>>>>> jwt
}
