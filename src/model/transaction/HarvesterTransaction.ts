/*
 * Copyright 2022 ProximaX
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

import { Builder } from '../../infrastructure/builders/HarvesterTransaction';
import { TransactionBuilder } from './Transaction';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { Transaction } from './Transaction';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline'
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionTypeVersion } from './TransactionTypeVersion';
import { calculateFee } from './FeeCalculationStrategy';

/**
 * Harvester transactions contain data about add or remove harvester.
 */
export class HarvesterTransaction extends Transaction {
    /**
     * Create a add harvester transaction object
     * @param deadline - The deadline to include the transaction.
     * @param harvesterKey - The public account of the harvester
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {TransferTransaction}
     */
    public static createAdd(deadline: Deadline,
                         harvesterKey: PublicAccount,
                         networkType: NetworkType,
                         maxFee?: UInt64): HarvesterTransaction {
        return new AddHarvesterTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .harvesterKey(harvesterKey)
            .build();
    }

    /**
     * Create a remove harvester transaction object
     * @param deadline - The deadline to include the transaction.
     * @param harvesterKey - The public account of the harvester
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {TransferTransaction}
     */
     public static createRemove(deadline: Deadline,
                harvesterKey: PublicAccount,
                networkType: NetworkType,
                maxFee?: UInt64): HarvesterTransaction {
        return new RemoveHarvesterTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .harvesterKey(harvesterKey)
            .build();
    }

    /**
     * @param networkType
     * @param type
     * @param version
     * @param deadline
     * @param maxFee
     * @param harvesterKey
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                type: number,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The harvester key
                 */
                public readonly harvesterKey: PublicAccount,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(type, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a HarvesterTransaction
     * @returns {number}
     * @memberof HarvesterTransaction
     */
    public get size(): number {
        return HarvesterTransaction.calculateSize()
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize();

        const harvesterKey = 32;
        return byteSize + harvesterKey;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof HarvesterTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                harvesterKey: this.harvesterKey.toDTO()
            }
        }
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new Builder()
            .addType(this.type)
            .addSize(this.size)
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addHarvesterKey(this.harvesterKey.publicKey)
            .build();
    }
}

export class HarvesterTransactionBuilder extends TransactionBuilder {
    private _harvesterKey: PublicAccount;
    private _transactionType: number;
    private _transactionTypeVersion: number;

    constructor(transactionType: number, transactionTypeVersion: number) {
        super();
        this._transactionType = transactionType;
        this._transactionTypeVersion = transactionTypeVersion;
    }

    public harvesterKey(harvesterKey: PublicAccount) {
        this._harvesterKey = harvesterKey;
        return this;
    }

    public build(): HarvesterTransaction {
        return new HarvesterTransaction(
            this._networkType,
            this._transactionType,
            this._transactionTypeVersion,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(HarvesterTransaction.calculateSize(), this._feeCalculationStrategy),
            this._harvesterKey,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}

export class AddHarvesterTransactionBuilder extends HarvesterTransactionBuilder {

    constructor(){
        super(TransactionType.ADD_HARVESTER, TransactionTypeVersion.ADD_HARVESTER);
    }
}

export class RemoveHarvesterTransactionBuilder extends HarvesterTransactionBuilder {

    constructor(){
        super(TransactionType.REMOVE_HARVESTER, TransactionTypeVersion.REMOVE_HARVESTER);
    }
}

