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

import { Builder } from '../../infrastructure/builders/MosaicAliasTransaction';
import {VerifiableTransaction} from '../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { AliasActionType } from '../namespace/AliasActionType';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { calculateFee } from './FeeCalculationStrategy';

export class MosaicAliasTransaction extends Transaction {

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
    public static create(deadline: Deadline,
                         actionType: AliasActionType,
                         namespaceId: NamespaceId,
                         mosaicId: MosaicId,
                         networkType: NetworkType,
                         maxFee?: UInt64): MosaicAliasTransaction {
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
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The alias action type.
                 */
                public readonly actionType: AliasActionType,
                /**
                 * The namespace id that will be an alias.
                 */
                public readonly namespaceId: NamespaceId,
                /**
                 * The mosaic id.
                 */
                public readonly mosaicId: MosaicId,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MOSAIC_ALIAS, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicAliasTransaction
     * @returns {number}
     * @memberof MosaicAliasTransaction
     */
    public get size(): number {
        return MosaicAliasTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const byteType = 1;
        const byteNamespaceId = 8;
        const byteMosaicId = 8;

        return byteSize + byteType + byteNamespaceId + byteMosaicId;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof MosaicAliasTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                aliasAction: this.actionType,
                namespaceId: this.namespaceId.toDTO(),
                mosaicId: this.mosaicId.toDTO(),
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
            .addActionType(this.actionType)
            .addNamespaceId(this.namespaceId.id.toDTO())
            .addMosaicId(this.mosaicId.id.toDTO())
            .build();
    }
}

export class MosaicAliasTransactionBuilder extends TransactionBuilder {
    private _actionType: AliasActionType;
    private _namespaceId: NamespaceId;
    private _mosaicId: MosaicId;

    public actionType(actionType: AliasActionType) {
        this._actionType = actionType;
        return this;
    }

    public namespaceId(namespaceId: NamespaceId) {
        this._namespaceId = namespaceId;
        return this;
    }

    public mosaicId(mosaicId: MosaicId) {
        this._mosaicId = mosaicId;
        return this;
    }

    public build() {
        return new MosaicAliasTransaction(
            this._networkType,
            this._version || TransactionVersion.MOSAIC_ALIAS,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(MosaicAliasTransaction.calculateSize(), this._feeCalculationStrategy),
            this._actionType,
            this._namespaceId,
            this._mosaicId,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
