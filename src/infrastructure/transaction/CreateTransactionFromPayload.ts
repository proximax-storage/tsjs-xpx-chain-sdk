/*
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

import { Convert as convert } from '../../core/format';
import { decode } from 'utf8';
import { Address } from '../../model/account/Address';
import { PublicAccount } from '../../model/account/PublicAccount';
import { NetworkType } from '../../model/blockchain/NetworkType';
import { Mosaic } from '../../model/mosaic/Mosaic';
import { MosaicId } from '../../model/mosaic/MosaicId';
import { MosaicNonce } from '../../model/mosaic/MosaicNonce';
import { MosaicProperties } from '../../model/mosaic/MosaicProperties';
import { NamespaceId } from '../../model/namespace/NamespaceId';
import { NamespaceType } from '../../model/namespace/NamespaceType';
import { AccountRestrictionModification } from '../../model/transaction/AccountRestrictionModification';
import { AggregateTransactionCosignature } from '../../model/transaction/AggregateTransactionCosignature';
import { Deadline } from '../../model/transaction/Deadline';
import { EncryptedMessage } from '../../model/transaction/EncryptedMessage';
import { Message } from '../../model/transaction/Message';
import { MessageType } from '../../model/transaction/MessageType';
import { MultisigCosignatoryModification } from '../../model/transaction/MultisigCosignatoryModification';
import { PlainMessage } from '../../model/transaction/PlainMessage';
import { SignedTransaction } from '../../model/transaction/SignedTransaction';
import { Transaction } from '../../model/transaction/Transaction';
import { TransactionType } from '../../model/transaction/TransactionType';
import { UInt64 } from '../../model/UInt64';
import { TransactionBuilderFactory, MetadataType, MetadataModification, Metadata, MultisigCosignatoryModificationType } from '../../model/model';
import { AddExchangeOffer } from '../../model/transaction/AddExchangeOffer';
import { ExchangeOffer } from '../../model/transaction/ExchangeOffer';
import { RemoveExchangeOffer } from '../../model/transaction/RemoveExchangeOffer';

/**
 * @internal
 * @param transactionBinary - The transaction binary data
 * @returns {Transaction}
 * @constructor
 */
export const CreateTransactionFromPayload = (transactionBinary: string): Transaction => {
    // Transaction byte size data
    const sizeLength        = 8;
    const signatureLength   = 128;
    const publicKeyLength   = 64;
    const versionLength     = 8;
    const typeLength        = 4;
    const feeLength         = 16;
    const deadlineLength    = 16;

    // Transaction byte data positions
    const signatureOffset = sizeLength;
    const publicKeyOffset = signatureOffset + signatureLength;
    const versionOffset = publicKeyOffset + publicKeyLength;
    const typeOffset = versionOffset + versionLength;
    const feeOffset = typeOffset + typeLength;
    const deadlineOffset = feeOffset + feeLength;
    const transactionOffset = deadlineOffset + deadlineLength;

    // Transaction byte data
    const networkType = extractNetwork(transactionBinary.substring(versionOffset, typeOffset));
    const type = extractNumberFromHex(transactionBinary.substring(typeOffset, feeOffset));
    const deadline = UInt64.fromHex(reverse(transactionBinary.substring(deadlineOffset, transactionOffset))).toDTO();
    const transactionData = transactionBinary.substring(transactionOffset);

    return CreateTransaction(type, transactionData, networkType, deadline);
};

/**
 * @internal
 * @param type - Transaction type
 * @param transactionData - Details per specific transaction type
 * @param networkType - Network type
 * @param deadline - Deadline
 * @returns {Transaction}
 */
