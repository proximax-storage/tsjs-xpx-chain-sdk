"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const MosaicAliasTransaction_1 = require("../../infrastructure/builders/MosaicAliasTransaction");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
const FeeCalculationStrategy_1 = require("./FeeCalculationStrategy");
class MosaicAliasTransaction extends Transaction_1.Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param actionType
     * @param namespaceId
     * @param mosaicId
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType, version, deadline, maxFee, 
    /**
     * The alias action type.
     */
    actionType, 
    /**
     * The namespace id that will be an alias.
     */
    namespaceId, 
    /**
     * The mosaic id.
     */
    mosaicId, signature, signer, transactionInfo) {
        super(TransactionType_1.TransactionType.MOSAIC_ALIAS, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.actionType = actionType;
        this.namespaceId = namespaceId;
        this.mosaicId = mosaicId;
    }
    /**
     * Create a mosaic alias transaction object
     * @param deadline - The deadline to include the transaction.
     * @param actionType - The alias action type.
     * @param namespaceId - The namespace id.
     * @param mosaicId - The mosaic id.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {MosaicAliasTransaction}
     */
    static create(deadline, actionType, namespaceId, mosaicId, networkType, maxFee) {
        return new MosaicAliasTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .actionType(actionType)
            .namespaceId(namespaceId)
            .mosaicId(mosaicId)
            .build();
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicAliasTransaction
     * @returns {number}
     * @memberof MosaicAliasTransaction
     */
    get size() {
        return MosaicAliasTransaction.calculateSize();
    }
    static calculateSize() {
        const byteSize = Transaction_1.Transaction.getHeaderSize();
        // set static byte size fields
        const byteType = 1;
        const byteNamespaceId = 8;
        const byteMosaicId = 8;
        return byteSize + byteType + byteNamespaceId + byteMosaicId;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new MosaicAliasTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addActionType(this.actionType)
            .addNamespaceId(this.namespaceId.id.toDTO())
            .addMosaicId(this.mosaicId.id.toDTO())
            .build();
    }
}
exports.MosaicAliasTransaction = MosaicAliasTransaction;
class MosaicAliasTransactionBuilder extends Transaction_1.TransactionBuilder {
    actionType(actionType) {
        this._actionType = actionType;
        return this;
    }
    namespaceId(namespaceId) {
        this._namespaceId = namespaceId;
        return this;
    }
    mosaicId(mosaicId) {
        this._mosaicId = mosaicId;
        return this;
    }
    build() {
        return new MosaicAliasTransaction(this._networkType, TransactionVersion_1.TransactionVersion.MOSAIC_ALIAS, this._deadline ? this._deadline : this._createNewDeadlineFn(), this._maxFee ? this._maxFee : FeeCalculationStrategy_1.calculateFee(MosaicAliasTransaction.calculateSize(), this._feeCalculationStrategy), this._actionType, this._namespaceId, this._mosaicId, this._signature, this._signer, this._transactionInfo);
    }
}
exports.MosaicAliasTransactionBuilder = MosaicAliasTransactionBuilder;
//# sourceMappingURL=MosaicAliasTransaction.js.map