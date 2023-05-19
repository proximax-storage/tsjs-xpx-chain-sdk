/*
 * Copyright 2023 ProximaX
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Convert as convert} from '../../core/format';
import {RawUInt64 as UInt64Library} from '../../core/format';
import {Address} from '../../model/account/Address';
import {PublicAccount} from '../../model/account/PublicAccount';
import {NetworkType} from '../../model/blockchain/NetworkType';
import {Id} from '../../model/Id';
import {Mosaic} from '../../model/mosaic/Mosaic';
import {MosaicId} from '../../model/mosaic/MosaicId';
import {MosaicProperties} from '../../model/mosaic/MosaicProperties';
import { MosaicPropertyType } from '../../model/mosaic/MosaicPropertyType';
import {NamespaceId} from '../../model/namespace/NamespaceId';
import { AccountLinkTransaction } from '../../model/transaction/AccountLinkTransaction';
import {AccountRestrictionModification} from '../../model/transaction/AccountRestrictionModification';
import {AddressAliasTransaction} from '../../model/transaction/AddressAliasTransaction';
import {AggregateTransaction} from '../../model/transaction/AggregateTransaction';
import {AggregateTransactionCosignature} from '../../model/transaction/AggregateTransactionCosignature';
import {AggregateTransactionInfo} from '../../model/transaction/AggregateTransactionInfo';
import {ChainConfigTransaction} from '../../model/transaction/ChainConfigTransaction';
import {ChainUpgradeTransaction} from '../../model/transaction/ChainUpgradeTransaction';
import {Deadline} from '../../model/transaction/Deadline';
import { MessageType } from '../../model/transaction/MessageType';
import { EncryptedMessage } from '../../model/transaction/EncryptedMessage';
import { HexadecimalMessage } from '../../model/transaction/HexadecimalMessage';
import {HashLockTransaction} from '../../model/transaction/HashLockTransaction';
import {AccountAddressRestrictionModificationTransaction} from '../../model/transaction/AccountAddressRestrictionModificationTransaction';
import {AccountOperationRestrictionModificationTransaction} from '../../model/transaction/AccountOperationRestrictionModificationTransaction';
import {AccountMosaicRestrictionModificationTransaction} from '../../model/transaction/AccountMosaicRestrictionModificationTransaction';
import {ModifyMultisigAccountTransaction} from '../../model/transaction/ModifyMultisigAccountTransaction';
import {MosaicAliasTransaction} from '../../model/transaction/MosaicAliasTransaction';
import {MosaicDefinitionTransaction} from '../../model/transaction/MosaicDefinitionTransaction';
import {MosaicSupplyChangeTransaction} from '../../model/transaction/MosaicSupplyChangeTransaction';
import {MultisigCosignatoryModification} from '../../model/transaction/MultisigCosignatoryModification';
import {EmptyMessage, PlainMessage} from '../../model/transaction/PlainMessage';
import {RegisterNamespaceTransaction} from '../../model/transaction/RegisterNamespaceTransaction';
import {SecretLockTransaction} from '../../model/transaction/SecretLockTransaction';
import {SecretProofTransaction} from '../../model/transaction/SecretProofTransaction';
import {TransactionHash} from '../../model/transaction/TransactionHash';
import {Transaction} from '../../model/transaction/Transaction';
import {UnknownTransaction} from '../../model/transaction/UnknownTransaction';
import {InnerTransaction} from '../../model/transaction/InnerTransaction';
import {TransactionInfo} from '../../model/transaction/TransactionInfo';
import {TransactionType} from '../../model/transaction/TransactionType';
import {TransferTransaction} from '../../model/transaction/TransferTransaction';
import {UInt64} from '../../model/UInt64';
import { ModifyMetadataTransaction, MetadataModification } from '../../model/transaction/ModifyMetadataTransaction';
import { MetadataType as oldMetadataType } from '../../model/metadata/oldMetadataType';
import { AddExchangeOfferTransaction } from '../../model/transaction/AddExchangeOfferTransaction';
import { AddExchangeOffer } from '../../model/transaction/AddExchangeOffer';
import { ExchangeOfferTransaction } from '../../model/transaction/ExchangeOfferTransaction';
import { ExchangeOffer } from '../../model/transaction/ExchangeOffer';
import { SdaExchangeOffer } from '../../model/transaction/SdaExchangeOffer';
import { RemoveSdaExchangeOffer } from '../../model/transaction/RemoveSdaExchangeOffer';
import { RemoveExchangeOfferTransaction } from '../../model/transaction/RemoveExchangeOfferTransaction';
import { RemoveExchangeOffer } from '../../model/transaction/RemoveExchangeOffer';
import { AccountMetadataTransaction } from '../../model/transaction/AccountMetadataTransaction';
import { MosaicMetadataTransaction } from '../../model/transaction/MosaicMetadataTransaction';
import { NamespaceMetadataTransaction } from '../../model/transaction/NamespaceMetadataTransaction';
import { MosaicModifyLevyTransaction } from '../../model/transaction/MosaicModifyLevyTransaction';
import { MosaicRemoveLevyTransaction } from '../../model/transaction/MosaicRemoveLevyTransaction';
import { HarvesterTransaction } from '../../model/transaction/HarvesterTransaction';
import { PlaceSdaExchangeOfferTransaction } from '../../model/transaction/PlaceSdaExchangeOfferTransaction';
import { RemoveSdaExchangeOfferTransaction } from '../../model/transaction/RemoveSdaExchangeOfferTransaction';
import { MosaicNonce } from '../../model/mosaic/MosaicNonce';
import { MosaicLevy } from '../../model/mosaic/MosaicLevy';
import { TransactionMapUtility } from "./TransactionMapUtility";
import { TransactionVersion } from "../../model/transaction/TransactionVersion";

interface IsAggregatedInfo{
    isEmbedded: boolean;
    isV2: boolean;
}

/**
 * @internal
 * @param transactionDTO
 * @returns {Transaction}
 * @constructor
 */
