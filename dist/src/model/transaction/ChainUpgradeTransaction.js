"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const ChainUpgradeTransaction_1 = require("../../infrastructure/builders/ChainUpgradeTransaction");
const TransactionVersion_1 = require("./TransactionVersion");
const FeeCalculationStrategy_1 = require("./FeeCalculationStrategy");
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
    static create(deadline, upgradePeriod, newCatapultVersion, networkType, maxFee) {
        return new ChainUpgradeTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .upgradePeriod(upgradePeriod)
            .newCatapultVersion(newCatapultVersion)
            .build();
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    get size() {
        return ChainUpgradeTransaction.calculateSize();
    }
    static calculateSize() {
        const byteSize = Transaction_1.Transaction.getHeaderSize()
            + 8 // upgradePeriod
            + 8; // newCatapultVersion
        return byteSize;
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
class ChainUpgradeTransactionBuilder extends Transaction_1.TransactionBuilder {
    constructor() {
        super();
        this._feeCalculationStrategy = FeeCalculationStrategy_1.FeeCalculationStrategy.ZeroFeeCalculationStrategy;
    }
    upgradePeriod(upgradePeriod) {
        this._upgradePeriod = upgradePeriod;
        return this;
    }
    newCatapultVersion(newCatapultVersion) {
        this._newCatapultVersion = newCatapultVersion;
        return this;
    }
    build() {
        return new ChainUpgradeTransaction(this._networkType, TransactionVersion_1.TransactionVersion.CHAIN_UPGRADE, this._deadline ? this._deadline : this._createNewDeadlineFn(), this._maxFee ? this._maxFee : FeeCalculationStrategy_1.calculateFee(ChainUpgradeTransaction.calculateSize(), this._feeCalculationStrategy), this._upgradePeriod, this._newCatapultVersion, this._signature, this._signer, this._transactionInfo);
    }
}
exports.ChainUpgradeTransactionBuilder = ChainUpgradeTransactionBuilder;
//# sourceMappingURL=ChainUpgradeTransaction.js.map