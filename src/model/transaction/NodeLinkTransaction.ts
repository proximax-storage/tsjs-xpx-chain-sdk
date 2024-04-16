/*
 * Copyright 2024 ProximaX
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

import { Builder } from '../../infrastructure/builders/NodeLinkTransaction';
import { TransactionBuilder } from './Transaction';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { AccountLinkAction } from "../account/AccountLink"
import { TransactionTypeVersion } from './TransactionTypeVersion';
import { calculateFee } from './FeeCalculationStrategy';

/**
 * Announce an NodeLinkTransaction, must use v2 account
 * By doing so, you can enable delegated harvesting
 */
export class NodeLinkTransaction extends Transaction {
    /**
     * Create a node link transaction object
     * @param deadline - The deadline to include the transaction.
     * @param remoteAccountKey - The public key of the v2 account.
     * @param linkAction - Link or unlink
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {NodeLinkTransaction}
     */
    public static create(deadline: Deadline,
                         remoteAccountKey: string,
                         linkAction: AccountLinkAction,
                         networkType: NetworkType,
                         maxFee?: UInt64): NodeLinkTransaction {
        return new NodeLinkTransactionBuilder()
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
                 * The public key of the node
                 */
                public readonly remoteAccountKey: string,
                public readonly linkAction: AccountLinkAction,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.Node_Key_Link, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a NodeLinkTransaction
     * @returns {number}
     * @memberof NodeLinkTransaction
     */
    public get size(): number {
        return NodeLinkTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const bytePublicKey = 32;

        return byteSize + bytePublicKey + 1;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof NodeLinkTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                remoteAccountKey: this.remoteAccountKey,
                linkAction: this.linkAction
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

export class NodeLinkTransactionBuilder extends TransactionBuilder {
    private _remoteAccountKey: string;
    private _linkAction: AccountLinkAction;

    public remoteAccountKey(remoteAccountKey: string) {
        this._remoteAccountKey = remoteAccountKey;
        return this;
    }

    public linkAction(linkAction: AccountLinkAction) {
        this._linkAction = linkAction;
        return this;
    }

    public build(): NodeLinkTransaction {
        return new NodeLinkTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Node_Key_Link,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(NodeLinkTransaction.calculateSize(), this._feeCalculationStrategy),
            this._remoteAccountKey,
            this._linkAction,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
