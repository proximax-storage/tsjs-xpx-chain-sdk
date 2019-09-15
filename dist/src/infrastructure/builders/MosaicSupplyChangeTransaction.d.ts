import { VerifiableTransaction } from './VerifiableTransaction';
/**
 * @module transactions/MosaicSupplyChangeTransaction
 */
export default class MosaicSupplyChangeTransaction extends VerifiableTransaction {
    constructor(bytes: any);
}
export declare class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    mosaicId: any;
    direction: any;
    delta: any;
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
    addDirection(direction: any): this;
    addDelta(delta: any): this;
    build(): MosaicSupplyChangeTransaction;
}
