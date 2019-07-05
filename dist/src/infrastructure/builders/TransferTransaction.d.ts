import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
export default class TransferTransaction extends VerifiableTransaction {
    constructor(bytes: any);
}
export declare class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    recipient: any;
    message: any;
    mosaics: any;
    constructor();
    addFee(maxFee: any): this;
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    addRecipient(recipient: any): this;
    addMessage(message: any): this;
    addMosaics(mosaics: any): this;
    build(): TransferTransaction;
}
