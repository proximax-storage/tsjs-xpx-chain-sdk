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
const AccountRestrictionsMosaicTransaction_1 = require("../../infrastructure/builders/AccountRestrictionsMosaicTransaction");
const RestrictionType_1 = require("../account/RestrictionType");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
const FeeCalculationStrategy_1 = require("./FeeCalculationStrategy");
class AccountMosaicRestrictionModificationTransaction extends Transaction_1.Transaction {
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
        super(TransactionType_1.TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.restrictionType = restrictionType;
        this.modifications = modifications;
    }
    /**
     * Create a modify account mosaic restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - The account restriction type.
     * @param modifications - The array of modifications.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountAddressRestrictionModificationTransaction}
     */
    static create(deadline, restrictionType, modifications, networkType, maxFee) {
        return new AccountMosaicRestrictionModificationTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .restrictionType(restrictionType)
            .modifications(modifications)
            .build();
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountMosaicRestrictionModificationTransaction
     * @returns {number}
     * @memberof AccountMosaicRestrictionModificationTransaction
     */
    get size() {
        return AccountMosaicRestrictionModificationTransaction.calculateSize(this.modifications.length);
    }
    static calculateSize(modificationCount) {
        const byteSize = Transaction_1.Transaction.getHeaderSize();
        // set static byte size fields
        const byteRestrictionType = 1;
        const byteModificationCount = 1;
        // each modification contains :
        // - 1 byte for modificationType
        // - 8 bytes for the modification value (mosaicId)
        const byteModifications = 9 * modificationCount;
        return byteSize + byteRestrictionType + byteModificationCount + byteModifications;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new AccountRestrictionsMosaicTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addRestrictionType(this.restrictionType)
            .addModifications(this.modifications.map((modification) => modification.toDTO()))
            .build();
    }
}
exports.AccountMosaicRestrictionModificationTransaction = AccountMosaicRestrictionModificationTransaction;
class AccountMosaicRestrictionModificationTransactionBuilder extends Transaction_1.TransactionBuilder {
    restrictionType(restrictionType) {
        if (!(restrictionType === RestrictionType_1.RestrictionType.AllowMosaic || restrictionType === RestrictionType_1.RestrictionType.BlockMosaic)) {
            throw new Error('Restriction type is not allowed.');
        }
        ;
        this._restrictionType = restrictionType;
        return this;
    }
    modifications(modifications) {
        this._modifications = modifications;
        return this;
    }
    build() {
        return new AccountMosaicRestrictionModificationTransaction(this._networkType, TransactionVersion_1.TransactionVersion.MODIFY_ACCOUNT_RESTRICTION_ADDRESS, this._deadline ? this._deadline : this._createNewDeadlineFn(), this._maxFee ? this._maxFee : FeeCalculationStrategy_1.calculateFee(AccountMosaicRestrictionModificationTransaction.calculateSize(this._modifications.length), this._feeCalculationStrategy), this._restrictionType, this._modifications, this._signature, this._signer, this._transactionInfo);
    }
}
exports.AccountMosaicRestrictionModificationTransactionBuilder = AccountMosaicRestrictionModificationTransactionBuilder;
//# sourceMappingURL=AccountMosaicRestrictionModificationTransaction.js.map