"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const NetworkType_1 = require("../blockchain/NetworkType");
const TransferTransaction_1 = require("./TransferTransaction");
const AccountLinkTransaction_1 = require("./AccountLinkTransaction");
const MosaicDefinitionTransaction_1 = require("./MosaicDefinitionTransaction");
const AccountAddressRestrictionModificationTransaction_1 = require("./AccountAddressRestrictionModificationTransaction");
const AccountMosaicRestrictionModificationTransaction_1 = require("./AccountMosaicRestrictionModificationTransaction");
const AccountOperationRestrictionModificationTransaction_1 = require("./AccountOperationRestrictionModificationTransaction");
const AddressAliasTransaction_1 = require("./AddressAliasTransaction");
const AggregateTransaction_1 = require("./AggregateTransaction");
const ChainConfigTransaction_1 = require("./ChainConfigTransaction");
const ChainUpgradeTransaction_1 = require("./ChainUpgradeTransaction");
const LockFundsTransaction_1 = require("./LockFundsTransaction");
const HashLockTransaction_1 = require("./HashLockTransaction");
const ModifyContractTransaction_1 = require("./ModifyContractTransaction");
const ModifyMetadataTransaction_1 = require("./ModifyMetadataTransaction");
const ModifyMultisigAccountTransaction_1 = require("./ModifyMultisigAccountTransaction");
const MosaicAliasTransaction_1 = require("./MosaicAliasTransaction");
const MosaicSupplyChangeTransaction_1 = require("./MosaicSupplyChangeTransaction");
const RegisterNamespaceTransaction_1 = require("./RegisterNamespaceTransaction");
const SecretLockTransaction_1 = require("./SecretLockTransaction");
const SecretProofTransaction_1 = require("./SecretProofTransaction");
const Deadline_1 = require("./Deadline");
const FeeCalculationStrategy_1 = require("./FeeCalculationStrategy");
class TransactionBuilderFactory {
    constructor() {
        this._networkType = NetworkType_1.NetworkType.MIJIN_TEST;
        this._feeCalculationStrategy = FeeCalculationStrategy_1.DefaultFeeCalculationStrategy;
        this._createNewDeadlineFn = Deadline_1.DefaultCreateNewDeadline;
    }
    set networkType(networkType) {
        this._networkType = networkType;
    }
    get networkType() {
        return this._networkType;
    }
    set generationHash(generationHash) {
        this._generationHash = generationHash;
    }
    get generationHash() {
        return this._generationHash;
    }
    set feeCalculationStrategy(feeCalculationStragegy) {
        this._feeCalculationStrategy = feeCalculationStragegy;
    }
    get feeCalculationStrategy() {
        return this._feeCalculationStrategy;
    }
    setDefaultFeeCalculationStrategy() {
        this.feeCalculationStrategy = FeeCalculationStrategy_1.DefaultFeeCalculationStrategy;
    }
    set createNewDeadlineFn(createNewDeadlineFn) {
        this._createNewDeadlineFn = createNewDeadlineFn;
    }
    get createNewDeadlineFn() {
        return this._createNewDeadlineFn;
    }
    configureBuilder(builder) {
        builder.networkType(this.networkType)
            .generationHash(this.generationHash)
            .feeCalculationStrategy(this.feeCalculationStrategy)
            .createNewDeadlineFn(this.createNewDeadlineFn);
    }
    accountLink() {
        const builder = new AccountLinkTransaction_1.AccountLinkTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    transfer() {
        const builder = new TransferTransaction_1.TransferTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    mosaicDefinition() {
        const builder = new MosaicDefinitionTransaction_1.MosaicDefinitionTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    accountRestrictionAddress() {
        const builder = new AccountAddressRestrictionModificationTransaction_1.AccountAddressRestrictionModificationTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    accountRestrictionMosaic() {
        const builder = new AccountMosaicRestrictionModificationTransaction_1.AccountMosaicRestrictionModificationTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    accountRestrictionOperation() {
        const builder = new AccountOperationRestrictionModificationTransaction_1.AccountOperationRestrictionModificationTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    addressAlias() {
        const builder = new AddressAliasTransaction_1.AddressAliasTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    aggregateBonded() {
        const builder = new AggregateTransaction_1.AggregateBondedTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    aggregateComplete() {
        const builder = new AggregateTransaction_1.AggregateCompleteTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    chainConfig() {
        const builder = new ChainConfigTransaction_1.ChainConfigTransactionBuilder();
        builder.networkType(this.networkType)
            .generationHash(this.generationHash)
            .createNewDeadlineFn(this.createNewDeadlineFn);
        return builder;
    }
    chainUpgrade() {
        const builder = new ChainUpgradeTransaction_1.ChainUpgradeTransactionBuilder();
        builder.networkType(this.networkType)
            .generationHash(this.generationHash)
            .createNewDeadlineFn(this.createNewDeadlineFn);
        return builder;
    }
    lockFunds() {
        const builder = new LockFundsTransaction_1.LockFundsTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    hashLock() {
        const builder = new HashLockTransaction_1.HashLockTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    modifyContract() {
        const builder = new ModifyContractTransaction_1.ModifyContractTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    accountMetadata() {
        const builder = new ModifyMetadataTransaction_1.ModifyAccountMetadataTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    mosaicMetadata() {
        const builder = new ModifyMetadataTransaction_1.ModifyMosaicMetadataTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    namespaceMetadata() {
        const builder = new ModifyMetadataTransaction_1.ModifyNamespaceMetadataTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    modifyMultisig() {
        const builder = new ModifyMultisigAccountTransaction_1.ModifyMultisigAccountTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    mosaicAlias() {
        const builder = new MosaicAliasTransaction_1.MosaicAliasTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    mosaicSupplyChange() {
        const builder = new MosaicSupplyChangeTransaction_1.MosaicSupplyChangeTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    registerRootNamespace() {
        const builder = new RegisterNamespaceTransaction_1.RegisterRootNamespaceTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    registerSubNamespace() {
        const builder = new RegisterNamespaceTransaction_1.RegisterSubNamespaceTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    secretLock() {
        const builder = new SecretLockTransaction_1.SecretLockTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    secretProof() {
        const builder = new SecretProofTransaction_1.SecretProofTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
}
exports.TransactionBuilderFactory = TransactionBuilderFactory;
//# sourceMappingURL=TransactionBuilderFactory.js.map