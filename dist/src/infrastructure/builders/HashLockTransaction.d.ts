import { VerifiableTransaction } from './VerifiableTransaction';
export default class HashLockTransaction extends VerifiableTransaction {
    constructor(bytes: any);
}
export declare class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    mosaicId: any;
    mosaicAmount: any;
    duration: any;
    hash: any;
    constructor();
<<<<<<< HEAD
    addMaxFee(maxFee: any): this;
=======
    addFee(maxFee: any): this;
>>>>>>> jwt
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    addMosaicId(mosaicId: any): this;
    addMosaicAmount(mosaicAmount: any): this;
    addDuration(duration: any): this;
    addHash(hash: any): this;
    build(): HashLockTransaction;
}
