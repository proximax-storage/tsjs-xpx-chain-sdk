"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const UInt64_1 = require("../UInt64");
const ChainConfigTransaction_1 = require("../../infrastructure/builders/ChainConfigTransaction");
const TransactionVersion_1 = require("./TransactionVersion");
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
    static create(deadline, applyHeightDelta, blockChainConfig, supportedEntityVersions, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        return new ChainConfigTransaction(networkType, TransactionVersion_1.TransactionVersion.CHAIN_CONFIG, deadline, maxFee, applyHeightDelta, blockChainConfig, supportedEntityVersions);
    }
    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    get size() {
        const byteSize = 8 // applyHeightDelta
            + 2 // blockChainConfigSize
            + 2 // supportedEntityVersionsSize
            + this.blockChainConfig.length //blockChainConfig
            + this.supportedEntityVersions.length; // supportedEntityVersions
        return super.size + byteSize;
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
//# sourceMappingURL=ChainConfigTransaction.js.map