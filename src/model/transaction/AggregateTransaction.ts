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

import { SignSchema } from '../../core/crypto';
import { Builder } from '../../infrastructure/builders/AggregateTransaction';
import { AggregateTransaction as AggregatedTransactionCore} from '../../infrastructure/builders/AggregateTransaction';
import { Account } from '../account/Account';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AggregateTransactionCosignature } from './AggregateTransactionCosignature';
import { CosignatureSignedTransaction } from './CosignatureSignedTransaction';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { SignedTransaction } from './SignedTransaction';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { calculateFee } from './FeeCalculationStrategy';

/**
 * Aggregate innerTransactions contain multiple innerTransactions that can be initiated by different accounts.
 */
export class AggregateTransaction extends Transaction {

    /**
     * @param networkType
     * @param type
     * @param version
     * @param deadline
     * @param maxFee
     * @param innerTransactions
     * @param cosignatures
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
                 * The array of innerTransactions included in the aggregate transaction.
                 */
                public readonly innerTransactions: InnerTransaction[],
                /**
                 * The array of transaction cosigners signatures.
                 */
                public readonly cosignatures: AggregateTransactionCosignature[],
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(type, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create an aggregate complete transaction object
     * @param deadline - The deadline to include the transaction.
     * @param innerTransactions - The array of inner innerTransactions.
     * @param networkType - The network type.
     * @param cosignatures
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AggregateTransaction}
     */
    public static createComplete(deadline: Deadline,
                                 innerTransactions: InnerTransaction[],
                                 networkType: NetworkType,
                                 cosignatures: AggregateTransactionCosignature[],
                                 maxFee?: UInt64): AggregateTransaction {
        return new AggregateCompleteTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .innerTransactions(innerTransactions)
            .cosignatures(cosignatures)
            .build();
    }

    /**
     * Create an aggregate bonded transaction object
     * @param {Deadline} deadline
     * @param {InnerTransaction[]} innerTransactions
     * @param {NetworkType} networkType
     * @param {AggregateTransactionCosignature[]} cosignatures
     * @param {UInt64} maxFee - (Optional) Max fee defined by the sender
     * @return {AggregateTransaction}
     */
    public static createBonded(deadline: Deadline,
                               innerTransactions: InnerTransaction[],
                               networkType: NetworkType,
                               cosignatures: AggregateTransactionCosignature[] = [],
                               maxFee?: UInt64): AggregateTransaction {
        return new AggregateBondedTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .innerTransactions(innerTransactions)
            .cosignatures(cosignatures)
            .build();
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof AggregateTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                transactions: this.innerTransactions.map((innerTransaction) => {
                    return innerTransaction.toJSON();
                }),
                cosignatures: this.cosignatures.map((cosignature) => {
                    return cosignature.toDTO();
                }),
            }
        }
    }

    /**
     * @internal
     * @returns {AggregateTransaction}
     */
    public buildTransaction(): AggregatedTransactionCore {
        return new Builder()
            .addSize(this.size)
            .addDeadline(this.deadline.toDTO())
            .addType(this.type)
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addTransactions(this.innerTransactions.map((transaction) => {
                return transaction.aggregateTransaction();
            })).build();
    }

    /**
     * Sign transaction with cosignatories creating a new SignedTransaction
     * @param initiatorAccount - Initiator account
     * @param cosignatories - The array of accounts that will cosign the transaction
     * @param generationHash - Network generation hash hex
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {SignedTransaction}
     */
    public signTransactionWithCosignatories(initiatorAccount: Account,
                                            cosignatories: Account[],
                                            generationHash: string,
                                            signSchema: SignSchema = SignSchema.SHA3) {
        const aggregateTransaction = this.buildTransaction();
        const signedTransactionRaw = aggregateTransaction
                .signTransactionWithCosigners(initiatorAccount, cosignatories, generationHash, signSchema);
        return new SignedTransaction(signedTransactionRaw.payload, signedTransactionRaw.hash, initiatorAccount.publicKey,
                                     this.type, this.networkType);
    }

    /**
     * Sign transaction with cosignatories collected from cosigned transactions and creating a new SignedTransaction
     * For off chain Aggregated Complete Transaction co-signing.
     * @param initiatorAccount - Initiator account
     * @param {CosignatureSignedTransaction[]} cosignatureSignedTransactions - Array of cosigned transaction
     * @param generationHash - Network generation hash hex
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {SignedTransaction}
     */
    public signTransactionGivenSignatures(initiatorAccount: Account,
                                          cosignatureSignedTransactions: CosignatureSignedTransaction[],
                                          generationHash: string,
                                          signSchema: SignSchema= SignSchema.SHA3) {
        const aggregateTransaction = this.buildTransaction();
        const signedTransactionRaw = aggregateTransaction.signTransactionGivenSignatures(initiatorAccount,
                                                                                         cosignatureSignedTransactions,
                                                                                         generationHash,
                                                                                         signSchema);
        return new SignedTransaction(signedTransactionRaw.payload, signedTransactionRaw.hash, initiatorAccount.publicKey,
                                     this.type, this.networkType);
    }

    /**
     * Check if account has signed transaction
     * @param publicAccount - Signer public account
     * @returns {boolean}
     */
    public signedByAccount(publicAccount: PublicAccount): boolean {
        return this.cosignatures.find((cosignature) => cosignature.signer.equals(publicAccount)) !== undefined
            || (this.signer !== undefined && this.signer.equals(publicAccount));
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AggregateTransaction
     * @returns {number}
     * @memberof AggregateTransaction
     */
    public get size(): number {
        return AggregateTransaction.calculateSize(this.innerTransactions || []);
    }

    public static calculateSize(innerTransactions: InnerTransaction[]): number {
        // .aggregateTransaction() => .toAggregateTransaction() removes 80 bytes from each inner tx
        const innerTransactionsSumSize = innerTransactions.reduce((previous, current) => previous + current.size - 80, 0);
        const byteSize = Transaction.getHeaderSize();
        // set static byte size fields
        const byteTransactionsSize = 4;

        return byteSize + byteTransactionsSize + innerTransactionsSumSize;
    }

}

