"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const UInt64_1 = require("../UInt64");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
const MetadataType_1 = require("../metadata/MetadataType");
const ModifyMetadataTransaction_1 = require("../../infrastructure/builders/ModifyMetadataTransaction");
var MetadataModificationType;
(function (MetadataModificationType) {
    MetadataModificationType[MetadataModificationType["ADD"] = 0] = "ADD";
    MetadataModificationType[MetadataModificationType["REMOVE"] = 1] = "REMOVE";
})(MetadataModificationType = exports.MetadataModificationType || (exports.MetadataModificationType = {}));
/**
 * Represents single metadata modification - add/remove of the key/value pair
 *
 * @param type
 * @param key
 * @param value
 */
class MetadataModification {
    constructor(type, key, value) {
        this.type = type;
        this.key = key;
        this.value = value ? value : undefined;
    }
}
exports.MetadataModification = MetadataModification;
/**
 * Modify metadata transaction contains information about metadata being modified.
 */
class ModifyMetadataTransaction extends Transaction_1.Transaction {
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    static createWithAddress(networkType, deadline, maxFee = new UInt64_1.UInt64([0, 0]), address, modifications, signature, signer, transactionInfo) {
        return new ModifyMetadataTransaction(TransactionType_1.TransactionType.MODIFY_ACCOUNT_METADATA, networkType, deadline, maxFee, MetadataType_1.MetadataType.ADDRESS, address.plain(), modifications, signature, signer, transactionInfo);
    }
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    static createWithMosaicId(networkType, deadline, maxFee = new UInt64_1.UInt64([0, 0]), mosaicId, modifications, signature, signer, transactionInfo) {
        return new ModifyMetadataTransaction(TransactionType_1.TransactionType.MODIFY_MOSAIC_METADATA, networkType, deadline, maxFee, MetadataType_1.MetadataType.MOSAIC, mosaicId.toHex(), modifications, signature, signer, transactionInfo);
    }
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    static createWithNamespaceId(networkType, deadline, maxFee = new UInt64_1.UInt64([0, 0]), namespaceId, modifications, signature, signer, transactionInfo) {
        return new ModifyMetadataTransaction(TransactionType_1.TransactionType.MODIFY_NAMESPACE_METADATA, networkType, deadline, maxFee, MetadataType_1.MetadataType.NAMESPACE, namespaceId.toHex(), modifications, signature, signer, transactionInfo);
    }
    /**
     * @param transactionType
     * @param networkType
     * @param deadline
     * @param maxFee
     * @param metadataType
     * @param metadataId
     * @param modifications
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(transactionType, networkType, deadline, maxFee, metadataType, metadataId, modifications, signature, signer, transactionInfo) {
        super(transactionType, networkType, TransactionVersion_1.TransactionVersion.MODIFY_METADATA, deadline, maxFee, signature, signer, transactionInfo);
        this.metadataType = metadataType;
        this.metadataId = metadataId;
        this.modifications = modifications;
    }
    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    get size() {
        const byteSize = super.size
            + 1 // type
            + (this.metadataType === 1 ? 25 : 8) // id
            + this.modifications.map(m => 4 + 1 + 1 + 2 + m.key.length + (m.value ? m.value.length : 0)).reduce((p, n) => p + n); // value
        return byteSize;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new ModifyMetadataTransaction_1.Builder()
            .addType(this.type)
            .addVersion(this.versionToDTO())
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addMetadataType(this.metadataType)
            .addMetadataId(this.metadataId)
            .addModifications(this.modifications)
            .build();
    }
}
exports.ModifyMetadataTransaction = ModifyMetadataTransaction;
//# sourceMappingURL=ModifyMetadataTransaction.js.map