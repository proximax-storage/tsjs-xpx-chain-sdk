import { VerifiableTransaction } from './VerifiableTransaction';
/**
 * @module transactions/MosaicAliasTransaction
 */
export default class MosaicAliasTransaction extends VerifiableTransaction {
    constructor(bytes: any);
}
export declare class Builder {
    fee: any;
    version: any;
    type: any;
    deadline: any;
    mosaicId: any;
    actionType: any;
    namespaceId: any;
    constructor();
    addFee(fee: any): this;
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    addActionType(actionType: any): this;
    addNamespaceId(namespaceId: any): this;
    addMosaicId(mosaicId: any): this;
    build(): MosaicAliasTransaction;
}
