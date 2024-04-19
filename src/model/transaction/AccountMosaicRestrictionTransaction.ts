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

import { Builder } from '../../infrastructure/builders/AccountMosaicRestrictionTransaction';
import {VerifiableTransaction} from '../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../account/PublicAccount';
import { RestrictionType } from '../account/RestrictionType';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionTypeVersion } from './TransactionTypeVersion';
import { calculateFee } from './FeeCalculationStrategy';
import { MosaicId } from "../mosaic/MosaicId";

export class AccountMosaicRestrictionTransaction extends Transaction {

    /**
     * Create a modify account address restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionFlags
     * @param restrictionAdditions
     * @param restrictionDeletions
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountMosaicRestrictionTransaction}
     */
    public static create(deadline: Deadline,
                         restrictionFlags: number,
                         restrictionAdditions: MosaicId[],
                         restrictionDeletions: MosaicId[],
                         networkType: NetworkType,
                         maxFee?: UInt64): AccountMosaicRestrictionTransaction {

        if(restrictionFlags > 0xFFFF){
            throw new Error("restrictionFlags short be uint16 number");
        }

        return new AccountMosaicRestrictionTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .restrictionFlags(restrictionFlags)
            .restrictionAdditions(restrictionAdditions)
            .restrictionDeletions(restrictionDeletions)
            .maxFee(maxFee)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param restrictionFlags
     * @param restrictionAdditions
     * @param restrictionDeletions
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly restrictionFlags: number,
                public readonly restrictionAdditions: MosaicId[],
                public readonly restrictionDeletions: MosaicId[],
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.Account_Mosaic_Restriction,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountMosaicRestrictionTransaction
     * @returns {number}
     * @memberof AccountMosaicRestrictionTransaction
     */
    public get size(): number {
        return AccountMosaicRestrictionTransaction.calculateSize(this.restrictionAdditions.length, this.restrictionDeletions.length);
    }

    public static calculateSize(addCount: number, deleteCount: number): number {
        const byteSize = Transaction.getHeaderSize();

        const restrictionFlags = 2;
        const byteAddCount = 1;
        const byteDeleteCount = 1;

        const reservedBodyByte = 1;

        const additionBytes = 8 * addCount;
        const deletionBytes = 8 * deleteCount;

        return byteSize + restrictionFlags 
                + byteAddCount + byteDeleteCount 
                + reservedBodyByte 
                + additionBytes + deletionBytes;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof AccountMosaicRestrictionTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                restrictionFlags: this.restrictionFlags,
                restrictionAdditions: this.restrictionAdditions.map(add=>{
                    return add.toHex()
                }),
                restrictionDeletions: this.restrictionDeletions.map(del=>{
                    return del.toHex()
                })
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
            .addRestrictionFlags(this.restrictionFlags)
            .addRestrictionAdditions(this.restrictionAdditions.map(x=> x.toDTO().id))
            .addRestrictionDeletions(this.restrictionDeletions.map(x=> x.toDTO().id))
            .build();
    }
}

export class AccountMosaicRestrictionTransactionBuilder extends TransactionBuilder {
    private _restrictionFlags: number;
    private _restrictionAdditions: MosaicId[];
    private _restrictionDeletions: MosaicId[];

    public restrictionFlags(restrictionFlags: number) {
        if (restrictionFlags > 0xFFFF) {
            throw new Error('restrictionFlags must be a uint16 number');
        };
        this._restrictionFlags = restrictionFlags;
        return this;
    }

    public restrictionAdditions(restrictionAdditions: MosaicId[]) {
        this._restrictionAdditions = restrictionAdditions;
        return this;
    }

    public restrictionDeletions(restrictionDeletions: MosaicId[]) {
        this._restrictionDeletions = restrictionDeletions;
        return this;
    }

    public build(): AccountMosaicRestrictionTransaction {
        return new AccountMosaicRestrictionTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Account_Mosaic_Restriction,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(AccountMosaicRestrictionTransaction.calculateSize(this._restrictionAdditions.length, this._restrictionDeletions.length), this._feeCalculationStrategy),
            this._restrictionFlags,
            this._restrictionAdditions,
            this._restrictionDeletions,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
