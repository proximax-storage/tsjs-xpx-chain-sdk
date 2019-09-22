"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("./Transaction");
const TransactionVersion_1 = require("./TransactionVersion");
const MetadataType_1 = require("../metadata/MetadataType");
const ModifyMetadataTransaction_1 = require("../../infrastructure/builders/ModifyMetadataTransaction");
const TransactionType_1 = require("./TransactionType");
const FeeCalculationStrategy_1 = require("./FeeCalculationStrategy");
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
    static createWithAddress(networkType, deadline, address, modifications, maxFee) {
        return new ModifyAccountMetadataTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .address(address)
            .modifications(modifications)
            .build();
    }
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    static createWithMosaicId(networkType, deadline, mosaicId, modifications, maxFee) {
        return new ModifyMosaicMetadataTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .mosaicId(mosaicId)
            .modifications(modifications)
            .build();
    }
    /**
     * Create a modify metadata transaction object
     * @returns {ModifyMetadataTransaction}
     */
    static createWithNamespaceId(networkType, deadline, namespaceId, modifications, maxFee) {
        return new ModifyNamespaceMetadataTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .namespaceId(namespaceId)
            .modifications(modifications)
            .build();
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
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    get size() {
        return ModifyMetadataTransaction.calculateSize(this.type, this.modifications);
    }
    static calculateSize(type, modifications) {
        const modificationsSize = modifications.map(m => 4 + 1 + 1 + 2 + m.key.length + (m.value ? m.value.length : 0)).reduce((p, n) => p + n);
        const byteSize = Transaction_1.Transaction.getHeaderSize()
            + 1 // type
            + (type === TransactionType_1.TransactionType.MODIFY_ACCOUNT_METADATA ? 25 : 8) // id
            + modificationsSize;
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
class ModifyMetadataTransactionBuilder extends Transaction_1.TransactionBuilder {
    constructor(transactionType) {
        super();
        this._transactionType = transactionType;
    }
    modifications(modifications) {
        this._modifications = modifications;
        return this;
    }
    build() {
        return new ModifyMetadataTransaction(this._transactionType, this._networkType, this._deadline ? this._deadline : this._createNewDeadlineFn(), this._maxFee ? this._maxFee : FeeCalculationStrategy_1.calculateFee(ModifyMetadataTransaction.calculateSize(this._transactionType, this._modifications), this._feeCalculationStrategy), this._metadataType, this._metadataId, this._modifications, this._signature, this._signer, this._transactionInfo);
    }
}
class ModifyAccountMetadataTransactionBuilder extends ModifyMetadataTransactionBuilder {
    address(address) {
        this._metadataType = MetadataType_1.MetadataType.ADDRESS;
        this._metadataId = address.plain();
        return this;
    }
    constructor() {
        super(TransactionType_1.TransactionType.MODIFY_ACCOUNT_METADATA);
    }
}
exports.ModifyAccountMetadataTransactionBuilder = ModifyAccountMetadataTransactionBuilder;
class ModifyMosaicMetadataTransactionBuilder extends ModifyMetadataTransactionBuilder {
    mosaicId(mosaicId) {
        this._metadataType = MetadataType_1.MetadataType.MOSAIC;
        this._metadataId = mosaicId.toHex();
        return this;
    }
    constructor() {
        super(TransactionType_1.TransactionType.MODIFY_MOSAIC_METADATA);
    }
}
exports.ModifyMosaicMetadataTransactionBuilder = ModifyMosaicMetadataTransactionBuilder;
class ModifyNamespaceMetadataTransactionBuilder extends ModifyMetadataTransactionBuilder {
    namespaceId(namespaceId) {
        this._metadataType = MetadataType_1.MetadataType.NAMESPACE;
        this._metadataId = namespaceId.toHex();
        return this;
    }
    constructor() {
        super(TransactionType_1.TransactionType.MODIFY_NAMESPACE_METADATA);
    }
}
exports.ModifyNamespaceMetadataTransactionBuilder = ModifyNamespaceMetadataTransactionBuilder;
//# sourceMappingURL=ModifyMetadataTransaction.js.map