export const CreateTransactionFromDTO = (transactionDTO): Transaction | InnerTransaction => {

    const transactionVersion = TransactionVersion.createFromUint32(transactionDTO.transaction.version);
    const networkType = transactionVersion.networkType;
    const dScheme = transactionVersion.dScheme;
    const signerVersion = dScheme ? dScheme : 1;
    const transactionTypeVersion = transactionVersion.txnTypeVersion;

    try {
        if (transactionDTO.transaction.type === TransactionType.AGGREGATE_COMPLETE_V1 ||
            transactionDTO.transaction.type === TransactionType.AGGREGATE_BONDED_V1) {
            const innerTransactions = transactionDTO.transaction.transactions === undefined ? [] : transactionDTO.transaction.transactions.map((innerTransactionDTO) => {
                const aggregateTransactionInfo = innerTransactionDTO.meta ? new AggregateTransactionInfo(
                    new UInt64(innerTransactionDTO.meta.height),
                    innerTransactionDTO.meta.index,
                    innerTransactionDTO.meta.id,
                    innerTransactionDTO.meta.aggregateHash,
                    innerTransactionDTO.meta.aggregateId,
                    innerTransactionDTO.meta.uniqueAggregateHash
                ) : undefined;
                innerTransactionDTO.transaction.maxFee = transactionDTO.transaction.maxFee;
                innerTransactionDTO.transaction.deadline = transactionDTO.transaction.deadline;
                innerTransactionDTO.transaction.signature = transactionDTO.transaction.signature;
                return CreateStandaloneTransactionFromDTO(innerTransactionDTO.transaction, aggregateTransactionInfo, {isEmbedded: true, isV2: false});
            });
            return new AggregateTransaction(
                networkType,
                transactionDTO.transaction.type,
                transactionTypeVersion,
                Deadline.createFromDTO(transactionDTO.transaction.deadline),
                new UInt64(transactionDTO.transaction.maxFee || [0, 0]),
                innerTransactions,
                transactionDTO.transaction.cosignatures ? transactionDTO.transaction.cosignatures
                    .map((aggregateCosignatureDTO) => {
                        return new AggregateTransactionCosignature(
                            aggregateCosignatureDTO.signature,
                            PublicAccount.createFromPublicKey(aggregateCosignatureDTO.signer,
                                networkType, 1));
                    }) : [],
                transactionDTO.transaction.signature,
                transactionDTO.transaction.signer ? PublicAccount.createFromPublicKey(transactionDTO.transaction.signer,
                    networkType, 1) : undefined,
                transactionDTO.meta ? new TransactionInfo(
                    new UInt64(transactionDTO.meta.height),
                    transactionDTO.meta.index,
                    transactionDTO.meta.id,
                    transactionDTO.meta.hash,
                    transactionDTO.meta.merkleComponentHash,
                    transactionDTO.transaction.size ? transactionDTO.transaction.size : undefined
                ) : undefined
            );
        } else if (transactionDTO.transaction.type === TransactionType.AGGREGATE_COMPLETE_V2 ||
            transactionDTO.transaction.type === TransactionType.AGGREGATE_BONDED_V2) {
            const innerTransactions = transactionDTO.transaction.transactions === undefined ? [] : transactionDTO.transaction.transactions.map((innerTransactionDTO) => {
                const aggregateTransactionInfo = innerTransactionDTO.meta ? new AggregateTransactionInfo(
                    new UInt64(innerTransactionDTO.meta.height),
                    innerTransactionDTO.meta.index,
                    innerTransactionDTO.meta.id,
                    innerTransactionDTO.meta.aggregateHash,
                    innerTransactionDTO.meta.aggregateId,
                    innerTransactionDTO.meta.uniqueAggregateHash
                ) : undefined;
                innerTransactionDTO.transaction.maxFee = transactionDTO.transaction.maxFee;
                innerTransactionDTO.transaction.deadline = transactionDTO.transaction.deadline;
                innerTransactionDTO.transaction.signature = transactionDTO.transaction.signature;
                return CreateStandaloneTransactionFromDTO(innerTransactionDTO.transaction, aggregateTransactionInfo, {isEmbedded: true, isV2: true});
            });
            return new AggregateTransaction(
                networkType,
                transactionDTO.transaction.type,
                transactionTypeVersion,
                Deadline.createFromDTO(transactionDTO.transaction.deadline),
                new UInt64(transactionDTO.transaction.maxFee || [0, 0]),
                innerTransactions,
                transactionDTO.transaction.cosignatures ? transactionDTO.transaction.cosignatures
                    .map((aggregateCosignatureDTO) => {
                        return new AggregateTransactionCosignature(
                            aggregateCosignatureDTO.signature,
                            PublicAccount.createFromPublicKey(aggregateCosignatureDTO.signer,
                                networkType, signerVersion));
                    }) : [],
                transactionDTO.transaction.signature,
                transactionDTO.transaction.signer ? PublicAccount.createFromPublicKey(transactionDTO.transaction.signer,
                    networkType, signerVersion) : undefined,
                transactionDTO.meta ? new TransactionInfo(
                    new UInt64(transactionDTO.meta.height),
                    transactionDTO.meta.index,
                    transactionDTO.meta.id,
                    transactionDTO.meta.hash,
                    transactionDTO.meta.merkleComponentHash,
                    transactionDTO.transaction.size ? transactionDTO.transaction.size : undefined
                ) : undefined
            );
        } else if(transactionDTO.meta && transactionDTO.meta.aggregateHash){
            const aggregateTransactionInfo = new AggregateTransactionInfo(
                new UInt64(transactionDTO.meta.height),
                transactionDTO.meta.index,
                transactionDTO.meta.id,
                transactionDTO.meta.aggregateHash,
                transactionDTO.meta.aggregateId,
                transactionDTO.meta.uniqueAggregateHash
            );
            return CreateStandaloneTransactionFromDTO(transactionDTO.transaction, aggregateTransactionInfo, {isEmbedded: true, isV2: dScheme ? true: false});
        } else {
            const transactionInfo = transactionDTO.meta ? new TransactionInfo(
                new UInt64(transactionDTO.meta.height),
                transactionDTO.meta.index,
                transactionDTO.meta.id,
                transactionDTO.meta.hash,
                transactionDTO.meta.merkleComponentHash,
                transactionDTO.transaction.size ? transactionDTO.transaction.size : undefined
            ) : undefined;
            return CreateStandaloneTransactionFromDTO(transactionDTO.transaction, transactionInfo);
        }
    } catch (error) {
        console.log(error);
        return transactionDTO;       
    }
};

