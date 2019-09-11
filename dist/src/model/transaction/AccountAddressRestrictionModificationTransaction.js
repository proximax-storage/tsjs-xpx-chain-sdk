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
const AccountRestrictionsAddressTransaction_1 = require("../../infrastructure/builders/AccountRestrictionsAddressTransaction");
const UInt64_1 = require("../UInt64");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
class AccountAddressRestrictionModificationTransaction extends Transaction_1.Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param restrictionType
     * @param modifications
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType, version, deadline, maxFee, restrictionType, modifications, signature, signer, transactionInfo) {
        super(TransactionType_1.TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.restrictionType = restrictionType;
        this.modifications = modifications;
    }
    /**
     * Create a modify account address restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - The account restriction type.
     * @param modifications - The array of modifications.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountAddressRestrictionModificationTransaction}
     */
    static create(deadline, restrictionType, modifications, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        return new AccountAddressRestrictionModificationTransaction(networkType, TransactionVersion_1.TransactionVersion.MODIFY_ACCOUNT_RESTRICTION_ADDRESS, deadline, maxFee, restrictionType, modifications);
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountAddressRestrictionModificationTransaction
     * @returns {number}
     * @memberof AccountAddressRestrictionModificationTransaction
     */
    get size() {
        const byteSize = super.size;
        // set static byte size fields
        const byteRestrictionType = 1;
        const byteModificationCount = 1;
        // each modification contains :
        // - 1 byte for modificationType
        // - 25 bytes for the modification value (address)
        const byteModifications = 26 * this.modifications.length;
        return byteSize + byteRestrictionType + byteModificationCount + byteModifications;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new AccountRestrictionsAddressTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addRestrictionType(this.restrictionType)
            .addModifications(this.modifications.map((modification) => modification.toDTO()))
            .build();
    }
}
exports.AccountAddressRestrictionModificationTransaction = AccountAddressRestrictionModificationTransaction;
//# sourceMappingURL=AccountAddressRestrictionModificationTransaction.js.map