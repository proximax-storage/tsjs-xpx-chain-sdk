import { Transaction } from "./Transaction";
import { TransactionType } from "./TransactionType";
import { NetworkType } from "../blockchain/NetworkType";
import { Deadline } from "./Deadline";
import { UInt64 } from "../UInt64";
import { PublicAccount } from "../account/PublicAccount";
import { TransactionInfo } from "./TransactionInfo";
import { Builder } from "../../infrastructure/builders/ChainConfigTransaction";
import { VerifiableTransaction } from "../../infrastructure/builders/VerifiableTransaction";

export class ChainConfigTransaction extends Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        applyHeightDelta: UInt64,
        blockChainConfig: string,
        supportedEntityVersions: string,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo) {
            super(TransactionType.CHAIN_CONFIGURE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        }    /**
        * @internal
        * @returns {VerifiableTransaction}
        */
       protected buildTransaction(): VerifiableTransaction {
           return new Builder()
               .addDeadline(this.deadline.toDTO())
               .addMaxFee(this.maxFee.toDTO())
               .addVersion(this.versionToDTO())
               .build();
       }

}