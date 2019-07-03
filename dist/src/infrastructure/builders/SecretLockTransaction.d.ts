import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
export default class SecretLockTransaction extends VerifiableTransaction {
    constructor(bytes: any);
}
export declare class Builder {
    fee: any;
    version: any;
    type: any;
    deadline: any;
    mosaicId: any;
    mosaicAmount: any;
    duration: any;
    hashAlgorithm: any;
    secret: any;
    recipient: any;
    constructor();
    addFee(fee: any): this;
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    addMosaicId(mosaicId: any): this;
    addMosaicAmount(mosaicAmount: any): this;
    addDuration(duration: any): this;
    addHashAlgorithm(hashAlgorithm: any): this;
    addSecret(secret: any): this;
    addRecipient(recipient: any): this;
    build(): SecretLockTransaction;
}
