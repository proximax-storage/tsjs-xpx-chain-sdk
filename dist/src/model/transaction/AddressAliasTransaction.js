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
const AddressAliasTransaction_1 = require("../../infrastructure/builders/AddressAliasTransaction");
const UInt64_1 = require("../UInt64");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
/**
 * In case a mosaic has the flag 'supplyMutable' set to true, the creator of the mosaic can change the supply,
 * i.e. increase or decrease the supply.
 */
class AddressAliasTransaction extends Transaction_1.Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param actionType
     * @param namespaceId
     * @param address
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
    address, signature, signer, transactionInfo) {
        super(TransactionType_1.TransactionType.ADDRESS_ALIAS, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.actionType = actionType;
        this.namespaceId = namespaceId;
        this.address = address;
    }
    /**
     * Create a address alias transaction object
     * @param deadline - The deadline to include the transaction.
     * @param actionType - The alias action type.
     * @param namespaceId - The namespace id.
     * @param address - The address.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AddressAliasTransaction}
     */
    static create(deadline, actionType, namespaceId, address, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        return new AddressAliasTransaction(networkType, TransactionVersion_1.TransactionVersion.ADDRESS_ALIAS, deadline, maxFee, actionType, namespaceId, address);
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a AddressAliasTransaction
     * @returns {number}
     * @memberof AddressAliasTransaction
     */
    get size() {
        const byteSize = super.size;
        // set static byte size fields
        const byteActionType = 1;
        const byteNamespaceId = 8;
        const byteAddress = 25;
        return byteSize + byteActionType + byteNamespaceId + byteAddress;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new AddressAliasTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addActionType(this.actionType)
            .addNamespaceId(this.namespaceId.id.toDTO())
            .addAddress(this.address.plain())
            .build();
    }
}
exports.AddressAliasTransaction = AddressAliasTransaction;
//# sourceMappingURL=AddressAliasTransaction.js.map