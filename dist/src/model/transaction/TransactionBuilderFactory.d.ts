import { NetworkType } from '../blockchain/NetworkType';
import { AccountAddressRestrictionModificationTransactionBuilder } from './AccountAddressRestrictionModificationTransaction';
import { AccountLinkTransactionBuilder } from './AccountLinkTransaction';
import { AccountMosaicRestrictionModificationTransactionBuilder } from './AccountMosaicRestrictionModificationTransaction';
import {
    AccountOperationRestrictionModificationTransactionBuilder,
} from './AccountOperationRestrictionModificationTransaction';
import { AddressAliasTransactionBuilder } from './AddressAliasTransaction';
import { AggregateBondedTransactionBuilder, AggregateCompleteTransactionBuilder } from './AggregateTransaction';
import { ChainConfigTransactionBuilder } from './ChainConfigTransaction';
import { ChainUpgradeTransactionBuilder } from './ChainUpgradeTransaction';
import { Deadline } from './Deadline';
import { FeeCalculationStrategy } from './FeeCalculationStrategy';
import { HashLockTransactionBuilder } from './HashLockTransaction';
import { LockFundsTransactionBuilder } from './LockFundsTransaction';
import { ModifyContractTransactionBuilder } from './ModifyContractTransaction';
import {
    ModifyAccountMetadataTransactionBuilder,
    ModifyMosaicMetadataTransactionBuilder,
    ModifyNamespaceMetadataTransactionBuilder,
} from './ModifyMetadataTransaction';
import { ModifyMultisigAccountTransactionBuilder } from './ModifyMultisigAccountTransaction';
import { MosaicAliasTransactionBuilder } from './MosaicAliasTransaction';
import { MosaicDefinitionTransactionBuilder } from './MosaicDefinitionTransaction';
import { MosaicSupplyChangeTransactionBuilder } from './MosaicSupplyChangeTransaction';
import {
    RegisterRootNamespaceTransactionBuilder,
    RegisterSubNamespaceTransactionBuilder,
} from './RegisterNamespaceTransaction';
import { SecretLockTransactionBuilder } from './SecretLockTransaction';
import { SecretProofTransactionBuilder } from './SecretProofTransaction';
import { TransferTransactionBuilder } from './TransferTransaction';

export declare class TransactionBuilderFactory {
    private _networkType;
    private _generationHash;
    private _feeCalculationStrategy;
    private _createNewDeadlineFn;
    constructor();
    networkType: NetworkType;
    generationHash: string;
    feeCalculationStrategy: FeeCalculationStrategy;
    setDefaultFeeCalculationStrategy(): void;
    createNewDeadlineFn: () => Deadline;
    private configureBuilder;
    accountLink(): AccountLinkTransactionBuilder;
    transfer(): TransferTransactionBuilder;
    mosaicDefinition(): MosaicDefinitionTransactionBuilder;
    accountRestrictionAddress(): AccountAddressRestrictionModificationTransactionBuilder;
    accountRestrictionMosaic(): AccountMosaicRestrictionModificationTransactionBuilder;
    accountRestrictionOperation(): AccountOperationRestrictionModificationTransactionBuilder;
    addressAlias(): AddressAliasTransactionBuilder;
    aggregateBonded(): AggregateBondedTransactionBuilder;
    aggregateComplete(): AggregateCompleteTransactionBuilder;
    chainConfig(): ChainConfigTransactionBuilder;
    chainUpgrade(): ChainUpgradeTransactionBuilder;
    lockFunds(): LockFundsTransactionBuilder;
    hashLock(): HashLockTransactionBuilder;
    modifyContract(): ModifyContractTransactionBuilder;
    accountMetadata(): ModifyAccountMetadataTransactionBuilder;
    mosaicMetadata(): ModifyMosaicMetadataTransactionBuilder;
    namespaceMetadata(): ModifyNamespaceMetadataTransactionBuilder;
    modifyMultisig(): ModifyMultisigAccountTransactionBuilder;
    mosaicAlias(): MosaicAliasTransactionBuilder;
    mosaicSupplyChange(): MosaicSupplyChangeTransactionBuilder;
    registerRootNamespace(): RegisterRootNamespaceTransactionBuilder;
    registerSubNamespace(): RegisterSubNamespaceTransactionBuilder;
    secretLock(): SecretLockTransactionBuilder;
    secretProof(): SecretProofTransactionBuilder;
}
