import { VerifiableTransaction } from './VerifiableTransaction';
export default class MosaicCreationTransaction extends VerifiableTransaction {
    constructor(bytes: any, schema: any);
}
export declare class Builder {
    fee: any;
    version: any;
    type: any;
    deadline: any;
    mosaicId: any;
    flags: any;
    nonce: any;
    divisibility: any;
    duration: any;
    constructor();
    addFee(fee: any): this;
    addVersion(version: any): this;
    addType(type: any): this;
    addNonce(nonce: any): this;
    addDeadline(deadline: any): this;
    addDuration(duration: any): this;
    addDivisibility(divisibility: any): this;
    addSupplyMutable(): this;
    addTransferability(): this;
    addLevyMutable(): this;
    addMosaicId(mosaicId: any): this;
    build(): MosaicCreationTransaction;
}