const CreateTransaction = (type: number, transactionData: string, networkType: NetworkType, deadline: number[]): Transaction => {
    const factory = new TransactionBuilderFactory();
    factory.networkType = networkType;
    factory.createNewDeadlineFn = () => Deadline.createFromDTO(deadline);

    switch (type) {
        case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
        case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
        case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
            const propertyTypeLength = 2;

            const modificationCountOffset = propertyTypeLength;
            const modificationArrayOffset = modificationCountOffset + propertyTypeLength;

            // read bytes
            const propertyType = transactionData.substring(0, propertyTypeLength);
            const modifications = transactionData.substring(modificationArrayOffset, transactionData.length);
            const modificationArray = modifications.match(/.{1,52}/g);

            switch (type) {
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
                    return factory.accountRestrictionAddress()
                        .restrictionType(extractNumberFromHex(propertyType))
                        .modifications(modificationArray ? modificationArray.map((modification) => new AccountRestrictionModification(
                            extractNumberFromHex(modification.substring(0, 2)),
                            Address.createFromEncoded(modification.substring(2, modification.length)).plain(),
                        )) : [])
                        .build();
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
                    return factory.accountRestrictionMosaic()
                        .restrictionType(extractNumberFromHex(propertyType))
                        .modifications(modificationArray ? modificationArray.map((modification) => new AccountRestrictionModification(
                            extractNumberFromHex(modification.substring(0, 2)),
                            UInt64.fromHex(reverse(modification.substring(2, modification.length))).toDTO(),
                        )) : [])
                        .build();
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
                    return factory.accountRestrictionOperation()
                        .restrictionType(extractNumberFromHex(propertyType))
                        .modifications(modificationArray ? modificationArray.map((modification) => new AccountRestrictionModification(
                            extractNumberFromHex(modification.substring(0, 2)),
                            extractNumberFromHex(
                                modification.substring(2, modification.length)),
                        )) : [])
                        .build();
            }
            throw new Error ('Account restriction transaction type not recognised.');
        case TransactionType.LINK_ACCOUNT:
            // read bytes
            const remoteAccountKey = transactionData.substring(0, 64);
            const linkAction = transactionData.substring(64, 66);

            return factory.accountLink()
                .remoteAccountKey(remoteAccountKey)
                .linkAction(extractNumberFromHex(linkAction))
                .build();

        case TransactionType.ADDRESS_ALIAS:
            // read bytes
            const addressAliasAction = transactionData.substring(0, 2);
            const addressAliasNamespaceId = transactionData.substring(2, 18);
            const addressAliasAddress = transactionData.substring(18);

            return factory.addressAlias()
                .actionType(extractNumberFromHex(addressAliasAction))
                .namespaceId(new NamespaceId(UInt64.fromHex(reverse(addressAliasNamespaceId)).toDTO()))
                .address(Address.createFromEncoded(addressAliasAddress))
                .build();

        case TransactionType.MOSAIC_ALIAS:
            const mosaicAliasActionLength = 2;

            // read bytes
            const mosaicAliasAction = transactionData.substring(0, mosaicAliasActionLength);
            const mosaicAliasNamespaceId = transactionData.substring(mosaicAliasActionLength, 18);
            const mosaicAliasMosaicId = transactionData.substring(18);

            return factory.mosaicAlias()
                .actionType(extractNumberFromHex(mosaicAliasAction))
                .namespaceId(new NamespaceId(UInt64.fromHex(reverse(mosaicAliasNamespaceId)).toDTO()))
                .mosaicId(new MosaicId(UInt64.fromHex(reverse(mosaicAliasMosaicId)).toDTO()))
                .build();

        case TransactionType.MOSAIC_DEFINITION:
            const mosaicDefMosaicNonceLength = 8;
            const mosaicDefMosaicIdLength    = 16;
            const mosaicDefPropsNumLength    = 2;
            const mosaicDefPropsFlagsLength  = 2;
            const mosaicDefDivisibilityLength = 2;
            const mosaicDefDurationIndLength = 2;
            const mosaicDefDurationLength    = 16;

            const mosaicIdOffset     = mosaicDefMosaicNonceLength;
            const propsOffset        = mosaicIdOffset + mosaicDefMosaicIdLength;
            const flagsOffset        = propsOffset + mosaicDefPropsNumLength;
            const divisibilityOffset = flagsOffset + mosaicDefPropsFlagsLength;
            const durationIndOffset  = divisibilityOffset + mosaicDefDivisibilityLength;
            const durationOffset     = durationIndOffset + mosaicDefDurationIndLength;

            // read bytes
            const mosaicNonce = transactionData.substring(0, mosaicDefMosaicNonceLength);
            const mosaicId = transactionData.substring(mosaicIdOffset, propsOffset);
            const props = transactionData.substring(propsOffset, flagsOffset);
            const flags = extractNumberFromHex(
                transactionData.substring(flagsOffset, divisibilityOffset));
            const divisibility = transactionData.substring(divisibilityOffset, durationIndOffset);
            const durationInd = transactionData.substring(durationIndOffset, durationOffset);
            const duration = transactionData.substring(durationOffset);

            const regexArray = mosaicNonce.match(/.{1,2}/g);

            const nonceArray = regexArray ? regexArray.map((n) => {
                return extractNumberFromHex(n);
            }) : [];

            return factory.mosaicDefinition()
                .mosaicNonce(new MosaicNonce(new Uint8Array(nonceArray)))
                .mosaicId(new MosaicId(UInt64.fromHex(reverse(mosaicId)).toDTO()))
                .mosaicProperties(MosaicProperties.create({
                    supplyMutable: (flags & 1) === 1,
                    transferable: (flags & 2) === 2,
                    divisibility: extractNumberFromHex(divisibility),
                    duration: duration ? UInt64.fromHex(reverse(duration)) : undefined,
                }))
                .build();

        case TransactionType.MOSAIC_SUPPLY_CHANGE:
            // read bytes
            const mosaicSupMosaicId = transactionData.substring(0, 16);
            const mosaicSupDirection = transactionData.substring(16, 18);
            const delta = transactionData.substring(18, 34);

            return factory.mosaicSupplyChange()
                .mosaicId(new MosaicId(UInt64.fromHex(reverse(mosaicSupMosaicId)).toDTO()))
                .direction(extractNumberFromHex(mosaicSupDirection))
                .delta(UInt64.fromHex(reverse(delta)))
                .build();

        case TransactionType.REGISTER_NAMESPACE:
            // read bytes
            const namespaceType = extractNumberFromHex(transactionData.substring(0, 2));
            const nameSpaceDurationParentId = transactionData.substring(2, 18);
            const nameSpaceId = transactionData.substring(18, 34);
            const nameSize = transactionData.substring(34, 36);
            const nameSpaceName = transactionData.substring(36);

            return namespaceType === NamespaceType.RootNamespace ?
                factory.registerRootNamespace()
                    .namespaceName(decodeHexUtf8(nameSpaceName))
                    .duration(UInt64.fromHex(reverse(nameSpaceDurationParentId)))
                    .build()
                : factory.registerSubNamespace()
                    .namespaceName(decodeHexUtf8(nameSpaceName))
                    .parentNamespace(new NamespaceId(UInt64.fromHex(reverse(nameSpaceDurationParentId)).toDTO()))
                    .build();

        case TransactionType.TRANSFER:
            // read bytes
            const transferRecipient = transactionData.substring(0, 50);
            const transferMessageSize = extractNumberFromHex(transactionData.substring(50, 54));

            const transferMessageAndMosaicSubString = transactionData.substring(56);
            const transferMessageType = extractNumberFromHex(
                                                                        transferMessageAndMosaicSubString.substring(0, 2));
            const transferMessage = transferMessageAndMosaicSubString.substring(2, (transferMessageSize - 1) * 2 + 2);
            const transferMosaic = transferMessageAndMosaicSubString.substring(transferMessageSize * 2);
            const transferMosaicArray = transferMosaic.match(/.{1,32}/g);

            return factory.transfer()
                .recipient(Address.createFromEncoded(transferRecipient))
                .mosaics(transferMosaicArray ? transferMosaicArray.map((mosaic) => new Mosaic(
                    new MosaicId(UInt64.fromHex(reverse(mosaic.substring(0, 16))).toDTO()),
                    UInt64.fromHex(reverse(mosaic.substring(16))),
                )) : [])
                .message(extractMessage(transferMessageType, transferMessage))
                .build();

        case TransactionType.SECRET_LOCK:
            // read bytes
            const secretLockMosaic = transactionData.substring(0, 32);
            const secretLockDuration = transactionData.substring(32, 48);
            const secretLockHashAlgorithm = extractNumberFromHex(
                transactionData.substring(48, 50));
            const secretLockSecret = transactionData.substring(50, transactionData.length - 50);
            const secretLockRecipient = transactionData.substring(transactionData.length - 50);

            return factory.secretLock()
                .mosaic(new Mosaic(
                    new MosaicId(UInt64.fromHex(reverse(secretLockMosaic.substring(0, 16))).toDTO()),
                    UInt64.fromHex(reverse(secretLockMosaic.substring(16))),
                ))
                .duration(UInt64.fromHex(reverse(secretLockDuration)))
                .hashType(secretLockHashAlgorithm)
                .secret(secretLockSecret)
                .recipient(Address.createFromEncoded(secretLockRecipient))
                .build();

        case TransactionType.SECRET_PROOF:
            // read bytes
            const secretProofHashAlgorithm = extractNumberFromHex(
                transactionData.substring(0, 2));

            const secretProofSecretLength = 64;
            const secretProofSecret = transactionData.substring(2, 66);
            const secretProofRecipient = transactionData.substring(66, 116);
            const secretProofSize = transactionData.substring(116, 120);
            const secretProofProof = transactionData.substring(120);

            return factory.secretProof()
                .hashType(secretProofHashAlgorithm)
                .secret(secretProofSecret)
                .recipient(Address.createFromEncoded(secretProofRecipient))
                .proof(secretProofProof)
                .build();

            case TransactionType.MODIFY_MULTISIG_ACCOUNT:
            // read bytes
            const minRemovalDelta = extractNumberFromHex(transactionData.substring(0, 2));
            const minApprovalDelta = extractNumberFromHex(transactionData.substring(2, 4));
            const modificationsCount = extractNumberFromHex(transactionData.substring(4, 6));

            const multiSigModificationSubString = transactionData.substring(6);
            const multiSigModificationArray = multiSigModificationSubString.match(/.{1,66}/g);

            return factory.modifyMultisig()
                .minApprovalDelta(minApprovalDelta)
                .minRemovalDelta(minRemovalDelta)
                .modifications(multiSigModificationArray ? multiSigModificationArray.map((modification) => new MultisigCosignatoryModification(
                    extractNumberFromHex(modification.substring(0, 2)),
                    PublicAccount.createFromPublicKey(modification.substring(2), networkType),
                )) : [])
                .build();

            case TransactionType.LOCK:
            // read bytes
            const hashLockMosaic = transactionData.substring(0, 32);
            const hashLockDuration = transactionData.substring(32, 48);
            const hashLockHash = transactionData.substring(48);

            return factory.lockFunds()
                .mosaic(new Mosaic(
                    new MosaicId(UInt64.fromHex(reverse(hashLockMosaic.substring(0, 16))).toDTO()),
                    UInt64.fromHex(reverse(hashLockMosaic.substring(16))),
                ))
                .duration(UInt64.fromHex(reverse(hashLockDuration)))
                .signedTransaction(new SignedTransaction('', hashLockHash, '', TransactionType.AGGREGATE_BONDED, networkType))
                .build();

        case TransactionType.AGGREGATE_COMPLETE:
            // read bytes
            const payloadSize = extractNumberFromHex(transactionData.substring(0, 8)) * 2;
            const cosignatures = transactionData.substring(payloadSize + 8);

            const innerTransactionArray = parseInnerTransactionFromBinary(transactionData.substring(8, payloadSize + 8));
            const consignatureArray = cosignatures.match(/.{1,192}/g);

            return factory.aggregateComplete()
                .innerTransactions(innerTransactionArray.map((innerTransaction) => {
                    const txType = extractNumberFromHex(innerTransaction.substring(72, 76));
                    const transaction = CreateTransaction(
                        txType,
                        innerTransaction.substring(76),
                        networkType,
                        deadline,
                    );
                    return transaction.toAggregate(PublicAccount.createFromPublicKey(innerTransaction.substring(0, 64), networkType));
                }))
                .cosignatures(consignatureArray ? consignatureArray.map((cosignature) => new AggregateTransactionCosignature(
                    cosignature.substring(64, 192),
                    PublicAccount.createFromPublicKey(cosignature.substring(0, 64), networkType),
                )) : [])
                .build();

        case TransactionType.AGGREGATE_BONDED:
            const bondedPayloadSize = extractNumberFromHex(transactionData.substring(0, 8)) * 2;
            const bondedCosignatures = transactionData.substring(bondedPayloadSize + 8);

            const bondedInnerTransactionArray = parseInnerTransactionFromBinary(transactionData.substring(8, bondedPayloadSize + 8));
            const bondedConsignatureArray = bondedCosignatures.match(/.{1,192}/g);

            return factory.aggregateBonded()
                .innerTransactions(bondedInnerTransactionArray.map((innerTransaction) => {
                    const txType = extractNumberFromHex(innerTransaction.substring(72, 76));
                    const transaction = CreateTransaction(
                        txType,
                        innerTransaction.substring(76),
                        networkType,
                        deadline,
                        );
                    return transaction.toAggregate(PublicAccount.createFromPublicKey(innerTransaction.substring(0, 64), networkType));
                }))
                .cosignatures(bondedConsignatureArray ? bondedConsignatureArray.map((cosignature) => new AggregateTransactionCosignature(
                    cosignature.substring(64, 192),
                    PublicAccount.createFromPublicKey(cosignature.substring(0, 64), networkType),
                )) : [])
                .build();

        case TransactionType.MODIFY_ACCOUNT_METADATA:
        case TransactionType.MODIFY_MOSAIC_METADATA:
        case TransactionType.MODIFY_NAMESPACE_METADATA:
            const metadataType = extractNumberFromHex(transactionData.substring(0, 2));
            const metadataIdLength = type === TransactionType.MODIFY_ACCOUNT_METADATA ? 25 : 8;
            const metadataId = transactionData.substring(2, 2 + metadataIdLength * 2);
            const metadataModifications = extractMetadataModifications(transactionData.substring(2 + metadataIdLength * 2));
            if (type === TransactionType.MODIFY_ACCOUNT_METADATA) {
                return factory.accountMetadata()
                    .address(Address.createFromEncoded(metadataId))
                    .modifications(metadataModifications)
                    .build();
            } else if (type === TransactionType.MODIFY_MOSAIC_METADATA) {
                return factory.mosaicMetadata()
                    .mosaicId(new MosaicId(UInt64.fromHex(reverse(metadataId)).toDTO()))
                    .modifications(metadataModifications)
                    .build();
            } else {// if type === TransactionType.MODIFY_NAMESPACE_METADATA
                return factory.namespaceMetadata()
                    .namespaceId(new NamespaceId(UInt64.fromHex(reverse(metadataId)).toDTO()))
                    .modifications(metadataModifications)
                    .build();
            }

        case TransactionType.CHAIN_CONFIGURE:
            const applyHeightDelta = transactionData.substring(0, 16);
            const networkConfigLength = extractNumberFromHex(transactionData.substring(16, 20));
            const supportedEntityVersionsLength = extractNumberFromHex(transactionData.substring(20, 24));
            const networkConfig = transactionData.substring(24, 24 + networkConfigLength*2);
            const supportedEntityVersions = transactionData.substring(24 + networkConfigLength*2, 24 + networkConfigLength*2 + supportedEntityVersionsLength*2);
            return factory.chainConfig()
                .applyHeightDelta(UInt64.fromHex(reverse(applyHeightDelta)))
                .networkConfig(decodeHexRaw(networkConfig))
                .supportedEntityVersions(decodeHexRaw(supportedEntityVersions))
                .build();

        case TransactionType.CHAIN_UPGRADE:
            const upgradePeriod = transactionData.substring(0, 16);
            const newBlockchainVersion = transactionData.substring(16, 32);
            return factory.chainUpgrade()
                .upgradePeriod(UInt64.fromHex(reverse(upgradePeriod)))
                .newBlockchainVersion(UInt64.fromHex(reverse(newBlockchainVersion)))
                .build();

        case TransactionType.MODIFY_CONTRACT:
            const durationDelta = transactionData.substring(0, 16);
            const hash = transactionData.substring(16, 80);
            const numCustomers = extractNumberFromHex(transactionData.substring(80, 82));
            const numExecutors = extractNumberFromHex(transactionData.substring(82, 84));
            const numVerifiers = extractNumberFromHex(transactionData.substring(84, 86));
            const allArray = transactionData.substring(86).match(/.{66}/g);
            const modArray = allArray ? allArray.map(one => new MultisigCosignatoryModification(
                extractNumberFromHex(one.substring(0, 2)) === 0 ? MultisigCosignatoryModificationType.Add : MultisigCosignatoryModificationType.Remove,
                PublicAccount.createFromPublicKey(one.substring(2), networkType)
            )):[];
            return factory.modifyContract()
                .durationDelta(UInt64.fromHex(reverse(durationDelta)))
                .hash(hash)
                .customers(modArray.slice(0, numCustomers))
                .executors(modArray.slice(numCustomers, numCustomers + numExecutors))
                .verifiers(modArray.slice(numCustomers + numExecutors))
                .build();
        case TransactionType.ADD_EXCHANGE_OFFER:
            // const numOffers = extractNumberFromHex(transactionData.substring(0, 2));
            const addOffersArray =  transactionData.substr(2).match(/.{66}/g) || [];
            return factory.addExchangeOffer()
                .offers(addOffersArray.map(o => {
                    const id = o.substring(0, 16);
                    const amount = o.substring(16, 32);
                    const cost = o.substring(32, 48);
                    const type = extractNumberFromHex(o.substring(48, 50));
                    const duration = o.substring(50, 66);

                    return new AddExchangeOffer(
                        new MosaicId(UInt64.fromHex(reverse(id)).toDTO()),
                        UInt64.fromHex(reverse(amount)),
                        UInt64.fromHex(reverse(cost)),
                        type,
                        UInt64.fromHex(reverse(duration))
                    )})
                )
                .build();
        case TransactionType.EXCHANGE_OFFER:
            // const numOffers = extractNumberFromHex(transactionData.substring(0, 2));
            const offersArray =  transactionData.substr(2).match(/.{114}/g) || [];
            return factory.exchangeOffer()
                .offers(offersArray.map(o => {
                    const id = o.substring(0, 16);
                    const amount = o.substring(16, 32);
                    const cost = o.substring(32, 48);
                    const type = extractNumberFromHex(o.substring(48, 50));
                    const owner = o.substring(50, 114);

                    return new ExchangeOffer(
                        new MosaicId(UInt64.fromHex(reverse(id)).toDTO()),
                        UInt64.fromHex(reverse(amount)),
                        UInt64.fromHex(reverse(cost)),
                        type,
                        PublicAccount.createFromPublicKey(owner, networkType)
                    )})
                )
                .build();
        case TransactionType.REMOVE_EXCHANGE_OFFER:
            // const numOffers = extractNumberFromHex(transactionData.substring(0, 2));
            const removeOffersArray =  transactionData.substr(2).match(/.{18}/g) || [];
            return factory.removeExchangeOffer()
                .offers(removeOffersArray.map(o => {
                    const id = o.substring(0, 16);
                    const offerType = extractNumberFromHex(o.substring(16, 18));

                    return new RemoveExchangeOffer(
                        new MosaicId(UInt64.fromHex(reverse(id)).toDTO()),
                        offerType
                    )})
                )
                .build();

        default:
            throw new Error ('Transaction type not implemented yet.');
        }
};

