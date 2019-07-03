"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const format_1 = require("../../core/format");
const format_2 = require("../../core/format");
const Address_1 = require("../../model/account/Address");
const PublicAccount_1 = require("../../model/account/PublicAccount");
const NetworkType_1 = require("../../model/blockchain/NetworkType");
const Id_1 = require("../../model/Id");
const Mosaic_1 = require("../../model/mosaic/Mosaic");
const MosaicId_1 = require("../../model/mosaic/MosaicId");
const MosaicProperties_1 = require("../../model/mosaic/MosaicProperties");
const MosaicPropertyType_1 = require("../../model/mosaic/MosaicPropertyType");
const NamespaceId_1 = require("../../model/namespace/NamespaceId");
const AccountLinkTransaction_1 = require("../../model/transaction/AccountLinkTransaction");
const AccountPropertyModification_1 = require("../../model/transaction/AccountPropertyModification");
const AddressAliasTransaction_1 = require("../../model/transaction/AddressAliasTransaction");
const AggregateTransaction_1 = require("../../model/transaction/AggregateTransaction");
const AggregateTransactionCosignature_1 = require("../../model/transaction/AggregateTransactionCosignature");
const AggregateTransactionInfo_1 = require("../../model/transaction/AggregateTransactionInfo");
const Deadline_1 = require("../../model/transaction/Deadline");
const EncryptedMessage_1 = require("../../model/transaction/EncryptedMessage");
const LockFundsTransaction_1 = require("../../model/transaction/LockFundsTransaction");
const ModifyAccountPropertyAddressTransaction_1 = require("../../model/transaction/ModifyAccountPropertyAddressTransaction");
const ModifyAccountPropertyEntityTypeTransaction_1 = require("../../model/transaction/ModifyAccountPropertyEntityTypeTransaction");
const ModifyAccountPropertyMosaicTransaction_1 = require("../../model/transaction/ModifyAccountPropertyMosaicTransaction");
const ModifyMultisigAccountTransaction_1 = require("../../model/transaction/ModifyMultisigAccountTransaction");
const MosaicAliasTransaction_1 = require("../../model/transaction/MosaicAliasTransaction");
const MosaicDefinitionTransaction_1 = require("../../model/transaction/MosaicDefinitionTransaction");
const MosaicSupplyChangeTransaction_1 = require("../../model/transaction/MosaicSupplyChangeTransaction");
const MultisigCosignatoryModification_1 = require("../../model/transaction/MultisigCosignatoryModification");
const PlainMessage_1 = require("../../model/transaction/PlainMessage");
const RegisterNamespaceTransaction_1 = require("../../model/transaction/RegisterNamespaceTransaction");
const SecretLockTransaction_1 = require("../../model/transaction/SecretLockTransaction");
const SecretProofTransaction_1 = require("../../model/transaction/SecretProofTransaction");
const SignedTransaction_1 = require("../../model/transaction/SignedTransaction");
const TransactionInfo_1 = require("../../model/transaction/TransactionInfo");
const TransactionType_1 = require("../../model/transaction/TransactionType");
const TransferTransaction_1 = require("../../model/transaction/TransferTransaction");
const UInt64_1 = require("../../model/UInt64");
const ModifyMetadataTransaction_1 = require("../../model/transaction/ModifyMetadataTransaction");
const MetadataType_1 = require("../../model/metadata/MetadataType");
const ModifyContractTransaction_1 = require("../../model/transaction/ModifyContractTransaction");
/**
 * @internal
 * @param transactionDTO
 * @returns {Transaction}
 * @constructor
 */
