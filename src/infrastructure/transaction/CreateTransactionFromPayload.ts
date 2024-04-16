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

import { Convert as convert } from '../../core/format';
// import { decode } from 'utf8';
import { Address } from '../../model/account/Address';
import { PublicAccount } from '../../model/account/PublicAccount';
import { NetworkType } from '../../model/blockchain/NetworkType';
import { Mosaic } from '../../model/mosaic/Mosaic';
import { MosaicId } from '../../model/mosaic/MosaicId';
import { MosaicLevy } from '../../model/mosaic/MosaicLevy'
import { MosaicNonce } from '../../model/mosaic/MosaicNonce';
import { MosaicProperties, PropertyBit } from '../../model/mosaic/MosaicProperties';
import { NamespaceId } from '../../model/namespace/NamespaceId';
import { NamespaceType } from '../../model/namespace/NamespaceType';
import { AccountRestrictionModification } from '../../model/transaction/AccountRestrictionModification';
import { AggregateTransactionCosignature } from '../../model/transaction/AggregateTransactionCosignature';
import { AggregateV2TransactionCosignature } from '../../model/transaction/AggregateV2TransactionCosignature';
import { Deadline } from '../../model/transaction/Deadline';
import { EncryptedMessage } from '../../model/transaction/EncryptedMessage';
import { Message } from '../../model/transaction/Message';
import { MessageType } from '../../model/transaction/MessageType';
import { MultisigCosignatoryModification } from '../../model/transaction/MultisigCosignatoryModification';
import { PlainMessage } from '../../model/transaction/PlainMessage';
import { Transaction } from '../../model/transaction/Transaction';
import { TransactionType } from '../../model/transaction/TransactionType';
import { UInt64 } from '../../model/UInt64';
import { TransactionBuilderFactory, MultisigCosignatoryModificationType } from '../../model/model';
import { AddExchangeOffer } from '../../model/transaction/AddExchangeOffer';
import { ExchangeOffer } from '../../model/transaction/ExchangeOffer';
import { RemoveExchangeOffer } from '../../model/transaction/RemoveExchangeOffer';
import { SdaExchangeOffer } from '../../model/transaction/SdaExchangeOffer';
import { RemoveSdaExchangeOffer } from '../../model/transaction/RemoveSdaExchangeOffer';
import { HexadecimalMessage } from '../../model/transaction/HexadecimalMessage';
import { TransactionHash } from '../../model/transaction/TransactionHash';
import { TransactionMapUtility } from "./TransactionMapUtility";
import { TransactionVersion } from "../../model/transaction/TransactionVersion";
import {UnknownTransaction} from '../../model/transaction/UnknownTransaction';
import { hasBit } from "../../model/transaction/Utilities";

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
    const transactionVersion = TransactionVersion.createFromPayloadHex(transactionBinary.substring(versionOffset, typeOffset));
    // const networkType = transactionVersion.networkType;//extractNetworkFromHexPayload(transactionBinary.substring(versionOffset, typeOffset));
    // const dScheme = transactionVersion.signatureDScheme;
    // const accountVersion = PublicAccount.getAccVersionFromDerivationScheme(dScheme);
    const type = extractNumberFromHexReverse(transactionBinary.substring(typeOffset, feeOffset));
    const maxFee = UInt64.fromHex(reverseHexString(transactionBinary.substring(feeOffset, deadlineOffset)));
    const deadline = UInt64.fromHex(reverseHexString(transactionBinary.substring(deadlineOffset, transactionOffset))).toDTO();
    const transactionData = transactionBinary.substring(transactionOffset);
    
    let txn = CreateTransaction(type, transactionData, transactionVersion, deadline);
    txn.maxFee = maxFee;

    return txn;
};

/**
 * @internal
 * @param type - Transaction type
 * @param transactionData - Details per specific transaction type
 * @param networkType - Network type
 * @param deadline - Deadline
 * @returns {Transaction}
 */
