import { VerifiableTransaction } from './VerifiableTransaction';
export default class ChainConfigTransaction extends VerifiableTransaction {
    constructor(bytes: any);
}
export declare class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    applyHeightDelta: any;
    blockChainConfig: any;
    supportedEntityVersions: any;
    constructor();
    addMaxFee(maxFee: any): this;
    addApplyHeightDelta(applyHeightDelta: any): this;
    addBlockChainConfig(blockChainConfig: any): this;
    addSupportedEntityVersions(supportedEntityVersions: any): this;
    addVersion(version: any): this;
    addType(type: any): this;
    addDeadline(deadline: any): this;
    build(): ChainConfigTransaction;
}
