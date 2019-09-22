import { Transaction, TransactionBuilder } from './Transaction';
import { NetworkType } from '../blockchain/NetworkType';
import { Deadline } from './Deadline';
import { UInt64 } from '../UInt64';
import { PublicAccount } from '../account/PublicAccount';
import { TransactionInfo } from './TransactionInfo';
export declare class ChainConfigTransaction extends Transaction {
    readonly applyHeightDelta: UInt64;
    readonly blockChainConfig: string;
    readonly supportedEntityVersions: string;
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param applyHeightDelta
     * @param blockChainConfig,
     * @param supportedEntityVersions,
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType, version: number, deadline: Deadline, maxFee: UInt64, applyHeightDelta: UInt64, blockChainConfig: string, supportedEntityVersions: string, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo);
    static create(deadline: Deadline, applyHeightDelta: UInt64, blockChainConfig: string, supportedEntityVersions: string, networkType: NetworkType, maxFee?: UInt64): ChainConfigTransaction;
    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    readonly size: number;
    static calculateSize(blockChainConfigLength: number, supportedEntityVersionsLength: number): number;
}
export declare class ChainConfigTransactionBuilder extends TransactionBuilder {
    private _applyHeightDelta;
    private _blockChainConfig;
    private _supportedEntityVersions;
    constructor();
    applyHeightDelta(applyHeightDelta: UInt64): this;
    blockChainConfig(blockChainConfig: string): this;
    supportedEntityVersions(supportedEntityVersions: string): this;
    build(): ChainConfigTransaction;
}
