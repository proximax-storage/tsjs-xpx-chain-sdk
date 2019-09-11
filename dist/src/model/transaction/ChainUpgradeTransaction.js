"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const UInt64_1 = require("../UInt64");
const ChainUpgradeTransaction_1 = require("../../infrastructure/builders/ChainUpgradeTransaction");
const TransactionVersion_1 = require("./TransactionVersion");
class ChainUpgradeTransaction extends Transaction_1.Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType, version, deadline, maxFee, upgradePeriod, newCatapultVersion, signature, signer, transactionInfo) {
        super(TransactionType_1.TransactionType.CHAIN_UPGRADE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.upgradePeriod = upgradePeriod;
        this.newCatapultVersion = newCatapultVersion;
    }
    static create(deadline, upgradePeriod, newCatapultVersion, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        return new ChainUpgradeTransaction(networkType, TransactionVersion_1.TransactionVersion.CHAIN_UPGRADE, deadline, maxFee, upgradePeriod, newCatapultVersion);
    }
    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    get size() {
        const byteSize = 8 // upgradePeriod
            + 8; // newCatapultVersion
        return super.size + byteSize;
    }
    /**
    * @internal
    * @returns {VerifiableTransaction}
    */
    buildTransaction() {
        return new ChainUpgradeTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addUpgradePeriod(this.upgradePeriod.toDTO())
            .addNewCatapultVersion(this.newCatapultVersion.toDTO())
            .build();
    }
}
exports.ChainUpgradeTransaction = ChainUpgradeTransaction;
//# sourceMappingURL=ChainUpgradeTransaction.js.map