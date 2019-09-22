"use strict";
/*
 * Copyright 2018 NEM
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
const format_1 = require("../../core/format");
const NamespaceCreationTransaction_1 = require("../../infrastructure/builders/NamespaceCreationTransaction");
const NamespaceId_1 = require("../namespace/NamespaceId");
const NamespaceType_1 = require("../namespace/NamespaceType");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
const FeeCalculationStrategy_1 = require("./FeeCalculationStrategy");
const infrastructure_1 = require("../../infrastructure/infrastructure");
/**
 * Accounts can rent a namespace for an amount of blocks and after a this renew the contract.
 * This is done via a RegisterNamespaceTransaction.
 */
class RegisterNamespaceTransaction extends Transaction_1.Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param namespaceType
     * @param namespaceName
     * @param namespaceId
     * @param duration
     * @param parentId
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType, version, deadline, maxFee, 
    /**
     * The namespace type could be namespace or sub namespace
     */
    namespaceType, 
    /**
     * The namespace name
     */
    namespaceName, 
    /**
     * The id of the namespace derived from namespaceName.
     * When creating a sub namespace the namespaceId is derived from namespaceName and parentName.
     */
    namespaceId, 
    /**
     * The number of blocks a namespace is active
     */
    duration, 
    /**
     * The id of the parent sub namespace
     */
    parentId, signature, signer, transactionInfo) {
        super(TransactionType_1.TransactionType.REGISTER_NAMESPACE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.namespaceType = namespaceType;
        this.namespaceName = namespaceName;
        this.namespaceId = namespaceId;
        this.duration = duration;
        this.parentId = parentId;
    }
    /**
     * Create a root namespace object
     * @param deadline - The deadline to include the transaction.
     * @param namespaceName - The namespace name.
     * @param duration - The duration of the namespace.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {RegisterNamespaceTransaction}
     */
    static createRootNamespace(deadline, namespaceName, duration, networkType, maxFee) {
        return new RegisterRootNamespaceTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .namespaceName(namespaceName)
            .duration(duration)
            .build();
    }
    /**
     * Create a sub namespace object
     * @param deadline - The deadline to include the transaction.
     * @param namespaceName - The namespace name.
     * @param parentNamespace - The parent namespace name.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {RegisterNamespaceTransaction}
     */
    static createSubNamespace(deadline, namespaceName, parentNamespace, networkType, maxFee) {
        return new RegisterSubNamespaceTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .namespaceName(namespaceName)
            .parentNamespace(parentNamespace)
            .build();
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a RegisterNamespaceTransaction
     * @returns {number}
     * @memberof RegisterNamespaceTransaction
     */
    get size() {
        return RegisterNamespaceTransaction.calculateSize(this.namespaceName);
    }
    static calculateSize(namespaceName) {
        const byteSize = Transaction_1.Transaction.getHeaderSize();
        // set static byte size fields
        const byteType = 1;
        const byteDurationParentId = 8;
        const byteNamespaceId = 8;
        const byteNameSize = 1;
        // convert name from utf8
        const namespaceNameSize = format_1.Convert.utf8ToHex(namespaceName).length / 2;
        return byteSize + byteType + byteDurationParentId + byteNamespaceId + byteNameSize + namespaceNameSize;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        let registerNamespacetransaction = new NamespaceCreationTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addNamespaceType(this.namespaceType)
            .addNamespaceId(this.namespaceId.id.toDTO())
            .addNamespaceName(this.namespaceName);
        if (this.namespaceType === NamespaceType_1.NamespaceType.RootNamespace) {
            registerNamespacetransaction = registerNamespacetransaction.addDuration(this.duration.toDTO());
        }
        else {
            registerNamespacetransaction = registerNamespacetransaction.addParentId(this.parentId.id.toDTO());
        }
        return registerNamespacetransaction.build();
    }
}
exports.RegisterNamespaceTransaction = RegisterNamespaceTransaction;
class RegisterRootNamespaceTransactionBuilder extends Transaction_1.TransactionBuilder {
    namespaceName(namespaceName) {
        this._namespaceName = namespaceName;
        return this;
    }
    duration(duration) {
        this._duration = duration;
        return this;
    }
    build() {
        return new RegisterNamespaceTransaction(this._networkType, TransactionVersion_1.TransactionVersion.REGISTER_NAMESPACE, this._deadline ? this._deadline : this._createNewDeadlineFn(), this._maxFee ? this._maxFee : FeeCalculationStrategy_1.calculateFee(RegisterNamespaceTransaction.calculateSize(this._namespaceName), this._feeCalculationStrategy), NamespaceType_1.NamespaceType.RootNamespace, this._namespaceName, new NamespaceId_1.NamespaceId(this._namespaceName), this._duration, undefined, this._signature, this._signer, this._transactionInfo);
    }
}
exports.RegisterRootNamespaceTransactionBuilder = RegisterRootNamespaceTransactionBuilder;
class RegisterSubNamespaceTransactionBuilder extends Transaction_1.TransactionBuilder {
    namespaceName(namespaceName) {
        this._namespaceName = namespaceName;
        return this;
    }
    parentNamespace(parentNamespace) {
        this._parentNamespace = parentNamespace;
        return this;
    }
    build() {
        const parentId = typeof this._parentNamespace === 'string' ?
            new NamespaceId_1.NamespaceId(infrastructure_1.NamespaceMosaicIdGenerator.subnamespaceParentId(this._parentNamespace, this._namespaceName)) :
            this._parentNamespace;
        let namespaceId = typeof this._parentNamespace === 'string' ?
            new NamespaceId_1.NamespaceId(infrastructure_1.NamespaceMosaicIdGenerator.subnamespaceNamespaceId(this._parentNamespace, this._namespaceName)) :
            new NamespaceId_1.NamespaceId(infrastructure_1.NamespaceMosaicIdGenerator.namespaceId(this._namespaceName));
        return new RegisterNamespaceTransaction(this._networkType, TransactionVersion_1.TransactionVersion.REGISTER_NAMESPACE, this._deadline ? this._deadline : this._createNewDeadlineFn(), this._maxFee ? this._maxFee : FeeCalculationStrategy_1.calculateFee(RegisterNamespaceTransaction.calculateSize(this._namespaceName), this._feeCalculationStrategy), NamespaceType_1.NamespaceType.SubNamespace, this._namespaceName, namespaceId, undefined, parentId, this._signature, this._signer, this._transactionInfo);
    }
}
exports.RegisterSubNamespaceTransactionBuilder = RegisterSubNamespaceTransactionBuilder;
//# sourceMappingURL=RegisterNamespaceTransaction.js.map