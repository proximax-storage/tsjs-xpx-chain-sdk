import { VerifiableTransaction } from './VerifiableTransaction';
export declare class AccountLinkTransaction extends VerifiableTransaction {
    constructor(bytes: any);
}
export declare class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    remoteAccountKey: any;
    linkAction: any;
    constructor();
<<<<<<< HEAD
    addMaxFee(maxFee: any): this;
=======
    addFee(maxFee: any): this;
>>>>>>> jwt
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    addRemoteAccountKey(remoteAccountKey: any): this;
    addLinkAction(linkAction: any): this;
    build(): AccountLinkTransaction;
}
