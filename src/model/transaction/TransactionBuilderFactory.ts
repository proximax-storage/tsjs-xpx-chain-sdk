// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { NetworkType } from "../blockchain/NetworkType";
import { TransactionBuilder } from "./Transaction";
import { TransferTransactionBuilder } from './TransferTransaction';
import { AccountLinkTransactionBuilder } from './AccountLinkTransaction';
import { MosaicDefinitionTransactionBuilder } from './MosaicDefinitionTransaction';
import { AccountAddressRestrictionModificationTransactionBuilder } from "./AccountAddressRestrictionModificationTransaction";
import { AccountMosaicRestrictionModificationTransactionBuilder } from "./AccountMosaicRestrictionModificationTransaction";
import { AccountOperationRestrictionModificationTransactionBuilder } from "./AccountOperationRestrictionModificationTransaction";
import { AddressAliasTransactionBuilder } from "./AddressAliasTransaction";
import { AggregateBondedTransactionBuilder, AggregateCompleteTransactionBuilder } from "./AggregateTransaction";
import { ChainConfigTransactionBuilder } from "./ChainConfigTransaction";
import { ChainUpgradeTransactionBuilder } from "./ChainUpgradeTransaction";
import { LockFundsTransactionBuilder } from "./LockFundsTransaction";
import { HashLockTransactionBuilder } from "./HashLockTransaction";
import { ModifyAccountMetadataTransactionBuilder, ModifyMosaicMetadataTransactionBuilder, ModifyNamespaceMetadataTransactionBuilder } from "./ModifyMetadataTransaction";
import { ModifyMultisigAccountTransactionBuilder } from "./ModifyMultisigAccountTransaction";
import { MosaicAliasTransactionBuilder } from "./MosaicAliasTransaction";
import { MosaicSupplyChangeTransactionBuilder } from "./MosaicSupplyChangeTransaction";
import { RegisterRootNamespaceTransactionBuilder, RegisterSubNamespaceTransactionBuilder } from "./RegisterNamespaceTransaction";
import { SecretLockTransactionBuilder } from "./SecretLockTransaction";
import { SecretProofTransactionBuilder } from "./SecretProofTransaction";
import { Deadline, DefaultCreateNewDeadline } from "./Deadline";
import { FeeCalculationStrategy, DefaultFeeCalculationStrategy } from "./FeeCalculationStrategy";
import { ExchangeOfferTransactionBuilder } from "./ExchangeOfferTransaction";
import { AddExchangeOfferTransactionBuilder } from "./AddExchangeOfferTransaction";
import { RemoveExchangeOfferTransactionBuilder } from "./RemoveExchangeOfferTransaction";


export class TransactionBuilderFactory {
    private _networkType: NetworkType = NetworkType.MIJIN_TEST;
    private _generationHash: string;
    private _feeCalculationStrategy: FeeCalculationStrategy = DefaultFeeCalculationStrategy;
    private _createNewDeadlineFn: () => Deadline = DefaultCreateNewDeadline;
    constructor() {

    }

    public set networkType(networkType: NetworkType) {
        this._networkType = networkType;
    }

    public get networkType() {
        return this._networkType;
    }

    public set generationHash(generationHash: string) {
        this._generationHash = generationHash;
    }

    public get generationHash() {
        return this._generationHash;
    }

    public set feeCalculationStrategy(feeCalculationStragegy: FeeCalculationStrategy) {
        this._feeCalculationStrategy = feeCalculationStragegy;
    }

    public get feeCalculationStrategy() {
        return this._feeCalculationStrategy;
    }

    public setDefaultFeeCalculationStrategy() {
        this.feeCalculationStrategy = DefaultFeeCalculationStrategy;
    }

    public set createNewDeadlineFn(createNewDeadlineFn: () => Deadline) {
        this._createNewDeadlineFn = createNewDeadlineFn;
    }

    public get createNewDeadlineFn() {
        return this._createNewDeadlineFn;
    }

    private configureBuilder(builder: TransactionBuilder) {
        builder.networkType(this.networkType)
            .generationHash(this.generationHash)
            .feeCalculationStrategy(this.feeCalculationStrategy)
            .createNewDeadlineFn(this.createNewDeadlineFn)
    }

    public accountLink(): AccountLinkTransactionBuilder {
        const builder = new AccountLinkTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public transfer(): TransferTransactionBuilder {
        const builder = new TransferTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public mosaicDefinition(): MosaicDefinitionTransactionBuilder {
        const builder = new MosaicDefinitionTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public accountRestrictionAddress(): AccountAddressRestrictionModificationTransactionBuilder {
        const builder = new AccountAddressRestrictionModificationTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public accountRestrictionMosaic(): AccountMosaicRestrictionModificationTransactionBuilder {
        const builder = new AccountMosaicRestrictionModificationTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public accountRestrictionOperation(): AccountOperationRestrictionModificationTransactionBuilder {
        const builder = new AccountOperationRestrictionModificationTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public addressAlias(): AddressAliasTransactionBuilder {
        const builder = new AddressAliasTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public aggregateBonded(): AggregateBondedTransactionBuilder {
        const builder = new AggregateBondedTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public aggregateComplete(): AggregateCompleteTransactionBuilder {
        const builder = new AggregateCompleteTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public chainConfig(): ChainConfigTransactionBuilder {
        const builder = new ChainConfigTransactionBuilder();
        builder.networkType(this.networkType)
            .generationHash(this.generationHash)
            .createNewDeadlineFn(this.createNewDeadlineFn);
        return builder;
    }

    public chainUpgrade(): ChainUpgradeTransactionBuilder {
        const builder = new ChainUpgradeTransactionBuilder();
        builder.networkType(this.networkType)
            .generationHash(this.generationHash)
            .createNewDeadlineFn(this.createNewDeadlineFn);
        return builder;
    }

    public lockFunds(): LockFundsTransactionBuilder {
        const builder = new LockFundsTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public hashLock(): HashLockTransactionBuilder {
        const builder = new HashLockTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public accountMetadata(): ModifyAccountMetadataTransactionBuilder {
        const builder = new ModifyAccountMetadataTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public mosaicMetadata(): ModifyMosaicMetadataTransactionBuilder {
        const builder = new ModifyMosaicMetadataTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public namespaceMetadata(): ModifyNamespaceMetadataTransactionBuilder {
        const builder = new ModifyNamespaceMetadataTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public modifyMultisig(): ModifyMultisigAccountTransactionBuilder {
        const builder = new ModifyMultisigAccountTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public mosaicAlias(): MosaicAliasTransactionBuilder {
        const builder = new MosaicAliasTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public mosaicSupplyChange(): MosaicSupplyChangeTransactionBuilder {
        const builder = new MosaicSupplyChangeTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public registerRootNamespace(): RegisterRootNamespaceTransactionBuilder {
        const builder = new RegisterRootNamespaceTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public registerSubNamespace(): RegisterSubNamespaceTransactionBuilder {
        const builder = new RegisterSubNamespaceTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public secretLock(): SecretLockTransactionBuilder {
        const builder = new SecretLockTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public secretProof(): SecretProofTransactionBuilder {
        const builder = new SecretProofTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public addExchangeOffer(): AddExchangeOfferTransactionBuilder {
        const builder = new AddExchangeOfferTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public exchangeOffer(): ExchangeOfferTransactionBuilder {
        const builder = new ExchangeOfferTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public removeExchangeOffer(): RemoveExchangeOfferTransactionBuilder {
        const builder = new RemoveExchangeOfferTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
}



