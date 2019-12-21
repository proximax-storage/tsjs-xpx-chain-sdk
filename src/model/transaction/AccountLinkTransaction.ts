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

import { Builder } from '../../infrastructure/builders/AccountLinkTransaction';
import { TransactionBuilder } from './Transaction';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { LinkAction } from './LinkAction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { calculateFee } from './FeeCalculationStrategy';

/**
 * Announce an AccountLinkTransaction to delegate the account importance to a proxy account.
 * By doing so, you can enable delegated harvesting
 */
export class AccountLinkTransaction extends Transaction {
    /**
     * Create a link account transaction object
     * @param deadline - The deadline to include the transaction.
     * @param remoteAccountKey - The public key of the remote account.
     * @param linkAction - The account link action.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountLinkTransaction}
     */
    public static create(deadline: Deadline,
                         remoteAccountKey: string,
                         linkAction: LinkAction,
                         networkType: NetworkType,
                         maxFee?: UInt64): AccountLinkTransaction {
        return new AccountLinkTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .remoteAccountKey(remoteAccountKey)
            .linkAction(linkAction)
            .build();
    }

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
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The public key of the remote account.
                 */
                public readonly remoteAccountKey: string,
                /**
                 * The account link action.
                 */
                public readonly linkAction: LinkAction,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.LINK_ACCOUNT, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountLinkTransaction
     * @returns {number}
     * @memberof AccountLinkTransaction
     */
    public get size(): number {
        return AccountLinkTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const bytePublicKey = 32;
        const byteLinkAction = 1;

        return byteSize + bytePublicKey + byteLinkAction;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof AccountLinkTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                remoteAccountKey: this.remoteAccountKey,
                action: this.linkAction
            }
        }
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new Builder()
            .addSize(this.size)
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addRemoteAccountKey(this.remoteAccountKey)
            .addLinkAction(this.linkAction)
            .build();
    }

}

export class AccountLinkTransactionBuilder extends TransactionBuilder {
    private _remoteAccountKey: string;
    private _linkAction: LinkAction;

    public linkAction(linkAction: LinkAction) {
        this._linkAction = linkAction;
        return this;
    }

    public remoteAccountKey(remoteAccountKey: string) {
        this._remoteAccountKey = remoteAccountKey;
        return this;
    }

    public build(): AccountLinkTransaction {
        return new AccountLinkTransaction(
            this._networkType,
            this._version || TransactionVersion.LINK_ACCOUNT,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(AccountLinkTransaction.calculateSize(), this._feeCalculationStrategy),
            this._remoteAccountKey,
            this._linkAction,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
