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
const NamespaceMosaicIdGenerator_1 = require("../../infrastructure/transaction/NamespaceMosaicIdGenerator");
const NamespaceId_1 = require("../namespace/NamespaceId");
const NamespaceType_1 = require("../namespace/NamespaceType");
const UInt64_1 = require("../UInt64");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
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
    static createRootNamespace(deadline, namespaceName, duration, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        return new RegisterNamespaceTransaction(networkType, TransactionVersion_1.TransactionVersion.REGISTER_NAMESPACE, deadline, maxFee, NamespaceType_1.NamespaceType.RootNamespace, namespaceName, new NamespaceId_1.NamespaceId(namespaceName), duration);
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
    static createSubNamespace(deadline, namespaceName, parentNamespace, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        let parentId;
        if (typeof parentNamespace === 'string') {
            parentId = new NamespaceId_1.NamespaceId(NamespaceMosaicIdGenerator_1.NamespaceMosaicIdGenerator.subnamespaceParentId(parentNamespace, namespaceName));
        }
        else {
            parentId = parentNamespace;
        }
        return new RegisterNamespaceTransaction(networkType, TransactionVersion_1.TransactionVersion.REGISTER_NAMESPACE, deadline, maxFee, NamespaceType_1.NamespaceType.SubNamespace, namespaceName, typeof parentNamespace === 'string' ?
            new NamespaceId_1.NamespaceId(NamespaceMosaicIdGenerator_1.NamespaceMosaicIdGenerator.subnamespaceNamespaceId(parentNamespace, namespaceName)) :
            new NamespaceId_1.NamespaceId(NamespaceMosaicIdGenerator_1.NamespaceMosaicIdGenerator.namespaceId(namespaceName)), undefined, parentId);
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a RegisterNamespaceTransaction
     * @returns {number}
     * @memberof RegisterNamespaceTransaction
     */
    get size() {
        const byteSize = super.size;
        // set static byte size fields
        const byteType = 1;
        const byteDurationParentId = 8;
        const byteNamespaceId = 8;
        const byteNameSize = 1;
        // convert name to uint8
        const byteName = format_1.Convert.utf8ToHex(this.namespaceName).length / 2;
        return byteSize + byteType + byteDurationParentId + byteNamespaceId + byteNameSize + byteName;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        let registerNamespacetransaction = new NamespaceCreationTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addFee(this.maxFee.toDTO())
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
//# sourceMappingURL=RegisterNamespaceTransaction.js.map