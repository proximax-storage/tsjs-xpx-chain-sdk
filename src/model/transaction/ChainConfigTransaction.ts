// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { Transaction } from "./Transaction";
import { TransactionType } from "./TransactionType";
import { NetworkType } from "../blockchain/NetworkType";
import { Deadline } from "./Deadline";
import { UInt64 } from "../UInt64";
import { PublicAccount } from "../account/PublicAccount";
import { TransactionInfo } from "./TransactionInfo";
import { Builder } from "../../infrastructure/builders/ChainConfigTransaction";
import { VerifiableTransaction } from "../../infrastructure/builders/VerifiableTransaction";
import { TransactionVersion } from "./TransactionVersion";

export class ChainConfigTransaction extends Transaction {
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
    constructor(networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        public readonly applyHeightDelta: UInt64,
        public readonly blockChainConfig: string,
        public readonly supportedEntityVersions: string,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo) {
            super(TransactionType.CHAIN_CONFIGURE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    public static create(deadline: Deadline,
        applyHeightDelta: UInt64,
        blockChainConfig: string,
        supportedEntityVersions: string,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0])): ChainConfigTransaction {
        return new ChainConfigTransaction(networkType,
            TransactionVersion.CHAIN_CONFIG,
            deadline,
            maxFee,
            applyHeightDelta,
            blockChainConfig,
            supportedEntityVersions
        );
    }

    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        const byteSize = 8 // applyHeightDelta
            + 2 // blockChainConfigSize
            + 2 // supportedEntityVersionsSize
            + this.blockChainConfig.length //blockChainConfig
            + this.supportedEntityVersions.length // supportedEntityVersions
        return super.size + byteSize;
    }

    /**
    * @internal
    * @returns {VerifiableTransaction}
    */
    protected buildTransaction(): VerifiableTransaction {
        return new Builder()
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addApplyHeightDelta(this.applyHeightDelta.toDTO())
            .addBlockChainConfig(this.blockChainConfig)
            .addSupportedEntityVersions(this.supportedEntityVersions)
            .build();
    }
}