/**
 * @internal
 * @param modificationsStringHex
 * @returns {MetadataModification[]}
 */
const extractMetadataModifications = (modificationsStringHex: string): MetadataModification[] => {
    let modificationArr = [] as MetadataModification[];
    let offset = 0;
    while (offset < modificationsStringHex.length) {
        const modificationSize = extractNumberFromHex(modificationsStringHex.substring(offset, offset + 8));
        const modificationType = extractNumberFromHex(modificationsStringHex.substring(offset + 8, offset + 10));
        const keyLength = extractNumberFromHex(modificationsStringHex.substring(offset + 10, offset + 12));
        const valueLength = extractNumberFromHex(modificationsStringHex.substring(offset + 12, offset + 16));
        const keyHex = modificationsStringHex.substring(offset + 16, offset + 16 + keyLength*2);
        const valueHex = modificationsStringHex.substring(offset + 16 + keyLength*2, offset + 16 + keyLength*2 + valueLength*2);
        if (modificationSize !== 8 + keyLength + valueLength) {
            throw new Error('MetadataModification parse error');
        }
        modificationArr.push(new MetadataModification(
            modificationType,
            decodeHexUtf8(keyHex),
            decodeHexUtf8(valueHex)
        ));
        offset += modificationSize*2;
    }
    return modificationArr;
}

