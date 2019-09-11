import { VerifiableTransaction } from './VerifiableTransaction';
export default class AccountRestrictionsEntityTypeTransaction extends VerifiableTransaction {
    constructor(bytes: any);
}
export declare class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    restrictionType: any;
    modifications: any;
    constructor();
    addMaxFee(maxFee: any): this;
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    addRestrictionType(restrictionType: any): this;
    addModifications(modifications: any): this;
    build(): AccountRestrictionsEntityTypeTransaction;
}
