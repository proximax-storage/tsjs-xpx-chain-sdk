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

import { Builder } from '../../infrastructure/builders/AccountAddressRestrictionTransaction';
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
import { Address } from "../account/Address";

export class AccountAddressRestrictionTransaction extends Transaction {

    /**
     * Create a modify account address restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionFlags
     * @param restrictionAdditions
     * @param restrictionDeletions
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountAddressRestrictionTransaction}
     */
    public static create(deadline: Deadline,
                         restrictionFlags: number,
                         restrictionAdditions: Address[],
                         restrictionDeletions: Address[],
                         networkType: NetworkType,
                         maxFee?: UInt64): AccountAddressRestrictionTransaction {

        if(restrictionFlags > 0xFFFF){
            throw new Error("restrictionFlags short be uint16 number");
        }

        return new AccountAddressRestrictionTransactionBuilder()
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
                public readonly restrictionAdditions: Address[],
                public readonly restrictionDeletions: Address[],
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.Account_Address_Restriction,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountAddressRestrictionTransaction
     * @returns {number}
     * @memberof AccountAddressRestrictionTransaction
     */
    public get size(): number {
        return AccountAddressRestrictionTransaction.calculateSize(this.restrictionAdditions.length, this.restrictionDeletions.length);
    }

    public static calculateSize(addCount: number, deleteCount: number): number {
        const byteSize = Transaction.getHeaderSize();

        const restrictionFlags = 2;
        const byteAddCount = 1;
        const byteDeleteCount = 1;

        const reservedBodyByte = 1;

        const additionBytes = 25 * addCount;
        const deletionBytes = 25 * deleteCount;

        return byteSize + restrictionFlags 
                + byteAddCount + byteDeleteCount 
                + reservedBodyByte 
                + additionBytes + deletionBytes;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof AccountAddressRestrictionTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                restrictionFlags: this.restrictionFlags,
                restrictionAdditions: this.restrictionAdditions.map(add=>{
                    return add.plain()
                }),
                restrictionDeletions: this.restrictionDeletions.map(del=>{
                    return del.plain()
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
            .addRestrictionAdditions(this.restrictionAdditions.map(x=> x.plain()))
            .addRestrictionDeletions(this.restrictionDeletions.map(x=> x.plain()))
            .build();
    }
}

export class AccountAddressRestrictionTransactionBuilder extends TransactionBuilder {
    private _restrictionFlags: number;
    private _restrictionAdditions: Address[];
    private _restrictionDeletions: Address[];

    public restrictionFlags(restrictionFlags: RestrictionType) {
        if (restrictionFlags > 0xFFFF) {
            throw new Error('restrictionFlags must be a uint16 number');
        };
        this._restrictionFlags = restrictionFlags;
        return this;
    }

    public restrictionAdditions(restrictionAdditions: Address[]) {
        this._restrictionAdditions = restrictionAdditions;
        return this;
    }

    public restrictionDeletions(restrictionDeletions: Address[]) {
        this._restrictionDeletions = restrictionDeletions;
        return this;
    }

    public build(): AccountAddressRestrictionTransaction {
        return new AccountAddressRestrictionTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Account_Address_Restriction,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(AccountAddressRestrictionTransaction.calculateSize(this._restrictionAdditions.length, this._restrictionDeletions.length), this._feeCalculationStrategy),
            this._restrictionFlags,
            this._restrictionAdditions,
            this._restrictionDeletions,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
