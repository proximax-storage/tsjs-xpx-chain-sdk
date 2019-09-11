import { VerifiableTransaction } from './VerifiableTransaction';
export default class ChainUpgradeTransaction extends VerifiableTransaction {
    constructor(bytes: any);
}
export declare class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    upgradePeriod: any;
    newCatapultVersion: any;
    constructor();
    addMaxFee(maxFee: any): this;
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    addUpgradePeriod(upgradePeriod: any): this;
    addNewCatapultVersion(newCatapultVersion: any): this;
    build(): ChainUpgradeTransaction;
}
