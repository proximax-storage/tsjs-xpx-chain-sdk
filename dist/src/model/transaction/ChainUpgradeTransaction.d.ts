import { Transaction } from "./Transaction";
import { NetworkType } from "../blockchain/NetworkType";
import { Deadline } from "./Deadline";
import { UInt64 } from "../UInt64";
import { PublicAccount } from "../account/PublicAccount";
import { TransactionInfo } from "./TransactionInfo";
export declare class ChainUpgradeTransaction extends Transaction {
    readonly upgradePeriod: UInt64;
    readonly newCatapultVersion: UInt64;
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType, version: number, deadline: Deadline, maxFee: UInt64, upgradePeriod: UInt64, newCatapultVersion: UInt64, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo);
    static create(deadline: Deadline, upgradePeriod: UInt64, newCatapultVersion: UInt64, networkType: NetworkType, maxFee?: UInt64): ChainUpgradeTransaction;
    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    readonly size: number;
}
