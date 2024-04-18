// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { NetworkType } from "../blockchain/NetworkType";
import { TransactionBuilder } from "./Transaction";
import { TransferTransactionBuilder } from './TransferTransaction';
import { AccountLinkTransactionBuilder } from './AccountLinkTransaction';
import { MosaicDefinitionTransactionBuilder } from './MosaicDefinitionTransaction';
import { AccountAddressRestrictionModificationTransactionBuilder } from "./deprecated/AccountAddressRestrictionModificationTransaction";
import { AccountMosaicRestrictionModificationTransactionBuilder } from "./deprecated/AccountMosaicRestrictionModificationTransaction";
import { AccountOperationRestrictionModificationTransactionBuilder } from "./deprecated/AccountOperationRestrictionModificationTransaction";
import { AddressAliasTransactionBuilder } from "./AddressAliasTransaction";
import { 
    AggregateBondedTransactionBuilder, AggregateCompleteTransactionBuilder, 
    AggregateBondedV1TransactionBuilder, AggregateCompleteV1TransactionBuilder 
} from "./AggregateTransaction";
import { NetworkConfigTransactionBuilder } from "./NetworkConfigTransaction";
import { ChainUpgradeTransactionBuilder } from "./ChainUpgradeTransaction";
import { HashLockTransactionBuilder } from "./HashLockTransaction";
import { AccountMetadataTransactionBuilder } from "./AccountMetadataTransaction";
import { MosaicMetadataTransactionBuilder } from "./MosaicMetadataTransaction";
import { NamespaceMetadataTransactionBuilder } from "./NamespaceMetadataTransaction";
import { ModifyMultisigAccountTransactionBuilder } from "./ModifyMultisigAccountTransaction";
import { MosaicAliasTransactionBuilder } from "./MosaicAliasTransaction";
import { MosaicModifyLevyTransactionBuilder } from "./MosaicModifyLevyTransaction";
import { MosaicRemoveLevyTransactionBuilder } from "./MosaicRemoveLevyTransaction";
import { MosaicSupplyChangeTransactionBuilder } from "./MosaicSupplyChangeTransaction";
import { RegisterRootNamespaceTransactionBuilder, RegisterSubNamespaceTransactionBuilder } from "./RegisterNamespaceTransaction";
import { SecretLockTransactionBuilder } from "./SecretLockTransaction";
import { SecretProofTransactionBuilder } from "./SecretProofTransaction";
import { Deadline, DefaultCreateNewDeadline } from "./Deadline";
import { FeeCalculationStrategy, DefaultFeeCalculationStrategy } from "./FeeCalculationStrategy";
import { ExchangeOfferTransactionBuilder } from "./ExchangeOfferTransaction";
import { AddExchangeOfferTransactionBuilder } from "./AddExchangeOfferTransaction";
import { RemoveExchangeOfferTransactionBuilder } from "./RemoveExchangeOfferTransaction";
import { AddHarvesterTransactionBuilder, RemoveHarvesterTransactionBuilder } from "./HarvesterTransaction";
import { PlaceSdaExchangeOfferTransactionBuilder } from "./PlaceSdaExchangeOfferTransaction";
import { RemoveSdaExchangeOfferTransactionBuilder } from "./RemoveSdaExchangeOfferTransaction";
import { CreateLiquidityProviderTransactionBuilder } from "./liquidityProvider/CreateLiquidityProviderTransaction";
import { ManualRateChangeTransactionBuilder } from "./liquidityProvider/ManualRateChangeTransaction";
import { NetworkConfigAbsoluteHeightTransactionBuilder } from "./NetworkConfigAbsoluteHeightTransaction";
import { VrfLinkTransactionBuilder } from "./VrfLinkTransaction";
import { NodeLinkTransactionBuilder } from "./NodeLinkTransaction";
import { AccountV2UpgradeTransactionBuilder } from "./AccountV2UpgradeTransaction";
import { AccountAddressRestrictionTransactionBuilder } from "./AccountAddressRestrictionTransaction";
import { AccountMosaicRestrictionTransactionBuilder } from "./AccountMosaicRestrictionTransaction";
import { AccountOperationRestrictionTransactionBuilder } from "./AccountOperationRestrictionTransaction";
import { MosaicGlobalRestrictionTransactionBuilder } from "./MosaicGlobalRestrictionTransaction";
import { MosaicAddressRestrictionTransactionBuilder } from "./MosaicAddressRestrictionTransaction";
import { LockFundTransferTransactionBuilder } from "./LockFundTransferTransaction";
import { LockFundCancelUnlockTransactionBuilder } from "./LockFundCancelUnlockTransaction";

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

    public nodeLink(): VrfLinkTransactionBuilder {
        const builder = new VrfLinkTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public vrfLink(): NodeLinkTransactionBuilder {
        const builder = new NodeLinkTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public accountV2Upgrade(): AccountV2UpgradeTransactionBuilder {
        const builder = new AccountV2UpgradeTransactionBuilder();
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

    /**
     * @deprecated 
     */
    public accountRestrictionAddress(): AccountAddressRestrictionModificationTransactionBuilder {
        const builder = new AccountAddressRestrictionModificationTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    /**
     * @deprecated 
     */
    public accountRestrictionMosaic(): AccountMosaicRestrictionModificationTransactionBuilder {
        const builder = new AccountMosaicRestrictionModificationTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    /**
     * @deprecated 
     */
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

    /**
     * @deprecated
     */
    public aggregateBondedV1(): AggregateBondedV1TransactionBuilder {
        const builder = new AggregateBondedV1TransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    /**
     * @deprecated
     */
    public aggregateCompleteV1(): AggregateCompleteV1TransactionBuilder {
        const builder = new AggregateCompleteV1TransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public networkConfig(): NetworkConfigTransactionBuilder {
        const builder = new NetworkConfigTransactionBuilder();
        builder.networkType(this.networkType)
            .generationHash(this.generationHash)
            .createNewDeadlineFn(this.createNewDeadlineFn);
        return builder;
    }

    public networkConfigAbsoluteHeight(): NetworkConfigAbsoluteHeightTransactionBuilder {
        const builder = new NetworkConfigAbsoluteHeightTransactionBuilder();
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

    public hashLock(): HashLockTransactionBuilder {
        const builder = new HashLockTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public accountMetadata(): AccountMetadataTransactionBuilder {
        const builder = new AccountMetadataTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public mosaicMetadata(): MosaicMetadataTransactionBuilder {
        const builder = new MosaicMetadataTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public namespaceMetadata(): NamespaceMetadataTransactionBuilder {
        const builder = new NamespaceMetadataTransactionBuilder();
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

    public mosaicModifyLevy(): MosaicModifyLevyTransactionBuilder {
        const builder = new MosaicModifyLevyTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public mosaicRemoveLevy(): MosaicRemoveLevyTransactionBuilder {
        const builder = new MosaicRemoveLevyTransactionBuilder();
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

    public addHarvester(): AddHarvesterTransactionBuilder {
        const builder = new AddHarvesterTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public removeHarvester(): RemoveHarvesterTransactionBuilder {
        const builder = new RemoveHarvesterTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public placeSdaExchangeOffer(): PlaceSdaExchangeOfferTransactionBuilder{
        const builder = new PlaceSdaExchangeOfferTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public removeSdaExchangeOffer(): RemoveSdaExchangeOfferTransactionBuilder{
        const builder = new RemoveSdaExchangeOfferTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
    
    public createLiquidityProvider(): CreateLiquidityProviderTransactionBuilder{
        const builder = new CreateLiquidityProviderTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public manualRateChange(): ManualRateChangeTransactionBuilder{
        const builder = new ManualRateChangeTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public accountAddressRestriction(): AccountAddressRestrictionTransactionBuilder{
        const builder = new AccountAddressRestrictionTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public accountMosaicRestriction(): AccountMosaicRestrictionTransactionBuilder{
        const builder = new AccountMosaicRestrictionTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public accountOperationRestriction(): AccountOperationRestrictionTransactionBuilder{
        const builder = new AccountOperationRestrictionTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public lockFundTransfer(): LockFundTransferTransactionBuilder{
        const builder = new LockFundTransferTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public lockFundCancelUnlock(): LockFundCancelUnlockTransactionBuilder{
        const builder = new LockFundCancelUnlockTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public mosaicAddressRestriction(): MosaicAddressRestrictionTransactionBuilder{
        const builder = new MosaicAddressRestrictionTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }

    public mosaicGlobalRestriction(): MosaicGlobalRestrictionTransactionBuilder{
        const builder = new MosaicGlobalRestrictionTransactionBuilder();
        this.configureBuilder(builder);
        return builder;
    }
}



