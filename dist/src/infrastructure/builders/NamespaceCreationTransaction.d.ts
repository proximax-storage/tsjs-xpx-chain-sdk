import { VerifiableTransaction } from './VerifiableTransaction';
export default class NamespaceCreationTransaction extends VerifiableTransaction {
    constructor(bytes: any);
}
export declare class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    namespaceType: any;
    duration: any;
    parentId: any;
    namespaceId: any;
    namespaceName: any;
    constructor();
<<<<<<< HEAD
    addMaxFee(maxFee: any): this;
=======
    addFee(maxFee: any): this;
>>>>>>> jwt
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    addNamespaceType(namespaceType: any): this;
    addDuration(duration: any): this;
    addParentId(parentId: any): this;
    addNamespaceId(namespaceId: any): this;
    addNamespaceName(namespaceName: any): this;
    build(): NamespaceCreationTransaction;
}