/**
 * @internal
 * @param hexValue - Hex representation of the number
 * @returns {number}
 */
const extractNumberFromHex = (hexValue: string): number => {
    return parseInt(convert.uint8ToHex(convert.hexToUint8(hexValue).reverse()), 16);
};

/**
 * @internal
 * @param versionHex - Transaction version in hex
 * @returns {NetworkType}
 */
const extractNetwork = (versionHex: string): NetworkType => {
    const networkType = convert.hexToUint8(versionHex)[3];
    if (networkType === NetworkType.MAIN_NET) {
        return NetworkType.MAIN_NET;
    } else if (networkType === NetworkType.TEST_NET) {
        return NetworkType.TEST_NET;
    } else if (networkType === NetworkType.MIJIN) {
        return NetworkType.MIJIN;
    } else if (networkType === NetworkType.MIJIN_TEST) {
        return NetworkType.MIJIN_TEST;
    } else if (networkType === NetworkType.PRIVATE) {
        return NetworkType.PRIVATE;
    } else if (networkType === NetworkType.PRIVATE_TEST) {
        return (NetworkType.PRIVATE_TEST)
    }
    throw new Error('Unimplemented network type');
};

/**
 * @internal
 * @param hex
 * @returns {string}
 */
const reverse = (hex: string): string => {
    return convert.uint8ToHex(convert.hexToUint8(hex).reverse());
};

