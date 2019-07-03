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
const MultisigModificationTransaction_1 = require("../../infrastructure/builders/MultisigModificationTransaction");
const UInt64_1 = require("../UInt64");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
/**
 * Modify multisig account transactions are part of the NEM's multisig account system.
 * A modify multisig account transaction holds an array of multisig cosignatory modifications,
 * min number of signatures to approve a transaction and a min number of signatures to remove a cosignatory.
 * @since 1.0
 */
class ModifyMultisigAccountTransaction extends Transaction_1.Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param minApprovalDelta
     * @param minRemovalDelta
     * @param modifications
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType, version, deadline, maxFee, 
    /**
     * The number of signatures needed to approve a transaction.
     * If we are modifying and existing multi-signature account this indicates the relative change of the minimum cosignatories.
     */
    minApprovalDelta, 
    /**
     * The number of signatures needed to remove a cosignatory.
     * If we are modifying and existing multi-signature account this indicates the relative change of the minimum cosignatories.
     */
    minRemovalDelta, 
    /**
     * The array of cosigner accounts added or removed from the multi-signature account.
     */
    modifications, signature, signer, transactionInfo) {
        super(TransactionType_1.TransactionType.MODIFY_MULTISIG_ACCOUNT, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.minApprovalDelta = minApprovalDelta;
        this.minRemovalDelta = minRemovalDelta;
        this.modifications = modifications;
    }
    /**
     * Create a modify multisig account transaction object
     * @param deadline - The deadline to include the transaction.
     * @param minApprovalDelta - The min approval relative change.
     * @param minRemovalDelta - The min removal relative change.
     * @param modifications - The array of modifications.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyMultisigAccountTransaction}
     */
    static create(deadline, minApprovalDelta, minRemovalDelta, modifications, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        return new ModifyMultisigAccountTransaction(networkType, TransactionVersion_1.TransactionVersion.MODIFY_MULTISIG_ACCOUNT, deadline, maxFee, minApprovalDelta, minRemovalDelta, modifications);
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a ModifyMultisigAccountTransaction
     * @returns {number}
     * @memberof ModifyMultisigAccountTransaction
     */
    get size() {
        const byteSize = super.size;
        // set static byte size fields
        const byteRemovalDelta = 1;
        const byteApprovalDelta = 1;
        const byteNumModifications = 1;
        // each modification contains :
        // - 1 byte for modificationType
        // - 32 bytes for cosignatoryPublicKey
        const byteModifications = 33 * this.modifications.length;
        return byteSize + byteRemovalDelta + byteApprovalDelta + byteNumModifications + byteModifications;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new MultisigModificationTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addMinApprovalDelta(this.minApprovalDelta)
            .addMinRemovalDelta(this.minRemovalDelta)
            .addModifications(this.modifications.map((modification) => modification.toDTO()))
            .build();
    }
}
exports.ModifyMultisigAccountTransaction = ModifyMultisigAccountTransaction;
//# sourceMappingURL=ModifyMultisigAccountTransaction.js.map