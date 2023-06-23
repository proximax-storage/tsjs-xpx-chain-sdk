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

import { Builder } from '../../../infrastructure/builders/liquidityProvider/CreateLiquidityProviderTransaction';
import { TransactionBuilder } from '../Transaction';
import { VerifiableTransaction } from '../../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../../account/PublicAccount';
import { NetworkType } from '../../blockchain/NetworkType';
import { UInt64 } from '../../UInt64';
import { Deadline } from '../Deadline';
import { MosaicId } from '../../mosaic/MosaicId';
import { Transaction } from '../Transaction';
import { TransactionInfo } from '../TransactionInfo';
import { TransactionType } from '../TransactionType';
import { TransactionTypeVersion } from '../TransactionTypeVersion';
import { calculateFee } from '../FeeCalculationStrategy';

export class CreateLiquidityProviderTransaction extends Transaction {
    /**
     * Create a create liquidity provider transaction object
     * @param deadline - The deadline to include the transaction.
     * @param providerMosaicId MosaicId
	 * @param currencyDeposit Amount
	 * @param initialMosaicsMinting Amount
	 * @param slashingPeriod uint32
	 * @param windowSize uint16
	 * @param slashingAccount PublicAccount
	 * @param alpha uint32
	 * @param beta uint32
     * @param networkType Network Type
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {CreateLiquidityProviderTransaction}
     */
    public static create(deadline: Deadline,
                            providerMosaicId: MosaicId,
                            currencyDeposit: UInt64,
                            initialMosaicsMinting: UInt64,
                            slashingPeriod: number,
                            windowSize: number,
                            slashingAccount: PublicAccount,
                            alpha: number,
                            beta: number,
                         networkType: NetworkType,
                         maxFee?: UInt64): CreateLiquidityProviderTransaction {
        return new CreateLiquidityProviderTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .providerMosaicId(providerMosaicId)
            .currencyDeposit(currencyDeposit)
            .initialMosaicsMinting(initialMosaicsMinting)
            .slashingPeriod(slashingPeriod)
            .windowSize(windowSize)
            .slashingAccount(slashingAccount)
            .alpha(alpha)
            .beta(beta)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param providerMosaicId MosaicId
	 * @param currencyDeposit Amount
	 * @param initialMosaicsMinting Amount
	 * @param slashingPeriod uint32
	 * @param windowSize uint16
	 * @param slashingAccount PublicAccount
	 * @param alpha uint32
	 * @param beta uint32
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly providerMosaicId: MosaicId,
                public readonly currencyDeposit: UInt64,
                public readonly initialMosaicsMinting: UInt64,
                public readonly slashingPeriod: number,
                public readonly windowSize: number,
                public readonly slashingAccount: PublicAccount,
                public readonly alpha: number,
                public readonly beta: number,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.Create_Liquidity_Provider, networkType, version, deadline, maxFee, signature, signer, transactionInfo);

        if(slashingPeriod > 0xFFFFFFFF || slashingPeriod <= 0){
            throw new Error("slashingPeriod out of range, should be uint32 positive number");
        }

        if(windowSize > 0xFFFF || windowSize <= 0){
            throw new Error("windowSize out of range, should be uint16 positive number");
        }

        if(alpha > 0xFFFFFFFF || alpha <= 0){
            throw new Error("slashingPeriod out of range, should be uint32 positive number");
        }

        if(beta > 0xFFFFFFFF || beta <= 0){
            throw new Error("slashingPeriod out of range, should be uint32 positive number");
        }
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a CreateLiquidityProviderTransaction
     * @returns {number}
     * @memberof CreateLiquidityProviderTransaction
     */
    public get size(): number {
        return CreateLiquidityProviderTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const providerMosaicId = 8;
        const currencyDeposit = 8;
        const initialMosaicsMinting = 8;
        const slashingPeriod = 4;
        const windowSize = 2;
        const slashingAccount = 32;
        const alpha = 4;
        const beta = 4;

        return byteSize + providerMosaicId + currencyDeposit + initialMosaicsMinting + slashingPeriod 
                + windowSize + slashingAccount + alpha + beta;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof CreateLiquidityProviderTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                providerMosaicId: this.providerMosaicId.toDTO(),
                currencyDeposit: this.currencyDeposit.toDTO(),
                initialMosaicsMinting: this.initialMosaicsMinting.toDTO(),
                slashingPeriod: this.slashingPeriod,
                windowSize: this.windowSize,
                slashingAccount: this.slashingAccount.publicKey,
                alpha: this.alpha,
                beta: this.beta
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
            .addType(this.type)
            .addProviderMosaicId(this.providerMosaicId.id.toDTO())
            .addCurrencyDeposit(this.currencyDeposit.toDTO())
            .addInitialMosaicsMinting(this.initialMosaicsMinting.toDTO())
            .addSlashingPeriod(this.slashingPeriod)
            .addWindowSize(this.windowSize)
            .addSlashingAccount(this.slashingAccount.publicKey)
            .addAlpha(this.alpha)
            .addBeta(this.beta)
            .build();
    }
}

export class CreateLiquidityProviderTransactionBuilder extends TransactionBuilder {
    private _providerMosaicId: MosaicId;
    private _currencyDeposit: UInt64;
    private _initialMosaicsMinting: UInt64;
    private _slashingPeriod: number;
    private _windowSize: number;
    private _slashingAccount: PublicAccount;
    private _alpha: number;
    private _beta: number;

    public providerMosaicId(providerMosaicId: MosaicId) {
        this._providerMosaicId = providerMosaicId;
        return this;
    }

    public currencyDeposit(currencyDeposit: UInt64) {
        this._currencyDeposit = currencyDeposit;
        return this;
    }

    public initialMosaicsMinting(initialMosaicsMinting: UInt64) {
        this._initialMosaicsMinting = initialMosaicsMinting;
        return this;
    }

    public slashingPeriod(slashingPeriod: number) {
        this._slashingPeriod = slashingPeriod;
        return this;
    }

    public windowSize(windowSize: number) {
        this._windowSize = windowSize;
        return this;
    }

    public slashingAccount(slashingAccount: PublicAccount) {
        this._slashingAccount = slashingAccount;
        return this;
    }

    public alpha(alpha: number) {
        this._alpha = alpha;
        return this;
    }

    public beta(beta: number) {
        this._beta = beta;
        return this;
    }

    public build(): CreateLiquidityProviderTransaction {
        return new CreateLiquidityProviderTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Create_Liquidity_Provider,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(CreateLiquidityProviderTransaction.calculateSize(), this._feeCalculationStrategy),
            this._providerMosaicId,
            this._currencyDeposit,
            this._initialMosaicsMinting,
            this._slashingPeriod,
            this._windowSize,
            this._slashingAccount,
            this._alpha,
            this._beta,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}