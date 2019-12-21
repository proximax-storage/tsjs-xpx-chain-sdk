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

import { Convert as convert } from '../../core/format';
import { Builder } from '../../infrastructure/builders/NamespaceCreationTransaction';
import {VerifiableTransaction} from '../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { NamespaceId } from '../namespace/NamespaceId';
import { NamespaceType } from '../namespace/NamespaceType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { calculateFee } from './FeeCalculationStrategy';
import { NamespaceMosaicIdGenerator } from '../../infrastructure/infrastructure';

/**
 * Accounts can rent a namespace for an amount of blocks and after a this renew the contract.
 * This is done via a RegisterNamespaceTransaction.
 */
export class RegisterNamespaceTransaction extends Transaction {

    /**
     * Create a root namespace object
     * @param deadline - The deadline to include the transaction.
     * @param namespaceName - The namespace name.
     * @param duration - The duration of the namespace.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {RegisterNamespaceTransaction}
     */
    public static createRootNamespace(deadline: Deadline,
                                      namespaceName: string,
                                      duration: UInt64,
                                      networkType: NetworkType,
                                      maxFee?: UInt64): RegisterNamespaceTransaction {
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
    public static createSubNamespace(deadline: Deadline,
                                     namespaceName: string,
                                     parentNamespace: string | NamespaceId,
                                     networkType: NetworkType,
                                     maxFee?: UInt64): RegisterNamespaceTransaction {
        return new RegisterSubNamespaceTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .namespaceName(namespaceName)
            .parentNamespace(parentNamespace)
            .build();
    }

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
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The namespace type could be namespace or sub namespace
                 */
                public readonly namespaceType: NamespaceType,
                /**
                 * The namespace name
                 */
                public readonly namespaceName: string,
                /**
                 * The id of the namespace derived from namespaceName.
                 * When creating a sub namespace the namespaceId is derived from namespaceName and parentName.
                 */
                public readonly namespaceId: NamespaceId,
                /**
                 * The number of blocks a namespace is active
                 */
                public readonly duration?: UInt64,
                /**
                 * The id of the parent sub namespace
                 */
                public readonly parentId?: NamespaceId,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.REGISTER_NAMESPACE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a RegisterNamespaceTransaction
     * @returns {number}
     * @memberof RegisterNamespaceTransaction
     */
    public get size(): number {
        return RegisterNamespaceTransaction.calculateSize(this.namespaceName);
    }

    public static calculateSize(namespaceName: string): number {
        const byteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const byteType = 1;
        const byteDurationParentId = 8;
        const byteNamespaceId = 8;
        const byteNameSize = 1;

        // convert name from utf8
        const namespaceNameSize = convert.utf8ToHex(namespaceName).length / 2;

        return byteSize + byteType + byteDurationParentId + byteNamespaceId + byteNameSize + namespaceNameSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof AddressAliasTransaction
     */
    public toJSON() {
        const parent = super.toJSON();

        const jsonObject = {
            namespaceType: this.namespaceType,
            namespaceName: this.namespaceName,
            namespaceId: this.namespaceId.toDTO(),
        };

        if (this.duration) {
            Object.assign(jsonObject, {duration: this.duration.toDTO()});
        }
        if (this.parentId) {
            Object.assign(jsonObject, {parentId: this.parentId.toDTO()});
        }

        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                ...jsonObject
            }
        }
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        let registerNamespacetransaction = new Builder()
            .addSize(this.size)
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addNamespaceType(this.namespaceType)
            .addNamespaceId(this.namespaceId.id.toDTO())
            .addNamespaceName(this.namespaceName);

        if (this.namespaceType === NamespaceType.RootNamespace) {
            registerNamespacetransaction = registerNamespacetransaction.addDuration(this.duration!.toDTO());
        } else {
            registerNamespacetransaction = registerNamespacetransaction.addParentId(this.parentId!.id.toDTO());
        }

        return registerNamespacetransaction.build();
    }
}

export class RegisterRootNamespaceTransactionBuilder extends TransactionBuilder {
    private _namespaceName: string;
    private _duration: UInt64;

    public namespaceName(namespaceName: string) {
        this._namespaceName = namespaceName;
        return this;
    }

    public duration(duration: UInt64) {
        this._duration = duration;
        return this;
    }

    public build(): RegisterNamespaceTransaction {
        return new RegisterNamespaceTransaction(
            this._networkType,
            this._version || TransactionVersion.REGISTER_NAMESPACE,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(RegisterNamespaceTransaction.calculateSize(this._namespaceName), this._feeCalculationStrategy),
            NamespaceType.RootNamespace,
            this._namespaceName,
            new NamespaceId(this._namespaceName),
            this._duration,
            undefined,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
export class RegisterSubNamespaceTransactionBuilder extends TransactionBuilder {
    private _namespaceName: string;
    private _parentNamespace: string | NamespaceId;

    public namespaceName(namespaceName: string) {
        this._namespaceName = namespaceName;
        return this;
    }

    public parentNamespace(parentNamespace: string | NamespaceId) {
        this._parentNamespace = parentNamespace;
        return this;
    }

    public build(): RegisterNamespaceTransaction {
        const parentId: NamespaceId = typeof this._parentNamespace === 'string' ?
            new NamespaceId(NamespaceMosaicIdGenerator.subnamespaceParentId(this._parentNamespace, this._namespaceName)) :
            this._parentNamespace;

        let namespaceId = typeof this._parentNamespace === 'string' ?
            new NamespaceId(NamespaceMosaicIdGenerator.subnamespaceNamespaceId(this._parentNamespace, this._namespaceName)) :
            new NamespaceId(NamespaceMosaicIdGenerator.namespaceId(this._namespaceName));

        return new RegisterNamespaceTransaction(
            this._networkType,
            this._version || TransactionVersion.REGISTER_NAMESPACE,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(RegisterNamespaceTransaction.calculateSize(this._namespaceName), this._feeCalculationStrategy),
            NamespaceType.SubNamespace,
            this._namespaceName,
            namespaceId,
            undefined,
            parentId,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
