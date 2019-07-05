import { VerifiableTransaction } from './VerifiableTransaction';
export default class AccountPropertiesAddressTransaction extends VerifiableTransaction {
    constructor(bytes: any);
}
export declare class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    propertyType: any;
    modifications: any;
    constructor();
    addFee(maxFee: any): this;
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    addPropertyType(propertyType: any): this;
    addModifications(modifications: any): this;
    build(): AccountPropertiesAddressTransaction;
}