/**
 * @internal
 * @param transactionDTO
 * @param transactionInfo
 * @returns {any}
 * @constructor
 */
const CreateStandaloneTransactionFromDTO = (transactionDTO, transactionInfo, isAggregatedInfo: IsAggregatedInfo = {isEmbedded: false, isV2: false}): Transaction | InnerTransaction => {

    const transactionVersion = TransactionVersion.createFromUint32(transactionDTO.version);
    const networkType = transactionVersion.networkType;
    const dScheme = transactionVersion.dScheme;
    const signerVersion = dScheme ? dScheme: 1;
    const transactionTypeVersion = transactionVersion.txnTypeVersion;

    let txn: Transaction;

    try {
        if (transactionDTO.type === TransactionType.TRANSFER) {

            let message: PlainMessage | EncryptedMessage | HexadecimalMessage;
            if (transactionDTO.message && transactionDTO.message.type === MessageType.PlainMessage) {
                message = PlainMessage.createFromPayload(transactionDTO.message.payload);
            } else if (transactionDTO.message && transactionDTO.message.type === MessageType.EncryptedMessage) {
                message = EncryptedMessage.createFromPayload(transactionDTO.message.payload);
            } else if (transactionDTO.message && transactionDTO.message.type === MessageType.HexadecimalMessage) {
                message = HexadecimalMessage.createFromPayload(transactionDTO.message.payload);
            } else {
                message = EmptyMessage;
            }
    
            const transferTxn = new TransferTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded ? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                TransactionMapUtility.extractRecipient(transactionDTO.recipient),
                TransactionMapUtility.extractMosaics(transactionDTO.mosaics),
                message,
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                        networkType, signerVersion) : undefined,
                transactionInfo
            );

            txn = transferTxn;

        } else if (transactionDTO.type === TransactionType.REGISTER_NAMESPACE) {
            const registerNamespaceTxn = new RegisterNamespaceTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded ? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                transactionDTO.namespaceType,
                transactionDTO.name,
                new NamespaceId(transactionDTO.namespaceId),
                transactionDTO.namespaceType === 0 ? new UInt64(transactionDTO.duration) : undefined,
                transactionDTO.namespaceType === 1 ? new NamespaceId(transactionDTO.parentId) : undefined,
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                    networkType, signerVersion) : undefined,
                transactionInfo,
            );

            txn = registerNamespaceTxn;
            
        } else if (transactionDTO.type === TransactionType.MOSAIC_DEFINITION) {
            const mosaicDefinitionTxn = new MosaicDefinitionTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded ? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                MosaicNonce.createFromNumber(transactionDTO.mosaicNonce),
                new MosaicId(transactionDTO.mosaicId),
                new MosaicProperties(
                    new UInt64(transactionDTO.properties[MosaicPropertyType.MosaicFlags].value),
                    (new UInt64(transactionDTO.properties[MosaicPropertyType.Divisibility].value)).compact(),
                    transactionDTO.properties.length === 3 &&  transactionDTO.properties[MosaicPropertyType.Duration].value ?
                        new UInt64(transactionDTO.properties[MosaicPropertyType.Duration].value) : undefined,
                ),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                    networkType, signerVersion) : undefined,
                transactionInfo,
            );

            txn = mosaicDefinitionTxn;

        } else if (transactionDTO.type === TransactionType.MOSAIC_SUPPLY_CHANGE) {
            const mosaicSupplyChangeTxn = new MosaicSupplyChangeTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                new MosaicId(transactionDTO.mosaicId),
                transactionDTO.direction,
                new UInt64(transactionDTO.delta),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                    networkType, signerVersion) : undefined,
                transactionInfo,
            );

            txn = mosaicSupplyChangeTxn;

        } else if (transactionDTO.type === TransactionType.MODIFY_MULTISIG_ACCOUNT) {
            const modifyMultisigTxn = new ModifyMultisigAccountTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                transactionDTO.minApprovalDelta,
                transactionDTO.minRemovalDelta,
                transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new MultisigCosignatoryModification(
                    modificationDTO.type,
                    PublicAccount.createFromPublicKey(modificationDTO.cosignatoryPublicKey, networkType),
                )) : [],
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                    networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = modifyMultisigTxn;

        } else if (transactionDTO.type === TransactionType.HASH_LOCK) {
            const lockHashTxn = new HashLockTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                new Mosaic(new MosaicId(transactionDTO.mosaicId), new UInt64(transactionDTO.amount)),
                new UInt64(transactionDTO.duration),
                new TransactionHash(transactionDTO.hash, dScheme ? TransactionType.AGGREGATE_BONDED_V2 : TransactionType.AGGREGATE_BONDED_V1),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? 
                    PublicAccount.createFromPublicKey(transactionDTO.signer, networkType, signerVersion) : undefined,
                transactionInfo,
            );
            
            txn = lockHashTxn;

        } else if (transactionDTO.type === TransactionType.SECRET_LOCK) {
            const recipient = transactionDTO.recipient;
            const secretLockTxn = new SecretLockTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                new Mosaic(new MosaicId(transactionDTO.mosaicId), new UInt64(transactionDTO.amount)),
                new UInt64(transactionDTO.duration),
                transactionDTO.hashAlgorithm,
                (transactionDTO.hashAlgorithm === 2 ? transactionDTO.secret.substring(0, 40) : transactionDTO.secret),
                typeof recipient === 'object' && recipient.hasOwnProperty('address') ?
                    Address.createFromRawAddress(recipient.address) : Address.createFromEncoded(recipient),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                    networkType, signerVersion) : undefined,
                transactionInfo,
            );

            txn = secretLockTxn;

        } else if (transactionDTO.type === TransactionType.SECRET_PROOF) {
            const secretProofTxn = new SecretProofTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                transactionDTO.hashAlgorithm,
                (transactionDTO.hashAlgorithm === 2 ? transactionDTO.secret.substring(0, 40) : transactionDTO.secret),
                Address.createFromEncoded(transactionDTO.recipient),
                transactionDTO.proof,
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                    networkType, signerVersion) : undefined,
                transactionInfo,
            );
            
            txn = secretProofTxn;

        } else if (transactionDTO.type === TransactionType.MOSAIC_ALIAS) {
            const mosaicAliasTxn = new MosaicAliasTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                transactionDTO.aliasAction,
                new NamespaceId(transactionDTO.namespaceId),
                new MosaicId(transactionDTO.mosaicId),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                    networkType, signerVersion) : undefined,
                transactionInfo,
            );

            txn = mosaicAliasTxn;

        } else if (transactionDTO.type === TransactionType.ADDRESS_ALIAS) {
            const addressAliasTxn = new AddressAliasTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                transactionDTO.aliasAction,
                new NamespaceId(transactionDTO.namespaceId),
                TransactionMapUtility.extractRecipient(transactionDTO.address) as Address,
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                    networkType, signerVersion) : undefined,
                transactionInfo,
            );

            txn = addressAliasTxn;

        } else if (transactionDTO.type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS) {
            const accountAddressRestrictionTxn = new AccountAddressRestrictionModificationTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                transactionDTO.propertyType,
                transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountRestrictionModification<string>(
                    modificationDTO.type,
                    Address.createFromEncoded(modificationDTO.value).plain(),
                )) : [],
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );

            txn = accountAddressRestrictionTxn;

        } else if (transactionDTO.type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION) {
            const accountOperationRestrictionTxn = new AccountOperationRestrictionModificationTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                transactionDTO.propertyType,
                transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountRestrictionModification<number[]>(
                    modificationDTO.type,
                    modificationDTO.value,
                )) : [],
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );
            
            txn = accountOperationRestrictionTxn;

        } else if (transactionDTO.type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC) {
            const accountMosaicRestrictionTxn = new AccountMosaicRestrictionModificationTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                transactionDTO.propertyType,
                transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountRestrictionModification<TransactionType>(
                    modificationDTO.type,
                    modificationDTO.value,
                )) : [],
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );

            txn = accountMosaicRestrictionTxn;

        } else if (transactionDTO.type === TransactionType.LINK_ACCOUNT) {
            const accountLinkTxn = new AccountLinkTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                transactionDTO.remoteAccountKey,
                transactionDTO.action,
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                        networkType, signerVersion) : undefined,
                transactionInfo,
            );

            txn = accountLinkTxn;

        } else if (transactionDTO.type === TransactionType.MODIFY_ACCOUNT_METADATA ||
                    transactionDTO.type === TransactionType.MODIFY_MOSAIC_METADATA ||
                    transactionDTO.type === TransactionType.MODIFY_NAMESPACE_METADATA) {

            const deadline = isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline);
            const maxFee = isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]);
            const signature = isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature;
            // const metadataType = transactionDTO.metadataType;
            const metadataId = transactionDTO.metadataId;
            const modifications =
                transactionDTO.modifications ?
                transactionDTO.modifications.map(m => new MetadataModification(m.key, m.value)) :
                undefined
            switch(transactionDTO.type) {
                case TransactionType.MODIFY_ACCOUNT_METADATA: {
                    let modifyMetadataTxn = new ModifyMetadataTransaction(
                        TransactionType.MODIFY_ACCOUNT_METADATA,
                        networkType,
                        transactionTypeVersion,
                        deadline,
                        maxFee,
                        oldMetadataType.ADDRESS,
                        Address.createFromEncoded(metadataId).plain(),
                        modifications,
                        signature,
                        transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                        transactionInfo,
                        )

                    txn = modifyMetadataTxn;
                }
                case TransactionType.MODIFY_MOSAIC_METADATA: {
                    let modifyMetadataTxn = new ModifyMetadataTransaction(
                        TransactionType.MODIFY_MOSAIC_METADATA,
                        networkType,
                        transactionTypeVersion,
                        deadline,
                        maxFee,
                        oldMetadataType.MOSAIC,
                        new MosaicId(metadataId).toHex(),
                        modifications,
                        signature,
                        transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                        transactionInfo,
                        )
                    txn = modifyMetadataTxn;
                }
                case TransactionType.MODIFY_NAMESPACE_METADATA: {
                    let modifyMetadataTxn = new ModifyMetadataTransaction(
                        TransactionType.MODIFY_NAMESPACE_METADATA,
                        networkType,
                        transactionTypeVersion,
                        deadline,
                        maxFee,
                        oldMetadataType.NAMESPACE,
                        new NamespaceId(metadataId).toHex(),
                        modifications,
                        signature,
                        transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                        transactionInfo,
                        )
                    txn = modifyMetadataTxn;
                }
            }
        } else if (transactionDTO.type === TransactionType.CHAIN_UPGRADE) {
            const chainUpgradeTxn = new ChainUpgradeTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                new UInt64(transactionDTO.upgradePeriod),
                new UInt64(transactionDTO.newBlockchainVersion),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = chainUpgradeTxn;
        } else if (transactionDTO.type === TransactionType.CHAIN_CONFIGURE) {
            const chainConfigTxn = new ChainConfigTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                new UInt64(transactionDTO.applyHeightDelta || [0, 0]),
                transactionDTO.networkConfig,
                transactionDTO.supportedEntityVersions,
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = chainConfigTxn;
        } else if (transactionDTO.type === TransactionType.ADD_EXCHANGE_OFFER) {
            const addExchangeOfferTxn = new AddExchangeOfferTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                transactionDTO.offers.map(o => new AddExchangeOffer(
                    new MosaicId(o.mosaicId),
                    new UInt64(o.mosaicAmount),
                    new UInt64(o.cost),
                    o.type,
                    new UInt64(o.duration)
                )),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = addExchangeOfferTxn;
        } else if (transactionDTO.type === TransactionType.EXCHANGE_OFFER) {
            const exchangeOfferTxn = new ExchangeOfferTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                transactionDTO.offers.map(o => new ExchangeOffer(
                    new MosaicId(o.mosaicId),
                    new UInt64(o.mosaicAmount),
                    new UInt64(o.cost),
                    o.type,
                    PublicAccount.createFromPublicKey(o.owner, networkType)
                )),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = exchangeOfferTxn;
        } else if (transactionDTO.type === TransactionType.REMOVE_EXCHANGE_OFFER) {
            const removeExchangeOfferTxn = new RemoveExchangeOfferTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                transactionDTO.offers.map(o => new RemoveExchangeOffer(
                    new MosaicId(o.mosaicId),
                    o.offerType // or type?
                )),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = removeExchangeOfferTxn;
        } else if (transactionDTO.type === TransactionType.ACCOUNT_METADATA_V2) {
            const accountMetadataTxn = new AccountMetadataTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                new UInt64(transactionDTO.scopedMetadataKey),
                PublicAccount.createFromPublicKey(transactionDTO.targetKey, networkType),
                transactionDTO.valueSizeDelta,
                "",
                "",
                transactionDTO.valueSize,
                convert.hexToUint8(transactionDTO.value),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = accountMetadataTxn;
        } else if (transactionDTO.type === TransactionType.MOSAIC_METADATA_V2) {
            const mosaicMetadataTxn = new MosaicMetadataTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                new UInt64(transactionDTO.scopedMetadataKey),
                PublicAccount.createFromPublicKey(transactionDTO.targetKey, networkType),
                new MosaicId(transactionDTO.targetMosaicId),
                transactionDTO.valueSizeDelta,
                "",
                "",
                transactionDTO.valueSize,
                convert.hexToUint8(transactionDTO.value),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = mosaicMetadataTxn;
        } else if (transactionDTO.type === TransactionType.NAMESPACE_METADATA_V2) {
            const namespaceMetadataTxn = new NamespaceMetadataTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                new UInt64(transactionDTO.scopedMetadataKey),
                PublicAccount.createFromPublicKey(transactionDTO.targetKey, networkType),
                new NamespaceId(transactionDTO.targetNamespaceId),
                transactionDTO.valueSizeDelta,
                "",
                "",
                transactionDTO.valueSize,
                convert.hexToUint8(transactionDTO.value),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = namespaceMetadataTxn;
        } else if (transactionDTO.type === TransactionType.MODIFY_MOSAIC_LEVY) {
            const mosaicModifyLevyTxn = new MosaicModifyLevyTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                new MosaicId(transactionDTO.mosaicId),
                new MosaicLevy(
                    transactionDTO.levy.type, 
                    Address.createFromEncoded(transactionDTO.levy.recipient), 
                    new MosaicId(transactionDTO.levy.mosaicId), 
                    new UInt64(transactionDTO.levy.fee)
                ),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = mosaicModifyLevyTxn;
        } else if (transactionDTO.type === TransactionType.REMOVE_MOSAIC_LEVY) {
            const mosaicRemoveLevyTxn = new MosaicRemoveLevyTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                new MosaicId(transactionDTO.mosaicId),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = mosaicRemoveLevyTxn;
        } else if (transactionDTO.type === TransactionType.ADD_HARVESTER) {
            const addHarvesterTxn = new HarvesterTransaction(
                networkType,
                TransactionType.ADD_HARVESTER,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                PublicAccount.createFromPublicKey(transactionDTO.harvesterKey, networkType),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer, networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = addHarvesterTxn;
        } else if (transactionDTO.type === TransactionType.REMOVE_HARVESTER) {
            const removeHarvesterTxn = new HarvesterTransaction(
                networkType,
                TransactionType.REMOVE_HARVESTER,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                PublicAccount.createFromPublicKey(transactionDTO.harvesterKey, networkType),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer, networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = removeHarvesterTxn;
        
        }else if (transactionDTO.type === TransactionType.PLACE_SDA_EXCHANGE_OFFER) {
            const placeSdaExchangeOfferTxn = new PlaceSdaExchangeOfferTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                transactionDTO.sdaOffers.map(o => new SdaExchangeOffer(
                    new MosaicId(o.mosaicIdGive),
                    new UInt64(o.mosaicAmountGive),
                    new MosaicId(o.mosaicIdGet),
                    new UInt64(o.mosaicAmountGet),
                    new UInt64(o.duration)
                )),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = placeSdaExchangeOfferTxn;
        } else if (transactionDTO.type === TransactionType.REMOVE_SDA_EXCHANGE_OFFER) {
            const removeSdaExchangeOfferTxn = new RemoveSdaExchangeOfferTransaction(
                networkType,
                transactionTypeVersion,
                isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
                transactionDTO.sdaOffers.map(o => new RemoveSdaExchangeOffer(
                    new MosaicId(o.mosaicIdGive),
                    new MosaicId(o.mosaicIdGet)
                )),
                isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
                isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
                transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                                networkType, signerVersion) : undefined,
                transactionInfo,
            );
            txn = removeSdaExchangeOfferTxn;
        } 
        else{
            throw new Error('Unimplemented transaction with type ' + transactionDTO.type);
        }

        txn!.version.dScheme = dScheme;

        if(isAggregatedInfo.isEmbedded && isAggregatedInfo.isV2){
            return txn!.toAggregate(txn!.signer!);
        }
        else if(isAggregatedInfo.isEmbedded){
            return txn!.toAggregateV1(txn!.signer!);
        }
        else{
            return txn!;
        }
        
    } catch (error) {

        let unknownTxnData = cloneAndRemoveTxnBaseData(transactionDTO);

        return new UnknownTransaction(
            "",
            unknownTxnData,
            transactionDTO.type, 
            networkType, 
            transactionTypeVersion, 
            isAggregatedInfo.isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isAggregatedInfo.isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            PublicAccount.createFromPublicKey(transactionDTO.signer, networkType, signerVersion),
            isAggregatedInfo.isEmbedded ? undefined : transactionDTO.signature,
            transactionInfo
        );
    }
};

const cloneAndRemoveTxnBaseData = (transactionDTO: Object): any =>{

    let clonedTransactionDTO = Object.assign({}, transactionDTO);

    if('signature' in clonedTransactionDTO){
        delete clonedTransactionDTO['signature'];
    }

    if('signer' in clonedTransactionDTO){
        delete clonedTransactionDTO['signer'];
    }

    if('version' in clonedTransactionDTO){
        delete clonedTransactionDTO['version'];
    }

    if('type' in clonedTransactionDTO){
        delete clonedTransactionDTO['type'];
    }

    if('deadline' in clonedTransactionDTO){
        delete clonedTransactionDTO['deadline'];
    }

    if('maxFee' in clonedTransactionDTO){
        delete clonedTransactionDTO['maxFee'];
    }

    return clonedTransactionDTO;
}
