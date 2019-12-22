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

import { Builder } from '../../infrastructure/builders/MultisigModificationTransaction';
import {VerifiableTransaction} from '../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { MultisigCosignatoryModification } from './MultisigCosignatoryModification';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { calculateFee } from './FeeCalculationStrategy';

/**
 * Modify multisig account transactions are part of the NEM's multisig account system.
 * A modify multisig account transaction holds an array of multisig cosignatory modifications,
 * min number of signatures to approve a transaction and a min number of signatures to remove a cosignatory.
 * @since 1.0
 */
export class ModifyMultisigAccountTransaction extends Transaction {

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
    public static create(deadline: Deadline,
                         minApprovalDelta: number,
                         minRemovalDelta: number,
                         modifications: MultisigCosignatoryModification[],
                         networkType: NetworkType,
                         maxFee?: UInt64): ModifyMultisigAccountTransaction {
        return new ModifyMultisigAccountTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .minApprovalDelta(minApprovalDelta)
            .minRemovalDelta(minRemovalDelta)
            .modifications(modifications)
            .build();
    }

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
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The number of signatures needed to approve a transaction.
                 * If we are modifying and existing multi-signature account this indicates the relative change of the minimum cosignatories.
                 */
                public readonly minApprovalDelta: number,
                /**
                 * The number of signatures needed to remove a cosignatory.
                 * If we are modifying and existing multi-signature account this indicates the relative change of the minimum cosignatories.
                 */
                public readonly minRemovalDelta: number,
                /**
                 * The array of cosigner accounts added or removed from the multi-signature account.
                 */
                public readonly modifications: MultisigCosignatoryModification[],
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MODIFY_MULTISIG_ACCOUNT, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a ModifyMultisigAccountTransaction
     * @returns {number}
     * @memberof ModifyMultisigAccountTransaction
     */
    public get size(): number {
        return ModifyMultisigAccountTransaction.calculateSize(this.modifications.length);
    }

    public static calculateSize(modificationsCount: number): number {
        const byteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const byteRemovalDelta = 1;
        const byteApprovalDelta = 1;
        const byteNumModifications = 1;

        // each modification contains :
        // - 1 byte for modificationType
        // - 32 bytes for cosignatoryPublicKey
        const byteModifications = 33 * modificationsCount;

        return byteSize + byteRemovalDelta + byteApprovalDelta + byteNumModifications + byteModifications;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof ModifyMultisigAccountTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                minApprovalDelta: this.minApprovalDelta,
                minRemovalDelta: this.minRemovalDelta,
                modifications: this.modifications.map((modification) => {
                    return modification.toDTO();
                }),
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
            .addMinApprovalDelta(this.minApprovalDelta)
            .addMinRemovalDelta(this.minRemovalDelta)
            .addModifications(this.modifications.map((modification) => modification.toDTO()))
            .build();
    }
}

export class ModifyMultisigAccountTransactionBuilder extends TransactionBuilder {
    private _minApprovalDelta: number;
    private _minRemovalDelta: number;
    private _modifications: MultisigCosignatoryModification[];

    public minApprovalDelta(minApprovalDelta: number) {
        this._minApprovalDelta = minApprovalDelta;
        return this;
    }

    public minRemovalDelta(minRemovalDelta: number) {
        this._minRemovalDelta = minRemovalDelta;
        return this;
    }

    public modifications(modifications: MultisigCosignatoryModification[]) {
        this._modifications = modifications;
        return this;
    }

    public build(): ModifyMultisigAccountTransaction {
        return new ModifyMultisigAccountTransaction(
            this._networkType,
            this._version || TransactionVersion.MODIFY_MULTISIG_ACCOUNT,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(ModifyMultisigAccountTransaction.calculateSize(this._modifications.length), this._feeCalculationStrategy),
            this._minApprovalDelta,
            this._minRemovalDelta,
            this._modifications,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