exports.CreateTransactionFromDTO = (transactionDTO) => {
    if (transactionDTO.transaction.type === TransactionType_1.TransactionType.AGGREGATE_COMPLETE ||
        transactionDTO.transaction.type === TransactionType_1.TransactionType.AGGREGATE_BONDED) {
        const innerTransactions = transactionDTO.transaction.transactions.map((innerTransactionDTO) => {
            const aggregateTransactionInfo = innerTransactionDTO.meta ? new AggregateTransactionInfo_1.AggregateTransactionInfo(new UInt64_1.UInt64(innerTransactionDTO.meta.height), innerTransactionDTO.meta.index, innerTransactionDTO.meta.id, innerTransactionDTO.meta.aggregateHash, innerTransactionDTO.meta.aggregateId) : undefined;
            innerTransactionDTO.transaction.maxFee = transactionDTO.transaction.maxFee;
            innerTransactionDTO.transaction.deadline = transactionDTO.transaction.deadline;
            innerTransactionDTO.transaction.signature = transactionDTO.transaction.signature;
            return CreateStandaloneTransactionFromDTO(innerTransactionDTO.transaction, aggregateTransactionInfo);
        });
        return new AggregateTransaction_1.AggregateTransaction(exports.extractNetworkType(transactionDTO.transaction.version), transactionDTO.transaction.type, exports.extractTransactionVersion(transactionDTO.transaction.version), Deadline_1.Deadline.createFromDTO(transactionDTO.transaction.deadline), new UInt64_1.UInt64(transactionDTO.transaction.maxFee || [0, 0]), innerTransactions, transactionDTO.transaction.cosignatures ? transactionDTO.transaction.cosignatures
            .map((aggregateCosignatureDTO) => {
            return new AggregateTransactionCosignature_1.AggregateTransactionCosignature(aggregateCosignatureDTO.signature, PublicAccount_1.PublicAccount.createFromPublicKey(aggregateCosignatureDTO.signer, exports.extractNetworkType(transactionDTO.transaction.version)));
        }) : [], transactionDTO.transaction.signature, transactionDTO.transaction.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.transaction.signer, exports.extractNetworkType(transactionDTO.transaction.version)) : undefined, transactionDTO.meta ? new TransactionInfo_1.TransactionInfo(new UInt64_1.UInt64(transactionDTO.meta.height), transactionDTO.meta.index, transactionDTO.meta.id, transactionDTO.meta.hash, transactionDTO.meta.merkleComponentHash) : undefined);
    }
    else {
        const transactionInfo = transactionDTO.meta ? new TransactionInfo_1.TransactionInfo(new UInt64_1.UInt64(transactionDTO.meta.height), transactionDTO.meta.index, transactionDTO.meta.id, transactionDTO.meta.hash, transactionDTO.meta.merkleComponentHash) : undefined;
        return CreateStandaloneTransactionFromDTO(transactionDTO.transaction, transactionInfo);
    }
};
/**
 * @internal
 * @param transactionDTO
 * @param transactionInfo
 * @returns {any}
 * @constructor
 */
