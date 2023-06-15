/*
 * Copyright 2023 ProximaX
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

import { Builder } from '../../../infrastructure/builders/liquidityProvider/ManualRateChangeTransaction';
import { TransactionBuilder } from '../Transaction';
import { VerifiableTransaction } from '../../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../../account/PublicAccount';
import { NetworkType } from '../../blockchain/NetworkType';
import { UInt64 } from '../../UInt64';
import { Deadline } from '../Deadline';
import { Transaction } from '../Transaction';
import { TransactionInfo } from '../TransactionInfo';
import { TransactionType } from '../TransactionType';
import { TransactionTypeVersion } from '../TransactionTypeVersion';
import { calculateFee } from '../FeeCalculationStrategy';
import { MosaicId } from '../../mosaic/MosaicId';

/** 
 * ManualRateChangeTransaction for liquidity provider
 */
export class ManualRateChangeTransaction extends Transaction {
    /**
     * Create a manual rate change transaction object
     * @param deadline - The deadline to include the transaction.
     * @param providerMosaicId MosaicId
     * @param currencyBalanceIncrease boolean
     * @param currencyBalanceChange Amount
     * @param mosaicBalanceIncrease booloan
     * @param mosaicBalanceChange Amount
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ManualRateChangeTransaction}
     */
    public static create(deadline: Deadline,
                            providerMosaicId: MosaicId,
                            currencyBalanceIncrease: boolean,
                            currencyBalanceChange: UInt64,
                            mosaicBalanceIncrease: boolean,
                            mosaicBalanceChange: UInt64,
                         networkType: NetworkType,
                         maxFee?: UInt64): ManualRateChangeTransaction {
        return new ManualRateChangeTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .providerMosaicId(providerMosaicId)
            .currencyBalanceIncrease(currencyBalanceIncrease)
            .currencyBalanceChange(currencyBalanceChange)
            .mosaicBalanceIncrease(mosaicBalanceIncrease)
            .mosaicBalanceChange(mosaicBalanceChange)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param providerMosaicId MosaicId
     * @param currencyBalanceIncrease boolean
     * @param currencyBalanceChange Amount
     * @param mosaicBalanceIncrease booloan
     * @param mosaicBalanceChange Amount
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly providerMosaicId: MosaicId,
                public readonly currencyBalanceIncrease: boolean,
                public readonly currencyBalanceChange: UInt64,
                public readonly mosaicBalanceIncrease: boolean,
                public readonly mosaicBalanceChange: UInt64,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.ManualRateChange, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a ManualRateChangeTransaction
     * @returns {number}
     * @memberof ManualRateChangeTransaction
     */
    public get size(): number {
        return ManualRateChangeTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const providerMosaicId = 8;
        const currencyBalanceIncrease = 1;
        const currencyBalanceChange = 8;
        const mosaicBalanceIncrease = 1;
        const mosaicBalanceChange = 8;

        return byteSize + providerMosaicId + currencyBalanceIncrease + currencyBalanceChange + mosaicBalanceIncrease + mosaicBalanceChange;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof ManualRateChangeTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                providerMosaicId: this.providerMosaicId.toHex(),
                currencyBalanceIncrease: this.currencyBalanceIncrease,
                currencyBalanceChange: this.currencyBalanceChange.toDTO(),
                mosaicBalanceIncrease: this.mosaicBalanceIncrease,
                mosaicBalanceChange: this.mosaicBalanceChange.toDTO()
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
            .addProviderMosaicId(this.providerMosaicId.id.toDTO())
            .addCurrencyBalanceIncrease(this.currencyBalanceIncrease)
            .addCurrencyBalanceChange(this.currencyBalanceChange.toDTO())
            .addMosaicBalanceIncrease(this.mosaicBalanceIncrease)
            .addMosaicBalanceChange(this.mosaicBalanceChange.toDTO())
            .build();
    }

}

export class ManualRateChangeTransactionBuilder extends TransactionBuilder {
    private _providerMosaicId: MosaicId;
    private _currencyBalanceIncrease: boolean;
    private _currencyBalanceChange: UInt64;
    private _mosaicBalanceIncrease: boolean;
    private _mosaicBalanceChange: UInt64;

    public providerMosaicId(providerMosaicId: MosaicId) {
        this._providerMosaicId = providerMosaicId;
        return this;
    }

    public currencyBalanceIncrease(currencyBalanceIncrease: boolean) {
        this._currencyBalanceIncrease = currencyBalanceIncrease;
        return this;
    }

    public currencyBalanceChange(currencyBalanceChange: UInt64) {
        this._currencyBalanceChange = currencyBalanceChange;
        return this;
    }

    public mosaicBalanceIncrease(mosaicBalanceIncrease: boolean) {
        this._mosaicBalanceIncrease = mosaicBalanceIncrease;
        return this;
    }

    public mosaicBalanceChange(mosaicBalanceChange: UInt64) {
        this._mosaicBalanceChange = mosaicBalanceChange;
        return this;
    }

    public build(): ManualRateChangeTransaction {
        return new ManualRateChangeTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.ManualRateChange,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(ManualRateChangeTransaction.calculateSize(), this._feeCalculationStrategy),
            this._providerMosaicId,
            this._currencyBalanceIncrease,
            this._currencyBalanceChange,
            this._mosaicBalanceIncrease,
            this._mosaicBalanceChange,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
