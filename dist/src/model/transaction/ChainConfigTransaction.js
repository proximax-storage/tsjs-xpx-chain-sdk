"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const ChainConfigTransaction_1 = require("../../infrastructure/builders/ChainConfigTransaction");
const TransactionVersion_1 = require("./TransactionVersion");
const FeeCalculationStrategy_1 = require("./FeeCalculationStrategy");
class ChainConfigTransaction extends Transaction_1.Transaction {
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
    constructor(networkType, version, deadline, maxFee, applyHeightDelta, blockChainConfig, supportedEntityVersions, signature, signer, transactionInfo) {
        super(TransactionType_1.TransactionType.CHAIN_CONFIGURE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.applyHeightDelta = applyHeightDelta;
        this.blockChainConfig = blockChainConfig;
        this.supportedEntityVersions = supportedEntityVersions;
    }
    static create(deadline, applyHeightDelta, blockChainConfig, supportedEntityVersions, networkType, maxFee) {
        return new ChainConfigTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .applyHeightDelta(applyHeightDelta)
            .blockChainConfig(blockChainConfig)
            .supportedEntityVersions(supportedEntityVersions)
            .build();
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    get size() {
        return ChainConfigTransaction.calculateSize(this.blockChainConfig.length, this.supportedEntityVersions.length);
    }
    static calculateSize(blockChainConfigLength, supportedEntityVersionsLength) {
        const byteSize = Transaction_1.Transaction.getHeaderSize()
            + 8 // applyHeightDelta
            + 2 // blockChainConfigSize
            + 2 // supportedEntityVersionsSize
            + blockChainConfigLength //blockChainConfig
            + supportedEntityVersionsLength; // supportedEntityVersions
        return byteSize;
    }
    /**
    * @internal
    * @returns {VerifiableTransaction}
    */
    buildTransaction() {
        return new ChainConfigTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addApplyHeightDelta(this.applyHeightDelta.toDTO())
            .addBlockChainConfig(this.blockChainConfig)
            .addSupportedEntityVersions(this.supportedEntityVersions)
            .build();
    }
}
exports.ChainConfigTransaction = ChainConfigTransaction;
class ChainConfigTransactionBuilder extends Transaction_1.TransactionBuilder {
    constructor() {
        super();
        this._feeCalculationStrategy = FeeCalculationStrategy_1.FeeCalculationStrategy.ZeroFeeCalculationStrategy;
    }
    applyHeightDelta(applyHeightDelta) {
        this._applyHeightDelta = applyHeightDelta;
        return this;
    }
    blockChainConfig(blockChainConfig) {
        this._blockChainConfig = blockChainConfig;
        return this;
    }
    supportedEntityVersions(supportedEntityVersions) {
        this._supportedEntityVersions = supportedEntityVersions;
        return this;
    }
    build() {
        return new ChainConfigTransaction(this._networkType, TransactionVersion_1.TransactionVersion.CHAIN_CONFIG, this._deadline ? this._deadline : this._createNewDeadlineFn(), this._maxFee ? this._maxFee : FeeCalculationStrategy_1.calculateFee(ChainConfigTransaction.calculateSize(this._blockChainConfig.length, this._supportedEntityVersions.length), this._feeCalculationStrategy), this._applyHeightDelta, this._blockChainConfig, this._supportedEntityVersions, this._signature, this._signer, this._transactionInfo);
    }
}
exports.ChainConfigTransactionBuilder = ChainConfigTransactionBuilder;
//# sourceMappingURL=ChainConfigTransaction.js.map