/**
 * @internal
 * @param innerTransactionBinary - Inner transaction binary data
 * @returns {Array}
 */
const parseInnerTransactionFromBinary = (innerTransactionBinary: string): string[] => {
    const embeddedTransaction: string[] = [];
    let innerBinary = innerTransactionBinary;

    while (innerBinary.length) {
        const payloadSize = extractNumberFromHex(innerBinary.substring(0, 8)) * 2;
        const innerTransaction = innerBinary.substring(8, payloadSize);
        embeddedTransaction.push(innerTransaction);
        innerBinary = innerBinary.substring(payloadSize);
    }
    return embeddedTransaction;
};

/**
 * @internal
 * @param hex - Hex input
 * @returns {string}
 */
const decodeHexUtf8 = (hex: string): string => {
    const str = decodeHexRaw(hex);
    try {
        return decode(str);
    } catch (e) {
        return str;
    }
};

/**
 * @internal
 * @param hex - Hex input
 * @returns {string}
 */
const decodeHexRaw = (hex: string): string => {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
};


/**
 * @internal
 * @param messageType - Message Type
 * @param payload - Message Payload
 * @returns {Message}
 */
const extractMessage = (messageType: MessageType, payload: string): Message => {
    if (messageType === MessageType.PlainMessage) {
        return PlainMessage.createFromPayload(payload);
    } else if (messageType === MessageType.EncryptedMessage) {
        return EncryptedMessage.createFromPayload(payload);
    } else {
        throw new Error('Invalid message type');
    }
};