const CreateStandaloneTransactionFromDTO = (transactionDTO, transactionInfo) => {
    if (transactionDTO.type === TransactionType_1.TransactionType.TRANSFER) {
        let message;
        if (transactionDTO.message && transactionDTO.message.type === 0) {
            message = PlainMessage_1.PlainMessage.createFromPayload(transactionDTO.message.payload);
        }
        else if (transactionDTO.message && transactionDTO.message.type === 1) {
            message = EncryptedMessage_1.EncryptedMessage.createFromPayload(transactionDTO.message.payload);
        }
        else {
            message = PlainMessage_1.EmptyMessage;
        }
        return new TransferTransaction_1.TransferTransaction(exports.extractNetworkType(transactionDTO.version), exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), exports.extractRecipient(transactionDTO.recipient), exports.extractMosaics(transactionDTO.mosaics), message, transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.REGISTER_NAMESPACE) {
        return new RegisterNamespaceTransaction_1.RegisterNamespaceTransaction(exports.extractNetworkType(transactionDTO.version), exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), transactionDTO.namespaceType, transactionDTO.name, new NamespaceId_1.NamespaceId(transactionDTO.namespaceId), transactionDTO.namespaceType === 0 ? new UInt64_1.UInt64(transactionDTO.duration) : undefined, transactionDTO.namespaceType === 1 ? new NamespaceId_1.NamespaceId(transactionDTO.parentId) : undefined, transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.MOSAIC_DEFINITION) {
        return new MosaicDefinitionTransaction_1.MosaicDefinitionTransaction(exports.extractNetworkType(transactionDTO.version), exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), transactionDTO.nonce, new MosaicId_1.MosaicId(transactionDTO.mosaicId), new MosaicProperties_1.MosaicProperties(new UInt64_1.UInt64(transactionDTO.properties[MosaicPropertyType_1.MosaicPropertyType.MosaicFlags].value), (new UInt64_1.UInt64(transactionDTO.properties[MosaicPropertyType_1.MosaicPropertyType.Divisibility].value)).compact(), transactionDTO.properties.length === 3 && transactionDTO.properties[MosaicPropertyType_1.MosaicPropertyType.Duration].value ?
            new UInt64_1.UInt64(transactionDTO.properties[MosaicPropertyType_1.MosaicPropertyType.Duration].value) : undefined), transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.MOSAIC_SUPPLY_CHANGE) {
        return new MosaicSupplyChangeTransaction_1.MosaicSupplyChangeTransaction(exports.extractNetworkType(transactionDTO.version), exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), new MosaicId_1.MosaicId(transactionDTO.mosaicId), transactionDTO.direction, new UInt64_1.UInt64(transactionDTO.delta), transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.MODIFY_MULTISIG_ACCOUNT) {
        return new ModifyMultisigAccountTransaction_1.ModifyMultisigAccountTransaction(exports.extractNetworkType(transactionDTO.version), exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), transactionDTO.minApprovalDelta, transactionDTO.minRemovalDelta, transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new MultisigCosignatoryModification_1.MultisigCosignatoryModification(modificationDTO.type, PublicAccount_1.PublicAccount.createFromPublicKey(modificationDTO.cosignatoryPublicKey, exports.extractNetworkType(transactionDTO.version)))) : [], transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.LOCK) {
        const networkType = exports.extractNetworkType(transactionDTO.version);
        return new LockFundsTransaction_1.LockFundsTransaction(networkType, exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), new Mosaic_1.Mosaic(new MosaicId_1.MosaicId(transactionDTO.mosaicId), new UInt64_1.UInt64(transactionDTO.amount)), new UInt64_1.UInt64(transactionDTO.duration), new SignedTransaction_1.SignedTransaction('', transactionDTO.hash, '', TransactionType_1.TransactionType.AGGREGATE_BONDED, networkType), transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, networkType) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.SECRET_LOCK) {
        const recipient = transactionDTO.recipient;
        return new SecretLockTransaction_1.SecretLockTransaction(exports.extractNetworkType(transactionDTO.version), exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), new Mosaic_1.Mosaic(new MosaicId_1.MosaicId(transactionDTO.mosaicId), new UInt64_1.UInt64(transactionDTO.amount)), new UInt64_1.UInt64(transactionDTO.duration), transactionDTO.hashAlgorithm, (transactionDTO.hashAlgorithm === 2 ? transactionDTO.secret.substr(0, 40) : transactionDTO.secret), typeof recipient === 'object' && recipient.hasOwnProperty('address') ?
            Address_1.Address.createFromRawAddress(recipient.address) : Address_1.Address.createFromEncoded(recipient), transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.SECRET_PROOF) {
        return new SecretProofTransaction_1.SecretProofTransaction(exports.extractNetworkType(transactionDTO.version), exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), transactionDTO.hashAlgorithm, (transactionDTO.hashAlgorithm === 2 ? transactionDTO.secret.substr(0, 40) : transactionDTO.secret), transactionDTO.recipient, transactionDTO.proof, transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.MOSAIC_ALIAS) {
        return new MosaicAliasTransaction_1.MosaicAliasTransaction(exports.extractNetworkType(transactionDTO.version), exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), transactionDTO.action, new NamespaceId_1.NamespaceId(transactionDTO.namespaceId), new MosaicId_1.MosaicId(transactionDTO.mosaicId), transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.ADDRESS_ALIAS) {
        return new AddressAliasTransaction_1.AddressAliasTransaction(exports.extractNetworkType(transactionDTO.version), exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), transactionDTO.action, new NamespaceId_1.NamespaceId(transactionDTO.namespaceId), exports.extractRecipient(transactionDTO.address), transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS) {
        return new ModifyAccountPropertyAddressTransaction_1.ModifyAccountPropertyAddressTransaction(exports.extractNetworkType(transactionDTO.version), exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), transactionDTO.propertyType, transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountPropertyModification_1.AccountPropertyModification(modificationDTO.type, modificationDTO.value)) : [], transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE) {
        return new ModifyAccountPropertyEntityTypeTransaction_1.ModifyAccountPropertyEntityTypeTransaction(exports.extractNetworkType(transactionDTO.version), exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), transactionDTO.propertyType, transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountPropertyModification_1.AccountPropertyModification(modificationDTO.type, modificationDTO.value)) : [], transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC) {
        return new ModifyAccountPropertyMosaicTransaction_1.ModifyAccountPropertyMosaicTransaction(exports.extractNetworkType(transactionDTO.version), exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), transactionDTO.propertyType, transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountPropertyModification_1.AccountPropertyModification(modificationDTO.type, modificationDTO.value)) : [], transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.LINK_ACCOUNT) {
        return new AccountLinkTransaction_1.AccountLinkTransaction(exports.extractNetworkType(transactionDTO.version), exports.extractTransactionVersion(transactionDTO.version), Deadline_1.Deadline.createFromDTO(transactionDTO.deadline), new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]), transactionDTO.remoteAccountKey, transactionDTO.action, transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.MODIFY_ACCOUNT_METADATA ||
        transactionDTO.type === TransactionType_1.TransactionType.MODIFY_MOSAIC_METADATA ||
        transactionDTO.type === TransactionType_1.TransactionType.MODIFY_NAMESPACE_METADATA) {
        const networkType = exports.extractNetworkType(transactionDTO.version);
        const transactionVersion = exports.extractTransactionVersion(transactionDTO.version);
        const deadline = Deadline_1.Deadline.createFromDTO(transactionDTO.deadline);
        const maxFee = new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]);
        const metadataType = transactionDTO.metadataType;
        const metadataId = transactionDTO.metadataId;
        const modifications = transactionDTO.modifications ?
            transactionDTO.modifications.map(m => new ModifyMetadataTransaction_1.MetadataModification(m.modificationType, m.key, m.value)) :
            undefined;
        switch (metadataType) {
            case MetadataType_1.MetadataType.ADDRESS: {
                return ModifyMetadataTransaction_1.ModifyMetadataTransaction.createWithAddress(networkType, deadline, maxFee, Address_1.Address.createFromEncoded(metadataId), modifications, transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
                //break;
            }
            case MetadataType_1.MetadataType.MOSAIC: {
                return ModifyMetadataTransaction_1.ModifyMetadataTransaction.createWithMosaicId(networkType, deadline, maxFee, new MosaicId_1.MosaicId(metadataId), modifications, transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
                //break;
            }
            case MetadataType_1.MetadataType.NAMESPACE: {
                return ModifyMetadataTransaction_1.ModifyMetadataTransaction.createWithMosaicId(networkType, deadline, maxFee, new NamespaceId_1.NamespaceId(metadataId), modifications, transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
                //break;
            }
            default: {
                throw new Error('Unimplemented modify metadata transaction with type ' + metadataType);
            }
        }
    }
    else if (transactionDTO.type === TransactionType_1.TransactionType.MODIFY_CONTRACT) {
        const networkType = exports.extractNetworkType(transactionDTO.version);
        const transactionVersion = exports.extractTransactionVersion(transactionDTO.version);
        const deadline = Deadline_1.Deadline.createFromDTO(transactionDTO.deadline);
        const maxFee = new UInt64_1.UInt64(transactionDTO.maxFee || [0, 0]);
        const durationDelta = new UInt64_1.UInt64(transactionDTO.duration || [0, 0]);
        const hash = transactionDTO.hash;
        const customers = transactionDTO.customers ?
            transactionDTO.customers.map(c => new MultisigCosignatoryModification_1.MultisigCosignatoryModification(c.type, PublicAccount_1.PublicAccount.createFromPublicKey(c.cosignatoryPublicKey, networkType))) :
            undefined;
        const executors = transactionDTO.executors ?
            transactionDTO.executors.map(e => new MultisigCosignatoryModification_1.MultisigCosignatoryModification(e.type, PublicAccount_1.PublicAccount.createFromPublicKey(e.cosignatoryPublicKey, networkType))) :
            undefined;
        const verifiers = transactionDTO.verifiers ?
            transactionDTO.verifiers.map(v => new MultisigCosignatoryModification_1.MultisigCosignatoryModification(v.type, PublicAccount_1.PublicAccount.createFromPublicKey(v.cosignatoryPublicKey, networkType))) :
            undefined;
        return ModifyContractTransaction_1.ModifyContractTransaction.create(networkType, deadline, durationDelta, hash, customers, executors, verifiers, maxFee, transactionDTO.signature, transactionDTO.signer ? PublicAccount_1.PublicAccount.createFromPublicKey(transactionDTO.signer, exports.extractNetworkType(transactionDTO.version)) : undefined, transactionInfo);
    }
    throw new Error('Unimplemented transaction with type ' + transactionDTO.type);
};
exports.extractNetworkType = (version) => {
    const networkType = parseInt(version.toString(16).substr(0, 2), 16);
    if (networkType === NetworkType_1.NetworkType.MAIN_NET) {
        return NetworkType_1.NetworkType.MAIN_NET;
    }
    else if (networkType === NetworkType_1.NetworkType.TEST_NET) {
        return NetworkType_1.NetworkType.TEST_NET;
    }
    else if (networkType === NetworkType_1.NetworkType.PRIVATE) {
        return NetworkType_1.NetworkType.PRIVATE;
    }
    else if (networkType === NetworkType_1.NetworkType.PRIVATE_TEST) {
        return NetworkType_1.NetworkType.PRIVATE_TEST;
    }
    else if (networkType === NetworkType_1.NetworkType.MIJIN) {
        return NetworkType_1.NetworkType.MIJIN;
    }
    else if (networkType === NetworkType_1.NetworkType.MIJIN_TEST) {
        return NetworkType_1.NetworkType.MIJIN_TEST;
    }
    throw new Error('Unimplemented network type');
};
exports.extractTransactionVersion = (version) => {
    return parseInt(version.toString(16).substr(2, 2), 16);
};
/**
 * Extract recipient value from encoded hexadecimal notation.
 *
 * If bit 0 of byte 0 is not set (e.g. 0x90), then it is a regular address.
 * Else (e.g. 0x91) it represents a namespace id which starts at byte 1.
 *
 * @param recipient {string} Encoded hexadecimal recipient notation
 * @return {Address | NamespaceId}
 */
exports.extractRecipient = (recipient) => {
    if (typeof recipient === 'string') {
        // If bit 0 of byte 0 is not set (like in 0x90), then it is a regular address.
        // Else (e.g. 0x91) it represents a namespace id which starts at byte 1.
        const bit0 = format_1.Convert.hexToUint8(recipient.substr(1, 2))[0];
        if ((bit0 & 16) === 16) {
            // namespaceId encoded hexadecimal notation provided
            // only 8 bytes are relevant to resolve the NamespaceId
            const relevantPart = recipient.substr(2, 16);
            return NamespaceId_1.NamespaceId.createFromEncoded(relevantPart);
        }
        // read address from encoded hexadecimal notation
        return Address_1.Address.createFromEncoded(recipient);
    }
    else if (typeof recipient === 'object') { // Is JSON object
        if (recipient.hasOwnProperty('address')) {
            return Address_1.Address.createFromRawAddress(recipient.address);
        }
        else if (recipient.hasOwnProperty('id')) {
            return new NamespaceId_1.NamespaceId(recipient.id);
        }
    }
    throw new Error(`Recipient: ${recipient} type is not recognised`);
};
/**
 * Extract mosaics from encoded UInt64 notation.
 *
 * If most significant bit of byte 0 is set, then it is a namespaceId.
 * If most significant bit of byte 0 is not set, then it is a mosaicId.
 *
 * @param mosaics {Array | undefined} The DTO array of mosaics (with UInt64 Id notation)
 * @return {Mosaic[]}
 */
exports.extractMosaics = (mosaics) => {
    if (mosaics === undefined) {
        return [];
    }
    return mosaics.map((mosaicDTO) => {
        // convert ID to UInt8 bytes array and get first byte (most significant byte)
        const uint64 = new Id_1.Id(mosaicDTO.id);
        const bytes = format_1.Convert.hexToUint8(format_2.RawUInt64.toHex(uint64.toDTO()));
        const byte0 = bytes[0];
        // if most significant bit of byte 0 is set, then we have a namespaceId
        if ((byte0 & 128) === 128) {
            return new Mosaic_1.Mosaic(new NamespaceId_1.NamespaceId(mosaicDTO.id), new UInt64_1.UInt64(mosaicDTO.amount));
        }
        // most significant bit of byte 0 is not set => mosaicId
        return new Mosaic_1.Mosaic(new MosaicId_1.MosaicId(mosaicDTO.id), new UInt64_1.UInt64(mosaicDTO.amount));
    });
};
/**
 * Extract beneficiary public key from DTO.
 *
 * @todo Upgrade of catapult-rest WITH catapult-service-bootstrap versioning.
 *
 * With `cow` upgrade (nemtech/catapult-server@0.3.0.2), `catapult-rest` block DTO
 * was updated and latest catapult-service-bootstrap uses the wrong block DTO.
 * This will be fixed with next catapult-server upgrade to `dragon`.
 *
 * :warning It is currently not possible to read the block's beneficiary public key
 * except when working with a local instance of `catapult-rest`.
 *
 * @param beneficiary {string | undefined} The beneficiary public key if set
 * @return {Mosaic[]}
 */
exports.extractBeneficiary = (blockDTO, networkType) => {
    let dtoPublicAccount;
    let dtoFieldValue;
    if (blockDTO.beneficiaryPublicKey) {
        dtoFieldValue = blockDTO.beneficiaryPublicKey;
    }
    else if (blockDTO.beneficiary) {
        dtoFieldValue = blockDTO.beneficiary;
    }
    if (!dtoFieldValue) {
        return undefined;
    }
    try {
        // @FIX with latest catapult-service-bootstrap version, catapult-rest still returns
        //      a `string` formatted copy of the public *when it is set at all*.
        dtoPublicAccount = PublicAccount_1.PublicAccount.createFromPublicKey(dtoFieldValue, networkType);
    }
    catch (e) {
        dtoPublicAccount = undefined;
    }
    return dtoPublicAccount;
};
//# sourceMappingURL=CreateTransactionFromDTO.js.map