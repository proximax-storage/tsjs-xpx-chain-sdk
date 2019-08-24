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
import { Builder } from "../../infrastructure/builders/ChainUpgradeTransaction";
import { VerifiableTransaction } from "../../infrastructure/builders/VerifiableTransaction";
import { TransactionVersion } from "./TransactionVersion";

export class ChainUpgradeTransaction extends Transaction {
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
        public readonly upgradePeriod: UInt64,
        public readonly newCatapultVersion: UInt64,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo) {
            super(TransactionType.CHAIN_UPGRADE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    public static create(deadline: Deadline,
        upgradePeriod: UInt64,
        newCatapultVersion: UInt64,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0])): ChainUpgradeTransaction {
        return new ChainUpgradeTransaction(networkType,
            TransactionVersion.CHAIN_UPGRADE,
            deadline,
            maxFee,
            upgradePeriod,
            newCatapultVersion
        );
    }

    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        const byteSize = 8 // upgradePeriod
            + 8; // newCatapultVersion
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
            .addUpgradePeriod(this.upgradePeriod.toDTO())
            .addNewCatapultVersion(this.newCatapultVersion.toDTO())
            .build();
    }
}