export class AggregateCompleteTransactionBuilder extends TransactionBuilder {
    private _cosignatures: AggregateTransactionCosignature[] = [];
    private _innerTransactions: InnerTransaction[] = [];

    public cosignatures(cosignatures: AggregateTransactionCosignature[]) {
        this._cosignatures = cosignatures;
        return this;
    }

    public innerTransactions(innerTransactions: InnerTransaction[]) {
        this._innerTransactions = innerTransactions;
        return this;
    }

    public build(): AggregateTransaction {
        return new AggregateTransaction(
            this._networkType,
            TransactionType.AGGREGATE_COMPLETE,
            this._version || TransactionVersion.AGGREGATE_COMPLETE,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(AggregateTransaction.calculateSize(this._innerTransactions), this._feeCalculationStrategy),
            this._innerTransactions,
            this._cosignatures,
            this._signature,
            this._signer,
            this._transactionInfo
        )
    }
}
export class AggregateBondedTransactionBuilder extends TransactionBuilder {
    private _cosignatures: AggregateTransactionCosignature[] = [];
    private _innerTransactions: InnerTransaction[] = [];

    public cosignatures(cosignatures: AggregateTransactionCosignature[]) {
        this._cosignatures = cosignatures;
        return this;
    }

    public innerTransactions(innerTransactions: InnerTransaction[]) {
        this._innerTransactions = innerTransactions;
        return this;
    }

    public build(): AggregateTransaction {
        return new AggregateTransaction(
            this._networkType,
            TransactionType.AGGREGATE_BONDED,
            this._version || TransactionVersion.AGGREGATE_BONDED,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(AggregateTransaction.calculateSize(this._innerTransactions), this._feeCalculationStrategy),
            this._innerTransactions,
            this._cosignatures,
            this._signature,
            this._signer,
            this._transactionInfo
        )
    }
}