const CreateTransaction = (type: number, transactionData: string, txnVersion: TransactionVersion, deadline: number[]): Transaction => {
    const factory = new TransactionBuilderFactory();
    factory.networkType = txnVersion.networkType;
    factory.createNewDeadlineFn = () => Deadline.createFromDTO(deadline);
    // const signatureDScheme = PublicAccount.getAccVersionFromDerivationScheme(transactionVersion.signatureDScheme);

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
                        .restrictionType(extractNumberFromHexReverse(propertyType))
                        .modifications(modificationArray ? modificationArray.map((modification) => new AccountRestrictionModification(
                            extractNumberFromHexReverse(modification.substring(0, 2)),
                            Address.createFromEncoded(modification.substring(2, modification.length)).plain(),
                        )) : [])
                        .build();
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
                    return factory.accountRestrictionMosaic()
                        .restrictionType(extractNumberFromHexReverse(propertyType))
                        .modifications(modificationArray ? modificationArray.map((modification) => new AccountRestrictionModification(
                            extractNumberFromHexReverse(modification.substring(0, 2)),
                            UInt64.fromHex(reverseHexString(modification.substring(2, modification.length))).toDTO(),
                        )) : [])
                        .build();
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
                    return factory.accountRestrictionOperation()
                        .restrictionType(extractNumberFromHexReverse(propertyType))
                        .modifications(modificationArray ? modificationArray.map((modification) => new AccountRestrictionModification(
                            extractNumberFromHexReverse(modification.substring(0, 2)),
                            extractNumberFromHexReverse(
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
                .linkAction(extractNumberFromHexReverse(linkAction))
                .build();

        case TransactionType.ADDRESS_ALIAS:
            // read bytes
            const addressAliasAction = transactionData.substring(0, 2);
            const addressAliasNamespaceId = transactionData.substring(2, 18);
            const addressAliasAddress = transactionData.substring(18);

            return factory.addressAlias()
                .actionType(extractNumberFromHexReverse(addressAliasAction))
                .namespaceId(new NamespaceId(UInt64.fromHex(reverseHexString(addressAliasNamespaceId)).toDTO()))
                .address(Address.createFromEncoded(addressAliasAddress))
                .build();

        case TransactionType.MOSAIC_ALIAS:
            const mosaicAliasActionLength = 2;

            // read bytes
            const mosaicAliasAction = transactionData.substring(0, mosaicAliasActionLength);
            const mosaicAliasNamespaceId = transactionData.substring(mosaicAliasActionLength, 18);
            const mosaicAliasMosaicId = transactionData.substring(18);

            return factory.mosaicAlias()
                .actionType(extractNumberFromHexReverse(mosaicAliasAction))
                .namespaceId(new NamespaceId(UInt64.fromHex(reverseHexString(mosaicAliasNamespaceId)).toDTO()))
                .mosaicId(new MosaicId(UInt64.fromHex(reverseHexString(mosaicAliasMosaicId)).toDTO()))
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
            const flags = extractNumberFromHexReverse(
                transactionData.substring(flagsOffset, divisibilityOffset));
            const divisibility = transactionData.substring(divisibilityOffset, durationIndOffset);
            const durationInd = transactionData.substring(durationIndOffset, durationOffset);
            const duration = transactionData.substring(durationOffset);

            const regexArray = mosaicNonce.match(/.{1,2}/g);

            const nonceArray = regexArray ? regexArray.map((n) => {
                return extractNumberFromHexReverse(n);
            }) : [];

            return factory.mosaicDefinition()
                .mosaicNonce(new MosaicNonce(new Uint8Array(nonceArray)))
                .mosaicId(new MosaicId(UInt64.fromHex(reverseHexString(mosaicId)).toDTO()))
                .mosaicProperties(MosaicProperties.create({
                    supplyMutable: hasBit(flags, PropertyBit.Supply_Mutable),
                    transferable: hasBit(flags, PropertyBit.Transferable),
                    disableLocking: hasBit(flags, PropertyBit.Disable_Locking),
                    restrictable: hasBit(flags, PropertyBit.Restrictable),
                    supplyForceImmutable: hasBit(flags, PropertyBit.Supply_Force_Immutable),
                    divisibility: extractNumberFromHexReverse(divisibility),
                    duration: duration ? UInt64.fromHex(reverseHexString(duration)) : undefined,
                }))
                .build();

        case TransactionType.MOSAIC_SUPPLY_CHANGE:
            // read bytes
            const mosaicSupMosaicId = transactionData.substring(0, 16);
            const mosaicSupDirection = transactionData.substring(16, 18);
            const delta = transactionData.substring(18, 34);

            return factory.mosaicSupplyChange()
                .mosaicId(new MosaicId(UInt64.fromHex(reverseHexString(mosaicSupMosaicId)).toDTO()))
                .direction(extractNumberFromHexReverse(mosaicSupDirection))
                .delta(UInt64.fromHex(reverseHexString(delta)))
                .build();

        case TransactionType.REGISTER_NAMESPACE:
            // read bytes
            const namespaceType = extractNumberFromHexReverse(transactionData.substring(0, 2));
            const nameSpaceDurationParentId = transactionData.substring(2, 18);
            const nameSpaceId = NamespaceId.createFromEncoded(transactionData.substring(18, 34));
            const nameSize = transactionData.substring(34, 36);
            const nameSpaceName = transactionData.substring(36);

            return namespaceType === NamespaceType.RootNamespace ?
                factory.registerRootNamespace()
                    .namespaceName(decodeHexUtf8(nameSpaceName))
                    .duration(UInt64.fromHex(reverseHexString(nameSpaceDurationParentId)))
                    .build()
                : factory.registerSubNamespace()
                    .namespaceName(decodeHexUtf8(nameSpaceName))
                    .parentNamespace(new NamespaceId(UInt64.fromHex(reverseHexString(nameSpaceDurationParentId)).toDTO()))
                    .build();

        case TransactionType.TRANSFER:
            // read bytes
            const transferRecipient = transactionData.substring(0, 50);
            const transferMessageSize = extractNumberFromHexReverse(transactionData.substring(50, 54));

            const transferMessageAndMosaicSubString = transactionData.substring(56);
            const transferMessageType = extractNumberFromHexReverse(transferMessageAndMosaicSubString.substring(0, 2));
            const transferMessage = transferMessageAndMosaicSubString.substring(2, (transferMessageSize - 1) * 2 + 2);
            const transferMosaic = transferMessageAndMosaicSubString.substring(transferMessageSize * 2);
            const transferMosaicArray = transferMosaic.match(/.{1,32}/g);

            return factory.transfer()
                .recipient(Address.createFromEncoded(transferRecipient))
                .mosaics(transferMosaicArray ? transferMosaicArray.map((mosaic) => new Mosaic(
                    new MosaicId(UInt64.fromHex(reverseHexString(mosaic.substring(0, 16))).toDTO()),
                    UInt64.fromHex(reverseHexString(mosaic.substring(16))),
                )) : [])
                .message(TransactionMapUtility.extractMessage(transferMessageType, transferMessage))
                .build();

        case TransactionType.SECRET_LOCK:
            // read bytes
            const secretLockMosaic = transactionData.substring(0, 32);
            const secretLockDuration = transactionData.substring(32, 48);
            const secretLockHashAlgorithm = extractNumberFromHexReverse(
                transactionData.substring(48, 50));
            const secretLockSecret = transactionData.substring(50, transactionData.length - 50);
            const secretLockRecipient = transactionData.substring(transactionData.length - 50);

            return factory.secretLock()
                .mosaic(new Mosaic(
                    new MosaicId(UInt64.fromHex(reverseHexString(secretLockMosaic.substring(0, 16))).toDTO()),
                    UInt64.fromHex(reverseHexString(secretLockMosaic.substring(16))),
                ))
                .duration(UInt64.fromHex(reverseHexString(secretLockDuration)))
                .hashType(secretLockHashAlgorithm)
                .secret(secretLockSecret)
                .recipient(Address.createFromEncoded(secretLockRecipient))
                .build();

        case TransactionType.SECRET_PROOF:
            // read bytes
            const secretProofHashAlgorithm = extractNumberFromHexReverse(
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
            const minRemovalDelta = extractSignedNumberFromHexReverse(transactionData.substring(0, 2));
            const minApprovalDelta = extractSignedNumberFromHexReverse(transactionData.substring(2, 4));
            const modificationsCount = extractNumberFromHexReverse(transactionData.substring(4, 6));

            const multiSigModificationSubString = transactionData.substring(6);
            const multiSigModificationArray = multiSigModificationSubString.match(/.{1,66}/g);

            return factory.modifyMultisig()
                .minApprovalDelta(minApprovalDelta)
                .minRemovalDelta(minRemovalDelta)
                .modifications(multiSigModificationArray ? multiSigModificationArray.map((modification) => new MultisigCosignatoryModification(
                    extractNumberFromHexReverse(modification.substring(0, 2)),
                    PublicAccount.createFromPublicKey(modification.substring(2), txnVersion.networkType),
                )) : [])
                .build();

            case TransactionType.HASH_LOCK:
            // read bytes
            const hashLockMosaic = transactionData.substring(0, 32);
            const hashLockDuration = transactionData.substring(32, 48);
            const hashLockHash = transactionData.substring(48);

            return factory.hashLock()
                .mosaic(new Mosaic(
                    new MosaicId(UInt64.fromHex(reverseHexString(hashLockMosaic.substring(0, 16))).toDTO()),
                    UInt64.fromHex(reverseHexString(hashLockMosaic.substring(16))),
                ))
                .duration(UInt64.fromHex(reverseHexString(hashLockDuration)))
                .transactionHash(new TransactionHash(hashLockHash, txnVersion.signatureDScheme ? TransactionType.AGGREGATE_BONDED_V2 : TransactionType.AGGREGATE_BONDED_V1))
                .build();

        case TransactionType.AGGREGATE_COMPLETE_V1:
            // read bytes
            const payloadSize = extractNumberFromHexReverse(transactionData.substring(0, 8)) * 2;
            const cosignatures = transactionData.substring(payloadSize + 8);

            const innerTransactionArray = parseInnerTransactionFromBinary(transactionData.substring(8, payloadSize + 8));
            const cosignatureArray = cosignatures.match(/.{1,192}/g);

            return factory.aggregateCompleteV1()
                .innerTransactions(innerTransactionArray.map((innerTransaction) => {
                    const txVersion = TransactionVersion.createFromPayloadHex(innerTransaction.substring(64, 72));
                    const txType = extractNumberFromHexReverse(innerTransaction.substring(72, 76));
                    const transaction = CreateTransaction(
                        txType,
                        innerTransaction.substring(76),
                        txVersion,
                        deadline,
                    );
                    return transaction.toAggregateV1(PublicAccount.createFromPublicKey(innerTransaction.substring(0, 64), txnVersion.networkType));
                }))
                .cosignatures(cosignatureArray ? cosignatureArray.map((cosignature) => new AggregateTransactionCosignature(
                    cosignature.substring(64, 192),
                    PublicAccount.createFromPublicKey(cosignature.substring(0, 64), txnVersion.networkType),
                )) : [])
                .build();

        case TransactionType.AGGREGATE_BONDED_V1:
            const bondedPayloadSize = extractNumberFromHexReverse(transactionData.substring(0, 8)) * 2;
            const bondedCosignatures = transactionData.substring(bondedPayloadSize + 8);

            const bondedInnerTransactionArray = parseInnerTransactionFromBinary(transactionData.substring(8, bondedPayloadSize + 8));
            const bondedConsignatureArray = bondedCosignatures.match(/.{1,192}/g);

            return factory.aggregateBondedV1()
                .innerTransactions(bondedInnerTransactionArray.map((innerTransaction) => {
                    const txVersion = TransactionVersion.createFromPayloadHex(innerTransaction.substring(64, 72));
                    const txType = extractNumberFromHexReverse(innerTransaction.substring(72, 76));
                    const transaction = CreateTransaction(
                        txType,
                        innerTransaction.substring(76),
                        txVersion,
                        deadline,
                        );
                    return transaction.toAggregateV1(PublicAccount.createFromPublicKey(innerTransaction.substring(0, 64), txVersion.networkType));
                }))
                .cosignatures(bondedConsignatureArray ? bondedConsignatureArray.map((cosignature) => new AggregateTransactionCosignature(
                    cosignature.substring(64, 192),
                    PublicAccount.createFromPublicKey(cosignature.substring(0, 64), txnVersion.networkType),
                )) : [])
                .build();

        case TransactionType.AGGREGATE_COMPLETE_V2:
            // read bytes
            const completeV2PayloadSize = extractNumberFromHexReverse(transactionData.substring(0, 8)) * 2;
            const completeV2Cosignatures = transactionData.substring(completeV2PayloadSize + 8);

            const completeV2InnerTransactionArray = parseInnerTransactionFromBinary(transactionData.substring(8, completeV2PayloadSize + 8));
            const completeV2CosignatureArray = completeV2Cosignatures.match(/.{1,194}/g);

            return factory.aggregateComplete()
                .innerTransactions(completeV2InnerTransactionArray.map((innerTransaction) => {
                    const txVersion = TransactionVersion.createFromPayloadHex(innerTransaction.substring(64, 72));
                    const txType = extractNumberFromHexReverse(innerTransaction.substring(72, 76));
                    const transaction = CreateTransaction(
                        txType,
                        innerTransaction.substring(76),
                        txVersion,
                        deadline,
                    );
                    return transaction.toAggregate(PublicAccount.createFromPublicKey(innerTransaction.substring(0, 64), txVersion.networkType, txVersion.signatureDScheme));
                }))
                .cosignatures(completeV2CosignatureArray ? completeV2CosignatureArray.map((cosignature) =>{
                    const dScheme = parseInt(cosignature.substring(0, 2), 16);
                    
                    return new AggregateV2TransactionCosignature(
                        dScheme,
                        cosignature.substring(66, 192),
                        PublicAccount.createFromPublicKey(cosignature.substring(2, 66), txnVersion.networkType, dScheme),
                    );
                }) : [])
                .build();

        case TransactionType.AGGREGATE_BONDED_V2:
            const bondedV2PayloadSize = extractNumberFromHexReverse(transactionData.substring(0, 8)) * 2;
            const bondedV2Cosignatures = transactionData.substring(bondedV2PayloadSize + 8);

            const bondedV2InnerTransactionArray = parseInnerTransactionFromBinary(transactionData.substring(8, bondedV2PayloadSize + 8));
            const bondedV2ConsignatureArray = bondedV2Cosignatures.match(/.{1,194}/g);

            return factory.aggregateBonded()
                .innerTransactions(bondedV2InnerTransactionArray.map((innerTransaction) => {
                    const txVersion = TransactionVersion.createFromPayloadHex(innerTransaction.substring(64, 72));
                    const txType = extractNumberFromHexReverse(innerTransaction.substring(72, 76));
                    const transaction = CreateTransaction(
                        txType,
                        innerTransaction.substring(76),
                        txVersion,
                        deadline,
                        );
                    return transaction.toAggregate(PublicAccount.createFromPublicKey(innerTransaction.substring(0, 64), txVersion.networkType, txVersion.signatureDScheme));
                }))
                .cosignatures(bondedV2ConsignatureArray ? bondedV2ConsignatureArray.map((cosignature) =>{
                    const dScheme = parseInt(cosignature.substring(0, 2), 16);
                    
                    return new AggregateV2TransactionCosignature(
                        dScheme,
                        cosignature.substring(66, 192),
                        PublicAccount.createFromPublicKey(cosignature.substring(2, 66), txnVersion.networkType, dScheme),
                    );
                }) : [])
                .build();
        
        case TransactionType.MOSAIC_METADATA_V2:
            return factory.mosaicMetadata()
                .targetPublicKey(PublicAccount.createFromPublicKey(transactionData.substring(0, 64), txnVersion.networkType))
                .scopedMetadataKey(UInt64.fromHex(reverseHexString(transactionData.substring(64, 80))))
                .targetMosaicId(new MosaicId(UInt64.fromHex(reverseHexString(transactionData.substring(80, 96))).toDTO()))
                .valueSizeDelta(extractValueSizeDelta(transactionData.substring(96, 100)))
                .valueSize(parseInt(reverseHexString(transactionData.substring(100, 104)), 16))
                .valueDifferences(convert.hexToUint8(transactionData.substring(104)))
                .build();
            
        case TransactionType.NAMESPACE_METADATA_V2:
            return factory.namespaceMetadata()
                .targetPublicKey(PublicAccount.createFromPublicKey(transactionData.substring(0, 64), txnVersion.networkType))
                .scopedMetadataKey(UInt64.fromHex(reverseHexString(transactionData.substring(64, 80))))
                .targetNamespaceId(new NamespaceId(UInt64.fromHex(reverseHexString(transactionData.substring(80, 96))).toDTO()))
                .valueSizeDelta(extractValueSizeDelta(transactionData.substring(96, 100)))
                .valueSize(parseInt(reverseHexString(transactionData.substring(100, 104)), 16))
                .valueDifferences(convert.hexToUint8(transactionData.substring(104)))
                .build();

        case TransactionType.ACCOUNT_METADATA_V2:
            return factory.accountMetadata()
                .targetPublicKey(PublicAccount.createFromPublicKey(transactionData.substring(0, 64), txnVersion.networkType))
                .scopedMetadataKey(UInt64.fromHex(reverseHexString(transactionData.substring(64, 80))))
                .valueSizeDelta(extractValueSizeDelta(transactionData.substring(80, 84)))
                .valueSize(parseInt(reverseHexString(transactionData.substring(84, 88)), 16))
                .valueDifferences(convert.hexToUint8(transactionData.substring(88)))
                .build();
            
        case TransactionType.MODIFY_MOSAIC_LEVY:
            return factory.mosaicModifyLevy()
                .mosaicId(new MosaicId(UInt64.fromHex(reverseHexString(transactionData.substring(0, 16))).toDTO()))
                .mosaicLevy(
                    new MosaicLevy(
                        parseInt(transactionData.substring(16, 18), 16), 
                        Address.createFromEncoded(transactionData.substring(18, 68)), 
                        new MosaicId(
                            UInt64.fromHex(reverseHexString(transactionData.substring(68, 84))).toDTO()
                        ),
                        UInt64.fromHex(reverseHexString(transactionData.substring(84, 100)))
                    )
                )    
                .build();

        case TransactionType.REMOVE_MOSAIC_LEVY:
        
            return factory.mosaicRemoveLevy()
                    .mosaicId(new MosaicId(UInt64.fromHex(reverseHexString(transactionData.substring(0, 16))).toDTO()))
                    .build();

        case TransactionType.CHAIN_CONFIGURE:
            const applyHeightDelta = transactionData.substring(0, 16);
            const networkConfigLength = extractNumberFromHexReverse(transactionData.substring(16, 20));
            const supportedEntityVersionsLength = extractNumberFromHexReverse(transactionData.substring(20, 24));
            const networkConfig = transactionData.substring(24, 24 + networkConfigLength*2);
            const supportedEntityVersions = transactionData.substring(24 + networkConfigLength*2, 24 + networkConfigLength*2 + supportedEntityVersionsLength*2);
            return factory.networkConfig()
                .applyHeightDelta(UInt64.fromHex(reverseHexString(applyHeightDelta)))
                .networkConfig(decodeHexUtf8(networkConfig))
                .supportedEntityVersions(decodeHexUtf8(supportedEntityVersions))
                .build();

        case TransactionType.CHAIN_UPGRADE:
            const upgradePeriod = transactionData.substring(0, 16);
            const newBlockchainVersion = transactionData.substring(16, 32);
            return factory.chainUpgrade()
                .upgradePeriod(UInt64.fromHex(reverseHexString(upgradePeriod)))
                .newBlockchainVersion(UInt64.fromHex(reverseHexString(newBlockchainVersion)))
                .build();

        case TransactionType.ADD_EXCHANGE_OFFER:
            // const numOffers = extractNumberFromHexReverse(transactionData.substring(0, 2));
            const addOffersArray =  transactionData.substring(2).match(/.{66}/g) || [];
            return factory.addExchangeOffer()
                .offers(addOffersArray.map(o => {
                    const id = o.substring(0, 16);
                    const amount = o.substring(16, 32);
                    const cost = o.substring(32, 48);
                    const type = extractNumberFromHexReverse(o.substring(48, 50));
                    const duration = o.substring(50, 66);

                    return new AddExchangeOffer(
                        new MosaicId(UInt64.fromHex(reverseHexString(id)).toDTO()),
                        UInt64.fromHex(reverseHexString(amount)),
                        UInt64.fromHex(reverseHexString(cost)),
                        type,
                        UInt64.fromHex(reverseHexString(duration))
                    )})
                )
                .build();
        case TransactionType.EXCHANGE_OFFER:
            // const numOffers = extractNumberFromHexReverse(transactionData.substring(0, 2));
            const offersArray =  transactionData.substring(2).match(/.{114}/g) || [];
            return factory.exchangeOffer()
                .offers(offersArray.map(o => {
                    const id = o.substring(0, 16);
                    const amount = o.substring(16, 32);
                    const cost = o.substring(32, 48);
                    const type = extractNumberFromHexReverse(o.substring(48, 50));
                    const owner = o.substring(50, 114);

                    return new ExchangeOffer(
                        new MosaicId(UInt64.fromHex(reverseHexString(id)).toDTO()),
                        UInt64.fromHex(reverseHexString(amount)),
                        UInt64.fromHex(reverseHexString(cost)),
                        type,
                        PublicAccount.createFromPublicKey(owner, txnVersion.networkType)
                    )})
                )
                .build();
        case TransactionType.REMOVE_EXCHANGE_OFFER:{
            // const numOffers = extractNumberFromHexReverse(transactionData.substring(0, 2));
            const removeOffersArray =  transactionData.substring(2).match(/.{18}/g) || [];
            return factory.removeExchangeOffer()
                .offers(removeOffersArray.map(o => {
                    const id = o.substring(0, 16);
                    const offerType = extractNumberFromHexReverse(o.substring(16, 18));

                    return new RemoveExchangeOffer(
                        new MosaicId(UInt64.fromHex(reverseHexString(id)).toDTO()),
                        offerType
                    )})
                )
                .build();
        }
        case TransactionType.ADD_HARVESTER:{
            const harvesterKey = transactionData.substring(0, 64);
            const harvesterAcc = PublicAccount.createFromPublicKey(harvesterKey, txnVersion.networkType);
            return factory.addHarvester()
                .harvesterKey(harvesterAcc)
                .build();
        }
        case TransactionType.REMOVE_HARVESTER:{
            const harvesterKey = transactionData.substring(0, 64);
            const harvesterAcc = PublicAccount.createFromPublicKey(harvesterKey, txnVersion.networkType);
            return factory.removeHarvester()
                .harvesterKey(harvesterAcc)
                .build();
        }

        case TransactionType.PLACE_SDA_EXCHANGE_OFFER:
            const placeSdaOffersArray =  transactionData.substring(2).match(/.{144}/g) || [];
            return factory.placeSdaExchangeOffer()
                .offers(placeSdaOffersArray.map(o => {
                    const giveMosaicId = o.substring(0, 16);
                    const giveAmount = o.substring(16, 32);
                    const getMosaicId = o.substring(32, 48);
                    const getAmount = o.substring(48, 64);
                    const duration = o.substring(64, 80);

                    return new SdaExchangeOffer(
                        new MosaicId(UInt64.fromHex(reverseHexString(giveMosaicId)).toDTO()),
                        UInt64.fromHex(reverseHexString(giveAmount)),
                        new MosaicId(UInt64.fromHex(reverseHexString(getMosaicId)).toDTO()),
                        UInt64.fromHex(reverseHexString(getAmount)),
                        UInt64.fromHex(reverseHexString(duration))
                    )})
                )
                .build();

        case TransactionType.REMOVE_SDA_EXCHANGE_OFFER:
            const removeSdaOffersArray =  transactionData.substring(2).match(/.{32}/g) || [];
            return factory.removeSdaExchangeOffer()
                .offers(removeSdaOffersArray.map(o => {
                    const giveMosaicId = o.substring(0, 16);
                    const getMosaicId = o.substring(16, 32);

                    return new RemoveSdaExchangeOffer(
                        new MosaicId(UInt64.fromHex(reverseHexString(giveMosaicId)).toDTO()),
                        new MosaicId(UInt64.fromHex(reverseHexString(getMosaicId)).toDTO())
                    )})
                )
                .build();

        case TransactionType.Create_Liquidity_Provider:
            return factory.createLiquidityProvider()
                    .providerMosaicId(new MosaicId(UInt64.fromHex(reverseHexString(transactionData.substring(0, 16))).toDTO()))
                    .currencyDeposit(UInt64.fromHex(reverseHexString(transactionData.substring(16, 32))))
                    .initialMosaicsMinting(UInt64.fromHex(reverseHexString(transactionData.substring(32, 48))))
                    .slashingPeriod(extractNumberFromHexReverse(transactionData.substring(48, 56)))
                    .windowSize(extractNumberFromHexReverse(transactionData.substring(56, 60)))
                    .slashingAccount(PublicAccount.createFromPublicKey(transactionData.substring(60, 124), txnVersion.networkType))
                    .alpha(extractNumberFromHexReverse(transactionData.substring(124, 132)))
                    .beta(extractNumberFromHexReverse(transactionData.substring(132, 140)))
                    .build();

        case TransactionType.Manual_Rate_Change:
            return factory.manualRateChange()
                    .providerMosaicId(new MosaicId(UInt64.fromHex(reverseHexString(transactionData.substring(0, 16))).toDTO()))
                    .currencyBalanceIncrease(extractHexNumberToBoolean(transactionData.substring(16, 18)))
                    .currencyBalanceChange(UInt64.fromHex(reverseHexString(transactionData.substring(18, 34))))
                    .mosaicBalanceIncrease(extractHexNumberToBoolean(transactionData.substring(34, 36)))
                    .mosaicBalanceChange(UInt64.fromHex(reverseHexString(transactionData.substring(36, 52))))
                    .build();

        default:
            return new UnknownTransaction(
                transactionData.substring(12),
                {},
                type, 
                txnVersion.networkType, 
                txnVersion.txnTypeVersion, 
                Deadline.createFromDTO(deadline),
                new UInt64([0,0]),
                undefined,
                undefined,
                undefined
            );
        }
};

/**
 * @internal
 * @param hexValue - Hex representation of the number
 * @returns {number}
 */
const extractValueSizeDelta = (hexValue: string): number => {
    return extractSignedNumberFromHexReverse(hexValue);
}; 

/**
 * @internal
 * @param hexValue - Hex representation of the number
 * @returns {number}
 */
const extractNumberFromHexReverse = (hexValue: string): number => {
    return parseInt(convert.uint8ArrayToHex(convert.hexToUint8(hexValue).reverse()), 16);
};

/**
 * @internal
 * @param hexValue - Hex representation of the number
 * @returns {number} - Signed number
 */
const extractSignedNumberFromHexReverse = (hexValue: string): number => {
 
    const bytesLength = hexValue.length / 2;
    const unsignedNumber = parseInt(convert.uint8ArrayToHex(convert.hexToUint8(hexValue).reverse()), 16);
    const binaryString = unsignedNumber.toString(2);

    // compare bits
    if((bytesLength * 8) > binaryString.length){
        return unsignedNumber;
    }
    else if(binaryString.substring(0, 1) === "0"){
        return unsignedNumber;
    }

    const maxValue = parseInt("FF".repeat(bytesLength), 16);
    const negativeNumber = ~(maxValue - unsignedNumber);

    return negativeNumber;
};

/**
 * @internal
 * @param hexValue - Hex representation of the number
 * @returns {boolean}
 */
const extractHexNumberToBoolean = (hexValue: string): boolean => {
    return parseInt(hexValue, 16) === 1 ?  true: false;
};

/**
 * @internal
 * @param versionHex - Transaction version in hex
 * @returns {NetworkType}
 */
const extractNetworkFromHexPayload = (versionHex: string): NetworkType => {
    const networkType = convert.hexToUint8(versionHex)[3]; // get last byte, total 4 bytes, as bytes have been reversed
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
const reverseHexString = (hex: string): string => {
    return convert.hexReverse(hex);
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
        const payloadSize = extractNumberFromHexReverse(innerBinary.substring(0, 8)) * 2;
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
    const str = "";
    try {
        let uint8Array = convert.hexToUint8(hex);

        return new TextDecoder().decode(uint8Array);
    } catch (e) {
        return str;
    }
};