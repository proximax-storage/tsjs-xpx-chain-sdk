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
const AccountLinkTransaction_1 = require("../../infrastructure/builders/AccountLinkTransaction");
const Transaction_1 = require("./Transaction");
const Transaction_2 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
const FeeCalculationStrategy_1 = require("./FeeCalculationStrategy");
/**
 * Announce an AccountLinkTransaction to delegate the account importance to a proxy account.
 * By doing so, you can enable delegated harvesting
 */
class AccountLinkTransaction extends Transaction_2.Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param remoteAccountKey
     * @param linkAction
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType, version, deadline, maxFee, 
    /**
     * The public key of the remote account.
     */
    remoteAccountKey, 
    /**
     * The account link action.
     */
    linkAction, signature, signer, transactionInfo) {
        super(TransactionType_1.TransactionType.LINK_ACCOUNT, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.remoteAccountKey = remoteAccountKey;
        this.linkAction = linkAction;
    }
    /**
     * Create a link account transaction object
     * @param deadline - The deadline to include the transaction.
     * @param remoteAccountKey - The public key of the remote account.
     * @param linkAction - The account link action.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountLinkTransaction}
     */
    static create(deadline, remoteAccountKey, linkAction, networkType, maxFee) {
        return new AccountLinkTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .remoteAccountKey(remoteAccountKey)
            .linkAction(linkAction)
            .build();
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountLinkTransaction
     * @returns {number}
     * @memberof AccountLinkTransaction
     */
    get size() {
        return AccountLinkTransaction.calculateSize();
    }
    static calculateSize() {
        const byteSize = Transaction_2.Transaction.getHeaderSize();
        // set static byte size fields
        const bytePublicKey = 32;
        const byteLinkAction = 1;
        return byteSize + bytePublicKey + byteLinkAction;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new AccountLinkTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addRemoteAccountKey(this.remoteAccountKey)
            .addLinkAction(this.linkAction)
            .build();
    }
}
exports.AccountLinkTransaction = AccountLinkTransaction;
class AccountLinkTransactionBuilder extends Transaction_1.TransactionBuilder {
    linkAction(linkAction) {
        this._linkAction = linkAction;
        return this;
    }
    remoteAccountKey(remoteAccountKey) {
        this._remoteAccountKey = remoteAccountKey;
        return this;
    }
    build() {
        return new AccountLinkTransaction(this._networkType, TransactionVersion_1.TransactionVersion.LINK_ACCOUNT, this._deadline ? this._deadline : this._createNewDeadlineFn(), this._maxFee ? this._maxFee : FeeCalculationStrategy_1.calculateFee(AccountLinkTransaction.calculateSize(), this._feeCalculationStrategy), this._remoteAccountKey, this._linkAction, this._signature, this._signer, this._transactionInfo);
    }
}
exports.AccountLinkTransactionBuilder = AccountLinkTransactionBuilder;
//# sourceMappingURL=AccountLinkTransaction.js.map